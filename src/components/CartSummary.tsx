import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, ChevronUp, ChevronDown } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price_cents: number;
}

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <Card className="bg-card shadow-elevated">
        {!isExpanded ? (
          // Collapsed state - just the button
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="font-medium">Il tuo ordine</span>
                <Badge variant="secondary">
                  {totalItems} {totalItems === 1 ? 'articolo' : 'articoli'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={onCheckout}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                >
                  Procedi con l'ordine
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        ) : (
          // Expanded state - full details
          <>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Il tuo ordine
                <Badge variant="secondary" className="ml-auto">
                  {totalItems} {totalItems === 1 ? 'articolo' : 'articoli'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items list */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <div className="flex justify-center pt-3 border-t border-border">
                <Button 
                  onClick={onCheckout}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Procedi con l'ordine
                </Button>
              </div>
              
              {/* Pickup info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                <MapPin className="h-4 w-4" />
                <span>Ritiro in negozio - Corso Cairoli 135, Macerata</span>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}