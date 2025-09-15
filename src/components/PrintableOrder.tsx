import React from 'react';

interface OrderFieldValue {
  key: string;
  value: string;
  file_url?: string;
}

interface Order {
  id: string;
  customer_name: string | null;
  customer_surname: string | null;
  customer_phone: string | null;
  pickup_date: string | null;
  pickup_time: string | null;
  status: string;
  created_at: string;
  category?: {
    name: string;
  };
  order_items: Array<{
    dish_name: string;
    quantity: number;
  }>;
  order_field_values: OrderFieldValue[];
  people_count?: number | null;
  allergies?: string | null;
  delivery_address?: string | null;
  needs_transport?: boolean;
  inscription?: string | null;
  decoration_text?: string | null;
  print_description?: string | null;
}

interface PrintableOrderProps {
  order: Order;
}

export const PrintableOrder: React.FC<PrintableOrderProps> = ({ order }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return timeString;
  };

  const getFieldLabel = (fieldKey: string) => {
    const labels: { [key: string]: string } = {
      pickup_date: 'Data Ritiro',
      pickup_time: 'Ora Ritiro',
      people_count: 'Numero Persone',
      allergies: 'Allergie',
      delivery_address: 'Indirizzo Consegna',
      inscription: 'Scritta',
      decoration_text: 'Decorazione',
      print_description: 'Descrizione Stampa',
      cake_design: 'Cake Design',
      tiers: 'Piani Torta',
      base: 'Base',
      filling: 'Farcitura',
      exterior: 'Esterno',
      decoration: 'Decorazione'
    };
    return labels[fieldKey] || fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1);
  };

  return (
    <div className="print-container max-w-[7cm] mx-auto bg-white text-black text-xs leading-tight font-mono">
      {/* Header */}
      <div className="text-center border-b border-black pb-2 mb-2">
        <div className="font-bold text-sm">SALUMERIA VITO</div>
        <div className="text-xs">Via del Borgo, 123</div>
        <div className="text-xs">Roma - Tel: 06.123456789</div>
      </div>

      {/* Order Info */}
      <div className="mb-2">
        <div className="font-bold text-center mb-1">ORDINE #{order.id.slice(-6).toUpperCase()}</div>
        <div>Data: {formatDate(order.created_at)}</div>
        <div>Stato: {order.status}</div>
      </div>

      {/* Customer Info */}
      <div className="border-t border-black pt-1 mb-2">
        <div className="font-bold mb-1">CLIENTE:</div>
        {order.customer_name && (
          <div>{order.customer_name} {order.customer_surname}</div>
        )}
        {order.customer_phone && (
          <div>Tel: {order.customer_phone}</div>
        )}
      </div>

      {/* Pickup Info */}
      {(order.pickup_date || order.pickup_time) && (
        <div className="border-t border-black pt-1 mb-2">
          <div className="font-bold mb-1">RITIRO:</div>
          {order.pickup_date && (
            <div>Data: {formatDate(order.pickup_date)}</div>
          )}
          {order.pickup_time && (
            <div>Ora: {formatTime(order.pickup_time)}</div>
          )}
        </div>
      )}

      {/* Items */}
      {order.order_items && order.order_items.length > 0 && (
        <div className="border-t border-black pt-1 mb-2">
          <div className="font-bold mb-1">ARTICOLI:</div>
          {order.order_items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.quantity}x {item.dish_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Additional Info */}
      <div className="border-t border-black pt-1 mb-2">
        <div className="font-bold mb-1">DETTAGLI:</div>
        
        {order.category && (
          <div>Categoria: {order.category.name}</div>
        )}
        
        {order.people_count && (
          <div>Persone: {order.people_count}</div>
        )}
        
        {order.allergies && (
          <div>Allergie: {order.allergies}</div>
        )}
        
        {order.inscription && (
          <div>Scritta: {order.inscription}</div>
        )}
        
        {order.decoration_text && (
          <div>Decorazione: {order.decoration_text}</div>
        )}
        
        {order.print_description && (
          <div>Stampa: {order.print_description}</div>
        )}
        
        {order.needs_transport && (
          <div>Trasporto richiesto</div>
        )}
        
        {order.delivery_address && (
          <div>Indirizzo: {order.delivery_address}</div>
        )}

        {/* Custom Fields */}
        {order.order_field_values && order.order_field_values.length > 0 && (
          <>
            {order.order_field_values.map((field, index) => (
              <div key={index}>
                {field.value && !field.file_url && (
                  <div>{getFieldLabel(field.key)}: {field.value}</div>
                )}
                {field.file_url && (
                  <div>{getFieldLabel(field.key)}: Immagine allegata</div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-black pt-1 text-center text-xs">
        <div>Grazie per la fiducia!</div>
        <div className="mt-1">www.salumeriavito.it</div>
      </div>
    </div>
  );
};

export const printOrder = (order: Order) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ordine #${order.id.slice(-6).toUpperCase()}</title>
        <style>
          @media print {
            @page {
              size: 7cm 14cm;
              margin: 0.2cm;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 10px;
              line-height: 1.2;
              margin: 0;
              padding: 0;
              color: black;
              background: white;
            }
            .print-container {
              width: 100%;
              max-width: none;
            }
          }
          body {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.2;
            margin: 0;
            padding: 0.2cm;
            color: black;
            background: white;
          }
          .print-container {
            width: 7cm;
            margin: 0 auto;
          }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .border-t { border-top: 1px solid black; }
          .border-b { border-bottom: 1px solid black; }
          .pt-1 { padding-top: 0.1cm; }
          .pb-2 { padding-bottom: 0.2cm; }
          .mb-1 { margin-bottom: 0.1cm; }
          .mb-2 { margin-bottom: 0.2cm; }
          .mt-1 { margin-top: 0.1cm; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
        </style>
      </head>
      <body>
        ${document.createElement('div').innerHTML = document.querySelector('.print-container')?.outerHTML || ''}
      </body>
    </html>
  `);

  // Create a temporary div to render the component
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = `
    <div class="print-container">
      <div class="text-center border-b pb-2 mb-2">
        <div class="font-bold" style="font-size: 12px;">SALUMERIA VITO</div>
        <div style="font-size: 10px;">Via del Borgo, 123</div>
        <div style="font-size: 10px;">Roma - Tel: 06.123456789</div>
      </div>
      
      <div class="mb-2">
        <div class="font-bold text-center mb-1">ORDINE #${order.id.slice(-6).toUpperCase()}</div>
        <div>Data: ${new Date(order.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
        <div>Stato: ${order.status}</div>
      </div>
      
      <div class="border-t pt-1 mb-2">
        <div class="font-bold mb-1">CLIENTE:</div>
        ${order.customer_name ? `<div>${order.customer_name} ${order.customer_surname || ''}</div>` : ''}
        ${order.customer_phone ? `<div>Tel: ${order.customer_phone}</div>` : ''}
      </div>
      
      ${(order.pickup_date || order.pickup_time) ? `
        <div class="border-t pt-1 mb-2">
          <div class="font-bold mb-1">RITIRO:</div>
          ${order.pickup_date ? `<div>Data: ${new Date(order.pickup_date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>` : ''}
          ${order.pickup_time ? `<div>Ora: ${order.pickup_time}</div>` : ''}
        </div>
      ` : ''}
      
      ${order.order_items && order.order_items.length > 0 ? `
        <div class="border-t pt-1 mb-2">
          <div class="font-bold mb-1">ARTICOLI:</div>
          ${order.order_items.map(item => `<div>${item.quantity}x ${item.dish_name}</div>`).join('')}
        </div>
      ` : ''}
      
      <div class="border-t pt-1 mb-2">
        <div class="font-bold mb-1">DETTAGLI:</div>
        ${order.category ? `<div>Categoria: ${order.category.name}</div>` : ''}
        ${order.people_count ? `<div>Persone: ${order.people_count}</div>` : ''}
        ${order.allergies ? `<div>Allergie: ${order.allergies}</div>` : ''}
        ${order.inscription ? `<div>Scritta: ${order.inscription}</div>` : ''}
        ${order.decoration_text ? `<div>Decorazione: ${order.decoration_text}</div>` : ''}
        ${order.print_description ? `<div>Stampa: ${order.print_description}</div>` : ''}
        ${order.needs_transport ? '<div>Trasporto richiesto</div>' : ''}
        ${order.delivery_address ? `<div>Indirizzo: ${order.delivery_address}</div>` : ''}
        ${order.order_field_values ? order.order_field_values.map(field => 
          field.value && !field.file_url ? `<div>${field.key}: ${field.value}</div>` :
          field.file_url ? `<div>${field.key}: Immagine allegata</div>` : ''
        ).join('') : ''}
      </div>
      
      <div class="border-t pt-1 text-center">
        <div>Grazie per la fiducia!</div>
        <div class="mt-1">www.salumeriavito.it</div>
      </div>
    </div>
  `;

  printWindow.document.body.innerHTML = tempDiv.innerHTML;
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
};