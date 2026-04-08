import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCart } from '@/context/CartContext';
import { useSupport } from '@/context/SupportContext';
import { useVerification } from '@/context/VerificationContext';
import { useNotifications } from '@/context/NotificationContext';
import { ShieldCheck, Package, MessageSquare, Image as ImageIcon, Bell, CheckCircle, XCircle, Clock, AlertTriangle, Plus, Mail, Trash2, Edit2, Check, X, Upload } from 'lucide-react';
import { fetchProducts, addProduct as apiAddProduct, fetchStudents, addStudent as apiAddStudent, updateProduct, deleteProduct, broadcastNotification, uploadImage, fetchAllOrders as fetchAllOrdersApi, updateOrderStatus as updateOrderStatusApi } from '@/lib/api';
import { toast } from 'sonner';
import { DesignVerification } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-foreground">Admin Dashboard</h1>
            <p className="text-secondary-foreground/80 text-sm">Manage products, orders & verifications</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="verifications">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="verifications">Design Queue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="notifications">Notify</TabsTrigger>
            <TabsTrigger value="products">New Product</TabsTrigger>
            <TabsTrigger value="students">Student Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="mt-6">
            <VerificationQueue />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="tickets" className="mt-6">
            <TicketManagement />
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <NotificationManagement />
          </TabsContent>
          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>
          <TabsContent value="students" className="mt-6">
            <StudentEmailsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

