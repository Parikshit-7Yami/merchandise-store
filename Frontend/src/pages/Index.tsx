import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { CategorySection } from '@/components/CategorySection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { TrendingInCampus } from '@/components/TrendingInCampus';
import { EventMerchSection } from '@/components/EventMerchSection';
import { NotificationSubscribe } from '@/components/NotificationSubscribe';
import { Truck, Shield, Award, Headphones, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Truck,
    title: 'Campus Delivery',
    description: 'Free delivery to any campus location'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Premium fabrics & print quality'
  },
  {
    icon: Award,
    title: 'Official Merchandise',
    description: 'Authorized university products'
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'Dedicated student support team'
  }
];

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategorySection />
      
      {/* Features Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-secondary-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-secondary-foreground/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrendingInCampus />

      <FeaturedProducts />

      {/* Group Order CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-16 w-16 text-primary-foreground/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Planning a Team Event?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Create a group order for your club, team, or event. Share a code with members, 
            let everyone choose their size and color, and checkout together!
          </p>
          <Link to="/group-orders">
            <Button size="lg" variant="secondary" className="gap-2">
              <Users className="h-5 w-5" />
              Start Group Order
            </Button>
          </Link>
        </div>
      </section>

      <NotificationSubscribe />

      <EventMerchSection />
    </Layout>
  );
};

export default Index;
