import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CreditCard, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { PaymentIssueForm } from '@/components/support/PaymentIssueForm';
import { TicketList } from '@/components/support/TicketList';

const PaymentSupport = () => {
  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <CreditCard className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-foreground mb-2">Payment Support</h1>
          <p className="text-secondary-foreground/80">Troubleshoot payment issues & report problems</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Fixes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Payment Failed?</h3>
              <p className="text-sm text-muted-foreground">Wait 30 mins, then retry. Amount auto-refunds if debited.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Double Charged?</h3>
              <p className="text-sm text-muted-foreground">Report below. Duplicate charges are refunded within 48hrs.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">All transactions are encrypted and PCI compliant.</p>
            </CardContent>
          </Card>
        </div>

        {/* Troubleshooting FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Common Payment Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="p1">
                <AccordionTrigger>Payment was deducted but order not confirmed</AccordionTrigger>
                <AccordionContent>
                  This usually resolves within 30 minutes. If the order still doesn't appear,
                  submit a ticket below with your transaction ID. The amount will be refunded
                  automatically within 5-7 business days if the order wasn't placed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p2">
                <AccordionTrigger>UPI payment stuck on processing</AccordionTrigger>
                <AccordionContent>
                  Close the payment app and check your bank statement. If debited, wait 30 minutes.
                  If the order isn't confirmed, submit a ticket with your UPI transaction reference number.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p3">
                <AccordionTrigger>Card declined / insufficient funds</AccordionTrigger>
                <AccordionContent>
                  Ensure your card has sufficient balance, is enabled for online transactions,
                  and international payments are allowed (if applicable). Try another payment method
                  or contact your bank.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="p4">
                <AccordionTrigger>Refund not received after 7 days</AccordionTrigger>
                <AccordionContent>
                  Refund processing times vary by bank. If it's been more than 10 business days,
                  submit a ticket with your order ID and original payment details for expedited resolution.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Report Issue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PaymentIssueForm />
          <TicketList type="payment" />
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSupport;
