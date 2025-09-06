import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, User, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock orders data
const mockOrders = [
  {
    id: "ord_1",
    pickup_time: "12:30",
    customer: "Mario Rossi",
    total_cents: 1250,
    status: "in_attesa",
    items: [
      { name: "Vincisgrassi", quantity: 2, price_cents: 650 }
    ]
  },
  {
    id: "ord_2", 
    pickup_time: "13:00",
    customer: "Anna Bianchi",
    total_cents: 850,
    status: "in_attesa",
    items: [
      { name: "Lasagne bianche con verdure", quantity: 1, price_cents: 600 },
      { name: "Minestrone", quantity: 1, price_cents: 450 }
    ]
  }
];

export const OrdersWindow = () => {
  const [orders, setOrders] = useState(mockOrders);
  const { toast } = useToast();

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Ordini di oggi ({orders.filter(o => o.status === "in_attesa").length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Ordini di oggi
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nessun ordine per oggi
            </p>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
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
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Articoli ordinati:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>€{(item.price_cents / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};