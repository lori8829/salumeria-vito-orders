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
      <header className="relative bg-gradient-glass backdrop-blur-md border-b border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img 
                  src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                  alt="Pasticceria del Borgo Logo" 
                  className="h-28 w-28 md:h-36 md:w-36 float-gentle drop-shadow-lg" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative bg-gradient-glass backdrop-blur-md border-b border-white/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="relative">
              <img 
                src="/lovable-uploads/0e6ea90f-ae9e-46b2-8fa2-805659673e5b.png" 
                alt="Pasticceria del Borgo Logo" 
                className="h-20 w-20 float-gentle drop-shadow-lg" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl -z-10"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6 font-medium">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}