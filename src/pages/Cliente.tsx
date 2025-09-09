import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MenuCard } from "@/components/MenuCard";
import { CartSummary } from "@/components/CartSummary";
import { EmptyMenu } from "@/components/EmptyMenu";
import { CustomerInfoDialog } from "@/components/CustomerInfoDialog";
import { OrderConfirmationDialog } from "@/components/OrderConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  price_cents: number;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price_cents: number;
}

const Cliente = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  
  const cartItems: CartItem[] = menuItems
    .filter(item => cart[item.id] > 0)
    .map(item => ({
      id: item.id,
      name: item.name,
      quantity: cart[item.id],
      price_cents: 0 // No prices shown to customer
    }));

  useEffect(() => {
    loadTodaysMenu();
  }, []);

  const loadTodaysMenu = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          dishes (
            id,
            name
          )
        `)
        .eq('date', today);
      
      if (error) {
        console.error('Error loading menu:', error);
        setMenuItems([]);
      } else {
        const formattedItems = data?.map(item => ({
          id: item.id,
          name: item.dishes?.name || 'Piatto sconosciuto',
          price_cents: 0 // No prices for customers
        })) || [];
        setMenuItems(formattedItems);
      }
    } catch (error) {
      console.error('Error:', error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(prev => {
      const newQuantity = (prev[itemId] || 0) + change;
      if (newQuantity <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const handleCheckout = () => {
    setShowCustomerDialog(true);
  };

  const handleCustomerInfoConfirm = async (customerInfo: {
    name: string;
    surname: string;
    phone: string;
    pickupTime?: string;
  }) => {
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          customer_name: customerInfo.name,
          customer_surname: customerInfo.surname,
          customer_phone: customerInfo.phone,
          pickup_time: customerInfo.pickupTime || null
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        return;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        dish_name: item.name,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        return;
      }

      // Clear cart and show confirmation
      setCart({});
      setShowCustomerDialog(false);
      setShowConfirmationDialog(true);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Errore durante la creazione dell\'ordine');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento menù...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      
      <Header 
        title="Salumeria Vito"
        subtitle="Menù del giorno - Area Cliente"
      />
      
      <main className="container mx-auto px-4 py-8 pb-40">
        {menuItems.length === 0 ? (
          <EmptyMenu />
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Le nostre specialità di oggi
              </h2>
              <p className="text-muted-foreground">
                Prodotti freschi e di qualità, preparati ogni giorno
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  quantity={cart[item.id] || 0}
                  onIncrement={() => updateQuantity(item.id, 1)}
                  onDecrement={() => updateQuantity(item.id, -1)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <CartSummary 
        items={cartItems}
        onCheckout={handleCheckout}
      />

      <CustomerInfoDialog
        isOpen={showCustomerDialog}
        onClose={() => setShowCustomerDialog(false)}
        onConfirm={handleCustomerInfoConfirm}
      />

      <OrderConfirmationDialog
        isOpen={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
      />
    </div>
  );
};

export default Cliente;