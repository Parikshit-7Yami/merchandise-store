import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

const BoysPage = () => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const { products: allProducts, loading } = useProducts();
  const categoryProducts = useMemo(() => allProducts.filter(p => p.category === 'boys'), [allProducts]);
  const subcategories = useMemo(() => [...new Set(categoryProducts.map(p => p.subcategory))], [categoryProducts]);
  const products = activeSubcategory
    ? categoryProducts.filter(p => p.subcategory === activeSubcategory)
    : categoryProducts;

  return (
    <Layout>
      <div className="bg-boys py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Boys Collection</h1>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto">
            Discover our range of comfortable and stylish merchandise for male students
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategory Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={activeSubcategory === null ? 'default' : 'outline'}
            onClick={() => setActiveSubcategory(null)}
          >
            All Products
          </Button>
          {subcategories.map(sub => (
            <Button
              key={sub}
              variant={activeSubcategory === sub ? 'default' : 'outline'}
              onClick={() => setActiveSubcategory(sub)}
            >
              {sub}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BoysPage;
