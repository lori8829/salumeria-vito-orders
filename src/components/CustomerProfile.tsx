import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, History } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import type { CustomerProfile as CustomerProfileType, OrderHistory } from "@/types/customer";

interface CustomerProfileProps {
  user: SupabaseUser;
  onProfileUpdate: (profile: CustomerProfileType) => void;
}

export const CustomerProfile = ({ user, onProfileUpdate }: CustomerProfileProps) => {
  const [profile, setProfile] = useState<CustomerProfileType | null>(null);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadOrderHistory();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        onProfileUpdate(data);
      }
    } catch (error) {
      console.error('Error:', error);
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
          categories (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading order history:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout effettuato",
        description: "Sei stato disconnesso con successo",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Errore",
        description: "Errore durante il logout",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Caricamento profilo...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profilo Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile ? (
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefono</p>
              <p className="font-medium">{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email || user.email}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-2">
              Profilo non configurato
            </p>
            <p className="text-sm text-muted-foreground">
              Il profilo verrà creato automaticamente al primo ordine
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="mr-2 h-4 w-4" />
            {showHistory ? 'Nascondi Storico' : 'Mostra Storico Ordini'}
          </Button>

          {showHistory && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Storico Ordini</h4>
              {orders.length > 0 ? (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="text-sm p-2 bg-background rounded border">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {order.categories?.name || 'Categoria sconosciuta'}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                      {order.pickup_date && (
                        <div className="text-muted-foreground">
                          Ritiro: {new Date(order.pickup_date).toLocaleDateString('it-IT')}
                        </div>
                      )}
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      ... e altri {orders.length - 5} ordini
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nessun ordine trovato
                </p>
              )}
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnetti
        </Button>
      </CardContent>
    </Card>
  );
};