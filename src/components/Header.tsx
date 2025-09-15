import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  // Special styling for cliente page
  const isClientePage = title.includes("Pasticceria");
  
  if (isClientePage) {
    return (
      <header className="relative glass-surface border-b border-primary/20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-neural" />
        <div className="absolute top-0 right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-float" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                  alt="Pasticceria del Borgo Logo" 
                  className="h-28 w-28 md:h-36 md:w-36 rounded-2xl shadow-neural hover:shadow-plasma transition-all duration-500 hover:scale-105" 
                />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-accent animate-glow-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative glass-surface border-b border-primary/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-neural" />
      <div className="absolute top-0 left-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse-neural" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                alt="Pasticceria del Borgo Logo" 
                className="h-20 w-20 rounded-2xl shadow-neural" 
              />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-4 h-4 text-warning animate-glow-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text font-display">
              {title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}