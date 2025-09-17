import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { CakeDesignForm } from "@/components/CakeDesignForm";
import { CategoryOrderForm } from "@/components/CategoryOrderForm";
import { OrderConfirmationDialog } from "@/components/OrderConfirmationDialog";
import { CustomerProfile } from "@/components/CustomerProfile";
import { Link } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import type { CustomerProfile as CustomerProfileType } from "@/types/customer";
import { 
  Cake, 
  Coffee, 
  Cookie, 
  Croissant, 
  IceCream, 
  Pizza,
  ChefHat,
  Utensils,
  Candy,
  LogIn,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_configurable: boolean;
  min_lead_days: number;
}

const Cliente = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfileType | null>(null);

  useEffect(() => {
    loadCategories();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  };

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
    setIsOrderDialogOpen(true);
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      console.log('Order data received:', orderData);
      
      // Calculate total items from order data
      const totalItems = orderData.orderItems?.length || 1;
      
      // Validate category exists
      if (!selectedCategory) {
        throw new Error('Categoria non selezionata');
      }

      // Insert order with user_id if user is logged in
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderData.customerName,
          customer_surname: orderData.customerSurname,
          customer_phone: orderData.customerPhone,
          pickup_date: orderData.pickupDate,
          pickup_time: orderData.pickupTime,
          allergies: orderData.allergies,
          category_id: selectedCategory.id,
          user_id: user?.id || null,
          date: new Date().toISOString().split('T')[0],
          total_items: totalItems
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Handle additional fields for all categories
      if (orderData.fieldValues) {
        const fieldValues = Object.entries(orderData.fieldValues).map(([key, value]: [string, any]) => {
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

      setIsOrderDialogOpen(false);
      setIsConfirmationDialogOpen(true);
      
    } catch (error) {
      console.error('Error during order creation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione dell'ordine. Riprova.",
        variant: "destructive",
      });
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Benvenuto alla Pasticceria del Borgo
          </h1>
          <p className="text-lg text-muted-foreground">
            Scegli una categoria per iniziare il tuo ordine
          </p>
        </div>

        {/* Auth section */}
        <div className="mb-8 flex justify-center">
          {user ? (
            <CustomerProfile 
              user={user} 
              onProfileUpdate={setCustomerProfile}
            />
          ) : (
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <p className="mb-4 text-muted-foreground">
                  Accedi per velocizzare i tuoi ordini futuri e tenere traccia dello storico
                </p>
                <Link to="/customer-auth">
                  <Button className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Accedi o Registrati
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${getCategoryColor(category.name)}`}
              onClick={() => handleCategorySelect(category)}
            >
              <CardContent className="flex flex-col items-center space-y-4 p-0">
                <div className="p-3 bg-background/50 rounded-full">
                  {getCategoryIcon(category.name)}
                </div>
                <CardTitle className="text-center text-lg">
                  {category.name}
                </CardTitle>
                <Button variant="outline" className="w-full">
                  Ordina Ora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ordina - {selectedCategory?.name}</DialogTitle>
            </DialogHeader>
            {selectedCategory?.slug === 'cake-design' ? (
              <CakeDesignForm 
                onSubmit={handleOrderSubmit}
                category={selectedCategory}
                customerProfile={customerProfile}
              />
            ) : (
              <CategoryOrderForm 
                onSubmit={handleOrderSubmit}
                category={selectedCategory}
                customerProfile={customerProfile}
              />
            )}
          </DialogContent>
        </Dialog>

        <OrderConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onClose={() => setIsConfirmationDialogOpen(false)}
        />
    </div>
  );
};

export default Cliente;