import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Archive, Clock, Package } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

const OrdersWindow = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodaysOrders();
  }, []);

  const loadTodaysOrders = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
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
        .eq('date', today)
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Errore nel caricamento degli ordini');
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento degli ordini');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast.error('Errore nell\'aggiornamento dello stato');
      } else {
        toast.success('Stato dell\'ordine aggiornato');
        loadTodaysOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'aggiornamento dello stato');
    }
  };

  const archiveOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'archived',
          archived_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error archiving order:', error);
        toast.error('Errore nell\'archiviazione dell\'ordine');
      } else {
        toast.success('Ordine archiviato con successo');
        loadTodaysOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'archiviazione dell\'ordine');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo ordine?')) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        toast.error('Errore nell\'eliminazione dell\'ordine');
      } else {
        toast.success('Ordine eliminato con successo');
        loadTodaysOrders();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione dell\'ordine');
    }
  };

  if (loading) {
    return (
      <Card className="bg-card shadow-card">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Ordini di Oggi</h2>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Caricamento ordini...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card shadow-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Ordini di Oggi</h2>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/archived-orders')}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Vedi Archivio
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nessun ordine oggi
                </h3>
                <p className="text-muted-foreground">
                  Gli ordini di oggi appariranno qui quando verranno effettuati
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border border-border rounded-lg">
                <div className="space-y-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{order.id.slice(0, 8)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => archiveOrder(order.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">
                        {order.customer_name} {order.customer_surname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tel: {order.customer_phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orario ritiro</p>
                      <p className="font-medium">
                        {order.pickup_time || 'Non specificato'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stato ordine</p>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">In attesa</SelectItem>
                          <SelectItem value="completed">Ritirato</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Order Items */}
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
          </div>
        )}
      </div>
    </Card>
  );
};

export { OrdersWindow };