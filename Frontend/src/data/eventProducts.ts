import { Product, EventCollection } from '@/types';

export const eventCollections: EventCollection[] = [
  {
    id: 'freshers-2026',
    name: 'Freshers 2026',
    description: 'Welcome the new batch with exclusive fresher merch!',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    isActive: true
  },
  {
    id: 'hackathon',
    name: 'Hackathon',
    description: 'Code in style with tech-themed merchandise',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    startDate: '2026-02-01',
    isActive: true
  },
  {
    id: 'sports-meet',
    name: 'Sports Meet 2026',
    description: 'Athletic wear for champions',
    image: 'https://images.unsplash.com/photo-1461896836934- voices-17f2e5?w=800',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    isActive: true
  },
  {
    id: 'farewell',
    name: 'Farewell 2026',
    description: 'Cherish memories with commemorative merchandise',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    isActive: true
  }
];

export const eventProducts: Product[] = [
  // Freshers 2026
  {
    id: 'freshers-tshirt-1',
    name: 'Freshers Welcome Tee',
    price: 699,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#1a237e', '#8B1538', '#FFFFFF', '#FFD700'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Official Freshers 2026 welcome t-shirt',
    eventName: 'Freshers 2026',
    isEventMerch: true
  },
  {
    id: 'freshers-hoodie-1',
    name: 'Freshers Batch Hoodie',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    category: 'boys',
    subcategory: 'Hoodies',
    fabric: 'Fleece',
    colors: ['#1a237e', '#8B1538', '#2c3e50'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Cozy hoodie for the class of 2026',
    eventName: 'Freshers 2026',
    isEventMerch: true
  },
  {
    id: 'freshers-tshirt-girls',
    name: 'Freshers Fitted Tee',
    price: 649,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400',
    category: 'girls',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#1a237e', '#8B1538', '#E91E63', '#FFFFFF'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Fitted welcome tee for freshers',
    eventName: 'Freshers 2026',
    isEventMerch: true
  },
  // Hackathon
  {
    id: 'hackathon-tshirt-1',
    name: 'Hackathon Coder Tee',
    price: 749,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#000000', '#1a237e', '#00C853'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Code in style - Hackathon edition',
    eventName: 'Hackathon',
    isEventMerch: true
  },
  {
    id: 'hackathon-hoodie-1',
    name: 'Developer Hoodie',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    category: 'boys',
    subcategory: 'Hoodies',
    fabric: 'Fleece',
    colors: ['#000000', '#1a237e', '#2c3e50'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium hoodie for late-night coding sessions',
    eventName: 'Hackathon',
    isEventMerch: true
  },
  // Sports Meet
  {
    id: 'sports-jersey-1',
    name: 'Sports Meet Jersey',
    price: 899,
    image: 'https://images.unsplash.com/photo-1580089595767-98745d7025c5?w=400',
    category: 'boys',
    subcategory: 'Sports T-shirts',
    fabric: 'Dri-Fit',
    colors: ['#1a237e', '#8B1538', '#FF5722', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Official Sports Meet 2026 jersey',
    eventName: 'Sports Meet 2026',
    isEventMerch: true
  },
  {
    id: 'sports-tracksuit-1',
    name: 'Athletic Tracksuit',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400',
    category: 'boys',
    subcategory: 'Sports T-shirts',
    fabric: 'Athletic',
    colors: ['#1a237e', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Complete athletic tracksuit',
    eventName: 'Sports Meet 2026',
    isEventMerch: true
  },
  {
    id: 'sports-jersey-girls',
    name: 'Women\'s Sports Jersey',
    price: 849,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    category: 'girls',
    subcategory: 'Sports T-shirts',
    fabric: 'Dri-Fit',
    colors: ['#1a237e', '#8B1538', '#E91E63'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Women\'s athletic jersey for sports meet',
    eventName: 'Sports Meet 2026',
    isEventMerch: true
  },
  // Farewell
  {
    id: 'farewell-tshirt-1',
    name: 'Farewell Memories Tee',
    price: 799,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
    category: 'boys',
    subcategory: 'T-shirts',
    fabric: 'Cotton',
    colors: ['#1a237e', '#8B1538', '#FFD700', '#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Commemorative farewell t-shirt',
    eventName: 'Farewell 2026',
    isEventMerch: true
  },
  {
    id: 'farewell-blazer-1',
    name: 'Farewell Formal Blazer',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400',
    category: 'teachers',
    subcategory: 'Blazers',
    fabric: 'Wool Blend',
    colors: ['#1a237e', '#000000'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Elegant farewell formal blazer with crest',
    eventName: 'Farewell 2026',
    isEventMerch: true
  },
  {
    id: 'farewell-hoodie-1',
    name: 'Farewell Batch Hoodie',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    category: 'boys',
    subcategory: 'Hoodies',
    fabric: 'Fleece',
    colors: ['#1a237e', '#8B1538', '#FFD700'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Premium farewell hoodie with batch year',
    eventName: 'Farewell 2026',
    isEventMerch: true
  }
];

export const getEventProducts = (eventName?: string) => {
  if (!eventName || eventName === 'All') {
    return eventProducts;
  }
  return eventProducts.filter(p => p.eventName === eventName);
};

export const getActiveEvents = () => {
  return eventCollections.filter(e => e.isActive);
};
