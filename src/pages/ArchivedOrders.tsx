import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronRight, Archive, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Order {
  id: string;
  created_at: string;
  date: string;
  status: string;
  total_items: number;
  customer_name: string;
  customer_surname: string;
  customer_phone: string;
  pickup_time: string;
  order_items: {
    id: string;
    dish_name: string;
    quantity: number;
  }[];
}

interface GroupedOrders {
  [date: string]: Order[];
}

const ArchivedOrders = () => {
  const [archivedOrders, setArchivedOrders] = useState<GroupedOrders>({});
  const [loading, setLoading] = useState(true);
  const [openDays, setOpenDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadArchivedOrders();
  }, []);

  const loadArchivedOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          date,
          status,
          total_items,
          customer_name,
          customer_surname,
          customer_phone,
          pickup_time,
          order_items (
            id,
            dish_name,
            quantity
          )
        `)
        .eq('status', 'archived')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading archived orders:', error);
      } else {
        // Group orders by date
        const grouped = (data || []).reduce((acc: GroupedOrders, order) => {
          const date = order.date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(order);
          return acc;
        }, {});
        setArchivedOrders(grouped);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (date: string) => {
    setOpenDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna all'Admin
            </Button>
          </Link>
          <Header 
            title="Archivio Ordini"
            subtitle="Ordini archiviati"
          />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento ordini archiviati...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link to="/admin">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna all'Admin
          </Button>
        </Link>
        <Header 
          title="Archivio Ordini"
          subtitle="Ordini archiviati"
        />
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-card shadow-card">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Archive className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Ordini Archiviati</h2>
            </div>

            {Object.keys(archivedOrders).length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <Archive className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nessun ordine archiviato
                    </h3>
                    <p className="text-muted-foreground">
                      Gli ordini archiviati appariranno qui
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(archivedOrders).map(([date, orders]) => (
                  <Collapsible
                    key={date}
                    open={openDays.has(date)}
                    onOpenChange={() => toggleDay(date)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-between p-4 h-auto"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5" />
                          <div className="text-left">
                            <h3 className="font-semibold">{formatDate(date)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {orders.length} ordini
                            </p>
                          </div>
                        </div>
                        {openDays.has(date) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border border-border rounded-lg ml-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">#{order.id.slice(0, 8)}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleTimeString('it-IT', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <p className="font-medium">
                                    {order.customer_name} {order.customer_surname}
                                  </p>
                                  <p className="text-muted-foreground">Tel: {order.customer_phone}</p>
                                  {order.pickup_time && (
                                    <p className="text-muted-foreground">
                                      Ritiro alle: {order.pickup_time}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Articoli ({order.total_items} totali):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {order.order_items.map((item) => (
                                  <Badge key={item.id} variant="outline">
                                    {item.quantity}x {item.dish_name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ArchivedOrders;