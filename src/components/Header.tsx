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
      <header className="bg-gradient-to-br from-primary/20 to-secondary/20 border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" alt="Pasticceria del Borgo Logo" className="h-24 w-24 md:h-32 md:w-32" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Menù del giorno
            </h1>
            <Badge variant="secondary" className="bg-card shadow-lg px-4 py-2">
              <span className="text-sm font-medium">
                {new Date().toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </Badge>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-br from-primary/20 to-secondary/20 border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" alt="Pasticceria del Borgo Logo" className="h-16 w-16" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">{subtitle}</p>
          <Badge variant="secondary" className="bg-card shadow-lg px-4 py-2">
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('it-IT', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </Badge>
        </div>
      </div>
    </header>
  );
}