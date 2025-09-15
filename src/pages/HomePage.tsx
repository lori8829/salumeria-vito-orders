import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Link } from "react-router-dom";
import { Users, Settings, Sparkles, Zap } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-void relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-neural" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse-neural" />
      
      {/* Hero Header */}
      <div className="relative z-10 glass-surface border-b border-primary/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                alt="Pasticceria del Borgo Logo" 
                className="h-28 w-28 md:h-36 md:w-36 rounded-2xl shadow-plasma hover:shadow-void transition-all duration-500 hover:scale-105" 
              />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-accent animate-glow-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center space-y-12">
          {/* Hero Text */}
          <div className="text-center mb-12 animate-slide-in-blur">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 font-display">
              Pasticceria del Borgo
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Il Futuro della Pasticceria
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un'esperienza visionaria dove tradizione e innovazione si incontrano
            </p>
          </div>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
            {/* Area Cliente */}
            <Link to="/cliente" className="group">
              <Card className="glass-card p-16 text-center hover-lift border border-primary/20 hover:border-primary/50 relative overflow-hidden">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-neural opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 glass-surface rounded-3xl flex items-center justify-center group-hover:shadow-plasma transition-all duration-500 border border-primary/30">
                      <Users className="h-16 w-16 text-primary group-hover:text-primary-glow transition-colors duration-300" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-plasma rounded-full animate-glow-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold gradient-text font-display">Area Cliente</h3>
                    <p className="text-muted-foreground text-lg">
                      Ordina le tue delizie preferite con un'interfaccia rivoluzionaria
                    </p>
                  </div>
                  
                  <Button variant="neural" size="xl" className="w-full group-hover:scale-105">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Inizia il Tuo Viaggio
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Area Admin */}
            <Link to="/admin" className="group">
              <Card className="glass-card p-16 text-center hover-lift border border-accent/20 hover:border-accent/50 relative overflow-hidden">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-plasma opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 glass-surface rounded-3xl flex items-center justify-center group-hover:shadow-void transition-all duration-500 border border-accent/30">
                      <Settings className="h-16 w-16 text-accent group-hover:text-accent animate-pulse-neural transition-colors duration-300" />
                    </div>
                    <div className="absolute -top-3 -right-3">
                      <Zap className="w-8 h-8 text-warning animate-glow-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold gradient-text font-display">Centro di Controllo</h3>
                    <p className="text-muted-foreground text-lg">
                      Gestisci la tua pasticceria con tecnologia all'avanguardia
                    </p>
                  </div>
                  
                  <Button variant="plasma" size="xl" className="w-full group-hover:scale-105">
                    <Zap className="mr-2 h-5 w-5" />
                    Accedi al Sistema
                  </Button>
                </div>
              </Card>
            </Link>
          </div>

          {/* Footer Enhancement */}
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground">
              Powered by Neural Networks & Quantum Computing ✨
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;