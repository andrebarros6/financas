/**
 * Database types for Supabase
 * Generated from schema in supabase/migrations/001_initial_schema.sql
 */

export type SubscriptionTier = 'free' | 'pro'
export type SubscriptionInterval = 'monthly' | 'annual'
export type ReferralStatus = 'pending' | 'rewarded' | 'invalid'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          subscription_tier: SubscriptionTier
          subscription_expires_at: string | null
          trial_started_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_interval: SubscriptionInterval | null
          is_founding_member: boolean
          referral_code: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          trial_started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_interval?: SubscriptionInterval | null
          is_founding_member?: boolean
          referral_code?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          subscription_tier?: SubscriptionTier
          subscription_expires_at?: string | null
          trial_started_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_interval?: SubscriptionInterval | null
          is_founding_member?: boolean
          referral_code?: string | null
        }
      }
      receipts: {
        Row: {
          id: string
          user_id: string
          // Document identification
          referencia: string
          tipo_documento: string
          atcud: string
          situacao: string
          // Dates
          data_transacao: string
          motivo_emissao: string | null
          data_emissao: string
          // Client info
          pais_adquirente: string | null
          nif_adquirente: string
          nome_adquirente: string
          // Financial values (in euros)
          valor_tributavel: number
          valor_iva: number
          imposto_selo_retencao: number | null
          valor_imposto_selo: number
          valor_irs: number
          total_impostos: number | null
          total_com_impostos: number
          total_retencoes: number
          contribuicao_cultura: number
          total_documento: number
          // Metadata
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          referencia: string
          tipo_documento: string
          atcud: string
          situacao: string
          data_transacao: string
          motivo_emissao?: string | null
          data_emissao: string
          pais_adquirente?: string | null
          nif_adquirente: string
          nome_adquirente: string
          valor_tributavel: number
          valor_iva?: number
          imposto_selo_retencao?: number | null
          valor_imposto_selo?: number
          valor_irs?: number
          total_impostos?: number | null
          total_com_impostos: number
          total_retencoes?: number
          contribuicao_cultura?: number
          total_documento: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          referencia?: string
          tipo_documento?: string
          atcud?: string
          situacao?: string
          data_transacao?: string
          motivo_emissao?: string | null
          data_emissao?: string
          pais_adquirente?: string | null
          nif_adquirente?: string
          nome_adquirente?: string
          valor_tributavel?: number
          valor_iva?: number
          imposto_selo_retencao?: number | null
          valor_imposto_selo?: number
          valor_irs?: number
          total_impostos?: number | null
          total_com_impostos?: number
          total_retencoes?: number
          contribuicao_cultura?: number
          total_documento?: number
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referee_id: string
          code_used: string
          status: ReferralStatus
          rewarded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referee_id: string
          code_used: string
          status?: ReferralStatus
          rewarded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referee_id?: string
          code_used?: string
          status?: ReferralStatus
          rewarded_at?: string | null
          created_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          created_at: string
          notified_at: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          notified_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          notified_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_pro_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_user_receipt_years: {
        Args: { user_uuid: string }
        Returns: number[]
      }
      grant_referral_reward: {
        Args: { p_referral_id: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Receipt = Database['public']['Tables']['receipts']['Row']
export type ReceiptInsert = Database['public']['Tables']['receipts']['Insert']
export type ReceiptUpdate = Database['public']['Tables']['receipts']['Update']

export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row']
export type WaitlistInsert = Database['public']['Tables']['waitlist']['Insert']

export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
