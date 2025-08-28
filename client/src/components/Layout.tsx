import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Home, Search, ShoppingCart, User, Package, Heart, Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { getCartItemsCount } = useApp();

  const navigation = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Search, label: 'Products' },
    { href: '/cart', icon: ShoppingCart, label: 'Cart', badge: getCartItemsCount() },
    { href: '/account', icon: User, label: 'Account' },
  ];

  const accountNavigation = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: Package, label: 'My Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const isAccountPage = location.startsWith('/account');

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col z-40">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">EliteStore</h1>
          <p className="text-sm text-muted-foreground">Premium E-commerce</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={`nav-item flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary w-full text-left transition-colors ${
                  isActive(item.href) ? 'text-primary bg-secondary' : ''
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav md:hidden bg-card border-t border-border px-4 py-2 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={`nav-item flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive(item.href) ? 'text-primary' : ''
                }`}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:ml-64 pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
