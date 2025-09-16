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
    <Card className="glass-card pulse-glow hover:scale-[1.02] transition-all duration-500 morphing-border group">
      <CardContent className="p-4 relative overflow-hidden">
        {/* Background animation layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-glass))] to-[hsl(var(--secondary-glass))] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center justify-between relative z-10">
          {/* Name and time badge */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-foreground transition-colors duration-300">
                {item.name}
              </h3>
              {item.has_time_restriction && (
                <Badge 
                  variant="destructive" 
                  className="glass-card bg-[hsl(var(--secondary-glass))] text-secondary-foreground text-xs px-2 py-1 backdrop-blur-md animate-pulse"
                >
                  ORE 12:00
                </Badge>
              )}
            </div>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3 ml-4">
            <Button
              size="sm"
              variant={quantity > 0 ? "floating" : "glass"}
              onClick={onDecrement}
              disabled={quantity === 0}
              className="h-10 w-10 rounded-full transition-all duration-300 hover:rotate-12"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="text-xl font-bold min-w-[2.5rem] text-center px-3 py-1 rounded-full glass-card bg-[hsl(var(--glass-strong))] backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
              {quantity}
            </span>
            
            <Button
              size="sm"
              variant="ripple"
              onClick={onIncrement}
              className="h-10 w-10 rounded-full transition-all duration-300 hover:-rotate-12"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}