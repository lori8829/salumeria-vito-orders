import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { CustomerProfile } from "@/types/customer";

interface CakeDesignFormProps {
  onSubmit: (orderData: any) => void;
  category: any;
  customerProfile?: CustomerProfile | null;
}

export function CakeDesignForm({ onSubmit, category, customerProfile }: CakeDesignFormProps) {
  const [formData, setFormData] = useState({
    customerName: customerProfile?.first_name || "",
    customerSurname: customerProfile?.last_name || "",
    customerPhone: customerProfile?.phone || "",
    description: "",
    pickupDate: "",
    inspirationImage: null as string | null
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
      setFormData(prev => ({ ...prev, inspirationImage: publicUrl }));

    } catch (error) {
      console.error('Error handling file:', error);
      alert('Errore durante il caricamento del file');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.customerSurname || !formData.customerPhone || !formData.description) {
      alert('Nome, cognome, telefono e descrizione sono obbligatori');
      return;
    }

    if (!formData.pickupDate) {
      alert('La data di ritiro è obbligatoria');
      return;
    }

    // Transform data for submission
    const orderData = {
      customerName: formData.customerName,
      customerSurname: formData.customerSurname,
      customerPhone: formData.customerPhone,
      pickupDate: formData.pickupDate,
      fieldValues: {
        cake_description: formData.description,
        inspiration_image: formData.inspirationImage || null
      }
    };

    onSubmit(orderData);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 7); // 7 days lead time for cake design
    
    return date < minDate;
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

      {/* Cake Design specific fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Descrivi in breve la torta che desideri *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descrivi il design, i colori, il tema o qualsiasi dettaglio importante..."
            rows={4}
            maxLength={350}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.description.length}/350 caratteri
          </p>
        </div>

        <div>
          <Label htmlFor="pickupDate">Data di ritiro *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {formData.pickupDate ? format(new Date(formData.pickupDate), "PPP") : <span>Seleziona data di ritiro</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.pickupDate ? new Date(formData.pickupDate + 'T00:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const localDateString = `${year}-${month}-${day}`;
                      handleInputChange('pickupDate', localDateString);
                    }
                  }}
                  disabled={isDateDisabled}
                  initialFocus
                  className="pointer-events-auto"
                />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground mt-1">
            Minimo 7 giorni di preavviso per cake design
          </p>
        </div>

        <div>
          <Label htmlFor="inspirationImage">Carica foto a cui ti ispiri (facoltativo)</Label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="imageUpload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('imageUpload')?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Scegli file</span>
            </Button>
            {formData.inspirationImage && (
              <span className="text-sm text-green-600">
                Immagine caricata con successo
              </span>
            )}
          </div>
        </div>
      </div>

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