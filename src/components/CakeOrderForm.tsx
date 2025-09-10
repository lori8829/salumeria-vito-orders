import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText } from "lucide-react";

interface CakeOrderFormProps {
  onSubmit: (orderData: any) => void;
  onCancel: () => void;
}

interface DropdownOption {
  id: string;
  name: string;
}

export function CakeOrderForm({ onSubmit, onCancel }: CakeOrderFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    date: "",
    cakeDesign: false,
    tiers: 1,
    pickupTime: "",
    cakeType: "",
    peopleCount: "",
    base: "",
    filling: "",
    allergies: "",
    exterior: "",
    printOption: false,
    printType: "describe" as "describe" | "upload",
    printDescription: "",
    printImage: null as File | null,
    decoration: "",
    inscription: "",
    needsTransport: false,
    isRestaurant: false,
    deliveryAddress: "",
    restaurantContact: ""
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    cakeTypes: [] as DropdownOption[],
    bases: [] as DropdownOption[],
    fillings: [] as DropdownOption[],
    exteriors: [] as DropdownOption[],
    decorations: [] as DropdownOption[]
  });

  useEffect(() => {
    loadDropdownOptions();
  }, []);

  const loadDropdownOptions = async () => {
    try {
      const [cakeTypes, bases, fillings, exteriors, decorations] = await Promise.all([
        supabase.from('cake_types').select('id, name'),
        supabase.from('cake_bases').select('id, name'),
        supabase.from('cake_fillings').select('id, name'),
        supabase.from('cake_exteriors').select('id, name'),
        supabase.from('cake_decorations').select('id, name')
      ]);

      setDropdownOptions({
        cakeTypes: cakeTypes.data || [],
        bases: bases.data || [],
        fillings: fillings.data || [],
        exteriors: exteriors.data || [],
        decorations: decorations.data || []
      });
    } catch (error) {
      console.error('Error loading dropdown options:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, printImage: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-6">
      {/* Nome e Cognome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Tel e Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Cake Design, Piani, Orario ritiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="cakeDesign"
            checked={formData.cakeDesign}
            onCheckedChange={(checked) => handleInputChange('cakeDesign', checked)}
          />
          <Label htmlFor="cakeDesign">Cake Design</Label>
        </div>
        <div>
          <Label htmlFor="tiers">Piani</Label>
          <Select value={formData.tiers.toString()} onValueChange={(value) => handleInputChange('tiers', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Piano' : 'Piani'}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pickupTime">Orario ritiro</Label>
          <Input
            id="pickupTime"
            type="time"
            value={formData.pickupTime}
            onChange={(e) => handleInputChange('pickupTime', e.target.value)}
          />
        </div>
      </div>

      {/* Nome torta e Persone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cakeType">Nome torta</Label>
          <Select value={formData.cakeType} onValueChange={(value) => handleInputChange('cakeType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona tipo di torta" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.cakeTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="peopleCount">Persone</Label>
          <Input
            id="peopleCount"
            type="number"
            min="1"
            value={formData.peopleCount}
            onChange={(e) => handleInputChange('peopleCount', e.target.value)}
          />
        </div>
      </div>

      {/* Base e Farcia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="base">Base</Label>
          <Select value={formData.base} onValueChange={(value) => handleInputChange('base', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona base" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.bases.map((base) => (
                <SelectItem key={base.id} value={base.id}>{base.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filling">Farcia</Label>
          <Select value={formData.filling} onValueChange={(value) => handleInputChange('filling', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona farcia" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.fillings.map((filling) => (
                <SelectItem key={filling.id} value={filling.id}>{filling.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Allergie */}
      <div>
        <Label htmlFor="allergies">Allergie</Label>
        <Textarea
          id="allergies"
          value={formData.allergies}
          onChange={(e) => handleInputChange('allergies', e.target.value)}
          placeholder="Specifica eventuali allergie"
          rows={2}
        />
      </div>

      {/* Esterno */}
      <div>
        <Label htmlFor="exterior">Esterno</Label>
        <Select value={formData.exterior} onValueChange={(value) => handleInputChange('exterior', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona esterno" />
          </SelectTrigger>
          <SelectContent>
            {dropdownOptions.exteriors.map((exterior) => (
              <SelectItem key={exterior.id} value={exterior.id}>{exterior.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stampa e Decorazione */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="printOption"
              checked={formData.printOption}
              onCheckedChange={(checked) => handleInputChange('printOption', checked)}
            />
            <Label htmlFor="printOption">Stampa</Label>
          </div>
          
          {formData.printOption && (
            <div className="space-y-3">
              <RadioGroup
                value={formData.printType}
                onValueChange={(value: "describe" | "upload") => handleInputChange('printType', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="describe" id="describe" />
                  <Label htmlFor="describe">Descrivi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Carica</Label>
                </div>
              </RadioGroup>

              {formData.printType === 'describe' ? (
                <Textarea
                  value={formData.printDescription}
                  onChange={(e) => handleInputChange('printDescription', e.target.value)}
                  placeholder="Descrivi l'immagine da stampare"
                  rows={3}
                />
              ) : (
                <div className="flex items-center space-x-2">
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
                    <span>Carica immagine</span>
                  </Button>
                  {formData.printImage && (
                    <span className="text-sm text-muted-foreground">
                      {formData.printImage.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="decoration">Decorazione</Label>
          <Select value={formData.decoration} onValueChange={(value) => handleInputChange('decoration', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona decorazione" />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions.decorations.map((decoration) => (
                <SelectItem key={decoration.id} value={decoration.id}>{decoration.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scritta */}
      <div>
        <Label htmlFor="inscription">Scritta</Label>
        <Input
          id="inscription"
          value={formData.inscription}
          onChange={(e) => handleInputChange('inscription', e.target.value)}
          placeholder="Testo da scrivere sulla torta"
        />
      </div>

      {/* Trasporto */}
      <div>
        <Label className="text-sm font-medium">La torta deve viaggiare?</Label>
        <RadioGroup
          value={formData.needsTransport.toString()}
          onValueChange={(value) => handleInputChange('needsTransport', value === 'true')}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="transportYes" />
            <Label htmlFor="transportYes">Sì</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="transportNo" />
            <Label htmlFor="transportNo">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Ristorante */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRestaurant"
            checked={formData.isRestaurant}
            onCheckedChange={(checked) => handleInputChange('isRestaurant', checked)}
          />
          <Label htmlFor="isRestaurant">Sei un ristorante?</Label>
        </div>
        
        {formData.isRestaurant && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deliveryAddress">Consegna</Label>
              <Textarea
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                placeholder="Indirizzo di consegna"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="restaurantContact">Cognome</Label>
              <Input
                id="restaurantContact"
                value={formData.restaurantContact}
                onChange={(e) => handleInputChange('restaurantContact', e.target.value)}
                placeholder="Cognome referente"
              />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annulla
        </Button>
        <Button type="submit" className="flex-1">
          Conferma ordine
        </Button>
      </div>
    </form>
  );
}