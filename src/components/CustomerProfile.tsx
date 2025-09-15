import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, History } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
}

interface OrderHistory {
  id: string;
  date: string;
  cake_type_id: string | null;
  pickup_date: string | null;
  categories: { name: string } | null;
}

interface CustomerProfileProps {
  user: SupabaseUser;
  onProfileUpdate: (profile: CustomerProfile) => void;
}

export const CustomerProfile = ({ user, onProfileUpdate }: CustomerProfileProps) => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    loadOrderHistory();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        onProfileUpdate(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          date,
          cake_type_id,
          pickup_date,
          categories (name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading order history:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore",
        description: "Errore durante il logout",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Arrivederci!",
        description: "Logout effettuato con successo",
      });
    }
  };

  if (loading) {
    return <div>Caricamento profilo...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Il tuo account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile && (
            <div className="space-y-2">
              <p><strong>Nome:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>Telefono:</strong> {profile.phone}</p>
              {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              {showHistory ? "Nascondi storico" : "Mostra storico ordini"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {showHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Storico Ordini</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">Non hai ancora effettuato ordini.</p>
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="border-b pb-2">
                        <p><strong>Data ordine:</strong> {new Date(order.date).toLocaleDateString('it-IT')}</p>
                        <p><strong>Categoria:</strong> {order.categories?.name || 'N/A'}</p>
                        {order.pickup_date && (
                          <p><strong>Data ritiro:</strong> {new Date(order.pickup_date).toLocaleDateString('it-IT')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};