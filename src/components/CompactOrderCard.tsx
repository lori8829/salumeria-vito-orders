import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Trash2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderFieldValue {
  field_key: string;
  field_value: string | null;
  file_url: string | null;
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
  category_id: string;
  field_values?: OrderFieldValue[];
  category?: {
    name: string;
  };
}

interface CompactOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onArchive: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

const statusColors = {
  pending: "bg-yellow-50 border-yellow-200",
  in_preparation: "bg-blue-50 border-blue-200", 
  ready: "bg-green-50 border-green-200",
  completed: "bg-gray-50 border-gray-200"
};

const statusLabels = {
  pending: "Ricevuto",
  in_preparation: "In preparazione", 
  ready: "Pronto",
  completed: "Ritirato"
};

export function CompactOrderCard({ order, onStatusChange, onArchive, onDelete }: CompactOrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      restaurant_contact: 'Referente ristorante'
    };
    return labels[fieldKey] || fieldKey.replace('_', ' ');
  };

  return (
    <Card className={cn("transition-all duration-200", getStatusColor(order.status))}>
      {/* Compact view */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {new Date(order.created_at).toLocaleDateString('it-IT')} - {order.pickup_time || 'N/A'}
            </div>
            <div className="font-medium truncate">
              {order.customer_name} {order.customer_surname}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {order.category?.name || 'Torta personalizzata'}
            </div>
            {order.people_count && (
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {order.people_count} persone
              </div>
            )}
            {order.pickup_date && (
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {new Date(order.pickup_date).toLocaleDateString('it-IT')}
              </div>
            )}
            <div className="ml-auto">
              <Select
                value={order.status}
                onValueChange={(value) => onStatusChange(order.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ricevuto</SelectItem>
                  <SelectItem value="in_preparation">In preparazione</SelectItem>
                  <SelectItem value="ready">Pronto</SelectItem>
                  <SelectItem value="completed">Ritirato</SelectItem>
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
            {order.status === 'completed' ? (
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
                    <p>{new Date(order.pickup_date).toLocaleDateString('it-IT')}</p>
                  </div>
                )}

                {order.people_count && (
                  <div>
                    <p className="font-medium text-muted-foreground">Numero persone</p>
                    <p>{order.people_count}</p>
                  </div>
                )}
              </div>
            ) : (
              // Full details for pending/in_preparation/ready orders - TUTTE le informazioni
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
                          <p className="break-words">
                            {fieldValue.file_url ? (
                              <a 
                                href={fieldValue.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visualizza file
                              </a>
                            ) : (
                              fieldValue.field_value || 'N/A'
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campi statici dal modello originale */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground border-b pb-2">Informazioni aggiuntive</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {order.pickup_date && (
                      <div>
                        <p className="font-medium text-muted-foreground">Data ritiro</p>
                        <p>{new Date(order.pickup_date).toLocaleDateString('it-IT')}</p>
                      </div>
                    )}

                    {order.pickup_time && (
                      <div>
                        <p className="font-medium text-muted-foreground">Orario ritiro</p>
                        <p>{order.pickup_time}</p>
                      </div>
                    )}

                    {order.people_count && (
                      <div>
                        <p className="font-medium text-muted-foreground">Numero persone</p>
                        <p>{order.people_count}</p>
                      </div>
                    )}

                    {order.cake_design && (
                      <div>
                        <p className="font-medium text-muted-foreground">Cake Design</p>
                        <p>Sì - {order.tiers} piani</p>
                      </div>
                    )}

                    {order.allergies && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">Allergie</p>
                        <p className="break-words">{order.allergies}</p>
                      </div>
                    )}

                    {order.inscription && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">Scritta</p>
                        <p className="break-words">{order.inscription}</p>
                      </div>
                    )}

                    {order.decoration_text && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">Dettagli decorazione</p>
                        <p className="break-words">{order.decoration_text}</p>
                      </div>
                    )}

                    {order.print_option && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">Stampa</p>
                        <p className="break-words">
                          {order.print_type === 'describe' ? `Descrizione: ${order.print_description}` : 'Immagine caricata'}
                        </p>
                      </div>
                    )}

                    {order.needs_transport && (
                      <div>
                        <p className="font-medium text-muted-foreground">Trasporto</p>
                        <p>Richiesto</p>
                      </div>
                    )}

                    {order.is_restaurant && (
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">Ristorante</p>
                        <p>Consegna: {order.delivery_address}</p>
                        <p>Referente: {order.restaurant_contact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}