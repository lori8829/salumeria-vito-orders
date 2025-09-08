import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gradient-warm border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/lovable-uploads/de909bd5-2e0a-47eb-bb4c-d284d67726cb.png" alt="Salumeria Vito Logo" className="h-16 w-16" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">{subtitle}</p>
          <Badge variant="secondary" className="bg-card shadow-soft px-4 py-2">
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