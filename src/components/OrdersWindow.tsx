import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Package, Archive } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CompactOrderCard } from "@/components/CompactOrderCard";

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
  pickup_date: string;
  cake_type_id: string;
  people_count: number;
  base_id: string;
  filling_id: string;
  second_filling_id?: string;
  allergies: string;
  exterior_id: string;
  decoration_id: string;
  decoration_text: string;
  inscription: string;
  needs_transport: boolean;
  is_restaurant: boolean;
  delivery_address: string;
  restaurant_contact: string;
  cake_design: boolean;
  tiers: number;
  print_option: boolean;
  print_type: string;
  print_description: string;
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
          pickup_date,
          cake_type_id,
          people_count,
          base_id,
          filling_id,
          allergies,
          exterior_id,
          decoration_id,
          decoration_text,
          inscription,
          needs_transport,
          is_restaurant,
          delivery_address,
          restaurant_contact,
          cake_design,
          tiers,
          print_option,
          print_type,
          print_description
        `)
        .eq('date', today)
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Errore nel caricamento degli ordini');
        setOrders([]);
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
              <CompactOrderCard
                key={order.id}
                order={order}
                onStatusChange={updateOrderStatus}
                onArchive={archiveOrder}
                onDelete={deleteOrder}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export { OrdersWindow };