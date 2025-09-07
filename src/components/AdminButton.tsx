import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Settings } from "lucide-react";

export const AdminButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="outline" className="fixed top-4 right-4 z-50">
          <Settings className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/admin">
      <Button variant="outline" className="fixed top-4 right-4 z-50">
        <Settings className="h-4 w-4 mr-2" />
        Admin Panel
      </Button>
    </Link>
  );
};