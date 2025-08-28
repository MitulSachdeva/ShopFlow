import React, { createContext, useContext, ReactNode } from 'react';
import { CartItem, Product, User, Order } from '@shared/schema';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { products } from '@/data/products';

interface AppContextType {
  // Cart state
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist state
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Theme state
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Orders state
  orders: Order[];
  addOrder: (order: Order) => void;

  // Product utilities
  getProduct: (id: string) => Product | undefined;
  getCartProducts: () => Array<{ product: Product; cartItem: CartItem }>;
  getWishlistProducts: () => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [wishlist, setWishlist] = useLocalStorage<string[]>('wishlist', []);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [user, setUser] = useLocalStorage<User | null>('user', {
    id: 'user1',
    firstName: 'Sophia',
    lastName: 'Carter',
    email: 'sophia.carter@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1992-03-15',
    address: {
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      zip: '10001',
    },
  });
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', [
    {
      id: 'order-123456',
      userId: 'user1',
      items: [{ productId: '4', quantity: 1 }],
      total: 249.99,
      status: 'delivered',
      createdAt: '2024-03-15',
      shippingAddress: {
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        zip: '10001',
        firstName: 'Sophia',
        lastName: 'Carter',
      },
    },
    {
      id: 'order-789012',
      userId: 'user1',
      items: [{ productId: '7', quantity: 1 }],
      total: 189.99,
      status: 'shipped',
      createdAt: '2024-03-10',
      shippingAddress: {
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        zip: '10001',
        firstName: 'Sophia',
        lastName: 'Carter',
      },
    },
    {
      id: 'order-456789',
      userId: 'user1',
      items: [{ productId: '2', quantity: 1 }],
      total: 2499.99,
      status: 'delivered',
      createdAt: '2024-03-05',
      shippingAddress: {
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        zip: '10001',
        firstName: 'Sophia',
        lastName: 'Carter',
      },
    },
  ]);

  // Apply theme to document
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Cart functions
  const addToCart = (productId: string, quantity = 1, selectedColor?: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.productId === productId && item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { productId, quantity, selectedColor }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = getProduct(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist functions
  const addToWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Theme functions
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Order functions
  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  // Product utilities
  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getCartProducts = () => {
    return cart.map(cartItem => ({
      product: getProduct(cartItem.productId)!,
      cartItem,
    })).filter(item => item.product);
  };

  const getWishlistProducts = () => {
    return wishlist.map(id => getProduct(id)!).filter(Boolean);
  };

  const value: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    theme,
    toggleTheme,
    user,
    setUser,
    orders,
    addOrder,
    getProduct,
    getCartProducts,
    getWishlistProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
