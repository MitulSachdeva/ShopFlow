import { useLocation } from 'wouter';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
}

export function CategoryCard({ id, name, description, image }: CategoryCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(`/products?category=${id}`);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={handleClick}
      data-testid={`card-category-${id}`}
    >
      <div className="bg-card rounded-xl p-6 text-center hover:bg-card/80 transition-all group-hover:scale-105">
        <img 
          src={image} 
          alt={`${name} Category`} 
          className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
        />
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
}
