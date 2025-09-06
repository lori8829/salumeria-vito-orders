import { useState } from "react";
import { Header } from "@/components/Header";
import { MenuCard } from "@/components/MenuCard";
import { CartSummary } from "@/components/CartSummary";
import { EmptyMenu } from "@/components/EmptyMenu";
import { AdminButton } from "@/components/AdminButton";

// Mock data rosticceria tradizionale - sostituirà con dati Supabase
const mockMenuItems = [
  { id: "1", name: "Vincisgrassi", price_cents: 650 },
  { id: "2", name: "Lasagne bianche con verdure", price_cents: 600 },
  { id: "3", name: "Cannelloni", price_cents: 580 },
  { id: "4", name: "Pasta fredda", price_cents: 520 },
  { id: "5", name: "Minestrone", price_cents: 450 },
  { id: "6", name: "Cous cous con verdure", price_cents: 550 },
  { id: "7", name: "Insalata di lenticchie", price_cents: 480 },
  { id: "8", name: "Insalata di riso", price_cents: 480 },
  { id: "9", name: "Parmigiana di melanzane", price_cents: 620 },
  { id: "10", name: "Patate arrosto", price_cents: 400 },
  { id: "11", name: "Verdure impanate", price_cents: 450 },
  { id: "12", name: "Coniglio in porchetta", price_cents: 750 },
  { id: "13", name: "Roastbeef di vitello condito", price_cents: 820 },
  { id: "14", name: "Verdure gratinate", price_cents: 380 },
  { id: "15", name: "Zuppa di fagioli borlotti", price_cents: 420 }
];

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price_cents: number;
}

const Index = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  
  const cartItems: CartItem[] = mockMenuItems
    .filter(item => cart[item.id] > 0)
    .map(item => ({
      id: item.id,
      name: item.name,
      quantity: cart[item.id],
      price_cents: item.price_cents
    }));

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
    // TODO: Navigate to checkout
    console.log("Proceeding to checkout with:", cartItems);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminButton />
      
      <Header 
        title="Salumeria Vito"
        subtitle="Menù del giorno"
        logo="🧀"
      />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        {mockMenuItems.length === 0 ? (
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
              {mockMenuItems.map((item) => (
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
    </div>
  );
};

export default Index;
