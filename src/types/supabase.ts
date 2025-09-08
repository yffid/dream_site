export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          slug: string
          status: 'draft' | 'published' | 'archived'
          author_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          slug: string
          status?: 'draft' | 'published' | 'archived'
          author_id: string
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          slug?: string
          status?: 'draft' | 'published' | 'archived'
          author_id?: string
        }
      }
      post_translations: {
        Row: {
          id: number
          post_id: number
          locale: 'en-US' | 'ar-AE'
          title: string
          description: string
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          post_id: number
          locale: 'en-US' | 'ar-AE'
          title: string
          description: string
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          post_id?: number
          locale?: 'en-US' | 'ar-AE'
          title?: string
          description?: string
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          slug: string
          status: 'draft' | 'published' | 'archived'
          price: number | null
          currency: string
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          slug: string
          status?: 'draft' | 'published' | 'archived'
          price?: number | null
          currency?: string
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          slug?: string
          status?: 'draft' | 'published' | 'archived'
          price?: number | null
          currency?: string
        }
      }
      product_translations: {
        Row: {
          id: number
          product_id: number
          locale: 'en-US' | 'ar-AE'
          name: string
          description: string
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          locale: 'en-US' | 'ar-AE'
          name: string
          description: string
          features: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          locale?: 'en-US' | 'ar-AE'
          name?: string
          description?: string
          features?: Json
          created_at?: string
          updated_at?: string
        }
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
  }
}
