import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Link } from "react-router-dom";
import { Users, Settings } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" alt="Pasticceria del Borgo Logo" className="h-24 w-24 md:h-32 md:w-32" />
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Benvenuto in Pasticceria del Borgo
            </h2>
            <p className="text-lg text-muted-foreground">
              Seleziona l'area di tuo interesse
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Area Cliente */}
            <Link to="/cliente" className="group">
              <Card className="p-12 text-center hover:shadow-elevated transition-all duration-300 group-hover:scale-105 bg-card border-border">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Users className="h-12 w-12 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Area Cliente</h3>
                  </div>
                  <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Entra come Cliente
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Area Admin */}
            <Link to="/admin" className="group">
              <Card className="p-12 text-center hover:shadow-elevated transition-all duration-300 group-hover:scale-105 bg-card border-border">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Settings className="h-12 w-12 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Area Admin</h3>
                  </div>
                  <Button size="lg" variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                    Entra come Admin
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;