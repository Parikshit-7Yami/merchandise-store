import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGroupOrder } from '@/context/GroupOrderContext';
import { toast } from 'sonner';

const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface GroupOrderJoinProps {
  initialCode?: string;
}

export const GroupOrderJoin = ({ initialCode = '' }: GroupOrderJoinProps) => {
  const navigate = useNavigate();
  const { getGroupOrderByCode, joinGroupOrder } = useGroupOrder();
  const [step, setStep] = useState<'code' | 'details'>('code');
  const [groupCode, setGroupCode] = useState(initialCode);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [memberData, setMemberData] = useState<{
    name: string;
    rollNumber: string;
    department: string;
    mobile: string;
    size: string;
    sizeType: 'standard' | 'custom';
    customSize: { chest: number; length: number; shoulder: number };
    color: string;
    productType: string;
    quantity: number;
    nameOnBack: string;
    numberOnBack: string;
  }>({
    name: '',
    rollNumber: '',
    department: '',
    mobile: '',
    size: 'M',
    sizeType: 'standard' as const,
    customSize: { chest: 0, length: 0, shoulder: 0 },
    color: '',
    productType: '' as any,
    quantity: 1,
    nameOnBack: '',
    numberOnBack: ''
  });

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = getGroupOrderByCode(groupCode);
    
    if (!order) {
      toast.error('Invalid group code. Please check and try again.');
      return;
    }

    if (order.status !== 'open') {
      toast.error('This group order is no longer accepting new members.');
      return;
    }

    setOrderDetails(order);
    setMemberData(prev => ({
      ...prev,
      color: order.allowedColors[0] || '',
      productType: order.baseProductType
    }));
    setStep('details');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberData.name || !memberData.rollNumber || !memberData.department || !memberData.mobile) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\d{10}$/.test(memberData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const success = joinGroupOrder(groupCode, {
      name: memberData.name,
      rollNumber: memberData.rollNumber,
      department: memberData.department,
      mobile: memberData.mobile,
      size: memberData.sizeType === 'custom' ? 'Custom' : memberData.size,
      sizeType: memberData.sizeType,
      customSize: memberData.sizeType === 'custom' ? memberData.customSize : undefined,
      color: memberData.color,
      productType: memberData.productType as 'tshirt' | 'sweatshirt' | 'hoodie' | 'sleeveless' | 'jersey' | 'blazer',
      quantity: memberData.quantity,
      nameOnBack: orderDetails.allowNameOnBack ? memberData.nameOnBack : undefined,
      numberOnBack: orderDetails.allowNumberOnBack ? memberData.numberOnBack : undefined
    });

    if (success) {
      toast.success('Successfully joined the group order!');
      navigate(`/group-orders/${groupCode}`);
    } else {
      toast.error('Failed to join group order');
    }
  };

  if (step === 'code') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Join Group Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupCode">Enter Group Code</Label>
              <Input
                id="groupCode"
                placeholder="e.g., ABC123"
                value={groupCode}
                onChange={e => setGroupCode(e.target.value.toUpperCase())}
                className="text-center text-2xl font-mono tracking-wider"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground text-center">
                Get this code from your group organizer
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={groupCode.length !== 6}>
              Find Group Order
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Join: {orderDetails?.groupName}
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="bg-secondary px-2 py-1 rounded">{orderDetails?.clubName}</span>
          <span className="bg-secondary px-2 py-1 rounded capitalize">{orderDetails?.baseProductType}</span>
          {orderDetails?.eventName && (
            <span className="bg-primary/20 text-primary px-2 py-1 rounded">{orderDetails.eventName}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleJoin} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={memberData.name}
                onChange={e => setMemberData({ ...memberData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number *</Label>
              <Input
                id="rollNumber"
                placeholder="e.g., 21CSE001"
                value={memberData.rollNumber}
                onChange={e => setMemberData({ ...memberData, rollNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
                value={memberData.department}
                onChange={e => setMemberData({ ...memberData, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile"
                value={memberData.mobile}
                onChange={e => setMemberData({ ...memberData, mobile: e.target.value })}
                maxLength={10}
              />
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Select Color *</Label>
            <div className="flex flex-wrap gap-2">
              {orderDetails?.allowedColors.map((color: string) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setMemberData({ ...memberData, color })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    memberData.color === color
                      ? 'border-primary ring-2 ring-primary/30 scale-110'
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <Label>Size Type</Label>
            <RadioGroup
              value={memberData.sizeType}
              onValueChange={value => setMemberData({ ...memberData, sizeType: value as any })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard Size</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Measurements</Label>
              </div>
            </RadioGroup>

            {memberData.sizeType === 'standard' ? (
              <div className="flex flex-wrap gap-2">
                {standardSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setMemberData({ ...memberData, size })}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      memberData.size === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Chest (inches)</Label>
                  <Input
                    type="number"
                    value={memberData.customSize.chest || ''}
                    onChange={e => setMemberData({
                      ...memberData,
                      customSize: { ...memberData.customSize, chest: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Length (inches)</Label>
                  <Input
                    type="number"
                    value={memberData.customSize.length || ''}
                    onChange={e => setMemberData({
                      ...memberData,
                      customSize: { ...memberData.customSize, length: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shoulder (inches)</Label>
                  <Input
                    type="number"
                    value={memberData.customSize.shoulder || ''}
                    onChange={e => setMemberData({
                      ...memberData,
                      customSize: { ...memberData.customSize, shoulder: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Select
              value={memberData.quantity.toString()}
              onValueChange={value => setMemberData({ ...memberData, quantity: parseInt(value) })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(q => (
                  <SelectItem key={q} value={q.toString()}>{q}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional: Name/Number on Back */}
          {(orderDetails?.allowNameOnBack || orderDetails?.allowNumberOnBack) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
              {orderDetails.allowNameOnBack && (
                <div className="space-y-2">
                  <Label htmlFor="nameOnBack">Name on Back (Optional)</Label>
                  <Input
                    id="nameOnBack"
                    placeholder="Your name"
                    value={memberData.nameOnBack}
                    onChange={e => setMemberData({ ...memberData, nameOnBack: e.target.value })}
                    maxLength={20}
                  />
                </div>
              )}
              {orderDetails.allowNumberOnBack && (
                <div className="space-y-2">
                  <Label htmlFor="numberOnBack">Jersey Number (Optional)</Label>
                  <Input
                    id="numberOnBack"
                    type="text"
                    placeholder="e.g., 10"
                    value={memberData.numberOnBack}
                    onChange={e => setMemberData({ ...memberData, numberOnBack: e.target.value })}
                    maxLength={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* Price Summary */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Your Total</span>
              <span className="text-xl font-bold text-primary">
                ₹{(orderDetails?.basePrice || 0) * memberData.quantity}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              ₹{orderDetails?.basePrice} × {memberData.quantity} item(s)
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep('code')} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              <Check className="h-5 w-5 mr-2" />
              Join Group Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
