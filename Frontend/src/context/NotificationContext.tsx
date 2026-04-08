import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NotificationSubscription } from '@/types';
import { toast } from 'sonner';
import { subscribeStudent } from '@/lib/api';

interface NotificationContextType {
  subscriptions: NotificationSubscription[];
  subscribe: (email: string, name: string) => Promise<void>;
  unsubscribe: (email: string) => void;
  updatePreferences: (email: string, preferences: NotificationSubscription['preferences']) => void;
  isSubscribed: (email: string) => boolean;
  simulateEventNotification: (eventName: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>(() => {
    const saved = localStorage.getItem('notificationSubscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('notificationSubscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const subscribe = async (email: string, name: string) => {

    try {
      await subscribeStudent({ email, name });
      const sub: NotificationSubscription = {
        id: `SUB-${Date.now()}`,
        email,
        name,
        subscribedAt: new Date().toISOString(),
        preferences: { newEvents: true, orderUpdates: true, promotions: false },
      };
      setSubscriptions(prev => [...prev, sub]);
      toast.success('Subscribed successfully!', {
        description: `Notifications will be sent to ${email}`,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe');
    }
  };

  const unsubscribe = (email: string) => {
    setSubscriptions(prev => prev.filter(s => s.email !== email));
    toast.info('Unsubscribed from notifications');
  };

  const updatePreferences = (email: string, preferences: NotificationSubscription['preferences']) => {
    setSubscriptions(prev =>
      prev.map(s => (s.email === email ? { ...s, preferences } : s))
    );
  };

  const isSubscribed = (email: string) => subscriptions.some(s => s.email === email);

  const simulateEventNotification = (eventName: string) => {
    const count = subscriptions.filter(s => s.preferences.newEvents).length;
    toast.success(`Event notification sent!`, {
      description: `"${eventName}" notification simulated for ${count} subscriber(s)`,
    });
  };

  return (
    <NotificationContext.Provider value={{
      subscriptions,
      subscribe,
      unsubscribe,
      updatePreferences,
      isSubscribed,
      simulateEventNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
