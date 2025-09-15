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

const AVAILABLE_FIELDS = [
  { key: 'pickup_date', label: 'Data di ritiro', type: 'date', hasRules: true },
  { key: 'pickup_time', label: 'Orario di ritiro', type: 'time', hasRules: true },
  { key: 'piani', label: 'Piani', type: 'select', hasRules: false },
  { key: 'cake_type', label: 'Nome torta', type: 'select', hasRules: false, needsOptions: true },
  { key: 'people_count', label: 'Persone', type: 'number', hasRules: true },
  { key: 'base', label: 'Base', type: 'select', hasRules: false, needsOptions: true },
  { key: 'filling', label: 'Farcia', type: 'select', hasRules: false, needsOptions: true },
  { key: 'exterior', label: 'Esterno', type: 'select', hasRules: false, needsOptions: true },
  { key: 'decoration', label: 'Decorazione', type: 'select', hasRules: false, needsOptions: true },
  { key: 'allergies', label: 'Allergie', type: 'textarea', hasRules: false },
  { key: 'print_option', label: 'Stampa', type: 'radio', hasRules: false },
  { key: 'inscription', label: 'Scritta', type: 'text', hasRules: false },
  { key: 'needs_transport', label: 'La torta deve viaggiare?', type: 'radio', hasRules: false },
  { key: 'is_restaurant', label: 'Devo portarla a un ristorante? (max 25 km)', type: 'radio', hasRules: false }
];

const SELECT_OPTIONS = {
  piani: [
    { value: '1', label: '1 Piano' },
    { value: '2', label: '2 Piani' }
  ]
};

