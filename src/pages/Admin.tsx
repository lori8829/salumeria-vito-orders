import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { OrdersWindow } from "@/components/OrdersWindow";
import { Plus, Trash2, FileText, Archive, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Mock data - sostituirà con dati Supabase
const mockMenuItems = [
  { id: "1", name: "Vincisgrassi", description: "", price_cents: 650 },
  { id: "2", name: "Lasagne bianche con verdure", description: "", price_cents: 600 },
  { id: "3", name: "Cannelloni", description: "", price_cents: 580 }
];

interface MenuItem {
  id: string;
  name: string;
  price_cents: number;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [newItem, setNewItem] = useState({ name: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name) {
      toast({
        title: "Errore",
        description: "Il nome del piatto è obbligatorio",
        variant: "destructive"
      });
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price_cents: 0 // Price will be set by customer or admin later
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: "" });
    
    toast({
      title: "Piatto aggiunto!",
      description: `${item.name} è stato aggiunto al menù`
    });
  };

  const handleDeleteItem = (id: string) => {
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

  const handleArchiveMenu = () => {
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
        <Header 
          title="Pannello Proprietario"
          subtitle="Gestione menù e ordini"
          logo="👨‍🍳"
        />
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
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="name">Nome piatto *</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ name: e.target.value })}
                    placeholder="es. Lasagne della nonna"
                    required
                  />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi piatto
                </Button>
              </div>
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