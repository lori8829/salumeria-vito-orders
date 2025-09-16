import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price_cents: number;
  has_time_restriction?: boolean;
}

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function MenuCard({ item, quantity, onIncrement, onDecrement }: MenuCardProps) {
  return (
    <Card className="hover:shadow-elevated transition-all duration-300 border-white/30 hover:scale-[1.02] group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          {/* Name and time badge */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              {item.has_time_restriction && (
                <Badge variant="destructive" className="glass-button text-xs px-3 py-1 font-medium">
                  ORE 12:00
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">
              €{(item.price_cents / 100).toFixed(2)}
            </div>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3 ml-4">
            <Button
              size="sm"
              variant={quantity > 0 ? "artisan" : "outline"}
              onClick={onDecrement}
              disabled={quantity === 0}
              className="h-10 w-10 rounded-full shadow-soft"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 min-w-[3rem] text-center">
              <span className="text-lg font-bold text-foreground">
                {quantity}
              </span>
            </div>
            
            <Button
              size="sm"
              variant="default"
              onClick={onIncrement}
              className="h-10 w-10 rounded-full shadow-soft"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}