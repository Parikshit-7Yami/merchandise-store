import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupport } from '@/context/SupportContext';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';

export const PaymentIssueForm = () => {
  const { createTicket } = useSupport();
  const [orderId, setOrderId] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');

  const issues = [
    'Payment deducted, order not confirmed',
    'Double charged',
    'Refund not received',
    'Payment stuck on processing',
    'Card declined unexpectedly',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !issue || !description) {
      toast.error('Please fill all fields');
      return;
    }
    createTicket({
      type: 'payment',
      orderId,
      subject: `Payment: ${issue}`,
      description,
    });
    toast.success('Payment issue reported!', {
      description: 'Our team will investigate within 24 hours.',
    });
    setOrderId('');
    setIssue('');
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Report Payment Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Order ID / Transaction ID</Label>
            <Input placeholder="e.g., ORD-1234567890" value={orderId} onChange={e => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Issue Type</Label>
            <Select value={issue} onValueChange={setIssue}>
              <SelectTrigger><SelectValue placeholder="Select issue" /></SelectTrigger>
              <SelectContent>
                {issues.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Details</Label>
            <Textarea placeholder="Include transaction reference, bank name, amount..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
          </div>
          <Button type="submit" className="w-full">Report Issue</Button>
        </form>
      </CardContent>
    </Card>
  );
};
