import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationDialog = ({ isOpen, onClose }: OrderConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-red-50 border-red-200">
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <CheckCircle className="h-16 w-16 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-red-700">
              Grazie per l'ordine effettuato
            </h2>
            <p className="text-red-600">
              Non vediamo l'ora di vederti in negozio!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};