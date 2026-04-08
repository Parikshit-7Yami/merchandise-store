import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupport } from '@/context/SupportContext';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';

export const ReturnRequestForm = () => {
  const { createTicket } = useSupport();
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const reasons = [
    'Wrong size delivered',
    'Defective/damaged item',
    'Wrong item received',
    'Size exchange',
    'Quality not as expected',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !reason || !description) {
      toast.error('Please fill all fields');
      return;
    }
    createTicket({
      type: 'return',
      orderId,
      subject: `Return: ${reason}`,
      description,
    });
    toast.success('Return request submitted!', {
      description: 'We\'ll review and respond within 24 hours.',
    });
    setOrderId('');
    setReason('');
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Submit Return Request
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Order ID</Label>
            <Input placeholder="e.g., ORD-1234567890" value={orderId} onChange={e => setOrderId(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                {reasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the issue in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
          </div>
          <Button type="submit" className="w-full">Submit Return Request</Button>
        </form>
      </CardContent>
    </Card>
  );
};
