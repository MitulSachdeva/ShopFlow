import { useLocation } from 'wouter';
import { Heart, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '@shared/schema';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();

  const handleProductClick = () => {
    setLocation(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  return (
    <div 
      className="product-card bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 cursor-pointer"
      onClick={handleProductClick}
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
          onClick={handleWishlistToggle}
          data-testid={`button-wishlist-${product.id}`}
        >
          <Heart 
            className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        
        {product.rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 mr-1">{renderStars(product.rating)}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ${product.price}
          </span>
          {showAddToCart && (
            <Button 
              size="sm"
              onClick={handleAddToCart}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {showAddToCart === true ? (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add to Cart
                </>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
