import { Product } from '@/types';

export const products: Product[] = [
  // Boys - T-shirts
  {
    id: 'boys-tshirt-1',
    name: 'Classic College Tee',
    price: 599,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium cotton t-shirt with Medicaps logo'
  },
  {
    id: 'boys-tshirt-2',
    name: 'Varsity Print Tee',
    price: 699,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton Blend',
    colors: ['#1a237e', '#8B1538', '#2c3e50'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Comfortable varsity style t-shirt'
  },
  {
    id: 'boys-tshirt-3',
    name: 'Campus Pride Tee',
    price: 549,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Show your campus pride'
  },
  // Boys - Sweatshirts
  {
    id: 'boys-sweat-1',
    name: 'University Hoodie',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    category: 'boys',
    subcategory: 'Sweatshirts',
    fabric: 'Fleece',
    colors: ['#1a237e', '#8B1538', '#2c3e50', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Warm fleece hoodie with embroidered logo'
  },
  {
    id: 'boys-sweat-2',
    name: 'Crew Neck Sweatshirt',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400',
    category: 'boys',
    subcategory: 'Sweatshirts',
    fabric: 'Cotton Fleece',
    colors: ['#1a237e', '#8B1538', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic crew neck sweatshirt'
  },
  // Boys - Sports T-shirts
  {
    id: 'boys-sports-1',
    name: 'Athletic Performance Tee',
    price: 799,
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400',
    category: 'boys',
    subcategory: 'Sports T-shirts',
    fabric: 'Dri-Fit',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Moisture-wicking sports tee'
  },
  {
    id: 'boys-sports-2',
    name: 'Team Sports Jersey',
    price: 899,
    image: 'https://images.unsplash.com/photo-1580089595767-98745d7025c5?w=400',
    category: 'boys',
    subcategory: 'Sports T-shirts',
    fabric: 'Polyester',
    colors: ['#1a237e', '#8B1538', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Official team sports jersey'
  },
  // Girls - T-shirts
  {
    id: 'girls-tshirt-1',
    name: 'Fitted College Tee',
    price: 599,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400',
    category: 'girls',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#E91E63'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Fitted cotton t-shirt for women'
  },
  {
    id: 'girls-tshirt-2',
    name: 'Relaxed Campus Tee',
    price: 649,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
    category: 'girls',
    subcategory: 'T-shirts',
    fabric: 'Cotton Blend',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#9C27B0'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Relaxed fit comfortable tee'
  },
  {
    id: 'girls-tshirt-3',
    name: 'V-Neck University Tee',
    price: 579,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    category: 'girls',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Classic v-neck design'
  },
  // Girls - Sweatshirts
  {
    id: 'girls-sweat-1',
    name: 'Cropped Hoodie',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    category: 'girls',
    subcategory: 'Sweatshirts',
    fabric: 'Fleece',
    colors: ['#1a237e', '#8B1538', '#FFFFFF', '#E91E63'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Trendy cropped hoodie'
  },
  {
    id: 'girls-sweat-2',
    name: 'Oversized Sweatshirt',
    price: 1149,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
    category: 'girls',
    subcategory: 'Sweatshirts',
    fabric: 'Cotton Fleece',
    colors: ['#1a237e', '#8B1538', '#2c3e50'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Cozy oversized fit'
  },
  // Teachers - Formal Shirts
  {
    id: 'teachers-shirt-1',
    name: 'Formal Oxford Shirt',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    category: 'teachers',
    subcategory: 'Formal Shirts',
    fabric: 'Cotton Oxford',
    colors: ['#FFFFFF', '#1a237e', '#87CEEB'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium oxford fabric formal shirt'
  },
  {
    id: 'teachers-shirt-2',
    name: 'Classic Dress Shirt',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
    category: 'teachers',
    subcategory: 'Formal Shirts',
    fabric: 'Cotton Twill',
    colors: ['#FFFFFF', '#87CEEB', '#1a237e'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Elegant dress shirt for faculty'
  },
  // Teachers - Blazers
  {
    id: 'teachers-blazer-1',
    name: 'University Blazer',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    category: 'teachers',
    subcategory: 'Blazers',
    fabric: 'Wool Blend',
    colors: ['#1a237e', '#000000', '#2c3e50'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium university blazer with crest'
  },
  {
    id: 'teachers-blazer-2',
    name: 'Formal Navy Blazer',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    category: 'teachers',
    subcategory: 'Blazers',
    fabric: 'Polyester Blend',
    colors: ['#1a237e', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic navy formal blazer'
  }
];

export const getProductsByCategory = (category: 'boys' | 'girls' | 'teachers') => {
  return products.filter(p => p.category === category);
};

export const getProductsBySubcategory = (category: 'boys' | 'girls' | 'teachers', subcategory: string) => {
  return products.filter(p => p.category === category && p.subcategory === subcategory);
};

export const getSubcategories = (category: 'boys' | 'girls' | 'teachers') => {
  const categoryProducts = products.filter(p => p.category === category);
  return [...new Set(categoryProducts.map(p => p.subcategory))];
};

export const getFeaturedProducts = () => {
  return products.slice(0, 6);
};
