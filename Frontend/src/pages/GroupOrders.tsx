import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GroupOrderCreate } from '@/components/group-order/GroupOrderCreate';
import { GroupOrderJoin } from '@/components/group-order/GroupOrderJoin';
import { GroupOrderSummary } from '@/components/group-order/GroupOrderSummary';
import { useGroupOrder } from '@/context/GroupOrderContext';
import { Users, Plus, UserPlus, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GroupOrdersPage = () => {
  const { code } = useParams<{ code?: string }>();
  const { groupOrders } = useGroupOrder();
  const [activeTab, setActiveTab] = useState<string>(code ? 'view' : 'list');

  // If viewing a specific group order
  if (code) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/group-orders" className="text-primary hover:underline flex items-center gap-1 text-sm">
              ← Back to Group Orders
            </Link>
          </div>
          <GroupOrderSummary groupCode={code} isCreator={true} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Group Orders</h1>
            <p className="text-muted-foreground">Collaborate on bulk orders for teams, events, and clubs</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="list">
              <Users className="h-4 w-4 mr-2" />
              My Groups
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="join">
              <UserPlus className="h-4 w-4 mr-2" />
              Join
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {groupOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Group Orders Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a new group order or join an existing one
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('join')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {groupOrders.map(order => (
                  <Link key={order.id} to={`/group-orders/${order.groupCode}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{order.groupName}</h3>
                              <Badge variant={
                                order.status === 'open' ? 'default' :
                                order.status === 'checked_out' ? 'secondary' : 'outline'
                              }>
                                {order.status === 'open' ? 'Open' :
                                 order.status === 'checked_out' ? 'Completed' : 'Closed'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {order.members.length} members
                              </span>
                              <span>•</span>
                              <span className="capitalize">{order.baseProductType}</span>
                              <span>•</span>
                              <span>{order.clubName}</span>
                              {order.eventName && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {order.eventName}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                ₹{order.members.reduce((sum, m) => sum + m.quantity * order.basePrice, 0)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.members.reduce((sum, m) => sum + m.quantity, 0)} items
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <GroupOrderCreate />
          </TabsContent>

          <TabsContent value="join">
            <GroupOrderJoin />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GroupOrdersPage;