const VerificationQueue = () => {
  const { verifications, reviewDesign } = useVerification();
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [extraCosts, setExtraCosts] = useState<Record<string, string>>({});

  const handleReview = (id: string, status: DesignVerification['status'], campusApproved: boolean, feasible: boolean) => {
    reviewDesign(id, {
      status,
      reviewNotes: reviewNotes[id] || '',
      campusApproved,
      collegeNameAllowed: campusApproved,
      manufacturingFeasible: feasible,
      estimatedExtraCost: extraCosts[id] ? Number(extraCosts[id]) : 0,
    });
    toast.success(`Design ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'}`);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'needs_changes': return <AlertTriangle className="h-4 w-4 text-accent" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Design Verification Queue ({verifications.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {verifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No designs submitted for verification yet.</p>
        ) : (
          <div className="space-y-4">
            {verifications.map(v => (
              <div key={v.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {v.designImage && (
                      <img src={v.designImage} alt="Design" className="w-16 h-16 object-contain rounded border border-border" />
                    )}
                    <div>
                      <p className="font-medium">{v.clubName} - {v.productType}</p>
                      <p className="text-xs text-muted-foreground">By: {v.submittedBy} • {new Date(v.submittedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Expires: {new Date(v.expiresAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {statusIcon(v.status)}
                    <Badge variant={v.status === 'approved' ? 'default' : v.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {v.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {(v.status === 'pending_review' || v.status === 'under_review') && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="space-y-1">
                      <Label className="text-xs">Review Notes</Label>
                      <Textarea
                        placeholder="Campus appropriateness, brand alignment, manufacturing notes..."
                        value={reviewNotes[v.id] || ''}
                        onChange={e => setReviewNotes(prev => ({ ...prev, [v.id]: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Extra Manufacturing Cost (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={extraCosts[v.id] || ''}
                        onChange={e => setExtraCosts(prev => ({ ...prev, [v.id]: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReview(v.id, 'approved', true, true)} className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReview(v.id, 'rejected', false, false)} className="gap-1">
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReview(v.id, 'needs_changes', true, true)} className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> Needs Changes
                      </Button>
                    </div>
                  </div>
                )}

                {v.reviewNotes && v.status !== 'pending_review' && (
                  <p className="text-sm bg-muted p-2 rounded"><strong>Review:</strong> {v.reviewNotes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderManagement = () => {
  const [dbOrders, setDbOrders] = useState<Awaited<ReturnType<typeof fetchAllOrdersApi>>>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { user } = useAuth();

  const loadOrders = async () => {
    const adminKey = user?.adminKey;
    if (!adminKey) return;
    try {
      setLoadingOrders(true);
      const list = await fetchAllOrdersApi(adminKey);
      setDbOrders(list);
    } catch {
      setDbOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const adminKey = user?.adminKey;
    if (!adminKey) return toast.error('Session expired');
    try {
      await updateOrderStatusApi(orderId, newStatus, adminKey);
      toast.success(`Status updated to "${newStatus}". Email sent to customer.`);
      loadOrders();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const STATUS_OPTIONS = [
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Orders ({dbOrders.length})
          <Button variant="outline" size="sm" className="ml-auto" onClick={loadOrders} disabled={loadingOrders}>
            {loadingOrders ? 'Loading...' : 'Refresh'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dbOrders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {loadingOrders ? 'Loading orders...' : 'No orders yet.'}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbOrders.map(order => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                  <TableCell>{order.userDetails.name}</TableCell>
                  <TableCell className="text-xs">{order.userDetails.email}</TableCell>
                  <TableCell>{order.items.length + order.customItems.length}</TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {order.paymentStatus || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{new Date(order.createdAt || '').toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(val) => handleStatusUpdate(order.orderId, val)}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

const TicketManagement = () => {
  const { tickets, updateTicketStatus, addResponse } = useSupport();
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleRespond = (ticketId: string) => {
    if (!responses[ticketId]) return;
    addResponse(ticketId, responses[ticketId], true);
    updateTicketStatus(ticketId, 'in_progress');
    setResponses(prev => ({ ...prev, [ticketId]: '' }));
    toast.success('Response sent');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Support Tickets ({tickets.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tickets yet.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.id} • {ticket.type} • {ticket.orderId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={ticket.status === 'resolved' ? 'default' : 'secondary'}>
                      {ticket.status}
                    </Badge>
                    {ticket.status !== 'resolved' && (
                      <Button size="sm" variant="outline" onClick={() => updateTicketStatus(ticket.id, 'resolved')}>
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
                {ticket.responses.map(r => (
                  <div key={r.id} className={`text-sm p-2 rounded ${r.isAdmin ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}>
                    <span className="font-medium text-xs">{r.isAdmin ? 'Admin' : 'User'}:</span> {r.message}
                  </div>
                ))}
                {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type admin response..."
                      value={responses[ticket.id] || ''}
                      onChange={e => setResponses(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleRespond(ticket.id)}
                    />
                    <Button size="sm" onClick={() => handleRespond(ticket.id)}>Send</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProductManagement = () => {
  const [dbProducts, setDbProducts] = useState<Awaited<ReturnType<typeof fetchProducts>>>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');
  const [form, setForm] = useState({
    name: '', price: '', stock: '', image: '', category: 'boys', subcategory: 'T-shirts', fabric: '', colors: '', sizes: '', description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();

  const loadProducts = async () => {
    try {
      const list = await fetchProducts();
      setDbProducts(list);
    } catch {
      setDbProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminKey = user?.adminKey;
    if (!adminKey) {
      toast.error('Session expired. Please log in again.');
      return;
    }
    const price = Number(form.price);
    if (!form.name || (!form.image && !selectedFile) || !form.category || !form.subcategory || !form.fabric || Number.isNaN(price)) {
      toast.error('Fill name, price, image URL or upload, category, subcategory, fabric');
      return;
    }
    setLoading(true);
    try {
      let finalImageUrl = form.image;

      // Handle file upload if a file was selected
      if (selectedFile) {
        toast.info('Uploading image...');
        const uploadResult = await uploadImage(selectedFile, adminKey);
        finalImageUrl = uploadResult.imageUrl;
      }

      const colors = form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [];
      const sizes = form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL'];
      const result = await apiAddProduct(
        {
          name: form.name,
          price,
          image: finalImageUrl,
          category: form.category as 'boys' | 'girls' | 'teachers',
          subcategory: form.subcategory,
          fabric: form.fabric,
          colors: colors.length ? colors : ['#1a237e'],
          sizes: sizes.length ? sizes : ['S', 'M', 'L', 'XL'],
          description: form.description || undefined,
          stock: form.stock ? Number(form.stock) : 0,
        },
        adminKey
      );
      toast.success(`Product added. Notifications sent to ${result.notification.sent} student(s).`);
      setForm({ name: '', price: '', stock: '', image: '', category: 'boys', subcategory: 'T-shirts', fabric: '', colors: '', sizes: '', description: '' });
      setSelectedFile(null);

      // Reset the file input element visually
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const adminKey = user?.adminKey;
    if (!adminKey) return toast.error('Session expired');
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteProduct(id, adminKey);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleUpdate = async (id: string) => {
    const adminKey = user?.adminKey;
    if (!adminKey) return toast.error('Session expired');
    const price = Number(editPrice);
    const stock = Number(editStock);
    if (isNaN(price)) return toast.error('Invalid price');

    const updates: { price?: number; stock?: number } = { price };
    if (!isNaN(stock)) updates.stock = stock;

    try {
      await updateProduct(id, updates, adminKey);
      toast.success('Product updated');
      setEditingId(null);
      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Product (sends email to all student emails)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" required />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="599" required />
            </div>
            <div className="space-y-2">
              <Label>Initial Stock</Label>
              <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
            </div>
          </div>
          <div className="space-y-3 p-4 bg-muted/50 rounded-md border border-border">
            <Label className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Product Image
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Upload className="h-3 w-3" /> Upload Local Image
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setSelectedFile(e.target.files[0]);
                      setForm(f => ({ ...f, image: '' })); // Clear URL if file is selected
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground text-center block pt-2">OR</Label>
                <Input
                  value={form.image}
                  onChange={e => {
                    setForm(f => ({ ...f, image: e.target.value }));
                    if (e.target.value) {
                      setSelectedFile(null); // Clear file if URL is entered
                      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }
                  }}
                  placeholder="Paste Image URL (https://...)"
                  disabled={!!selectedFile}
                />
              </div>
            </div>
            {selectedFile && <p className="text-xs text-primary font-medium mt-1">✓ File selected: {selectedFile.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Input value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} placeholder="T-shirts" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Fabric</Label>
            <Input value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))} placeholder="Cotton" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Colors (comma-separated hex or names)</Label>
              <Input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} placeholder="#1a237e, #8B1538" />
            </div>
            <div className="space-y-2">
              <Label>Sizes (comma-separated)</Label>
              <Input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} placeholder="S, M, L, XL" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" rows={2} />
          </div>
          <Button type="submit" disabled={loading}>Add product & send notifications</Button>
        </form>
        <div>
          <h4 className="font-medium mb-2">Products in database ({dbProducts.length})</h4>
          {dbProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No products from API yet. Add one above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbProducts.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      {editingId === p.id ? (
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-20 h-8"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleUpdate(p.id)}
                        />
                      ) : (
                        `₹${p.price}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === p.id ? (
                        <Input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(e.target.value)}
                          className="w-20 h-8"
                          onKeyDown={e => e.key === 'Enter' && handleUpdate(p.id)}
                        />
                      ) : (
                        p.stock !== undefined ? p.stock : 0
                      )}
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-right">
                      {editingId === p.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleUpdate(p.id)}>
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => { setEditingId(p.id); setEditPrice(p.price.toString()); setEditStock(p.stock !== undefined ? p.stock.toString() : '0'); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id, p.name)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const StudentEmailsManagement = () => {
  const [students, setStudents] = useState<Awaited<ReturnType<typeof fetchStudents>>>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const adminKey = sessionStorage.getItem('adminKey') || '';

  const loadStudents = async () => {
    if (!adminKey) return;
    try {
      const list = await fetchStudents(adminKey);
      setStudents(list);
    } catch {
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [adminKey]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) {
      toast.error('Session expired. Please log in again.');
      return;
    }
    if (!email.trim()) {
      toast.error('Enter email');
      return;
    }
    setLoading(true);
    try {
      await apiAddStudent({ email: email.trim(), name: name.trim() }, adminKey);
      toast.success('Student email added');
      setEmail('');
      setName('');
      loadStudents();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Student emails (notifications go here when you add a new product)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="flex flex-wrap gap-2 items-end max-w-xl">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@college.edu" required />
          </div>
          <div className="space-y-1">
            <Label>Name (optional)</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Student name" />
          </div>
          <Button type="submit" disabled={loading}>Add</Button>
        </form>
        <div>
          <h4 className="font-medium mb-2">Students ({students.length})</h4>
          {students.length === 0 ? (
            <p className="text-muted-foreground text-sm">No emails yet. Add college email IDs above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs">{s.email}</TableCell>
                    <TableCell>{s.name || '–'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationManagement = () => {
  const { subscriptions, simulateEventNotification } = useNotifications();
  const [eventName, setEventName] = useState('');

  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const adminKey = sessionStorage.getItem('adminKey') || '';

  const handleBroadcast = async () => {
    if (!adminKey) return toast.error('Session expired');
    if (!broadcastSubject || !broadcastMessage) {
      return toast.error('Subject and message are required');
    }

    setIsBroadcasting(true);
    try {
      const res = await broadcastNotification({ subject: broadcastSubject, message: broadcastMessage }, adminKey);
      toast.success('Broadcast complete', {
        description: `Successfully sent to ${res.notification.sent} emails. Failed: ${res.notification.failed}`
      });
      setBroadcastSubject('');
      setBroadcastMessage('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 pb-6 border-b border-border">
          <h4 className="font-medium">Send Broadcast Notification (Live)</h4>
          <p className="text-sm text-muted-foreground">Send an email to all subscribed students.</p>
          <div className="space-y-2 max-w-xl">
            <Input
              placeholder="Subject (e.g. Price Drop on Winter Hoodies!)"
              value={broadcastSubject}
              onChange={e => setBroadcastSubject(e.target.value)}
            />
            <Textarea
              placeholder="Message (HTML supported. E.g. <b>Prices are now lower!</b> Check them out...)"
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              rows={3}
            />
            <Button onClick={handleBroadcast} disabled={isBroadcasting}>
              {isBroadcasting ? 'Sending emails...' : 'Send to all Subscribers'}
            </Button>
          </div>
        </div>

        <div className="space-y-3 pb-6 border-b border-border">
          <h4 className="font-medium">Simulate Event (Frontend Demo Only)</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Event name (e.g., Freshers 2026)"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
            />
            <Button onClick={() => {
              if (eventName) {
                simulateEventNotification(eventName);
                setEventName('');
              }
            }}>
              Simulate
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Subscribers ({subscriptions.length})</h4>
          {subscriptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No subscribers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Preferences</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell className="text-xs">{sub.email}</TableCell>
                    <TableCell className="text-xs">{new Date(sub.subscribedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-1 flex-wrap">
                      {sub.preferences.newEvents && <Badge variant="secondary" className="text-xs">Events</Badge>}
                      {sub.preferences.orderUpdates && <Badge variant="secondary" className="text-xs">Orders</Badge>}
                      {sub.preferences.promotions && <Badge variant="secondary" className="text-xs">Promos</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
