import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function MenuCard({ item, quantity, onIncrement, onDecrement }: MenuCardProps) {
  const price = (item.price_cents / 100).toFixed(2);
  
  return (
    <Card className="bg-card shadow-card hover:shadow-elevated transition-all duration-200 border-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
            <Badge variant="secondary" className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1 ml-4">
              €{price}
            </Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant={quantity > 0 ? "default" : "outline"}
                onClick={onDecrement}
                disabled={quantity === 0}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="text-lg font-semibold min-w-[2rem] text-center">
                {quantity}
              </span>
              
              <Button
                size="sm"
                variant="default"
                onClick={onIncrement}
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {quantity > 0 && (
              <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
                €{((item.price_cents * quantity) / 100).toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}