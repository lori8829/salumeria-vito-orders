import { Card, CardContent } from "@/components/ui/card";
import { Clock, ChefHat } from "lucide-react";

export function EmptyMenu() {
  return (
    <Card className="bg-card shadow-card">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-muted rounded-full p-4">
            <ChefHat className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Il menù di oggi sarà disponibile tra poco
            </h3>
            <p className="text-muted-foreground max-w-md">
              I nostri chef stanno preparando il delizioso menù del giorno. 
              Torna presto per scoprire le specialità di oggi!
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Aggiornamento automatico</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}