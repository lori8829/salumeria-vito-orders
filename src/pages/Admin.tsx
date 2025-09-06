import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Plus, Edit, Trash2, FileText, Archive, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - sostituirà con dati Supabase
const mockMenuItems = [
  { id: "1", name: "Vincisgrassi", description: "", price_cents: 650 },
  { id: "2", name: "Lasagne bianche con verdure", description: "", price_cents: 600 },
  { id: "3", name: "Cannelloni", description: "", price_cents: 580 }
];

const mockOrders = [
  {
    id: "ord_1",
    pickup_time: "12:30",
    customer: "Mario Rossi",
    total_cents: 1250,
    status: "in_attesa"
  },
  {
    id: "ord_2", 
    pickup_time: "13:00",
    customer: "Anna Bianchi",
    total_cents: 850,
    status: "in_attesa"
  }
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price_cents: number;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState(mockOrders);
  const [newItem, setNewItem] = useState({ name: "", description: "", price_eur: "" });
  const { toast } = useToast();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.price_eur) {
      toast({
        title: "Errore",
        description: "Nome e prezzo sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    const price_cents = Math.round(parseFloat(newItem.price_eur) * 100);
    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price_cents
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: "", description: "", price_eur: "" });
    
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

  const markOrderCompleted = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "completato" }
        : order
    ));
    toast({
      title: "Ordine completato",
      description: "L'ordine è stato segnato come completato"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Pannello Proprietario"
        subtitle="Gestione menù e ordini"
        logo="👨‍🍳"
      />
      
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Nome piatto *</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Lasagne della nonna"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione (opzionale)</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ingredienti speciali..."
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prezzo (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price_eur}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price_eur: e.target.value }))}
                    placeholder="6.50"
                    required
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
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        €{(item.price_cents / 100).toFixed(2)}
                      </Badge>
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
            </div>
          </CardContent>
        </Card>

        {/* Today's Orders */}
        <Card className="bg-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Ordini di oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nessun ordine per oggi
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{order.pickup_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{order.customer}</span>
                      </div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        €{(order.total_cents / 100).toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={order.status === "completato" ? "default" : "outline"}>
                        {order.status === "completato" ? "Completato" : "In attesa"}
                      </Badge>
                      {order.status !== "completato" && (
                        <Button
                          size="sm"
                          onClick={() => markOrderCompleted(order.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Completa
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;