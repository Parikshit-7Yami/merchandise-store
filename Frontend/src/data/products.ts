import { Product } from '@/types';
import geminiImg from '../assets/Gemini_Generated_Image_ne319xne319xne31.png';
import layeredShirtImg from '../assets/layered_shirt.png';
import upperImg from '../assets/upper.png';

export const products: Product[] = [
  {
    id: 'boys-tshirt-new',
    name: 'Signature Campus Graphic Tee',
    price: 749,
    image: geminiImg,
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A vibrant signature graphic t-shirt perfect for making a statement on campus.'
  },
  {
    id: 'boys-shirt-new',
    name: 'Modern Layered Campus Shirt',
    price: 899,
    image: layeredShirtImg,
    category: 'boys',
    subcategory: 'Shirts',
    fabric: 'Cotton Blend',
    colors: ['#2c3e50', '#1a237e'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A stylish and modern layered shirt, offering both comfort and a smart-casual look.'
  },
  {
    id: 'boys-upper-new',
    name: 'Essential Active Upper',
    price: 699,
    image: upperImg,
    category: 'boys',
    subcategory: 'Sweatshirts',
    fabric: 'Fleece Blend',
    colors: ['#1a237e', '#8B1538'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Your go-to active upper for cooler weather or morning workouts.'
  },
  // Boys - T-shirts
  {
    id: 'boys-tshirt-1',
    name: 'Classic College Tee',
    price: 599,
    image: '/products/boys_tshirt_1777437314693.png',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium black cotton t-shirt featuring the distinctive university logo prominently on the chest. Perfect for everyday campus wear.'
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
    id: 'boys-sweat-2',
    name: 'Varsity Style Jacket',
    price: 1499,
    image: '/products/boys_jacket_1777437351152.png',
    category: 'boys',
    subcategory: 'Sweatshirts',
    fabric: 'Cotton Blend',
    colors: ['#1a237e', '#8B1538', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Comfortable varsity style jacket for boys with the university logo on the left chest.'
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
    image: '/products/girls_tshirt_1777437366887.png',
    category: 'girls',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#FFFFFF', '#1a237e', '#8B1538', '#E91E63'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Fitted white cotton t-shirt for girls with the university logo printed prominently on the chest.'
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
  // {
  //   id: 'girls-tshirt-3',
  //   name: 'V-Neck University Tee',
  //   price: 579,
  //   image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  //   category: 'girls',
  //   subcategory: 'T-shirts',
  //   fabric: 'Cotton',
  //   colors: ['#FFFFFF', '#1a237e', '#8B1538'],
  //   sizes: ['XS', 'S', 'M', 'L', 'XL'],
  //   description: 'Classic v-neck design'
  // },
  // Girls - Sweatshirts
  {
    id: 'girls-sweat-1',
    name: 'Cropped Navy Sweatshirt',
    price: 1199,
    image: '/products/girls_sweatshirt_1777437380733.png',
    category: 'girls',
    subcategory: 'Sweatshirts',
    fabric: 'Fleece',
    colors: ['#1a237e', '#8B1538', '#FFFFFF', '#E91E63'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Trendy cropped navy blue sweatshirt for girls, adorned with the university logo.'
  },
  {
    id: 'girls-sweat-2',
    name: 'Formal Knit Sweater',
    price: 1299,
    image: '/products/formal_girls_sweatshirt_1777470938815.png',
    category: 'girls',
    subcategory: 'Sweatshirts',
    fabric: 'Premium Knit',
    colors: ['#FFFFFF', '#1a237e', '#000000'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Elegant formal knit sweater for girls, featuring a subtle university logo. Perfect for professional presentations and formal events.'
  },
  // Teachers - Formal Shirts
  {
    id: 'teachers-shirt-1',
    name: 'Formal Oxford Shirt',
    price: 1499,
    image: '/products/teachers_shirt_1777437398246.png',
    category: 'teachers',
    subcategory: 'Formal Shirts',
    fabric: 'Cotton Oxford',
    colors: ['#FFFFFF', '#1a237e', '#87CEEB'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Formal light blue button-down oxford shirt for teachers. Features a discreet university logo embroidered on the left chest pocket area.'
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
    image: '/products/teachers_blazer_1777437416659.png',
    category: 'teachers',
    subcategory: 'Blazers',
    fabric: 'Wool Blend',
    colors: ['#1a237e', '#000000', '#2c3e50'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Formal tailored navy blue blazer for teachers. Impeccably designed with a subtle university crest embroidered on the chest pocket for a distinguished look.'
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
