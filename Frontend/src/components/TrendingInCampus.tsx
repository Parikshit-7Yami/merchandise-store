import { TrendingUp, Palette, Award, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useTrendingStats } from '@/hooks/useTrendingStats';

export const TrendingInCampus = () => {
  const { orders } = useCart();
  const stats = useTrendingStats(orders);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Trending in Campus</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Most Ordered Product */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 bg-secondary/20">
              <img
                src={stats.mostOrderedProduct.image}
                alt={stats.mostOrderedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                🔥 Top Seller
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {stats.mostOrderedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.mostOrderedProduct.category}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-primary">
                {stats.mostOrderedProduct.orders} orders this month
              </p>
            </CardContent>
          </Card>

          {/* Most Popular Color */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 flex items-center justify-center bg-secondary/20">
              <div
                className="w-24 h-24 rounded-full shadow-lg border-4 border-background"
                style={{ backgroundColor: stats.mostPopularColor.color }}
              />
              <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
                🎨 Favorite Color
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <Palette className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {stats.mostPopularColor.colorName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Most chosen color
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-primary">
                {stats.mostPopularColor.orders} items ordered
              </p>
            </CardContent>
          </Card>

          {/* Top Club Design */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/20">
              {stats.topClubDesign.logo ? (
                <img
                  src={stats.topClubDesign.logo}
                  alt={stats.topClubDesign.clubName}
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <Award className="w-20 h-20 text-primary/30" />
              )}
              <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                🏆 Top Club
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <Award className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {stats.topClubDesign.clubName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Most popular club design
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium text-primary">
                {stats.topClubDesign.orders} custom orders
              </p>
            </CardContent>
          </Card>

          {/* Total Orders This Month */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
              <TrendingUp className="h-12 w-12 mb-4 opacity-80" />
              <p className="text-4xl font-bold mb-2">
                {stats.totalOrdersThisMonth}
              </p>
              <p className="text-lg opacity-90">
                Orders This Month
              </p>
              <p className="text-sm opacity-75 mt-2">
                Campus is loving the merch! 🎉
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
