import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cartItems, customItems, updateQuantity, removeFromCart, removeCustomItem, getTotalPrice } = useCart();

  const isEmpty = cartItems.length === 0 && customItems.length === 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Regular Items */}
              {cartItems.map(item => (
                <Card key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.subcategory}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Color:</span>
                            <span
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                          <div>
                            <span className="text-muted-foreground">Size:</span>{' '}
                            <span className="font-medium">{item.selectedSize}</span>
                          </div>
                        </div>
                        <p className="text-primary font-bold mt-2">₹{item.product.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Custom Items */}
              {customItems.map(item => (
                <Card key={item.id} className="border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div
                        className="w-24 h-24 rounded-lg flex flex-col items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.clubLogo && (
                          <img 
                            src={item.clubLogo} 
                            alt="Logo" 
                            className="absolute inset-0 w-full h-full object-contain p-2 opacity-30"
                          />
                        )}
                        <span className="text-xs text-center px-2 bg-card/90 backdrop-blur-sm rounded py-1 font-medium z-10">
                          Custom
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{item.clubName}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Customized</span>
                          <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded capitalize">
                            {item.gender}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {item.productType.replace('_', ' ')} • {item.fabricType}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <span>Color:</span>
                            <span
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                          <span>
                            Size: {item.size}
                            {item.customSize && (
                              <span className="text-xs"> ({item.customSize.chest}" × {item.customSize.length}" × {item.customSize.shoulder}")</span>
                            )}
                          </span>
                        </div>
                        <p className="text-primary font-bold mt-2">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-green-600">Free (Campus)</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{getTotalPrice()}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button className="w-full mt-6 gap-2" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Delivery available only within Medicaps University campus
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
