import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CategoryOrderForm } from "@/components/CategoryOrderForm";
import { CakeDesignForm } from "@/components/CakeDesignForm";
import { OrderConfirmationDialog } from "@/components/OrderConfirmationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChefHat, Cookie, Cake, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_configurable: boolean;
  min_lead_days: number;
}

const Cliente = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowOrderDialog(true);
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      // Create order in database
      const orderInsertData = {
        customer_name: orderData.name,
        customer_surname: orderData.surname,
        customer_phone: orderData.phone,
        category_id: selectedCategory?.id,
        pickup_date: orderData.fieldValues?.pickup_date || null,
        pickup_time: orderData.fieldValues?.pickup_time || null,
        status: 'Ricevuto',
        total_items: 1
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsertData)
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        alert('Errore durante la creazione dell\'ordine');
        return;
      }

      // Save field values
      if (orderData.fieldValues && orderResult) {
        const fieldValues = Object.entries(orderData.fieldValues).map(([key, value]: [string, any]) => {
          // Check if the value is a URL (for uploaded files)
          const isFileUrl = typeof value === 'string' && (value.includes('/order-images/') || value.startsWith('http'));
          
          return {
            order_id: orderResult.id,
            field_key: key,
            field_value: isFileUrl ? null : (typeof value === 'string' ? value : JSON.stringify(value)),
            file_url: isFileUrl ? value : null
          };
        });

        const { error: valuesError } = await supabase
          .from('order_field_values')
          .insert(fieldValues);

        if (valuesError) {
          console.error('Error saving field values:', valuesError);
        }
      }

      setShowOrderDialog(false);
      setShowConfirmationDialog(true);
      
    } catch (error) {
      console.error('Error during order creation:', error);
      alert('Errore durante la creazione dell\'ordine');
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'TORTE IN VETRINA':
        return <ChefHat className="h-8 w-8" />;
      case 'TORTE DA FORNO':
        return <Cookie className="h-8 w-8" />;
      case 'CROSTATE':
        return <Cake className="h-8 w-8" />;
      case 'CAKE DESIGN':
        return <Sparkles className="h-8 w-8" />;
      default:
        return <Cake className="h-8 w-8" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case 'TORTE IN VETRINA':
        return 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700';
      case 'TORTE DA FORNO':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700';
      case 'CROSTATE':
        return 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700';
      case 'CAKE DESIGN':
        return 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700';
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Pasticceria del Borgo"
        subtitle=""
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Che torta vuoi ordinare oggi?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`p-8 cursor-pointer transition-all duration-300 hover:shadow-elevated hover:scale-105 border-2 ${getCategoryColor(category.name)}`}
                onClick={() => handleCategorySelect(category)}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white/50 rounded-full">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="text-lg font-bold text-center">
                    {category.name}
                  </h3>
                  <Button 
                    className="w-full mt-4"
                    variant="outline"
                  >
                    Seleziona
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Ordine {selectedCategory?.name} - Pasticceria del Borgo
            </DialogTitle>
          </DialogHeader>
          {selectedCategory?.slug === 'cake-design' ? (
            <CakeDesignForm
              onSubmit={handleOrderSubmit}
              onCancel={() => setShowOrderDialog(false)}
            />
          ) : (
            <CategoryOrderForm
              category={selectedCategory}
              onSubmit={handleOrderSubmit}
              onCancel={() => setShowOrderDialog(false)}
            />
          )}
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