export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      course_reviews: {
        Row: {
          anonymous: boolean | null
          body: string | null
          course_code_fk: string | null
          created_at: string | null
          easy: number | null
          id: string
          liked: number | null
          useful: number | null
          user_id_fk: string | null
        }
        Insert: {
          anonymous?: boolean | null
          body?: string | null
          course_code_fk?: string | null
          created_at?: string | null
          easy?: number | null
          id: string
          liked?: number | null
          useful?: number | null
          user_id_fk?: string | null
        }
        Update: {
          anonymous?: boolean | null
          body?: string | null
          course_code_fk?: string | null
          created_at?: string | null
          easy?: number | null
          id?: string
          liked?: number | null
          useful?: number | null
          user_id_fk?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_code_fk_fkey"
            columns: ["course_code_fk"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_code"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fk_fkey"
            columns: ["user_id_fk"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      courses: {
        Row: {
          course_code: string
          course_title: string | null
          easy: number | null
          liked: number | null
          total_reviews: number | null
          useful: number | null
        }
        Insert: {
          course_code: string
          course_title?: string | null
          easy?: number | null
          liked?: number | null
          total_reviews?: number | null
          useful?: number | null
        }
        Update: {
          course_code?: string
          course_title?: string | null
          easy?: number | null
          liked?: number | null
          total_reviews?: number | null
          useful?: number | null
        }
        Relationships: []
      }
      instructor_reviews: {
        Row: {
          anonymous: boolean | null
          body: string | null
          clear: number | null
          course_code_fk: string | null
          created_at: string | null
          engaging: number | null
          id: string
          instructor_fk: string | null
          user_id_fk: string | null
        }
        Insert: {
          anonymous?: boolean | null
          body?: string | null
          clear?: number | null
          course_code_fk?: string | null
          created_at?: string | null
          engaging?: number | null
          id: string
          instructor_fk?: string | null
          user_id_fk?: string | null
        }
        Update: {
          anonymous?: boolean | null
          body?: string | null
          clear?: number | null
          course_code_fk?: string | null
          created_at?: string | null
          engaging?: number | null
          id?: string
          instructor_fk?: string | null
          user_id_fk?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_reviews_course_code_fk_fkey"
            columns: ["course_code_fk"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_code"]
          },
          {
            foreignKeyName: "instructor_reviews_instructor_fk_fkey"
            columns: ["instructor_fk"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["instructor_name"]
          },
          {
            foreignKeyName: "instructor_reviews_user_id_fk_fkey"
            columns: ["user_id_fk"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      instructors: {
        Row: {
          clear: number | null
          engaging: number | null
          instructor_email: string | null
          instructor_name: string
          liked: number | null
          total_reviews: number | null
        }
        Insert: {
          clear?: number | null
          engaging?: number | null
          instructor_email?: string | null
          instructor_name: string
          liked?: number | null
          total_reviews?: number | null
        }
        Update: {
          clear?: number | null
          engaging?: number | null
          instructor_email?: string | null
          instructor_name?: string
          liked?: number | null
          total_reviews?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          last_name: string | null
          program: string | null
          user_id: string
        }
        Insert: {
          first_name?: string | null
          last_name?: string | null
          program?: string | null
          user_id: string
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          program?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          course_code_fk: string | null
          course_registration_number: number
          instructor_name_fk: string | null
          term: string | null
        }
        Insert: {
          course_code_fk?: string | null
          course_registration_number: number
          instructor_name_fk?: string | null
          term?: string | null
        }
        Update: {
          course_code_fk?: string | null
          course_registration_number?: number
          instructor_name_fk?: string | null
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_code_fk_fkey"
            columns: ["course_code_fk"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["course_code"]
          },
          {
            foreignKeyName: "sections_instructor_name_fk_fkey"
            columns: ["instructor_name_fk"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["instructor_name"]
          }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
