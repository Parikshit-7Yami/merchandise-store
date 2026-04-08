import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { ReturnRequestForm } from '@/components/support/ReturnRequestForm';
import { TicketList } from '@/components/support/TicketList';

const ReturnPolicy = () => {
  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <RotateCcw className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-foreground mb-2">Return Policy</h1>
          <p className="text-secondary-foreground/80">Know your rights & submit return requests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">7-Day Window</h3>
              <p className="text-sm text-muted-foreground">Return within 7 days of delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Quality Check</h3>
              <p className="text-sm text-muted-foreground">Items must be unworn with tags</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Custom Items</h3>
              <p className="text-sm text-muted-foreground">Customized merch is non-returnable</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger>What items are eligible for return?</AccordionTrigger>
                <AccordionContent>
                  Standard catalog items (non-customized) in original condition with tags attached,
                  returned within 7 days of delivery. Items must be unworn and unwashed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Can I return customized merchandise?</AccordionTrigger>
                <AccordionContent>
                  Customized items (club logos, names, custom designs) are <strong>non-returnable</strong> unless
                  there is a manufacturing defect or wrong item delivered.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How long does the refund take?</AccordionTrigger>
                <AccordionContent>
                  Once we receive and inspect the returned item, refunds are processed within 5-7 business days
                  to the original payment method.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>Can I exchange for a different size?</AccordionTrigger>
                <AccordionContent>
                  Yes! Size exchanges are free for standard items. Submit a return request selecting
                  "Size Exchange" and mention your preferred size.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>What about group order returns?</AccordionTrigger>
                <AccordionContent>
                  Individual members in a group order can request returns for their items only.
                  The group order creator must coordinate with the merchant for bulk returns.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Submit Return Request */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReturnRequestForm />
          <TicketList type="return" />
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
