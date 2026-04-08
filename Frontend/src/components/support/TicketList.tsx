import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupport } from '@/context/SupportContext';
import { MessageSquare, Clock } from 'lucide-react';

const statusColors: Record<string, string> = {
  open: 'bg-accent text-accent-foreground',
  in_progress: 'bg-primary text-primary-foreground',
  resolved: 'bg-secondary text-secondary-foreground',
  closed: 'bg-muted text-muted-foreground',
};

export const TicketList = ({ type }: { type: 'return' | 'payment' }) => {
  const { getTicketsByType } = useSupport();
  const tickets = getTicketsByType(type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Your {type === 'return' ? 'Return' : 'Payment'} Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No {type} tickets yet. Submit a request to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.id} • Order: {ticket.orderId}</p>
                  </div>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                  {ticket.responses.length > 0 && (
                    <span className="ml-2">• {ticket.responses.length} response(s)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
