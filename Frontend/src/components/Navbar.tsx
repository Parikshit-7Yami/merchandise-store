import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import medicapsLogo from '@/assets/medicaps-logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/boys', label: 'Boys' },
  { path: '/girls', label: 'Girls' },
  { path: '/teachers', label: 'Teachers' },
  { path: '/event-merch', label: 'Events' },
  { path: '/club-customization', label: 'Customize' },
  { path: '/group-orders', label: 'Group Orders' },
  { path: '/orders', label: 'Orders' },
  { path: '/return-policy', label: 'Returns' },
  { path: '/payment-support', label: 'Payment Help' },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const totalItems = getTotalItems();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm shadow-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={medicapsLogo} alt="Medicaps University" className="h-10 w-auto" />
            <span className="hidden sm:block font-semibold text-foreground">Campus Merch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${location.pathname === link.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="hidden lg:block ml-2">
                <Button variant="outline" size="sm" className="font-medium text-xs">
                  Admin Panel
                </Button>
              </Link>
            )}

            {isAuthenticated && (
              <Button variant="ghost" size="sm" onClick={logout} className="hidden lg:block text-xs text-muted-foreground hover:text-destructive">
                Logout
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === link.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                    }`}
                >
                  Admin Panel
                </Link>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-md text-sm font-medium text-left text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
