import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular merchandise loved by the Medicaps community
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
