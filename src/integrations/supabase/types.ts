export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          is_configurable: boolean
          min_lead_days: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_configurable?: boolean
          min_lead_days?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_configurable?: boolean
          min_lead_days?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      category_daily_capacity: {
        Row: {
          capacity_date: string
          category_id: string
          created_at: string
          current_orders: number
          id: string
          max_orders: number
        }
        Insert: {
          capacity_date: string
          category_id: string
          created_at?: string
          current_orders?: number
          id?: string
          max_orders?: number
        }
        Update: {
          capacity_date?: string
          category_id?: string
          created_at?: string
          current_orders?: number
          id?: string
          max_orders?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_daily_capacity_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_fields: {
        Row: {
          category_id: string
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          is_required: boolean
          options: Json | null
          position: number
          rules: Json | null
        }
        Insert: {
          category_id: string
          created_at?: string
          field_key: string
          field_label: string
          field_type: string
          id?: string
          is_required?: boolean
          options?: Json | null
          position?: number
          rules?: Json | null
        }
        Update: {
          category_id?: string
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          is_required?: boolean
          options?: Json | null
          position?: number
          rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "category_fields_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_field_values: {
        Row: {
          created_at: string
          field_key: string
          field_value: string | null
          file_url: string | null
          id: string
          order_id: string
        }
        Insert: {
          created_at?: string
          field_key: string
          field_value?: string | null
          file_url?: string | null
          id?: string
          order_id: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_value?: string | null
          file_url?: string | null
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_field_values_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          dish_name: string
          id: string
          order_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          dish_name: string
          id?: string
          order_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          dish_name?: string
          id?: string
          order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          allergies: string | null
          archived_at: string | null
          base_id: string | null
          cake_design: boolean | null
          cake_type_id: string | null
          category_id: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          customer_surname: string | null
          date: string
          decoration_id: string | null
          decoration_text: string | null
          delivery_address: string | null
          exterior_id: string | null
          filling_id: string | null
          id: string
          inscription: string | null
          is_restaurant: boolean | null
          needs_transport: boolean | null
          people_count: number | null
          pickup_date: string | null
          pickup_time: string | null
          print_description: string | null
          print_image_url: string | null
          print_option: boolean | null
          print_type: string | null
          restaurant_contact: string | null
          status: string
          tiers: number | null
          total_items: number
          user_id: string | null
        }
        Insert: {
          allergies?: string | null
          archived_at?: string | null
          base_id?: string | null
          cake_design?: boolean | null
          cake_type_id?: string | null
          category_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_surname?: string | null
          date?: string
          decoration_id?: string | null
          decoration_text?: string | null
          delivery_address?: string | null
          exterior_id?: string | null
          filling_id?: string | null
          id?: string
          inscription?: string | null
          is_restaurant?: boolean | null
          needs_transport?: boolean | null
          people_count?: number | null
          pickup_date?: string | null
          pickup_time?: string | null
          print_description?: string | null
          print_image_url?: string | null
          print_option?: boolean | null
          print_type?: string | null
          restaurant_contact?: string | null
          status?: string
          tiers?: number | null
          total_items?: number
          user_id?: string | null
        }
        Update: {
          allergies?: string | null
          archived_at?: string | null
          base_id?: string | null
          cake_design?: boolean | null
          cake_type_id?: string | null
          category_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          customer_surname?: string | null
          date?: string
          decoration_id?: string | null
          decoration_text?: string | null
          delivery_address?: string | null
          exterior_id?: string | null
          filling_id?: string | null
          id?: string
          inscription?: string | null
          is_restaurant?: boolean | null
          needs_transport?: boolean | null
          people_count?: number | null
          pickup_date?: string | null
          pickup_time?: string | null
          print_description?: string | null
          print_image_url?: string | null
          print_option?: boolean | null
          print_type?: string | null
          restaurant_contact?: string | null
          status?: string
          tiers?: number | null
          total_items?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
