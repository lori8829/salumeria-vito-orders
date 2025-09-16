// Centralized order types
export interface OrderFieldValue {
  key: string;
  value: string;
  file_url?: string;
  field_key: string;
  field_value: string | null;
}

export interface OrderItem {
  dish_name: string;
  quantity: number;
}

export interface Order {
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
  order_items: OrderItem[];
  order_field_values?: OrderFieldValue[]; // Optional for backward compatibility
}