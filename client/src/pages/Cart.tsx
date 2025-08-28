import { useLocation } from 'wouter';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { getCartProducts, updateCartQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useApp();

  const cartProducts = getCartProducts();
  const total = getCartTotal();
  const itemsCount = getCartItemsCount();
  const subtotal = total;
  const tax = total * 0.08; // 8% tax
  const shipping = total > 100 ? 0 : 9.99;
  const finalTotal = subtotal + tax + shipping;

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Button onClick={() => setLocation('/products')} data-testid="button-start-shopping">
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartProducts.map(({ product, cartItem }) => (
            <div key={`${product.id}-${cartItem.selectedColor}`} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col md:flex-row gap-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-24 h-24 rounded-lg object-cover"
                  data-testid={`img-cart-item-${product.id}`}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1" data-testid={`text-cart-item-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">{product.description}</p>
                  {cartItem.selectedColor && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Color: <span className="capitalize">{cartItem.selectedColor}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary" data-testid={`text-cart-item-price-${product.id}`}>
                      ${product.price}
                    </span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCartQuantity(product.id, cartItem.quantity - 1)}
                        disabled={cartItem.quantity <= 1}
                        data-testid={`button-decrease-quantity-${product.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium px-2" data-testid={`text-cart-item-quantity-${product.id}`}>
                        {cartItem.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateCartQuantity(product.id, cartItem.quantity + 1)}
                        data-testid={`button-increase-quantity-${product.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(product.id)}
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-remove-item-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="bg-card rounded-xl p-6 border border-border h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({itemsCount} items)</span>
              <span data-testid="text-cart-subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? 'text-primary' : ''} data-testid="text-cart-shipping">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span data-testid="text-cart-tax">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary" data-testid="text-cart-total">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            size="lg"
            className="w-full mb-4"
            onClick={() => setLocation('/checkout')}
            data-testid="button-proceed-to-checkout"
          >
            Proceed to Checkout
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => setLocation('/products')}
            data-testid="button-continue-shopping"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
