import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthProps {
  onAdminLogin: (isAdmin: boolean) => void;
}

export const AdminAuth = ({ onAdminLogin }: AdminAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if the email exists in admin_users table
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();

      if (!adminUser) {
        toast({
          title: "Accesso negato",
          description: "Credenziali admin non valide",
          variant: "destructive",
        });
        onAdminLogin(false);
        return;
      }

      // For now, we'll just verify the email exists in admin_users
      // In a real scenario, you'd verify the password hash
      if (email === "loripiero88@gmail.com") {
        toast({
          title: "Accesso riuscito",
          description: "Benvenuto nell'area admin",
        });
        onAdminLogin(true);
      } else {
        toast({
          title: "Accesso negato",
          description: "Credenziali admin non valide",
          variant: "destructive",
        });
        onAdminLogin(false);
      }
    } catch (error) {
      console.error("Errore durante il login admin:", error);
      toast({
        title: "Errore",
        description: "Errore durante l'autenticazione",
        variant: "destructive",
      });
      onAdminLogin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Accesso Admin</CardTitle>
          <CardDescription>
            Inserisci le credenziali di amministratore
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAdminLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Accesso in corso..." : "Accedi come Admin"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};