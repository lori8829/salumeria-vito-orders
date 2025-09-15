import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface CakeDesignFormProps {
  onSubmit: (orderData: any) => void;
  onCancel: () => void;
}

export function CakeDesignForm({ onSubmit, onCancel }: CakeDesignFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    description: "",
    pickupDate: "",
    inspirationImage: null as File | null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, inspirationImage: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.surname || !formData.phone || !formData.description) {
      alert('Nome, cognome, telefono e descrizione sono obbligatori');
      return;
    }

    if (!formData.pickupDate) {
      alert('La data di ritiro è obbligatoria');
      return;
    }

    // Transform data for submission
    const orderData = {
      name: formData.name,
      surname: formData.surname,
      phone: formData.phone,
      pickupDate: formData.pickupDate,
      fieldValues: {
        cake_description: formData.description,
        inspiration_image: formData.inspirationImage?.name || null
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
          <Label htmlFor="name">Nome *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="surname">Cognome *</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => handleInputChange('surname', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefono *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
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
                selected={formData.pickupDate ? new Date(formData.pickupDate) : undefined}
                onSelect={(date) => handleInputChange('pickupDate', date?.toISOString().split('T')[0])}
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
              <span className="text-sm text-muted-foreground">
                {formData.inspirationImage.name}
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
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annulla
        </Button>
        <Button type="submit" className="flex-1">
          Invia ordine
        </Button>
      </div>
    </form>
  );
}