import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";

import { CategoryConfigManager } from "@/components/CategoryConfigManager";
import { LogOut, ArrowLeft, Calendar, Package, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersWindow } from "@/components/OrdersWindow";


const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Pasticceria del Borgo"
        subtitle="Gestione ordini pasticceria"
      />
      
      <div className="flex justify-between items-center px-4 py-2 border-b border-border">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Button>
        </Link>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Esci
        </Button>
      </div>
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Gestione Ordini</span>
              <span className="sm:hidden">Ordini</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Impostazioni</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersWindow />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <CategoryConfigManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;