export function CategoryConfigManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('');
  const [fieldRules, setFieldRules] = useState<any>(null);
  const [isRequired, setIsRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<any[]>([]);
  const [showOptionsConfig, setShowOptionsConfig] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  
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
    if (!selectedCategory || !selectedFieldKey) {
      toast({
        title: "Errore",
        description: "Seleziona un campo da aggiungere",
        variant: "destructive"
      });
      return;
    }

    const fieldTemplate = AVAILABLE_FIELDS.find(f => f.key === selectedFieldKey);
    if (!fieldTemplate) return;

    // Check if field already exists
    if (fields.some(f => f.field_key === selectedFieldKey)) {
      toast({
        title: "Errore",
        description: "Questo campo è già presente nella categoria",
        variant: "destructive"
      });
      return;
    }

    try {
      const fieldData = {
        category_id: selectedCategory.id,
        field_key: selectedFieldKey,
        field_label: fieldTemplate.label,
        field_type: fieldTemplate.type,
        is_required: isRequired,
        position: fields.length,
        options: getFieldOptions(selectedFieldKey),
        rules: fieldRules
      };

      const { data, error } = await supabase
        .from('category_fields')
        .insert(fieldData)
        .select()
        .single();

      if (error) throw error;

      setFields(prev => [...prev, data]);
      resetForm();

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

  const getFieldOptions = (fieldKey: string) => {
    switch (fieldKey) {
      case 'print_option':
        return { items: [{ value: 'No', label: 'No' }, { value: 'Si', label: 'Sì' }] };
      case 'needs_transport':
        return { items: [{ value: 'No', label: 'No' }, { value: 'Si', label: 'Sì' }] };
      case 'is_restaurant':
        return { items: [{ value: 'No', label: 'No' }, { value: 'Si', label: 'Sì' }] };
      case 'piani':
        return { items: SELECT_OPTIONS.piani };
      default:
        // For dynamic fields, use configured options
        return fieldOptions.length > 0 ? { items: fieldOptions } : null;
    }
  };

  const addFieldOption = () => {
    if (!newOptionValue || !newOptionLabel) return;
    
    setFieldOptions(prev => [...prev, { value: newOptionValue, label: newOptionLabel }]);
    setNewOptionValue('');
    setNewOptionLabel('');
  };

  const removeFieldOption = (index: number) => {
    setFieldOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldSelection = (fieldKey: string) => {
    setSelectedFieldKey(fieldKey);
    setFieldRules(null);
    setFieldOptions([]);
    
    const fieldTemplate = AVAILABLE_FIELDS.find(f => f.key === fieldKey);
    if (fieldTemplate?.needsOptions) {
      setShowOptionsConfig(true);
    } else {
      setShowOptionsConfig(false);
    }
  };

  const resetForm = () => {
    setSelectedFieldKey('');
    setFieldRules(null);
    setIsRequired(false);
    setFieldOptions([]);
    setShowOptionsConfig(false);
    setNewOptionValue('');
    setNewOptionLabel('');
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

  const getFieldRulesUI = (fieldKey: string) => {
    const fieldTemplate = AVAILABLE_FIELDS.find(f => f.key === fieldKey);
    if (!fieldTemplate?.hasRules) return null;

    switch (fieldTemplate.type) {
      case 'date':
        return (
          <div className="space-y-4">
            <div>
              <Label>Preavviso minimo (giorni)</Label>
              <Input
                type="number"
                placeholder="0"
                value={fieldRules?.minLeadDays || ''}
                onChange={(e) => setFieldRules({ ...fieldRules, minLeadDays: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Giorni non disponibili (separati da virgola, es: 1,15,25 per primo, 15esimo e 25esimo del mese)</Label>
              <Input
                placeholder="1,15,25"
                value={fieldRules?.unavailableDays || ''}
                onChange={(e) => setFieldRules({ ...fieldRules, unavailableDays: e.target.value })}
              />
            </div>
          </div>
        );
      case 'time':
        return (
          <div className="space-y-2">
            <Label>Fasce orarie disponibili (una per riga, formato HH:MM)</Label>
            <Textarea
              placeholder="09:00&#10;10:00&#10;11:00&#10;15:00&#10;16:00"
              rows={5}
              value={fieldRules?.availableTimeSlots?.join('\n') || ''}
              onChange={(e) => setFieldRules({ 
                ...fieldRules, 
                availableTimeSlots: e.target.value.split('\n').filter(t => t.trim()) 
              })}
            />
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
                  value={fieldRules?.min || ''}
                  onChange={(e) => setFieldRules({ ...fieldRules, min: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Max</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={fieldRules?.max || ''}
                  onChange={(e) => setFieldRules({ ...fieldRules, max: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const completeForm = () => {
    toast({
      title: "Form completato",
      description: "La configurazione è stata salvata. I clienti possono ora utilizzare questa categoria."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurazione Campi Categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div>
          <Label className="text-base font-semibold">Seleziona Macrocategoria</Label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory?.id === category.id ? "default" : "outline"}
                className="h-auto p-4 text-center"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className="space-y-6">
            {/* Add Field Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aggiungi Campo alla Categoria: {selectedCategory.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Seleziona Campo da Aggiungere</Label>
                  <Select value={selectedFieldKey} onValueChange={handleFieldSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Scegli un campo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FIELDS
                        .filter(field => !fields.some(f => f.field_key === field.key))
                        .map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} ({field.type})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFieldKey && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={isRequired}
                        onCheckedChange={(checked) => setIsRequired(!!checked)}
                      />
                      <Label>Campo obbligatorio</Label>
                    </div>

                    {getFieldRulesUI(selectedFieldKey)}

                    {showOptionsConfig && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Configura Opzioni</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Valore</Label>
                              <Input
                                value={newOptionValue}
                                onChange={(e) => setNewOptionValue(e.target.value)}
                                placeholder="es. margherita"
                              />
                            </div>
                            <div>
                              <Label>Etichetta</Label>
                              <Input
                                value={newOptionLabel}
                                onChange={(e) => setNewOptionLabel(e.target.value)}
                                placeholder="es. Margherita"
                              />
                            </div>
                          </div>
                          <Button onClick={addFieldOption} size="sm" className="w-full">
                            Aggiungi Opzione
                          </Button>
                          
                          {fieldOptions.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Opzioni configurate:</Label>
                              {fieldOptions.map((option, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                  <span>{option.label}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFieldOption(index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    <Button onClick={handleAddField} className="w-full" disabled={showOptionsConfig && fieldOptions.length === 0}>
                      <Plus className="h-4 w-4 mr-2" />
                      Aggiungi Campo
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Configured Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campi Configurati per {selectedCategory.name}</CardTitle>
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
                              {field.field_type} 
                              {field.is_required && ' • Obbligatorio'}
                              {field.rules && Object.keys(field.rules).length > 0 && ' • Con regole'}
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

            {/* Complete Form Button */}
            {fields.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={completeForm} size="lg" className="px-8">
                  Completa Form
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
