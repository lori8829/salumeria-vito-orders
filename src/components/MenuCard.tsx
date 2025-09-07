import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price_cents: number;
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function MenuCard({ item, quantity, onIncrement, onDecrement }: MenuCardProps) {
  return (
    <Card className="bg-card shadow-card hover:shadow-elevated transition-all duration-200 border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Name only */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {item.name}
            </h3>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-2 ml-4">
            <Button
              size="sm"
              variant={quantity > 0 ? "default" : "outline"}
              onClick={onDecrement}
              disabled={quantity === 0}
              className="h-9 w-9 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-lg font-bold min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <Button
              size="sm"
              variant="default"
              onClick={onIncrement}
              className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}