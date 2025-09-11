import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DropdownItem {
  id: string;
  name: string;
}

export function DropdownManager() {
  const [data, setData] = useState({
    cakeTypes: [] as DropdownItem[],
    bases: [] as DropdownItem[],
    fillings: [] as DropdownItem[],
    exteriors: [] as DropdownItem[],
    decorations: [] as DropdownItem[]
  });

  const [newItems, setNewItems] = useState({
    cakeTypes: "",
    bases: "",
    fillings: "",
    exteriors: "",
    decorations: ""
  });

  const { toast } = useToast();

  const tableNames = {
    cakeTypes: 'cake_types',
    bases: 'cake_bases',
    fillings: 'cake_fillings',
    exteriors: 'cake_exteriors',
    decorations: 'cake_decorations'
  };

  const displayNames = {
    cakeTypes: 'Tipi di Torta',
    bases: 'Basi',
    fillings: 'Farce',
    exteriors: 'Esterni',
    decorations: 'Decorazioni'
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [cakeTypes, bases, fillings, exteriors, decorations] = await Promise.all([
        supabase.from('cake_types').select('id, name').order('name'),
        supabase.from('cake_bases').select('id, name').order('name'),
        supabase.from('cake_fillings').select('id, name').order('name'),
        supabase.from('cake_exteriors').select('id, name').order('name'),
        supabase.from('cake_decorations').select('id, name').order('name')
      ]);

      setData({
        cakeTypes: cakeTypes.data || [],
        bases: bases.data || [],
        fillings: fillings.data || [],
        exteriors: exteriors.data || [],
        decorations: decorations.data || []
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dei dati",
        variant: "destructive"
      });
    }
  };

  const handleAdd = async (category: keyof typeof tableNames) => {
    const itemName = newItems[category].trim();
    if (!itemName) return;

    try {
      const tableName = tableNames[category] as "cake_types" | "cake_bases" | "cake_fillings" | "cake_exteriors" | "cake_decorations";
      
      const { data: newItem, error } = await supabase
        .from(tableName)
        .insert({ name: itemName })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Elemento già esistente",
            description: "Questo elemento è già presente nella lista",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      setData(prev => ({
        ...prev,
        [category]: [...prev[category], newItem]
      }));

      setNewItems(prev => ({
        ...prev,
        [category]: ""
      }));

      toast({
        title: "Elemento aggiunto",
        description: `${itemName} è stato aggiunto a ${displayNames[category]}`
      });

    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiunta dell'elemento",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (category: keyof typeof tableNames, id: string) => {
    try {
      const tableName = tableNames[category] as "cake_types" | "cake_bases" | "cake_fillings" | "cake_exteriors" | "cake_decorations";
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== id)
      }));

      toast({
        title: "Elemento eliminato",
        description: "L'elemento è stato eliminato dalla lista"
      });

    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'elemento",
        variant: "destructive"
      });
    }
  };

  const CategoryTab = ({ category }: { category: keyof typeof tableNames }) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={newItems[category]}
          onChange={(e) => setNewItems(prev => ({ ...prev, [category]: e.target.value }))}
          placeholder={`Nuovo elemento per ${displayNames[category]}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd(category);
            }
          }}
          autoComplete="off"
        />
        <Button 
          onClick={() => handleAdd(category)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </div>

      <div className="grid gap-2">
        {data[category].map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium">{item.name}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(category, item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {data[category].length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Nessun elemento presente
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Opzioni Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cakeTypes" className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <TabsTrigger 
              value="cakeTypes"
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 data-[state=active]:bg-red-100"
            >
              Torte
            </TabsTrigger>
            <TabsTrigger 
              value="bases"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 data-[state=active]:bg-blue-100"
            >
              Basi
            </TabsTrigger>
            <TabsTrigger 
              value="fillings"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 data-[state=active]:bg-green-100"
            >
              Farce
            </TabsTrigger>
            <TabsTrigger 
              value="exteriors"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 data-[state=active]:bg-purple-100"
            >
              Esterni
            </TabsTrigger>
            <TabsTrigger 
              value="decorations"
              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 data-[state=active]:bg-orange-100"
            >
              Decorazioni
            </TabsTrigger>
          </div>
          <TabsList className="sr-only">
            <TabsTrigger value="cakeTypes">Torte</TabsTrigger>
            <TabsTrigger value="bases">Basi</TabsTrigger>
            <TabsTrigger value="fillings">Farce</TabsTrigger>
            <TabsTrigger value="exteriors">Esterni</TabsTrigger>
            <TabsTrigger value="decorations">Decorazioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cakeTypes" className="mt-6">
            <CategoryTab category="cakeTypes" />
          </TabsContent>
          <TabsContent value="bases" className="mt-6">
            <CategoryTab category="bases" />
          </TabsContent>
          <TabsContent value="fillings" className="mt-6">
            <CategoryTab category="fillings" />
          </TabsContent>
          <TabsContent value="exteriors" className="mt-6">
            <CategoryTab category="exteriors" />
          </TabsContent>
          <TabsContent value="decorations" className="mt-6">
            <CategoryTab category="decorations" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}