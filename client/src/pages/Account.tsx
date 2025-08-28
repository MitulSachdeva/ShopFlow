import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { User, Package, Heart, Settings, Edit, Shield, Bell, Palette, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProductCard } from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type AccountSection = 'profile' | 'orders' | 'wishlist' | 'settings';

export default function Account() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  const { user, setUser, orders, getWishlistProducts, theme, toggleTheme } = useApp();
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState<AccountSection>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
  });

  const wishlistProducts = getWishlistProducts();

  // Handle section from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const section = urlParams.get('section') as AccountSection;
    if (section && ['profile', 'orders', 'wishlist', 'settings'].includes(section)) {
      setActiveSection(section);
    } else if (params.section && ['profile', 'orders', 'wishlist', 'settings'].includes(params.section)) {
      setActiveSection(params.section as AccountSection);
    }
  }, [location, params.section]);

  const navigation = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'orders', icon: Package, label: 'My Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleSectionChange = (sectionId: AccountSection) => {
    setActiveSection(sectionId);
    setLocation(`/account/${sectionId}`);
  };

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: {
        street: formData.street,
        city: formData.city,
        zip: formData.zip,
      },
    };

    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-gray-500/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access your account
          </p>
          <Button onClick={() => setLocation('/products')} data-testid="button-go-shopping">
            Go Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Account Sidebar */}
        <div className="bg-card rounded-xl p-6 border border-border h-fit">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id as AccountSection)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary text-left transition-colors ${
                    activeSection === item.id ? 'bg-secondary text-primary' : ''
                  }`}
                  data-testid={`nav-account-${item.id}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Account Content */}
        <div className="lg:col-span-3">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <Button
                    variant="outline"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    data-testid={isEditing ? "button-save-profile" : "button-edit-profile"}
                  >
                    {isEditing ? (
                      <>Save Changes</>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-last-name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-date-of-birth"
                    />
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-6">Shipping Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                      disabled={!isEditing}
                      data-testid="input-profile-zip"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-6">Order History</h3>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                            Order #{order.id.split('-')[1]}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                          <Badge className={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <span className="font-semibold" data-testid={`text-order-total-${order.id}`}>
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-view-order-${order.id}`}>
                            View Details
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm" data-testid={`button-reorder-${order.id}`}>
                              Reorder
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button variant="outline" size="sm" data-testid={`button-track-order-${order.id}`}>
                              Track Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">No orders yet</h4>
                  <p className="text-muted-foreground mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Button onClick={() => setLocation('/products')} data-testid="button-start-shopping">
                    Start Shopping
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Wishlist Section */}
          {activeSection === 'wishlist' && (
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-6">My Wishlist</h3>
              
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">Your wishlist is empty</h4>
                  <p className="text-muted-foreground mb-4">
                    Save items you love for later
                  </p>
                  <Button onClick={() => setLocation('/products')} data-testid="button-browse-products">
                    Browse Products
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {/* Security Settings */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" data-testid="button-change-password">
                      Change
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" data-testid="button-setup-2fa">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Preferences */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-6">Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive order updates and promotions</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-email-notifications" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'} 
                      onCheckedChange={toggleTheme}
                      data-testid="switch-dark-mode"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-muted-foreground">Receive marketing emails and offers</p>
                    </div>
                    <Switch data-testid="switch-marketing" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
