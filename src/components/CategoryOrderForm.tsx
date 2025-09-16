import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { CustomerProfile } from "@/types/customer";

interface Category {
  id: string;
  name: string;
  slug: string;
  is_configurable: boolean;
  min_lead_days: number;
}

interface CategoryField {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  position: number;
  options?: any;
  rules?: any;
}

interface CategoryOrderFormProps {
  onSubmit: (data: any) => Promise<void>;
  category: any;
  customerProfile?: CustomerProfile | null;
}

export function CategoryOrderForm({ onSubmit, category, customerProfile }: CategoryOrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: customerProfile?.first_name || "",
    customerSurname: customerProfile?.last_name || "",
    customerPhone: customerProfile?.phone || "",
    fieldValues: {} as Record<string, any>
  });

  // Update form data when customerProfile changes
  useEffect(() => {
    if (customerProfile) {
      setFormData(prev => ({
        ...prev,
        customerName: customerProfile.first_name,
        customerSurname: customerProfile.last_name,
        customerPhone: customerProfile.phone
      }));
    }
  }, [customerProfile]);
  
  const [fields, setFields] = useState<CategoryField[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (category) {
      loadCategoryFields();
      loadDropdownOptions();
    }
  }, [category]);

  const loadCategoryFields = async () => {
    if (!category) return;

    try {
      const { data, error } = await supabase
        .from('category_fields')
        .select('*')
        .eq('category_id', category.id)
        .order('position');

      if (error) throw error;
      setFields(data || []);
    } catch (error) {
      console.error('Error loading category fields:', error);
    }
  };

  const loadDropdownOptions = async () => {
    // Non carichiamo più opzioni dal database
    // Tutte le opzioni vengono dalla configurazione dei campi
    setDropdownOptions({});
  };

  const handleInputChange = (field: string, value: any) => {
    if (['customerName', 'customerSurname', 'customerPhone'].includes(field)) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        fieldValues: { ...prev.fieldValues, [field]: value }
      }));
    }
  };

  const handleFileChange = async (field: string, file: File) => {
    if (!file) return;

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('order-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        alert('Errore durante il caricamento del file');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('order-images')
        .getPublicUrl(filePath);

      // Save the URL in form data
      setFormData(prev => ({ 
        ...prev, 
        fieldValues: { ...prev.fieldValues, [field]: publicUrl }
      }));

    } catch (error) {
      console.error('Error handling file:', error);
      alert('Errore durante il caricamento del file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.customerSurname || !formData.customerPhone) {
      alert('Nome, cognome e telefono sono obbligatori');
      return;
    }

    for (const field of fields) {
      if (field.is_required && !formData.fieldValues[field.field_key]) {
        alert(`Il campo ${field.field_label} è obbligatorio`);
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Errore durante l\'invio dell\'ordine');
    }
  };

  const isDateDisabled = (date: Date, field?: CategoryField) => {
    if (!category) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0); // Reset to start of day
    
    // Use field-specific minLeadDays first, then fallback to category min_lead_days
    const minLeadDays = field?.rules?.minLeadDays ?? category.min_lead_days;
    
    // If min_lead_days is set, disable dates before today + min_lead_days
    if (minLeadDays > 0) {
      const minAllowedDate = new Date(today);
      minAllowedDate.setDate(today.getDate() + minLeadDays);
      
      if (compareDate < minAllowedDate) return true;
    } else {
      // If no min_lead_days, at least disable past dates
      if (compareDate < today) return true;
    }
    
    // Check field-specific rules for unavailable dates
    if (field?.rules?.unavailableDates && field.rules.unavailableDates.length > 0) {
      const dateString = format(compareDate, 'yyyy-MM-dd');
      if (field.rules.unavailableDates.includes(dateString)) return true;
    }
    
    return false;
  };

  const renderField = (field: CategoryField) => {
    const value = formData.fieldValues[field.field_key] || '';

    switch (field.field_type) {
      case 'date':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && ' *'}
              {field.rules?.minLeadDays && (
                <span className="text-sm text-muted-foreground ml-2">
                  (minimo {field.rules.minLeadDays} giorni di preavviso)
                </span>
              )}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {value ? format(new Date(value + 'T00:00:00'), "PPP") : <span>Seleziona data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value + 'T00:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const localDateString = `${year}-${month}-${day}`;
                      handleInputChange(field.field_key, localDateString);
                    }
                  }}
                  disabled={(date) => isDateDisabled(date, field)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {field.rules?.unavailableDates && field.rules.unavailableDates.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Giorni non disponibili configurati dall'amministratore
              </p>
            )}
          </div>
        );

      case 'time':
        const rules = field.rules;
        
        if (rules && (rules.morningStart || rules.afternoonStart || rules.sundayStart)) {
          // Generate specific time slots based on configured rules
          const generateTimeSlots = () => {
            const slots: string[] = [];
            const selectedDate = formData.fieldValues.pickup_date;
            
            if (selectedDate) {
              const pickupDate = new Date(selectedDate);
              const dayOfWeek = pickupDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
              
              if (dayOfWeek === 0) {
                // Domenica - solo mattina
                if (rules.sundayStart && rules.sundayEnd) {
                  const morningSlots = generateSlotsInRange(rules.sundayStart, rules.sundayEnd);
                  slots.push(...morningSlots);
                }
              } else {
                // Lunedì-Sabato - mattina e pomeriggio
                if (rules.morningStart && rules.morningEnd) {
                  const morningSlots = generateSlotsInRange(rules.morningStart, rules.morningEnd);
                  slots.push(...morningSlots);
                }
                if (rules.afternoonStart && rules.afternoonEnd) {
                  const afternoonSlots = generateSlotsInRange(rules.afternoonStart, rules.afternoonEnd);
                  slots.push(...afternoonSlots);
                }
              }
            }
            
            return slots;
          };

          // Generate 30-minute time slots within a time range
          const generateSlotsInRange = (startTime: string, endTime: string) => {
            const slots: string[] = [];
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            
            let currentHour = startHour;
            let currentMinute = startMinute;
            
            while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
              const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
              slots.push(timeString);
              
              // Add 30 minutes
              currentMinute += 30;
              if (currentMinute >= 60) {
                currentMinute = 0;
                currentHour++;
              }
            }
            
            return slots;
          };

          const availableSlots = generateTimeSlots();
          
          return (
            <div key={field.id}>
              <Label htmlFor={field.field_key}>
                {field.field_label}
                {field.is_required && ' *'}
              </Label>
              {availableSlots.length > 0 ? (
                <Select value={value} onValueChange={(val) => handleInputChange(field.field_key, val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona fascia oraria" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Seleziona prima una data di ritiro per visualizzare gli orari disponibili
                </p>
              )}
            </div>
          );
        } else {
          // Default time input if no specific slots configured
          return (
            <div key={field.id}>
              <Label htmlFor={field.field_key}>
                {field.field_label}
                {field.is_required && ' *'}
              </Label>
              <Input
                id={field.field_key}
                type="time"
                value={value}
                onChange={(e) => handleInputChange(field.field_key, e.target.value)}
                required={field.is_required}
              />
            </div>
          );
        }

      case 'select':
        const options = field.options?.items || [];
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && ' *'}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.field_key, val)}>
              <SelectTrigger>
                <SelectValue placeholder={`Seleziona ${field.field_label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && ' *'}
            </Label>
            <Input
              id={field.field_key}
              type="number"
              min={field.rules?.min || 1}
              max={field.rules?.max}
              value={value}
              onChange={(e) => handleInputChange(field.field_key, e.target.value)}
              required={field.is_required}
            />
          </div>
        );

      case 'text':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && ' *'}
            </Label>
            <Input
              id={field.field_key}
              value={value}
              onChange={(e) => handleInputChange(field.field_key, e.target.value)}
              required={field.is_required}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && ' *'}
            </Label>
            <Textarea
              id={field.field_key}
              value={value}
              onChange={(e) => handleInputChange(field.field_key, e.target.value)}
              rows={field.rules?.rows || 3}
              maxLength={field.rules?.maxLength}
              required={field.is_required}
            />
          </div>
        );

      case 'radio':
        return (
          <div key={field.id}>
            <Label>
              {field.field_label}
              {field.is_required && ' *'}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleInputChange(field.field_key, val)}
              className="flex space-x-4"
            >
              {(field.options?.items || []).map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.field_key}-${option.value}`} />
                  <Label htmlFor={`${field.field_key}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-6">
      {/* Fixed fields: Nome, Cognome, Telefono */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b">
        <div>
          <Label htmlFor="customerName">Nome *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            required
            disabled={!!customerProfile}
          />
        </div>
        <div>
          <Label htmlFor="customerSurname">Cognome *</Label>
          <Input
            id="customerSurname"
            value={formData.customerSurname}
            onChange={(e) => handleInputChange('customerSurname', e.target.value)}
            required
            disabled={!!customerProfile}
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Telefono *</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            required
            disabled={!!customerProfile}
          />
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(renderField)}
      </div>

      {/* Conditional fields based on radio selections */}
      {formData.fieldValues.print_option === 'Si' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="print_description">Descrivi l'immagine da stampare</Label>
            <Textarea
              id="print_description"
              value={formData.fieldValues.print_description || ''}
              onChange={(e) => handleInputChange('print_description', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="print_image">Carica immagine</Label>
            <Input
              id="print_image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange('print_image', file);
                }
              }}
            />
            {formData.fieldValues.print_image && (
              <p className="text-sm text-green-600 mt-1">
                Immagine caricata con successo
              </p>
            )}
          </div>
        </div>
      )}

      {formData.fieldValues.is_restaurant === 'Si' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label htmlFor="restaurant_name">Nome ristorante</Label>
            <Input
              id="restaurant_name"
              value={formData.fieldValues.restaurant_name || ''}
              onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="restaurant_contact">Nome referente</Label>
            <Input
              id="restaurant_contact"
              value={formData.fieldValues.restaurant_contact || ''}
              onChange={(e) => handleInputChange('restaurant_contact', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Unified message */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          Premendo 'Invia ordine' verrai ricontattato quanto prima per definire i dettagli.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="w-full">
          Invia ordine
        </Button>
      </div>
    </form>
  );
}