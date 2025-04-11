export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          email: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          phone: string | null
          is_freelancer: boolean
          is_client: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          email: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          is_freelancer?: boolean
          is_client?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          email?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          phone?: string | null
          is_freelancer?: boolean
          is_client?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      freelancer_profiles: {
        Row: {
          id: string
          title: string | null
          hourly_rate: number | null
          tagline: string | null
          total_earnings: number
          job_success_score: number
          response_time: string | null
          last_active: string | null
          member_since: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title?: string | null
          hourly_rate?: number | null
          tagline?: string | null
          total_earnings?: number
          job_success_score?: number
          response_time?: string | null
          last_active?: string | null
          member_since?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          hourly_rate?: number | null
          tagline?: string | null
          total_earnings?: number
          job_success_score?: number
          response_time?: string | null
          last_active?: string | null
          member_since?: string
          created_at?: string
          updated_at?: string
        }
      }
      client_profiles: {
        Row: {
          id: string
          company_name: string | null
          company_website: string | null
          company_size: string | null
          industry: string | null
          total_spent: number
          payment_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name?: string | null
          company_website?: string | null
          company_size?: string | null
          industry?: string | null
          total_spent?: number
          payment_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string | null
          company_website?: string | null
          company_size?: string | null
          industry?: string | null
          total_spent?: number
          payment_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      freelancer_skills: {
        Row: {
          id: string
          freelancer_id: string
          skill_id: string
          level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          freelancer_id: string
          skill_id: string
          level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          freelancer_id?: string
          skill_id?: string
          level?: number | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string
          budget_min: number | null
          budget_max: number | null
          budget_type: string | null
          deadline: string | null
          status: string
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description: string
          budget_min?: number | null
          budget_max?: number | null
          budget_type?: string | null
          deadline?: string | null
          status?: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string
          budget_min?: number | null
          budget_max?: number | null
          budget_type?: string | null
          deadline?: string | null
          status?: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          project_id: string
          freelancer_id: string
          amount: number
          delivery_time: number
          cover_letter: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          freelancer_id: string
          amount: number
          delivery_time: number
          cover_letter?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          freelancer_id?: string
          amount?: number
          delivery_time?: number
          cover_letter?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          freelancer_id: string
          title: string
          description: string
          category_id: string | null
          price: number
          delivery_time: number
          revisions: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          freelancer_id: string
          title: string
          description: string
          category_id?: string | null
          price: number
          delivery_time: number
          revisions?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          freelancer_id?: string
          title?: string
          description?: string
          category_id?: string | null
          price?: number
          delivery_time?: number
          revisions?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      photographers: {
        Row: {
          id: string
          specialties: string[] | null
          equipment: string[] | null
          location_lat: number | null
          location_lng: number | null
          location_address: string | null
          availability_schedule: string | null
          booking_notice: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialties?: string[] | null
          equipment?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          availability_schedule?: string | null
          booking_notice?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          specialties?: string[] | null
          equipment?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          availability_schedule?: string | null
          booking_notice?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      // Add other tables as needed
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
