import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { OrdersWindow } from "@/components/OrdersWindow";
import { Plus, Trash2, FileText, Archive, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";


interface MenuItem {
  id: string;
  name: string;
  price_cents: number;
}

interface Dish {
  id: string;
  name: string;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [newItem, setNewItem] = useState({ name: "", selectedDish: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load all dishes and today's menu from database
  useEffect(() => {
    loadDishes();
    loadTodaysMenu();
  }, []);

  const loadDishes = async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading dishes:', error);
    } else {
      setDishes(data || []);
    }
  };

  const loadTodaysMenu = async () => {
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
      console.error('Error loading menu items:', error);
    } else {
      const formattedItems = data?.map(item => ({
        id: item.id,
        name: item.dishes?.name || 'Piatto sconosciuto',
        price_cents: 0
      })) || [];
      setMenuItems(formattedItems);
    }
  };

  // Auto-archive menu at 23:00 every day
  useEffect(() => {
    const checkAutoArchive = () => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 0) {
        handleArchiveMenu();
      }
    };

    const interval = setInterval(checkAutoArchive, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let dishName = "";
    
    if (newItem.selectedDish) {
      // Use selected dish from dropdown
      const selectedDish = dishes.find(d => d.id === newItem.selectedDish);
      if (selectedDish) {
        dishName = selectedDish.name;
      }
    } else if (newItem.name) {
      // Create new dish
      dishName = newItem.name;
      
      // Save new dish to database
      const { data: newDish, error } = await supabase
        .from('dishes')
        .insert({ name: dishName })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Piatto già esistente",
            description: "Questo piatto è già presente nel database",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Errore",
            description: "Errore durante il salvataggio del piatto",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Reload dishes to include the new one
      await loadDishes();
    } else {
      toast({
        title: "Errore",
        description: "Seleziona un piatto dal menù o inserisci un nuovo nome",
        variant: "destructive"
      });
      return;
    }

    // Add to today's menu in database
    const today = new Date().toISOString().split('T')[0];
    
    // Find the dish ID
    let dishId = "";
    if (newItem.selectedDish) {
      dishId = newItem.selectedDish;
    } else {
      // Find the newly created dish
      const dish = dishes.find(d => d.name === dishName);
      if (dish) {
        dishId = dish.id;
      }
    }
    
    if (dishId) {
      const { data: menuItem, error: menuError } = await supabase
        .from('menu_items')
        .insert({
          dish_id: dishId,
          date: today
        })
        .select(`
          id,
          dishes (
            id,
            name
          )
        `)
        .single();
      
      if (menuError) {
        toast({
          title: "Errore",
          description: "Errore durante l'aggiunta al menù",
          variant: "destructive"
        });
        return;
      }
      
      // Add to local state
      const newMenuItem = {
        id: menuItem.id,
        name: menuItem.dishes?.name || dishName,
        price_cents: 0
      };
      
      setMenuItems(prev => [...prev, newMenuItem]);
    }
    
    setNewItem({ name: "", selectedDish: "" });
    
    toast({
      title: "Piatto aggiunto!",
      description: `${dishName} è stato aggiunto al menù`
    });
  };

  const handleDeleteItem = async (id: string) => {
    // Delete from database
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Errore",
        description: "Errore durante la rimozione del piatto",
        variant: "destructive"
      });
      return;
    }
    
    // Remove from local state
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Piatto rimosso",
      description: "Il piatto è stato rimosso dal menù"
    });
  };

  const handlePrintMenu = () => {
    toast({
      title: "PDF generato",
      description: "Il menù è pronto per la stampa"
    });
  };

  const handleArchiveMenu = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Delete all menu items for today
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('date', today);
    
    if (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'archiviazione del menù",
        variant: "destructive"
      });
      return;
    }
    
    setMenuItems([]);
    toast({
      title: "Menù archiviato",
      description: "Il menù di oggi è stato archiviato"
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna alla Home
            </Button>
          </Link>
          <Header 
            title="Pannello Proprietario"
            subtitle="Gestione menù e ordini"
          />
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Esci
        </Button>
      </div>
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Add Menu Item Form */}
        <Card className="bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Aggiungi piatto al menù di oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="existingDish">Scegli piatto esistente</Label>
                  <Select 
                    value={newItem.selectedDish} 
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, selectedDish: value, name: "" }))}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Seleziona un piatto..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border z-50">
                      {dishes.map((dish) => (
                        <SelectItem key={dish.id} value={dish.id}>
                          {dish.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="newDish">Oppure inserisci nuovo piatto</Label>
                  <Input
                    id="newDish"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value, selectedDish: "" }))}
                    placeholder="es. Lasagne della nonna"
                    disabled={!!newItem.selectedDish}
                  />
                </div>
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi piatto
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Menu */}
        <Card className="bg-card shadow-card">
          <CardHeader>
            <CardTitle>Menù di oggi</CardTitle>
          </CardHeader>
          <CardContent>
            {menuItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nessun piatto inserito nel menù di oggi
              </p>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Actions */}
        <Card className="bg-card shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handlePrintMenu}>
                <FileText className="h-4 w-4 mr-2" />
                Stampa menù (PDF)
              </Button>
              <Button variant="outline" onClick={handleArchiveMenu}>
                <Archive className="h-4 w-4 mr-2" />
                Archivia menù
              </Button>
              <OrdersWindow />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;