import { useState, useRef, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useVerification } from '@/context/VerificationContext';
import { CustomizedProduct } from '@/types';
import { Upload, ShoppingCart, Palette, Shirt, Ruler, Image, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { clubLogos, clubCategories, getLogosByCategory, ClubLogoOption } from '@/data/clubLogos';
import GarmentPreview from '@/components/GarmentPreview';
import { cn } from '@/lib/utils';

const clubs = [
  'Coding Club',
  'Robotics Club',
  'Cultural Club',
  'Sports Club',
  'Music Club',
  'Drama Club',
  'Photography Club',
  'Debate Club',
  'IEEE Student Branch',
  'NSS',
  'Other'
];

const productTypes = [
  { value: 'tshirt', label: 'T-Shirt (Cotton)', basePrice: 599 },
  { value: 'sweatshirt', label: 'Sweatshirt', basePrice: 1199 },
  { value: 'athletic', label: 'Athletic Sports T-Shirt', basePrice: 799 },
  { value: 'sleeveless', label: 'Sleeveless Top', basePrice: 499 }
];

const fabricTypes = [
  { value: 'cotton', label: 'Cotton', priceModifier: 0 },
  { value: 'polyester', label: 'Polyester', priceModifier: 50 },
  { value: 'athletic', label: 'Athletic Fabric (Dri-Fit)', priceModifier: 100 }
];

const genderOptions = [
  { value: 'boys', label: 'Boys' },
  { value: 'girls', label: 'Girls' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'teachers', label: 'Teachers' }
];

const standardSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const colorPresets = [
  { color: '#1a237e', name: 'Navy Blue' },
  { color: '#8B1538', name: 'Maroon' },
  { color: '#FFFFFF', name: 'White' },
  { color: '#000000', name: 'Black' },
  { color: '#2c3e50', name: 'Dark Gray' },
  { color: '#1e3a5f', name: 'Deep Blue' },
  { color: '#4a0e2a', name: 'Burgundy' },
  { color: '#0d5c4f', name: 'Teal' }
];

const ClubCustomization = () => {
  const { addCustomItem } = useCart();
  const { submitForVerification, getVerificationByProductId, verifications } = useVerification();
  const [clubName, setClubName] = useState('');
  const [customClubName, setCustomClubName] = useState('');
  const [productType, setProductType] = useState<'tshirt' | 'sweatshirt' | 'athletic' | 'sleeveless'>('tshirt');
  const [fabricType, setFabricType] = useState<'cotton' | 'polyester' | 'athletic'>('cotton');
  const [color, setColor] = useState('#1a237e');
  const [gender, setGender] = useState<'boys' | 'girls' | 'unisex' | 'teachers'>('unisex');
  const [sizeType, setSizeType] = useState<'standard' | 'custom'>('standard');
  const [standardSize, setStandardSize] = useState('M');
  const [customSize, setCustomSize] = useState({ chest: 40, length: 28, shoulder: 18 });
  const [clubLogo, setClubLogo] = useState<string | null>(null);
  const [logoSource, setLogoSource] = useState<'predefined' | 'uploaded'>('predefined');
  const [selectedLogoCategory, setSelectedLogoCategory] = useState<string>('technical');
  const [customDesign, setCustomDesign] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const designInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, setImage: (val: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload PNG, JPEG, or SVG files only');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSelectPredefinedLogo = (logo: ClubLogoOption) => {
    setClubLogo(logo.svg);
    setLogoSource('predefined');
    toast.success(`Selected ${logo.name} logo`);
  };

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (val) => {
      setClubLogo(val);
      setLogoSource('uploaded');
    });
  };

  const calculatePrice = () => {
    const base = productTypes.find(p => p.value === productType)?.basePrice || 599;
    const fabricMod = fabricTypes.find(f => f.value === fabricType)?.priceModifier || 0;
    const customizationFee = (clubLogo ? 100 : 0) + (customDesign ? 150 : 0);
    return base + fabricMod + customizationFee;
  };

  const needsVerification = logoSource === 'uploaded' && (clubLogo || customDesign);

  const handleAddToCart = () => {
    const finalClubName = clubName === 'Other' ? customClubName : clubName;
    if (!finalClubName) {
      toast.error('Please select or enter a club name');
      return;
    }

    const itemId = `custom-${Date.now()}`;

    const item: CustomizedProduct = {
      id: itemId,
      clubName: finalClubName,
      collegeName: 'Medicaps University',
      productType,
      fabricType,
      color,
      gender,
      sizeType,
      size: sizeType === 'standard' ? standardSize : 'Custom',
      customSize: sizeType === 'custom' ? customSize : undefined,
      clubLogo: clubLogo || undefined,
      logoSource,
      customDesign: customDesign || undefined,
      quantity,
      price: calculatePrice(),
      verificationStatus: needsVerification ? 'pending' : undefined,
      verificationSubmittedAt: needsVerification ? new Date().toISOString() : undefined,
    };

    if (needsVerification) {
      // Submit for verification - don't add to cart yet
      submitForVerification({
        customProductId: itemId,
        designImage: customDesign || clubLogo || '',
        clubName: finalClubName,
        productType,
        submittedBy: 'Student',
      });
      toast.info('Design submitted for verification!', {
        description: 'Uploaded designs require a 7-day verification process. You\'ll be notified once approved.',
        duration: 6000,
      });
    } else {
      addCustomItem(item);
      toast.success('Custom item added to cart!', {
        description: `${finalClubName} - ${productTypes.find(p => p.value === productType)?.label}`
      });
    }
  };

  const finalClubName = clubName === 'Other' ? customClubName : clubName;
  const filteredLogos = getLogosByCategory(selectedLogoCategory);

  return (
    <Layout>
      <div className="bg-club py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Club Customization</h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto">
            Design custom merchandise for your club with your own logo and colors
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Form */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Customize Your Merchandise</h2>
                </div>

                {/* Gender/Section Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Section / Gender
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {genderOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={gender === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setGender(option.value as any)}
                        className="w-full"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Club Name */}
                <div className="space-y-2">
                  <Label>Club Name</Label>
                  <Select value={clubName} onValueChange={setClubName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your club" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map(club => (
                        <SelectItem key={club} value={club}>{club}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clubName === 'Other' && (
                    <Input
                      placeholder="Enter your club name"
                      value={customClubName}
                      onChange={(e) => setCustomClubName(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Product Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shirt className="h-4 w-4" />
                    Product Type
                  </Label>
                  <Select value={productType} onValueChange={(v) => setProductType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label} - ₹{type.basePrice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fabric Type */}
                <div className="space-y-2">
                  <Label>Fabric Type</Label>
                  <Select value={fabricType} onValueChange={(v) => setFabricType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fabricTypes.map(fabric => (
                        <SelectItem key={fabric.value} value={fabric.value}>
                          {fabric.label} {fabric.priceModifier > 0 && `(+₹${fabric.priceModifier})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map(c => (
                        <button
                          key={c.color}
                          onClick={() => setColor(c.color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            color === c.color ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border hover:scale-105"
                          )}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Size Selection
                  </Label>
                  <RadioGroup value={sizeType} onValueChange={(v) => setSizeType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal">Standard Size</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-normal">Custom Measurements</Label>
                    </div>
                  </RadioGroup>

                  {sizeType === 'standard' ? (
                    <Select value={standardSize} onValueChange={setStandardSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {standardSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs">Chest (in)</Label>
                        <Input
                          type="number"
                          value={customSize.chest}
                          onChange={(e) => setCustomSize({ ...customSize, chest: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Length (in)</Label>
                        <Input
                          type="number"
                          value={customSize.length}
                          onChange={(e) => setCustomSize({ ...customSize, length: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Shoulder (in)</Label>
                        <Input
                          type="number"
                          value={customSize.shoulder}
                          onChange={(e) => setCustomSize({ ...customSize, shoulder: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo Selection Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Logo Selection</h2>
                </div>

                <Tabs defaultValue="predefined" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="predefined">Pre-made Logos</TabsTrigger>
                    <TabsTrigger value="upload">Upload Your Own</TabsTrigger>
                  </TabsList>

                  <TabsContent value="predefined" className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {clubCategories.map(cat => (
                        <Button
                          key={cat.value}
                          variant={selectedLogoCategory === cat.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedLogoCategory(cat.value)}
                          className="text-xs"
                          style={selectedLogoCategory === cat.value ? { backgroundColor: cat.color } : {}}
                        >
                          {cat.label}
                        </Button>
                      ))}
                    </div>

                    {/* Logo Grid */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {filteredLogos.map(logo => (
                        <button
                          key={logo.id}
                          onClick={() => handleSelectPredefinedLogo(logo)}
                          className={cn(
                            "relative p-3 rounded-lg border-2 transition-all hover:scale-105",
                            clubLogo === logo.svg && logoSource === 'predefined'
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <img 
                            src={logo.svg} 
                            alt={logo.name} 
                            className="w-full aspect-square object-contain"
                          />
                          <span className="text-[10px] text-muted-foreground mt-1 block text-center truncate">
                            {logo.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Club Logo</Label>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          onChange={handleUploadLogo}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full h-24 flex-col gap-2"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {clubLogo && logoSource === 'uploaded' ? (
                            <img src={clubLogo} alt="Logo" className="h-14 w-14 object-contain" />
                          ) : (
                            <>
                              <Upload className="h-6 w-6" />
                              <span className="text-xs">PNG / SVG / JPEG</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Custom Design (Optional)</Label>
                        <input
                          ref={designInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          onChange={(e) => handleFileUpload(e, setCustomDesign)}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full h-24 flex-col gap-2"
                          onClick={() => designInputRef.current?.click()}
                        >
                          {customDesign ? (
                            <img src={customDesign} alt="Design" className="h-14 w-14 object-contain" />
                          ) : (
                            <>
                              <Upload className="h-6 w-6" />
                              <span className="text-xs">Add Custom Art</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {(clubLogo || customDesign) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setClubLogo(null);
                          setCustomDesign(null);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        Clear Uploads
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Live 3D Preview</h2>
                
                {/* 3D Garment Preview */}
                <GarmentPreview
                  productType={productType}
                  color={color}
                  clubName={finalClubName}
                  clubLogo={clubLogo}
                  customDesign={customDesign}
                  gender={gender}
                />

                {/* Summary */}
                <div className="space-y-3 border-t border-border pt-4 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">{productTypes.find(p => p.value === productType)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Section</span>
                    <span className="font-medium capitalize">{gender}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fabric</span>
                    <span className="font-medium">{fabricTypes.find(f => f.value === fabricType)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Color</span>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium">{colorPresets.find(c => c.color === color)?.name || 'Custom'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">
                      {sizeType === 'standard' ? standardSize : `Custom (${customSize.chest}" × ${customSize.length}" × ${customSize.shoulder}")`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">₹{calculatePrice() * quantity}</span>
                  </div>
                </div>

                {needsVerification && (
                  <div className="bg-accent/20 border border-accent/50 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                      <Clock className="h-4 w-4" />
                      7-Day Verification Required
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded designs require approval from university officials and merchant 
                      for campus appropriateness, brand usage, and manufacturing feasibility.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleAddToCart} 
                  className="w-full mt-6 gap-2"
                  size="lg"
                  variant={needsVerification ? 'secondary' : 'default'}
                >
                  {needsVerification ? (
                    <>
                      <Clock className="h-5 w-5" />
                      Submit for Verification
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>

                {/* Pending Verifications */}
                {verifications.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Your Verification Requests</h4>
                    {verifications.slice(0, 3).map(v => (
                      <div key={v.id} className="flex items-center justify-between text-xs border border-border rounded p-2">
                        <span className="truncate">{v.clubName} - {v.productType}</span>
                        <Badge variant={v.status === 'approved' ? 'default' : v.status === 'rejected' ? 'destructive' : 'secondary'} className="text-xs ml-2">
                          {v.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {v.status === 'rejected' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {v.status === 'pending_review' && <Clock className="h-3 w-3 mr-1" />}
                          {v.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">💡 Ordering Tips</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Add multiple variants (different colors/sizes) separately</li>
                  <li>• Each variant will appear as a separate cart item</li>
                  <li>• Bulk orders (10+) get special pricing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubCustomization;
