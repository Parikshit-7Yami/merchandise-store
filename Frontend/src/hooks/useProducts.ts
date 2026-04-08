import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { products as staticProducts } from '@/data/products';
import { fetchProducts } from '@/lib/api';

function apiToProduct(p: Awaited<ReturnType<typeof fetchProducts>>[number]): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.category,
    subcategory: p.subcategory,
    fabric: p.fabric,
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    description: p.description,
  };
}

export function useProducts(): { products: Product[]; loading: boolean } {
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((list) => {
        if (!cancelled) setApiProducts(list.map(apiToProduct));
      })
      .catch(() => {
        if (!cancelled) setApiProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products = [...staticProducts, ...apiProducts];
  return { products, loading };
}
