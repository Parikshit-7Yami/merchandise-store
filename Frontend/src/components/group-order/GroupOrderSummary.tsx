import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Copy, Check, Trash2, ShoppingCart, Lock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGroupOrder } from '@/context/GroupOrderContext';
import { useCart } from '@/context/CartContext';
import { GroupOrder } from '@/types';
import { toast } from 'sonner';

interface GroupOrderSummaryProps {
  groupCode: string;
  isCreator?: boolean;
}

export const GroupOrderSummary = ({ groupCode, isCreator = false }: GroupOrderSummaryProps) => {
  const navigate = useNavigate();
  const { getGroupOrderByCode, closeGroupOrder, checkoutGroupOrder, removeMemberFromGroup } = useGroupOrder();
  const { placeOrder } = useCart();
  const [copied, setCopied] = useState(false);

  const order = getGroupOrderByCode(groupCode);

  if (!order) {
    return (
      <Card className="text-center p-8">
        <p className="text-muted-foreground">Group order not found</p>
        <Button variant="link" onClick={() => navigate('/group-orders')}>
          View all group orders
        </Button>
      </Card>
    );
  }

  const totalQuantity = order.members.reduce((sum, m) => sum + m.quantity, 0);
  const totalAmount = totalQuantity * order.basePrice;

  const copyGroupCode = () => {
    navigator.clipboard.writeText(order.groupCode);
    setCopied(true);
    toast.success('Group code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseOrder = () => {
    closeGroupOrder(groupCode);
    toast.success('Group order closed. No more members can join.');
  };

  const handleCheckout = () => {
    if (order.members.length === 0) {
      toast.error('Cannot checkout with no members');
      return;
    }

    const placedOrder = placeOrder({
      name: order.creatorName,
      rollNumber: 'GROUP-ORDER',
      department: order.clubName,
      mobile: ''
    });

    checkoutGroupOrder(groupCode, placedOrder.id);
    toast.success('Group order checked out successfully!');
    navigate('/orders');
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`Remove ${memberName} from the group order?`)) {
      removeMemberFromGroup(groupCode, memberId);
      toast.success(`${memberName} removed from the order`);
    }
  };

  const getStatusBadge = (status: GroupOrder['status']) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Open for Members</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'checked_out':
        return <Badge className="bg-primary">Checked Out</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {order.groupName}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                {getStatusBadge(order.status)}
                <Badge variant="outline">{order.clubName}</Badge>
                <Badge variant="outline" className="capitalize">{order.baseProductType}</Badge>
                {order.eventName && (
                  <Badge variant="outline" className="bg-primary/10">
                    <Calendar className="h-3 w-3 mr-1" />
                    {order.eventName}
                  </Badge>
                )}
              </div>
            </div>
            
            {order.status === 'open' && (
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
                <span className="text-sm text-muted-foreground">Code:</span>
                <span className="font-mono font-bold text-lg">{order.groupCode}</span>
                <Button variant="ghost" size="icon" onClick={copyGroupCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{order.members.length}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalQuantity}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-bold text-primary">₹{order.basePrice}</p>
              <p className="text-sm text-muted-foreground">Per Item</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">₹{totalAmount}</p>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Members ({order.members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {order.members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No members have joined yet</p>
              <p className="text-sm">Share the group code to invite members</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead>Personalization</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {isCreator && order.status === 'open' && <TableHead></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.rollNumber}</TableCell>
                      <TableCell>
                        {member.sizeType === 'custom' ? (
                          <span className="text-xs">
                            C:{member.customSize?.chest}" L:{member.customSize?.length}" S:{member.customSize?.shoulder}"
                          </span>
                        ) : member.size}
                      </TableCell>
                      <TableCell>
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: member.color }}
                        />
                      </TableCell>
                      <TableCell className="text-center">{member.quantity}</TableCell>
                      <TableCell className="text-sm">
                        {member.nameOnBack && <div>Name: {member.nameOnBack}</div>}
                        {member.numberOnBack && <div>#{member.numberOnBack}</div>}
                        {!member.nameOnBack && !member.numberOnBack && <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{order.basePrice * member.quantity}
                      </TableCell>
                      {isCreator && order.status === 'open' && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id, member.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creator Actions */}
      {isCreator && order.status === 'open' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <h3 className="font-semibold">Ready to finalize?</h3>
                <p className="text-sm text-muted-foreground">
                  Close the order to stop accepting members, then checkout
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleCloseOrder}>
                  <Lock className="h-4 w-4 mr-2" />
                  Close Order
                </Button>
                <Button onClick={handleCheckout} disabled={order.members.length === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Checkout (₹{totalAmount})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isCreator && order.status === 'closed' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <h3 className="font-semibold">Order is closed</h3>
                <p className="text-sm text-muted-foreground">
                  No more members can join. Proceed to checkout.
                </p>
              </div>
              <Button onClick={handleCheckout} disabled={order.members.length === 0} size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Complete Checkout (₹{totalAmount})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {order.status === 'checked_out' && order.checkoutDetails && (
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Order Completed</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Order ID: {order.checkoutDetails.orderId} • 
                  Total: ₹{order.checkoutDetails.totalAmount} • 
                  {order.checkoutDetails.totalQuantity} items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
