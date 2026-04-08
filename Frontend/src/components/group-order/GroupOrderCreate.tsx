import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Palette, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGroupOrder } from '@/context/GroupOrderContext';
import { toast } from 'sonner';
import { clubLogos } from '@/data/clubLogos';
import { eventCollections } from '@/data/eventProducts';

const productTypes = [
  { value: 'tshirt', label: 'T-Shirt', price: 599 },
  { value: 'hoodie', label: 'Hoodie', price: 1299 },
  { value: 'sweatshirt', label: 'Sweatshirt', price: 1099 },
  { value: 'sleeveless', label: 'Sleeveless', price: 499 },
  { value: 'jersey', label: 'Jersey', price: 899 },
  { value: 'blazer', label: 'Blazer', price: 3999 }
];

const fabricTypes = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'athletic', label: 'Athletic Fabric' }
];

const defaultColors = [
  '#1a237e', '#8B1538', '#FFFFFF', '#000000', '#2c3e50', '#FFD700', '#00C853'
];

export const GroupOrderCreate = () => {
  const navigate = useNavigate();
  const { createGroupOrder } = useGroupOrder();
  const [copied, setCopied] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ groupCode: string } | null>(null);

  const [formData, setFormData] = useState({
    groupName: '',
    eventName: '',
    creatorName: '',
    baseProductType: 'tshirt' as const,
    clubName: '',
    collegeName: 'Medicaps University',
    fabricType: 'cotton' as const,
    selectedLogo: '',
    allowNameOnBack: false,
    allowNumberOnBack: false,
    allowedColors: [...defaultColors]
  });

  const selectedProduct = productTypes.find(p => p.value === formData.baseProductType);

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      allowedColors: prev.allowedColors.includes(color)
        ? prev.allowedColors.filter(c => c !== color)
        : [...prev.allowedColors, color]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.groupName || !formData.creatorName || !formData.clubName) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.allowedColors.length === 0) {
      toast.error('Please select at least one color option');
      return;
    }

    const order = createGroupOrder({
      groupName: formData.groupName,
      eventName: formData.eventName || undefined,
      creatorId: `creator-${Date.now()}`,
      creatorName: formData.creatorName,
      baseProductType: formData.baseProductType,
      allowedColors: formData.allowedColors,
      allowNameOnBack: formData.allowNameOnBack,
      allowNumberOnBack: formData.allowNumberOnBack,
      clubName: formData.clubName,
      collegeName: formData.collegeName,
      clubLogo: formData.selectedLogo || undefined,
      logoSource: formData.selectedLogo ? 'predefined' : 'predefined',
      fabricType: formData.fabricType,
      basePrice: selectedProduct?.price || 599
    });

    setCreatedOrder({ groupCode: order.groupCode });
    toast.success('Group order created successfully!');
  };

  const copyGroupCode = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.groupCode);
      setCopied(true);
      toast.success('Group code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (createdOrder) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Group Order Created!</h2>
          <p className="text-muted-foreground mb-6">
            Share this code with your team members
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Group Code</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-mono font-bold tracking-wider text-primary">
                {createdOrder.groupCode}
              </span>
              <Button variant="ghost" size="icon" onClick={copyGroupCode}>
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/group-orders')}
            >
              View All Groups
            </Button>
            <Button 
              className="flex-1"
              onClick={() => navigate(`/group-orders/${createdOrder.groupCode}`)}
            >
              Manage Order
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Group Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                placeholder="e.g., CSE Hackathon Team"
                value={formData.groupName}
                onChange={e => setFormData({ ...formData, groupName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creatorName">Your Name *</Label>
              <Input
                id="creatorName"
                placeholder="Enter your name"
                value={formData.creatorName}
                onChange={e => setFormData({ ...formData, creatorName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clubName">Club Name *</Label>
              <Input
                id="clubName"
                placeholder="e.g., Technical Club"
                value={formData.clubName}
                onChange={e => setFormData({ ...formData, clubName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventName">Event (Optional)</Label>
              <Select
                value={formData.eventName}
                onValueChange={value => setFormData({ ...formData, eventName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Event</SelectItem>
                  {eventCollections.filter(e => e.isActive).map(event => (
                    <SelectItem key={event.id} value={event.name}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Type *</Label>
              <Select
                value={formData.baseProductType}
                onValueChange={value => setFormData({ ...formData, baseProductType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} - ₹{type.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fabric Type</Label>
              <Select
                value={formData.fabricType}
                onValueChange={value => setFormData({ ...formData, fabricType: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fabricTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Club Logo */}
          <div className="space-y-2">
            <Label>Club Logo</Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {clubLogos.slice(0, 12).map(logo => (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, selectedLogo: logo.svg })}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    formData.selectedLogo === logo.svg
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img src={logo.svg} alt={logo.name} className="w-full h-10 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Allowed Colors */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Allowed Colors (Members can choose from these)
            </Label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.allowedColors.includes(color)
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border opacity-50'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Name on Back</Label>
                <p className="text-sm text-muted-foreground">Members can add their name</p>
              </div>
              <Switch
                checked={formData.allowNameOnBack}
                onCheckedChange={checked => setFormData({ ...formData, allowNameOnBack: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Number on Back</Label>
                <p className="text-sm text-muted-foreground">Members can add a jersey number</p>
              </div>
              <Switch
                checked={formData.allowNumberOnBack}
                onCheckedChange={checked => setFormData({ ...formData, allowNumberOnBack: checked })}
              />
            </div>
          </div>

          {/* Price Info */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Base Price per Item</span>
              <span className="text-xl font-bold text-primary">₹{selectedProduct?.price}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Users className="h-5 w-5 mr-2" />
            Create Group Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
