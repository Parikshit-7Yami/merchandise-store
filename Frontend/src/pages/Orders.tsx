import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fetchOrdersByEmail, type ApiOrder } from '@/lib/api';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Order placed & confirmed' },
  { key: 'processing', label: 'Processing', icon: ShoppingBag, description: 'Being prepared' },
  { key: 'shipped', label: 'Shipped', icon: Package, description: 'Handed to courier' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'On the way to you' },
  { key: 'delivered', label: 'Delivered', icon: MapPin, description: 'Successfully delivered' },
] as const;

function getStatusIndex(status: string): number {
  return STATUS_STEPS.findIndex(s => s.key === status);
}

function getHistoryTimestamp(statusHistory: Array<{ status: string; timestamp: string }> | undefined, statusKey: string): string | null {
  if (!statusHistory) return null;
  const entry = statusHistory.find(h => h.status === statusKey);
  return entry ? entry.timestamp : null;
}

const OrdersPage = () => {
  const { orders: localOrders } = useCart();
  const { user } = useAuth();
  const [backendOrders, setBackendOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    const email = user?.email;
    if (!email) return;
    try {
      setLoading(true);
      const orders = await fetchOrdersByEmail(email);
      setBackendOrders(orders);
    } catch {
      setBackendOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 30 seconds for live tracking
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Merge backend and local orders, backend takes priority
  const mergedOrders = (() => {
    const backendIds = new Set(backendOrders.map(o => o.orderId));
    const localOnly = localOrders.filter(o => !backendIds.has(o.orderId || o.id));

    const fromBackend = backendOrders.map(o => ({
      id: o.orderId,
      orderId: o.orderId,
      items: o.items.map(item => ({
        product: {
          id: item.productId || '',
          name: item.name,
          price: item.price,
          image: item.image || '',
          category: 'boys' as const,
          subcategory: '',
          fabric: '',
          colors: [item.color || ''],
          sizes: [item.size || ''],
        },
        quantity: item.quantity,
        selectedColor: item.color || '',
        selectedSize: item.size || '',
      })),
      customItems: o.customItems.map(item => ({
        id: `custom-${Math.random()}`,
        clubName: item.clubName || 'Custom',
        collegeName: '',
        productType: (item.productType || 'tshirt') as 'tshirt',
        fabricType: 'cotton' as const,
        color: item.color || '',
        gender: 'boys' as const,
        sizeType: 'standard' as const,
        size: item.size || '',
        logoSource: 'predefined' as const,
        quantity: item.quantity,
        price: item.price,
      })),
      userDetails: o.userDetails,
      totalPrice: o.totalPrice,
      status: o.status,
      statusHistory: o.statusHistory,
      orderDate: o.createdAt || new Date().toISOString(),
    }));

    return [...fromBackend, ...localOnly];
  })();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          {loading && (
            <span className="text-sm text-muted-foreground animate-pulse">Refreshing...</span>
          )}
        </div>

        {mergedOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground">
                When you place an order, it will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mergedOrders.map(order => {
              const currentStepIdx = getStatusIndex(order.status);

              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-foreground">{order.orderId || order.id}</h2>
                          <Badge
                            variant={order.status === 'delivered' ? 'default' : 'secondary'}
                            className="flex items-center gap-1"
                          >
                            {STATUS_STEPS[currentStepIdx]?.label || order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {format(new Date(order.orderDate), 'PPP')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{order.totalPrice}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length + order.customItems.length} item(s)
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-grow">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedSize} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{item.product.price * item.quantity}</p>
                        </div>
                      ))}

                      {order.customItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.color }}
                          >
                            <span className="text-xs bg-card/80 rounded px-1.5 py-0.5">Custom</span>
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">{item.clubName}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {item.productType} • {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Delivery Details</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">Name</span>
                          <span className="font-medium">{order.userDetails.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Roll No.</span>
                          <span className="font-medium">{order.userDetails.rollNumber}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Department</span>
                          <span className="font-medium">{order.userDetails.department}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Mobile</span>
                          <span className="font-medium">{order.userDetails.mobile}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Email</span>
                          <span className="font-medium text-xs">{order.userDetails.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Tracking Timeline */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4">LIVE TRACKING</h3>
                      <div className="flex items-start justify-between relative">
                        {/* Progress line background */}
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted z-0 mx-[5%]" />
                        {/* Progress line filled */}
                        <div
                          className="absolute top-4 left-0 h-0.5 bg-primary z-[1] mx-[5%] transition-all duration-700 ease-out"
                          style={{
                            width: `${currentStepIdx >= 0 ? (currentStepIdx / (STATUS_STEPS.length - 1)) * 90 : 0}%`,
                          }}
                        />

                        {STATUS_STEPS.map((step, idx) => {
                          const Icon = step.icon;
                          const isActive = idx === currentStepIdx;
                          const isPast = idx < currentStepIdx;
                          const isFuture = idx > currentStepIdx;
                          const timestamp = getHistoryTimestamp(order.statusHistory, step.key);

                          return (
                            <div
                              key={step.key}
                              className="flex flex-col items-center relative z-10 flex-1"
                            >
                              <div
                                className={`
                                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                                  ${isActive
                                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                                    : isPast
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }
                                `}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={`text-[10px] sm:text-xs mt-1.5 text-center font-medium ${
                                  isActive
                                    ? 'text-primary'
                                    : isPast
                                      ? 'text-foreground'
                                      : 'text-muted-foreground'
                                }`}
                              >
                                {step.label}
                              </span>
                              {timestamp && (
                                <span className="text-[9px] text-muted-foreground mt-0.5 text-center">
                                  {format(new Date(timestamp), 'MMM d, h:mm a')}
                                </span>
                              )}
                              {isFuture && (
                                <span className="text-[9px] text-muted-foreground/50 mt-0.5">
                                  Pending
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
