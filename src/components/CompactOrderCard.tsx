import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Trash2, Archive, Download, Eye, Printer, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { printOrder } from "./PrintableOrder";

interface OrderFieldValue {
  key: string;
  value: string;
  file_url?: string;
  field_key: string;
  field_value: string | null;
}

interface Order {
  id: string;
  created_at: string;
  date: string;
  status: string;
  total_items: number;
  customer_name: string;
  customer_surname: string;
  customer_phone: string;
  pickup_time: string;
  pickup_date: string;
  cake_type_id: string;
  people_count: number;
  base_id: string;
  filling_id: string;
  second_filling_id?: string;
  allergies: string;
  exterior_id: string;
  decoration_id: string;
  decoration_text: string;
  inscription: string;
  needs_transport: boolean;
  is_restaurant: boolean;
  delivery_address: string;
  restaurant_contact: string;
  cake_design: boolean;
  tiers: number;
  print_option: boolean;
  print_type: string;
  print_description: string;
  print_image_url?: string;
  category_id: string;
  field_values?: OrderFieldValue[];
  category?: {
    name: string;
  };
  order_items: Array<{
    dish_name: string;
    quantity: number;
  }>;
  order_field_values: OrderFieldValue[];
}

interface CompactOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

const statusColors = {
  "Ricevuto": "bg-yellow-50 border-yellow-200",
  "Confermato": "bg-blue-50 border-blue-200",
  "In preparazione": "bg-orange-50 border-orange-200", 
  "Pronto": "bg-green-50 border-green-200",
  "Consegnato": "bg-gray-50 border-gray-200",
  "archived": "bg-gray-100 border-gray-300"
};

const statusLabels = {
  "Ricevuto": "Ricevuto",
  "Confermato": "Confermato",
  "In preparazione": "In preparazione", 
  "Pronto": "Pronto",
  "Consegnato": "Consegnato",
  "archived": "Archiviato"
};

