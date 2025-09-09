import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customerInfo: {
    name: string;
    surname: string;
    phone: string;
    pickupTime?: string;
  }) => void;
}

export const CustomerInfoDialog = ({ isOpen, onClose, onConfirm }: CustomerInfoDialogProps) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    surname: "",
    phone: "",
    pickupTime: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerInfo.name && customerInfo.surname && customerInfo.phone) {
      onConfirm(customerInfo);
      setCustomerInfo({ name: "", surname: "", phone: "", pickupTime: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Completa il tuo ordine</DialogTitle>
          <DialogDescription>
            Inserisci i tuoi dati per finalizzare l'ordine
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="surname">Cognome *</Label>
            <Input
              id="surname"
              value={customerInfo.surname}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, surname: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Numero di telefono *</Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="pickupTime">Orario di ritiro (facoltativo)</Label>
            <Input
              id="pickupTime"
              type="time"
              value={customerInfo.pickupTime}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, pickupTime: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annulla
            </Button>
            <Button type="submit" className="flex-1">
              Conferma ordine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};