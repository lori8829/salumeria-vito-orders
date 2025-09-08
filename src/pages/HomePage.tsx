import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Users, Settings } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Salumeria Vito"
        subtitle="Scegli la tua area"
      />
      
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Benvenuto da Salumeria Vito
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
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Area Cliente</h3>
                    <p className="text-muted-foreground">
                      Visualizza il menù del giorno e effettua il tuo ordine
                    </p>
                  </div>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                    Entra come Cliente
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Area Admin */}
            <Link to="/admin" className="group">
              <Card className="p-12 text-center hover:shadow-elevated transition-all duration-300 group-hover:scale-105 bg-card border-border">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Settings className="h-12 w-12 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">Area Admin</h3>
                    <p className="text-muted-foreground">
                      Gestisci il menù, i piatti e gli ordini della giornata
                    </p>
                  </div>
                  <Button size="lg" variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
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