import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CustomizedProduct, Order, UserDetails } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  customItems: CustomizedProduct[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  addCustomItem: (item: CustomizedProduct) => void;
  removeCustomItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  placeOrder: (userDetails: UserDetails) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [customItems, setCustomItems] = useState<CustomizedProduct[]>(() => {
    const saved = localStorage.getItem('customItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('customItems', JSON.stringify(customItems));
  }, [customItems]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(
        i => i.product.id === item.product.id && 
        i.selectedColor === item.selectedColor && 
        i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === item.product.id && 
          i.selectedColor === item.selectedColor && 
          i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCartItems(prev => prev.filter(
      i => !(i.product.id === productId && i.selectedColor === color && i.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.selectedColor === color && i.selectedSize === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const addCustomItem = (item: CustomizedProduct) => {
    setCustomItems(prev => [...prev, item]);
  };

  const removeCustomItem = (itemId: string) => {
    setCustomItems(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomItems([]);
  };

  const getTotalPrice = () => {
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const customTotal = customItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return itemsTotal + customTotal;
  };

  const getTotalItems = () => {
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const customCount = customItems.reduce((sum, item) => sum + item.quantity, 0);
    return itemsCount + customCount;
  };

  const placeOrder = (userDetails: UserDetails): Order => {
    const orderId = `ORD-${Date.now()}`;
    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      orderId,
      items: [...cartItems],
      customItems: [...customItems],
      userDetails,
      totalPrice: getTotalPrice(),
      status: 'confirmed',
      statusHistory: [{ status: 'confirmed', timestamp: now }],
      orderDate: now,
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      customItems,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      addCustomItem,
      removeCustomItem,
      clearCart,
      getTotalPrice,
      getTotalItems,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
