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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      market_prices: {
        Row: {
          id: string
          market_id: string
          outcome: string
          price: number
          probability: number
          timestamp: string
        }
        Insert: {
          id?: string
          market_id: string
          outcome: string
          price: number
          probability: number
          timestamp?: string
        }
        Update: {
          id?: string
          market_id?: string
          outcome?: string
          price?: number
          probability?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_prices_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          category: Database["public"]["Enums"]["market_category"]
          created_at: string
          creator_address: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          outcomes: Json
          resolution: string | null
          status: Database["public"]["Enums"]["market_status"]
          title: string
          total_liquidity: number | null
          total_volume: number | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["market_category"]
          created_at?: string
          creator_address: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          outcomes?: Json
          resolution?: string | null
          status?: Database["public"]["Enums"]["market_status"]
          title: string
          total_liquidity?: number | null
          total_volume?: number | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["market_category"]
          created_at?: string
          creator_address?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          outcomes?: Json
          resolution?: string | null
          status?: Database["public"]["Enums"]["market_status"]
          title?: string
          total_liquidity?: number | null
          total_volume?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          avg_price: number
          created_at: string
          current_value: number
          id: string
          market_id: string
          outcome: string
          realized_pnl: number
          shares: number
          updated_at: string
          user_address: string
        }
        Insert: {
          avg_price?: number
          created_at?: string
          current_value?: number
          id?: string
          market_id: string
          outcome: string
          realized_pnl?: number
          shares?: number
          updated_at?: string
          user_address: string
        }
        Update: {
          avg_price?: number
          created_at?: string
          current_value?: number
          id?: string
          market_id?: string
          outcome?: string
          realized_pnl?: number
          shares?: number
          updated_at?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          created_at: string
          id: string
          market_id: string
          outcome: string
          price: number
          shares: number
          total_cost: number
          trade_type: Database["public"]["Enums"]["trade_type"]
          tx_hash: string | null
          user_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          outcome: string
          price: number
          shares: number
          total_cost: number
          trade_type: Database["public"]["Enums"]["trade_type"]
          tx_hash?: string | null
          user_address: string
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          outcome?: string
          price?: number
          shares?: number
          total_cost?: number
          trade_type?: Database["public"]["Enums"]["trade_type"]
          tx_hash?: string | null
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          markets_traded: number | null
          total_profit: number | null
          total_volume: number | null
          username: string | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          markets_traded?: number | null
          total_profit?: number | null
          total_volume?: number | null
          username?: string | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          markets_traded?: number | null
          total_profit?: number | null
          total_volume?: number | null
          username?: string | null
          wallet_address?: string
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
      market_category: "Politics" | "Sports" | "Crypto" | "Custom"
      market_status: "active" | "closed" | "resolved"
      trade_type: "buy" | "sell"
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
    Enums: {
      market_category: ["Politics", "Sports", "Crypto", "Custom"],
      market_status: ["active", "closed", "resolved"],
      trade_type: ["buy", "sell"],
    },
  },
} as const
