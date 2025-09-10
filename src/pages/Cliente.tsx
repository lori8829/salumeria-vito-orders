import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CakeOrderForm } from "@/components/CakeOrderForm";
import { OrderConfirmationDialog } from "@/components/OrderConfirmationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Cliente = () => {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const handleOrderSubmit = async (orderData: any) => {
    try {
      // Create order in database
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.name,
          customer_surname: orderData.surname,
          customer_phone: orderData.phone,
          pickup_date: orderData.date,
          pickup_time: orderData.pickupTime,
          cake_design: orderData.cakeDesign,
          tiers: orderData.tiers,
          cake_type_id: orderData.cakeType || null,
          people_count: orderData.peopleCount ? parseInt(orderData.peopleCount) : null,
          base_id: orderData.base || null,
          filling_id: orderData.filling || null,
          allergies: orderData.allergies,
          exterior_id: orderData.exterior || null,
          print_option: orderData.printOption,
          print_type: orderData.printType,
          print_description: orderData.printDescription,
          decoration_id: orderData.decoration || null,
          inscription: orderData.inscription,
          needs_transport: orderData.needsTransport,
          is_restaurant: orderData.isRestaurant,
          delivery_address: orderData.deliveryAddress,
          restaurant_contact: orderData.restaurantContact,
          total_items: 1
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        alert('Errore durante la creazione dell\'ordine');
        return;
      }

      // Handle image upload if needed
      if (orderData.printImage && orderData.printType === 'upload') {
        // In a real app, you would upload to Supabase Storage here
        console.log('Image to upload:', orderData.printImage);
      }

      setShowOrderDialog(false);
      setShowConfirmationDialog(true);
      
    } catch (error) {
      console.error('Error during order creation:', error);
      alert('Errore durante la creazione dell\'ordine');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Pasticceria del Borgo"
        subtitle=""
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
            Ordina la tua torta personalizzata
          </h2>
          <p className="text-muted-foreground mb-8">
            Creazioni artigianali per ogni occasione speciale
          </p>
          
          <Button 
            onClick={() => setShowOrderDialog(true)}
            size="lg"
            className="w-full max-w-md mx-auto"
          >
            Crea il tuo ordine
          </Button>
        </div>
      </main>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Ordine Personalizzato - Pasticceria del Borgo
            </DialogTitle>
          </DialogHeader>
          <CakeOrderForm
            onSubmit={handleOrderSubmit}
            onCancel={() => setShowOrderDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <OrderConfirmationDialog
        isOpen={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
      />
    </div>
  );
};

export default Cliente;