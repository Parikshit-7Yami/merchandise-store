import { Link } from 'react-router-dom';
import { ArrowRight, Users, GraduationCap, Briefcase, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'boys',
    title: 'Boys Collection',
    description: 'T-shirts, Sweatshirts & Sports Wear',
    icon: Users,
    path: '/boys',
    colorClass: 'bg-boys text-primary-foreground'
  },
  {
    id: 'girls',
    title: 'Girls Collection',
    description: 'Stylish T-shirts & Comfortable Sweatshirts',
    icon: GraduationCap,
    path: '/girls',
    colorClass: 'bg-girls text-primary-foreground'
  },
  {
    id: 'teachers',
    title: 'Teachers Collection',
    description: 'Professional Shirts & Blazers',
    icon: Briefcase,
    path: '/teachers',
    colorClass: 'bg-teachers text-primary-foreground'
  },
  {
    id: 'club',
    title: 'Club Customization',
    description: 'Design Your Own Club Merchandise',
    icon: Palette,
    path: '/club-customization',
    colorClass: 'bg-club text-primary-foreground'
  }
];

export const CategorySection = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect merchandise for every member of the Medicaps University community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link key={category.id} to={category.path}>
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl ${category.colorClass} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <category.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow">{category.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-primary font-medium text-sm">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
