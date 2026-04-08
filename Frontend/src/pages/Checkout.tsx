import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { UserDetails } from '@/types';
import { MapPin, Mail, CreditCard, Smartphone, Landmark, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = 'upi' | 'card' | 'netbanking';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'upi',
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm & more',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Rupay',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    description: 'All major banks supported',
    icon: <Landmark className="h-5 w-5" />,
  },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, customItems, getTotalPrice, placeOrder } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: user?.name || '',
    rollNumber: '',
    department: '',
    mobile: '',
    email: user?.email || '',
  });

  const isEmpty = cartItems.length === 0 && customItems.length === 0;

  const prepareOrderData = () => {
    const apiItems = cartItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor,
      quantity: item.quantity,
    }));

    const apiCustomItems = customItems.map(item => ({
      clubName: item.clubName,
      collegeName: item.collegeName,
      productType: item.productType,
      fabricType: item.fabricType,
      color: item.color,
      gender: item.gender,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      nameOnBack: item.nameOnBack,
      numberOnBack: item.numberOnBack,
    }));

    return { items: apiItems, customItems: apiCustomItems };
  };

  const openRazorpay = async () => {
    const totalPrice = getTotalPrice();

    try {
      // Step 1: Create Razorpay order on backend
      const razorpayOrder = await createRazorpayOrder(totalPrice);

      // Step 2: Prepare order data
      const { items, customItems: apiCustomItems } = prepareOrderData();

      // Step 3: Build Razorpay display config based on selected method
      const methodInstruments: Record<PaymentMethod, any[]> = {
        upi: [{ method: 'upi' }],
        card: [{ method: 'card' }],
        netbanking: [{ method: 'netbanking' }],
      };

      const methodLabels: Record<PaymentMethod, string> = {
        upi: 'Pay using UPI',
        card: 'Pay using Card',
        netbanking: 'Pay using Net Banking',
      };

      // Step 4: Configure Razorpay checkout options
      const options: any = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Campus Threads Co.',
        description: `Order for ${items.length + apiCustomItems.length} item(s)`,
        order_id: razorpayOrder.orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: `+91${userDetails.mobile}`,
          method: selectedMethod === 'card' ? 'card' : selectedMethod === 'upi' ? 'upi' : 'netbanking',
        },
        config: {
          display: {
            blocks: {
              preferred: {
                name: methodLabels[selectedMethod],
                instruments: methodInstruments[selectedMethod],
              },
            },
            sequence: ['block.preferred'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        theme: {
          color: '#7c3aed',
          backdrop_color: 'rgba(0, 0, 0, 0.7)',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.error('Payment cancelled');
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Step 5: Verify payment on backend
            const apiOrder = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items,
                customItems: apiCustomItems,
                userDetails,
                totalPrice,
                paymentMethod: selectedMethod,
              },
            });

            // Also store locally for offline access
            placeOrder(userDetails);

            toast.success('Payment successful! 🎉', {
              description: `Order ID: ${apiOrder.orderId}. Confirmation email sent to ${userDetails.email}`,
            });
            navigate('/orders');
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            toast.error('Payment verification failed. Please contact support.', {
              description: 'If money was debited, it will be refunded within 5-7 days.',
            });
          } finally {
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        setIsSubmitting(false);
        toast.error('Payment failed', {
          description: response.error?.description || 'Please try again or use a different payment method.',
        });
      });

      rzp.open();
    } catch (err) {
      setIsSubmitting(false);
      console.error('Failed to initiate payment:', err);
      toast.error('Could not initiate payment. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userDetails.name || !userDetails.rollNumber || !userDetails.department || !userDetails.mobile || !userDetails.email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^\d{10}$/.test(userDetails.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    await openRazorpay();
  };

  if (isEmpty) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Details Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number / Employee ID *</Label>
                      <Input
                        id="rollNumber"
                        placeholder="e.g., 21CSE001"
                        value={userDetails.rollNumber}
                        onChange={(e) => setUserDetails({ ...userDetails, rollNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        placeholder="e.g., Computer Science"
                        value={userDetails.department}
                        onChange={(e) => setUserDetails({ ...userDetails, department: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={userDetails.mobile}
                        onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your-email@college.edu"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Order confirmation and live tracking updates will be sent to this email.
                    </p>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-secondary/30 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-secondary-foreground mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-secondary-foreground">Campus Delivery Only</h3>
                        <p className="text-sm text-secondary-foreground/80">
                          Your order will be delivered to your department within the Medicaps University campus.
                          You will receive email updates at each tracking step.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                <p className="text-sm text-muted-foreground mb-5">Choose how you'd like to pay</p>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/40 hover:bg-muted/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={() => setSelectedMethod(method.id)}
                        className="sr-only"
                      />
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        selectedMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-foreground">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedMethod === method.id
                          ? 'border-primary'
                          : 'border-muted-foreground/30'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 mt-5 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <p className="text-xs">
                    Secured by <strong>Razorpay</strong>. Your payment info is encrypted and safe.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}

                  {customItems.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className="w-14 h-14 rounded flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                      >
                        <span className="text-[10px] bg-card/80 rounded px-1">Custom</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-1">{item.clubName}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.productType} × {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{getTotalPrice()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full gap-2 mt-6"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5" />
                      Pay ₹{getTotalPrice()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  You'll be redirected to Razorpay's secure payment page
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
