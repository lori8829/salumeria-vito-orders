import { useState } from "react";
import { Header } from "@/components/Header";
import { MenuCard } from "@/components/MenuCard";
import { CartSummary } from "@/components/CartSummary";
import { EmptyMenu } from "@/components/EmptyMenu";

// Mock data per demo - sostituirà con dati Supabase
const mockMenuItems = [
  {
    id: "1",
    name: "Panino con Prosciutto di Parma",
    description: "Prosciutto di Parma DOP 18 mesi, mozzarella di bufala, rucola e pomodorini",
    price_cents: 850
  },
  {
    id: "2", 
    name: "Tagliere Misto",
    description: "Selezione di salumi e formaggi locali, miele millefiori e mostarda di Cremona",
    price_cents: 1200
  },
  {
    id: "3",
    name: "Focaccia Gourmet",
    description: "Focaccia artigianale con mortadella Bologna IGP, stracciatella e pistacchi",
    price_cents: 700
  }
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
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
