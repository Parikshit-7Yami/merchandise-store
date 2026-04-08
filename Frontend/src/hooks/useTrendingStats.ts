import { useMemo } from 'react';
import { Order, TrendingStats } from '@/types';

// Color name mapping
const colorNames: Record<string, string> = {
  '#1a237e': 'Navy Blue',
  '#8B1538': 'Maroon',
  '#FFFFFF': 'White',
  '#000000': 'Black',
  '#2c3e50': 'Dark Slate',
  '#E91E63': 'Pink',
  '#9C27B0': 'Purple',
  '#FFD700': 'Gold',
  '#00C853': 'Green',
  '#FF5722': 'Orange',
  '#87CEEB': 'Sky Blue'
};

const getColorName = (hex: string): string => {
  return colorNames[hex.toUpperCase()] || colorNames[hex.toLowerCase()] || 'Custom Color';
};

export const useTrendingStats = (orders: Order[]): TrendingStats => {
  return useMemo(() => {
    // Default stats if no orders
    const defaultStats: TrendingStats = {
      mostOrderedProduct: {
        name: 'University Hoodie',
        category: 'Sweatshirts',
        orders: 142,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
      },
      mostPopularColor: {
        color: '#1a237e',
        colorName: 'Navy Blue',
        orders: 234
      },
      topClubDesign: {
        clubName: 'CSE Technical Club',
        orders: 89
      },
      totalOrdersThisMonth: 567
    };

    if (orders.length === 0) {
      return defaultStats;
    }

    // Count products
    const productCounts: Record<string, { count: number; name: string; category: string; image: string }> = {};
    const colorCounts: Record<string, number> = {};
    const clubCounts: Record<string, { count: number; logo?: string }> = {};

    orders.forEach(order => {
      // Count regular items
      order.items.forEach(item => {
        const key = item.product.id;
        if (!productCounts[key]) {
          productCounts[key] = {
            count: 0,
            name: item.product.name,
            category: item.product.subcategory,
            image: item.product.image
          };
        }
        productCounts[key].count += item.quantity;

        // Count colors
        const color = item.selectedColor;
        colorCounts[color] = (colorCounts[color] || 0) + item.quantity;
      });

      // Count custom items
      order.customItems.forEach(item => {
        // Count colors
        colorCounts[item.color] = (colorCounts[item.color] || 0) + item.quantity;

        // Count clubs
        if (item.clubName) {
          if (!clubCounts[item.clubName]) {
            clubCounts[item.clubName] = { count: 0, logo: item.clubLogo };
          }
          clubCounts[item.clubName].count += item.quantity;
        }
      });

      // Count group order members
      if (order.groupOrderMembers) {
        order.groupOrderMembers.forEach(member => {
          colorCounts[member.color] = (colorCounts[member.color] || 0) + member.quantity;
        });
      }
    });

    // Find most ordered product
    let mostOrderedProduct = defaultStats.mostOrderedProduct;
    let maxProductCount = 0;
    Object.values(productCounts).forEach(product => {
      if (product.count > maxProductCount) {
        maxProductCount = product.count;
        mostOrderedProduct = {
          name: product.name,
          category: product.category,
          orders: product.count,
          image: product.image
        };
      }
    });

    // Find most popular color
    let mostPopularColor = defaultStats.mostPopularColor;
    let maxColorCount = 0;
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count > maxColorCount) {
        maxColorCount = count;
        mostPopularColor = {
          color,
          colorName: getColorName(color),
          orders: count
        };
      }
    });

    // Find top club design
    let topClubDesign = defaultStats.topClubDesign;
    let maxClubCount = 0;
    Object.entries(clubCounts).forEach(([clubName, data]) => {
      if (data.count > maxClubCount) {
        maxClubCount = data.count;
        topClubDesign = {
          clubName,
          orders: data.count,
          logo: data.logo
        };
      }
    });

    // Calculate total orders this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalOrdersThisMonth = orders.filter(order => 
      new Date(order.orderDate) >= startOfMonth
    ).length;

    return {
      mostOrderedProduct: maxProductCount > 0 ? mostOrderedProduct : defaultStats.mostOrderedProduct,
      mostPopularColor: maxColorCount > 0 ? mostPopularColor : defaultStats.mostPopularColor,
      topClubDesign: maxClubCount > 0 ? topClubDesign : defaultStats.topClubDesign,
      totalOrdersThisMonth: totalOrdersThisMonth || defaultStats.totalOrdersThisMonth
    };
  }, [orders]);
};
