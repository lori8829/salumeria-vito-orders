import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  // Special styling for cliente page
  const isClientePage = title.includes("Pasticceria");
  
  if (isClientePage) {
    return (
      <header className="glass-strong relative overflow-hidden">
        {/* Animated background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-glass))] via-transparent to-[hsl(var(--secondary-glass))] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[hsl(var(--secondary-glass))] via-transparent to-[hsl(var(--primary-glass))] opacity-20 animate-pulse" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                alt="Pasticceria del Borgo Logo" 
                className="h-24 w-24 md:h-32 md:w-32 float-animation hover:scale-110 transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-strong relative overflow-hidden border-b border-[hsl(var(--border-hover))]">
      {/* Dynamic background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary-glass))] via-transparent to-[hsl(var(--secondary-glass))] opacity-40" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--primary-glass))] rounded-full blur-3xl opacity-20 animate-float" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[hsl(var(--secondary-glass))] rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
              alt="Pasticceria del Borgo Logo" 
              className="h-16 w-16 float-animation hover:scale-110 transition-transform duration-500" 
            />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground slide-in-stagger hover:scale-105 transition-transform duration-300 cursor-default">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4 slide-in-stagger opacity-glass hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
}