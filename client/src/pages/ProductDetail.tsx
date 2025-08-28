import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Heart, ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { products, reviews } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('black');

  const product = products.find(p => p.id === params.id);
  const productReviews = reviews.filter(r => r.productId === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => setLocation('/products')} data-testid="button-back-to-products">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const colors = [
    { name: 'black', value: '#1f2937', label: 'Black' },
    { name: 'white', value: '#ffffff', label: 'White' },
    { name: 'blue', value: '#3b82f6', label: 'Blue' },
  ];

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Button
        variant="ghost"
        onClick={() => setLocation('/products')}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <img 
            src={product.images[selectedImage]} 
            alt={product.name}
            className="w-full rounded-xl border border-border"
            data-testid="img-product-main"
          />
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className={`w-full aspect-square rounded-lg border cursor-pointer hover:border-primary/50 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setSelectedImage(index)}
                  data-testid={`img-product-thumbnail-${index}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-product-name">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">{renderStars(product.rating)}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.rating}) {product.reviewCount} reviews
                </span>
              </div>
              <Badge variant="secondary">Best Seller</Badge>
            </div>
            <p className="text-3xl font-bold text-primary mb-4" data-testid="text-product-price">
              ${product.price}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>
          </div>
          
          {/* Product Options */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Color</h4>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      selectedColor === color.name ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.label}
                    data-testid={`button-color-${color.name}`}
                  >
                    <span className="sr-only">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Quantity</h4>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium px-4" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleWishlistToggle}
              data-testid="button-add-to-wishlist"
            >
              <Heart className={`w-5 h-5 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
          
          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      {productReviews.length > 0 && (
        <div className="mt-16 border-t border-border pt-12">
          <h3 className="text-2xl font-bold mb-8">Customer Reviews</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productReviews.map((review) => (
              <div key={review.id} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">{review.userInitials}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{review.userName}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">{renderStars(review.rating)}</span>
                      <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
