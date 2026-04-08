import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationSubscribe = () => {
  const { subscribe } = useNotifications();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please enter your name and college email');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    setIsSubmitting(true);
    try {
      await subscribe(email, name);
      setEmail('');
      setName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Bell className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Never Miss an Event!</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Subscribe with your college email to get notified about new events,
              exclusive merchandise drops, and special offers.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="college@medicaps.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
