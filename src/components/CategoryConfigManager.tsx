import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_configurable: boolean;
  min_lead_days: number;
}

interface CategoryField {
  id?: string;
  category_id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  position: number;
  options?: any;
  rules?: any;
}

const FIELD_TYPES = [
  { value: 'date', label: 'Data di ritiro' },
  { value: 'time', label: 'Orario di ritiro' },
  { value: 'select', label: 'Selezione (Piani/Nome torta/Base/Farcia/Esterno)' },
  { value: 'number', label: 'Numero (Persone)' },
  { value: 'text', label: 'Testo (Decorazione/Scritta)' },
  { value: 'textarea', label: 'Testo lungo (Allergie)' },
  { value: 'radio', label: 'Radio (Stampa/Trasporto/Ristorante)' }
];

const SELECT_OPTIONS = {
  piani: [
    { value: '1', label: '1 Piano' },
    { value: '2', label: '2 Piani' },
    { value: '3', label: '3 Piani' },
    { value: '4', label: '4 Piani' },
    { value: '5', label: '5 Piani' }
  ],
  cake_type: 'Da database cake_types',
  base: 'Da database cake_bases',
  filling: 'Da database cake_fillings',
  exterior: 'Da database cake_exteriors'
};

export function CategoryConfigManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [newField, setNewField] = useState<Partial<CategoryField>>({
    field_key: '',
    field_label: '',
    field_type: 'text',
    is_required: false,
    options: null,
    rules: null
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryFields();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_configurable', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
      if (data && data.length > 0) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento delle categorie",
        variant: "destructive"
      });
    }
  };

  const loadCategoryFields = async () => {
    if (!selectedCategory) return;

    try {
      const { data, error } = await supabase
        .from('category_fields')
        .select('*')
        .eq('category_id', selectedCategory.id)
        .order('position');

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Error loading fields:', error);
    }
  };

  const handleAddField = async () => {
    if (!selectedCategory || !newField.field_key || !newField.field_label) {
      toast({
        title: "Errore",
        description: "Chiave campo e etichetta sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    try {
      const fieldData = {
        category_id: selectedCategory.id,
        field_key: newField.field_key,
        field_label: newField.field_label,
        field_type: newField.field_type || 'text',
        is_required: newField.is_required || false,
        position: fields.length,
        options: newField.options,
        rules: newField.rules
      };

      const { data, error } = await supabase
        .from('category_fields')
        .insert(fieldData)
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [...prev, data]);
      setNewField({
        field_key: '',
        field_label: '',
        field_type: 'text',
        is_required: false,
        options: null,
        rules: null
      });

      toast({
        title: "Campo aggiunto",
        description: "Il campo è stato aggiunto con successo"
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiunta del campo",
        variant: "destructive"
      });
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('category_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      setFields(prev => prev.filter(f => f.id !== fieldId));
      
      toast({
        title: "Campo eliminato",
        description: "Il campo è stato eliminato con successo"
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione del campo",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFieldPosition = async (fieldId: string, newPosition: number) => {
    try {
      const { error } = await supabase
        .from('category_fields')
        .update({ position: newPosition })
        .eq('id', fieldId);

      if (error) throw error;
      
      loadCategoryFields(); // Reload to get updated positions
    } catch (error) {
      console.error('Error updating field position:', error);
    }
  };

  const getFieldTypeOptions = (type: string) => {
    switch (type) {
      case 'radio':
        return (
          <div className="space-y-2">
            <Label>Opzioni Radio</Label>
            <Textarea
              placeholder='Formato JSON: [{\\\"value\\\": \\\"Si\\\", \\\"label\\\": \\\"Sì\\\"}, {\\\"value\\\": \\\"No\\\", \\\"label\\\": \\\"No\\\"}]'
              value={newField.options ? JSON.stringify(newField.options.items || []) : ''}
              onChange={(e) => {
                try {
                  const items = JSON.parse(e.target.value);
                  setNewField(prev => ({ ...prev, options: { items } }));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
            />
          </div>
        );
      case 'select':
        return (
          <div className="space-y-2">
            <Label>Tipo Select</Label>
            <Select onValueChange={(value) => setNewField(prev => ({ ...prev, field_key: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piani">Piani</SelectItem>
                <SelectItem value="cake_type">Nome torta</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="filling">Farcia</SelectItem>
                <SelectItem value="exterior">Esterno</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'number':
        return (
          <div className="space-y-2">
            <Label>Regole numero</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min</Label>
                <Input
                  type="number"
                  placeholder="1"
                  onChange={(e) => setNewField(prev => ({
                    ...prev,
                    rules: { ...prev.rules, min: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label>Max</Label>
                <Input
                  type="number"
                  placeholder="100"
                  onChange={(e) => setNewField(prev => ({
                    ...prev,
                    rules: { ...prev.rules, max: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label>Righe</Label>
            <Input
              type="number"
              placeholder="3"
              onChange={(e) => setNewField(prev => ({
                ...prev,
                rules: { ...prev.rules, rows: parseInt(e.target.value) }
              }))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurazione Campi Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory?.id} onValueChange={(value) => {
          const category = categories.find(c => c.id === value);
          setSelectedCategory(category || null);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              {/* Add new field form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aggiungi Nuovo Campo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Chiave Campo</Label>
                      <Input
                        value={newField.field_key || ''}
                        onChange={(e) => setNewField(prev => ({ ...prev, field_key: e.target.value }))}
                        placeholder="es: pickup_date, pickup_time, allergies"
                      />
                    </div>
                    <div>
                      <Label>Etichetta</Label>
                      <Input
                        value={newField.field_label || ''}
                        onChange={(e) => setNewField(prev => ({ ...prev, field_label: e.target.value }))}
                        placeholder="es: Data di ritiro, Allergie"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo Campo</Label>
                      <Select 
                        value={newField.field_type || 'text'} 
                        onValueChange={(value) => setNewField(prev => ({ ...prev, field_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        checked={newField.is_required || false}
                        onCheckedChange={(checked) => setNewField(prev => ({ ...prev, is_required: !!checked }))}
                      />
                      <Label>Campo obbligatorio</Label>
                    </div>
                  </div>

                  {getFieldTypeOptions(newField.field_type || 'text')}

                  <Button onClick={handleAddField} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Campo
                  </Button>
                </CardContent>
              </Card>

              {/* Existing fields */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campi Configurati</CardTitle>
                </CardHeader>
                <CardContent>
                  {fields.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nessun campo configurato per questa categoria
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                          <div className="flex items-center space-x-4">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <div>
                              <div className="font-medium">{field.field_label}</div>
                              <div className="text-sm text-muted-foreground">
                                {field.field_key} • {field.field_type} 
                                {field.is_required && ' • Obbligatorio'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={index === 0}
                              onClick={() => field.id && handleUpdateFieldPosition(field.id, field.position - 1)}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={index === fields.length - 1}
                              onClick={() => field.id && handleUpdateFieldPosition(field.id, field.position + 1)}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => field.id && handleDeleteField(field.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
