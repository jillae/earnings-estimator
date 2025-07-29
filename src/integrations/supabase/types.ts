export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      calculations: {
        Row: {
          adjustment_factor: number
          created_at: string
          customer_price: number
          id: string
          insurance: boolean | null
          leasing_period: number
          machine_id: string | null
          treatments_per_day: number
          uses_flatrate: boolean | null
        }
        Insert: {
          adjustment_factor: number
          created_at?: string
          customer_price: number
          id?: string
          insurance?: boolean | null
          leasing_period: number
          machine_id?: string | null
          treatments_per_day: number
          uses_flatrate?: boolean | null
        }
        Update: {
          adjustment_factor?: number
          created_at?: string
          customer_price?: number
          id?: string
          insurance?: boolean | null
          leasing_period?: number
          machine_id?: string | null
          treatments_per_day?: number
          uses_flatrate?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "calculations_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["id"]
          },
        ]
      }
      calculator_logs: {
        Row: {
          action: string
          created_at: string
          data: Json | null
          id: string
          session_id: string
          timestamp: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          data?: Json | null
          id?: string
          session_id: string
          timestamp?: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          data?: Json | null
          id?: string
          session_id?: string
          timestamp?: string
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      machines: {
        Row: {
          category: string | null
          created_at: string
          credit_max: number | null
          credit_min: number | null
          credits_per_treatment: number | null
          default_customer_price: number | null
          default_leasing_period: number | null
          description: string | null
          flatrate_amount: number | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          leasing_max: number | null
          leasing_min: number | null
          leasing_tariffs: Json | null
          name: string
          price_eur: number
          uses_credits: boolean | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          credit_max?: number | null
          credit_min?: number | null
          credits_per_treatment?: number | null
          default_customer_price?: number | null
          default_leasing_period?: number | null
          description?: string | null
          flatrate_amount?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          leasing_max?: number | null
          leasing_min?: number | null
          leasing_tariffs?: Json | null
          name: string
          price_eur?: number
          uses_credits?: boolean | null
        }
        Update: {
          category?: string | null
          created_at?: string
          credit_max?: number | null
          credit_min?: number | null
          credits_per_treatment?: number | null
          default_customer_price?: number | null
          default_leasing_period?: number | null
          description?: string | null
          flatrate_amount?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          leasing_max?: number | null
          leasing_min?: number | null
          leasing_tariffs?: Json | null
          name?: string
          price_eur?: number
          uses_credits?: boolean | null
        }
        Relationships: []
      }
      test_exports: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          export_data: Json
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          export_data: Json
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          export_data?: Json
          id?: string
          name?: string
        }
        Relationships: []
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
