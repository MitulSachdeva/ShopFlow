import { useState } from 'react';
import { useLocation } from 'wouter';
import { Lock, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@shared/schema';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { getCartProducts, getCartTotal, clearCart, addOrder, user } = useApp();
  const { toast } = useToast();
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    zip: user?.address?.zip || '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const cartProducts = getCartProducts();
  const total = getCartTotal();
  const tax = total * 0.08;
  const shipping = total > 100 ? 0 : 9.99;
  const finalTotal = total + tax + shipping;

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out
          </p>
          <Button onClick={() => setLocation('/products')} data-testid="button-shop-now">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping information fields.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'card' && (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvc)) {
      toast({
        title: "Missing Payment Information",
        description: "Please fill in all card information fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user?.id || 'guest',
      items: cartProducts.map(({ cartItem }) => cartItem),
      total: finalTotal,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      shippingAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        zip: shippingInfo.zip,
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
      },
    };

    addOrder(newOrder);
    clearCart();
    
    toast({
      title: "Order Successful!",
      description: "Thank you for your purchase. Your order has been received.",
    });

    setLocation('/account?section=orders');
    setIsProcessing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button
        variant="ghost"
        onClick={() => setLocation('/cart')}
        className="mb-6"
        data-testid="button-back-to-cart"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleProcessOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-6">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    data-testid="input-last-name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    required
                    data-testid="input-address"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                    required
                    data-testid="input-city"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input
                    id="zip"
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo(prev => ({ ...prev, zip: e.target.value }))}
                    required
                    data-testid="input-zip"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-6">Payment Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="card" id="card" data-testid="radio-payment-card" />
                      <Label htmlFor="card" className="flex items-center cursor-pointer">
                        <Lock className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" data-testid="radio-payment-paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                        data-testid="input-card-number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                          data-testid="input-expiry-date"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC *</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={cardInfo.cvc}
                          onChange={(e) => setCardInfo(prev => ({ ...prev, cvc: e.target.value }))}
                          data-testid="input-cvc"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-card rounded-xl p-6 border border-border h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cartProducts.map(({ product, cartItem }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {cartItem.quantity}</p>
                  </div>
                  <span className="font-medium">${(product.price * cartItem.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="text-checkout-subtotal">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? 'text-primary' : ''} data-testid="text-checkout-shipping">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span data-testid="text-checkout-tax">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-checkout-total">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit"
              size="lg"
              className="w-full"
              disabled={isProcessing}
              data-testid="button-complete-order"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Your payment information is secure and encrypted.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
