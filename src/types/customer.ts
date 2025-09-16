// Centralized customer types to avoid duplication
export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
}

export interface OrderHistory {
  id: string;
  date: string;
  cake_type_id: string | null;
  pickup_date: string | null;
  categories: { name: string } | null;
}