export function CompactOrderCard({ order, onStatusChange, onArchive, onDelete }: CompactOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const printImage = (imageUrl: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stampa Immagine</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @media print { 
                body { margin: 0; }
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Immagine da stampare" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const isImageFile = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const downloadFile = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-50 border-gray-200";
  };

  const getFieldLabel = (fieldKey: string) => {
    const labels: Record<string, string> = {
      pickup_date: 'Data ritiro',
      pickup_time: 'Orario ritiro',
      piani: 'Piani',
      cake_type: 'Nome torta',
      people_count: 'Persone',
      base: 'Base',
      filling: 'Farcia',
      exterior: 'Esterno',
      decoration: 'Decorazione',
      allergies: 'Allergie',
      print_option: 'Stampa',
      inscription: 'Scritta',
      needs_transport: 'Trasporto necessario',
      is_restaurant: 'Consegna ristorante',
      print_description: 'Descrizione stampa',
      delivery_address: 'Indirizzo consegna',
      restaurant_contact: 'Nome referente',
      restaurant_name: 'Nome ristorante'
    };
    return labels[fieldKey] || fieldKey.replace('_', ' ');
  };

  const getPeopleCount = () => {
    if (order.people_count) return order.people_count;
    
    const peopleField = order.field_values?.find(f => f.field_key === 'people_count');
    return peopleField?.field_value ? parseInt(peopleField.field_value) : null;
  };

  return (
    <Card className={cn("transition-all duration-200", getStatusColor(order.status))}>
      {/* Compact view */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(order.pickup_date || order.date)} - {order.pickup_time || 'N/A'}
            </div>
            <div className="font-medium truncate">
              {order.customer_name} {order.customer_surname}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {order.category?.name || 'Torta personalizzata'}
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {getPeopleCount() ? `${getPeopleCount()} pers.` : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {order.customer_phone || 'N/A'}
            </div>
            <div className="ml-auto">
              <Select
                value={order.status}
                onValueChange={(value) => onStatusChange(order.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ricevuto">Ricevuto</SelectItem>
                  <SelectItem value="Confermato">Confermato</SelectItem>
                  <SelectItem value="In preparazione">In preparazione</SelectItem>
                  <SelectItem value="Pronto">Pronto</SelectItem>
                  <SelectItem value="Consegnato">Consegnato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="outline">#{order.id.slice(0, 8)}</Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printOrder(order)}
                  className="text-green-600 hover:text-green-700"
                  title="Stampa riepilogo ordine"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(order.id)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(order.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Show different details based on order status */}
            {order.status === 'Consegnato' ? (
              // Essential info only for completed orders
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Cliente</p>
                  <p>{order.customer_name} {order.customer_surname}</p>
                </div>
                
                <div>
                  <p className="font-medium text-muted-foreground">Macrocategoria</p>
                  <p>{order.category?.name || 'Torta personalizzata'}</p>
                </div>
                
                {order.pickup_date && (
                  <div>
                    <p className="font-medium text-muted-foreground">Data consegna</p>
                    <p>{formatDate(order.pickup_date)}</p>
                  </div>
                )}

                {getPeopleCount() && (
                  <div>
                    <p className="font-medium text-muted-foreground">Numero persone</p>
                    <p>{getPeopleCount()}</p>
                  </div>
                )}
              </div>
            ) : (
              // Full details for non-completed orders - TUTTE le informazioni
              <div className="space-y-4">
                {/* Informazioni base */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Cliente</p>
                    <p>{order.customer_name} {order.customer_surname}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Telefono</p>
                    <p>{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Macrocategoria</p>
                    <p>{order.category?.name || 'Torta personalizzata'}</p>
                  </div>
                </div>

                {/* Campi dinamici dal form */}
                {order.field_values && order.field_values.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground border-b pb-2">Dettagli ordine</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                       {order.field_values.map((fieldValue, index) => (
                         <div key={index}>
                           <p className="font-medium text-muted-foreground capitalize">
                             {getFieldLabel(fieldValue.field_key)}
                           </p>
                           {fieldValue.file_url ? (
                             <div className="space-y-2">
                               {isImageFile(fieldValue.file_url) ? (
                                 <div className="space-y-2">
                                   <img 
                                     src={fieldValue.file_url} 
                                     alt="Immagine caricata dal cliente"
                                     className="max-w-full h-auto max-h-64 rounded border"
                                     loading="lazy"
                                   />
                                   <div className="flex gap-2 flex-wrap">
                                     <Dialog>
                                       <DialogTrigger asChild>
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           className="flex items-center gap-1"
                                         >
                                           <Eye className="h-3 w-3" />
                                           Schermo intero
                                         </Button>
                                       </DialogTrigger>
                                       <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
                                         <div className="relative flex flex-col h-full">
                                           <div className="flex justify-between items-center p-4 border-b">
                                             <h3 className="font-medium">
                                               {getFieldLabel(fieldValue.field_key)} - Ordine #{order.id.slice(0, 8)}
                                             </h3>
                                             <div className="flex gap-2">
                                               <Button
                                                 variant="outline"
                                                 size="sm"
                                                 onClick={() => printImage(fieldValue.file_url!)}
                                                 className="flex items-center gap-1"
                                               >
                                                 <Printer className="h-3 w-3" />
                                                 Stampa
                                               </Button>
                                               <Button
                                                 variant="outline"
                                                 size="sm"
                                                 onClick={() => downloadFile(fieldValue.file_url!, `${fieldValue.field_key}-${order.id.slice(0, 8)}`)}
                                                 className="flex items-center gap-1"
                                               >
                                                 <Download className="h-3 w-3" />
                                                 Scarica
                                               </Button>
                                             </div>
                                           </div>
                                           <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                                             <img 
                                               src={fieldValue.file_url} 
                                               alt="Immagine a schermo intero"
                                               className="max-w-full max-h-full object-contain"
                                             />
                                           </div>
                                         </div>
                                       </DialogContent>
                                     </Dialog>
                                     <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => printImage(fieldValue.file_url!)}
                                       className="flex items-center gap-1"
                                     >
                                       <Printer className="h-3 w-3" />
                                       Stampa
                                     </Button>
                                     <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => downloadFile(fieldValue.file_url!, `${fieldValue.field_key}-${order.id.slice(0, 8)}`)}
                                       className="flex items-center gap-1"
                                     >
                                       <Download className="h-3 w-3" />
                                       Scarica
                                     </Button>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="flex gap-2">
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => window.open(fieldValue.file_url, '_blank')}
                                     className="flex items-center gap-1"
                                   >
                                     <Eye className="h-3 w-3" />
                                     Visualizza file
                                   </Button>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => downloadFile(fieldValue.file_url!, `${fieldValue.field_key}-${order.id.slice(0, 8)}`)}
                                     className="flex items-center gap-1"
                                   >
                                     <Download className="h-3 w-3" />
                                     Scarica
                                   </Button>
                                 </div>
                               )}
                             </div>
                           ) : (
                             <p className="break-words">{fieldValue.field_value || 'N/A'}</p>
                           )}
                         </div>
                       ))}
                       
                       {/* Aggiungi gestione dell'immagine di stampa */}
                       {order.print_option && order.print_image_url && (
                         <div className="md:col-span-2">
                           <p className="font-medium text-muted-foreground">Print Image</p>
                           <div className="space-y-2">
                             <img 
                               src={order.print_image_url} 
                               alt="Immagine di stampa"
                               className="max-w-full h-auto max-h-64 rounded border"
                               loading="lazy"
                             />
                             <div className="flex gap-2 flex-wrap">
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     className="flex items-center gap-1"
                                   >
                                     <Eye className="h-3 w-3" />
                                     Schermo intero
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
                                   <div className="relative flex flex-col h-full">
                                     <div className="flex justify-between items-center p-4 border-b">
                                       <h3 className="font-medium">
                                         Print Image - Ordine #{order.id.slice(0, 8)}
                                       </h3>
                                       <div className="flex gap-2">
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           onClick={() => printImage(order.print_image_url!)}
                                           className="flex items-center gap-1"
                                         >
                                           <Printer className="h-3 w-3" />
                                           Stampa
                                         </Button>
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           onClick={() => downloadFile(order.print_image_url!, `print-image-${order.id.slice(0, 8)}`)}
                                           className="flex items-center gap-1"
                                         >
                                           <Download className="h-3 w-3" />
                                           Scarica
                                         </Button>
                                       </div>
                                     </div>
                                     <div className="flex-1 flex items-center justify-center p-4 min-h-0">
                                       <img 
                                         src={order.print_image_url} 
                                         alt="Immagine di stampa a schermo intero"
                                         className="max-w-full max-h-full object-contain"
                                       />
                                     </div>
                                   </div>
                                 </DialogContent>
                               </Dialog>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => printImage(order.print_image_url!)}
                                 className="flex items-center gap-1"
                               >
                                 <Printer className="h-3 w-3" />
                                 Stampa
                               </Button>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => downloadFile(order.print_image_url!, `print-image-${order.id.slice(0, 8)}`)}
                                 className="flex items-center gap-1"
                               >
                                 <Download className="h-3 w-3" />
                                 Scarica
                               </Button>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}