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
      course_reviews: {
        Row: {
          body: string | null
          course_code_fk: string | null
          created_at: string | null
          easy: number | null
          id: string
          instructor_name_fk: string | null
          liked: number | null
          useful: number | null
          user_id_fk: string | null
        }
        Insert: {
          body?: string | null
          course_code_fk?: string | null
          created_at?: string | null
          easy?: number | null
          id?: string
          instructor_name_fk?: string | null
          liked?: number | null
          useful?: number | null
          user_id_fk?: string | null
        }
        Update: {
          body?: string | null
          course_code_fk?: string | null
          created_at?: string | null
          easy?: number | null
          id?: string
          instructor_name_fk?: string | null
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
            foreignKeyName: "course_reviews_instructor_fkey"
            columns: ["instructor_name_fk"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["instructor_name"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fk_fkey"
            columns: ["user_id_fk"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      courses: {
        Row: {
          course_code: string
          course_number: string | null
          course_prefix: string | null
          course_title: string | null
          easy: number | null
          is_uwaterloo_course: boolean | null
          leads_to: string[] | null
          liked: number | null
          total_reviews: number | null
          useful: number | null
          year: number | null
        }
        Insert: {
          course_code: string
          course_number?: string | null
          course_prefix?: string | null
          course_title?: string | null
          easy?: number | null
          is_uwaterloo_course?: boolean | null
          leads_to?: string[] | null
          liked?: number | null
          total_reviews?: number | null
          useful?: number | null
          year?: number | null
        }
        Update: {
          course_code?: string
          course_number?: string | null
          course_prefix?: string | null
          course_title?: string | null
          easy?: number | null
          is_uwaterloo_course?: boolean | null
          leads_to?: string[] | null
          liked?: number | null
          total_reviews?: number | null
          useful?: number | null
          year?: number | null
        }
        Relationships: []
      }
      instructor_reviews: {
        Row: {
          body: string | null
          clear: number | null
          course_code_fk: string | null
          created_at: string | null
          engaging: number | null
          id: string
          instructor_name_fk: string | null
          liked: number | null
          user_id_fk: string | null
        }
        Insert: {
          body?: string | null
          clear?: number | null
          course_code_fk?: string | null
          created_at?: string | null
          engaging?: number | null
          id?: string
          instructor_name_fk?: string | null
          liked?: number | null
          user_id_fk?: string | null
        }
        Update: {
          body?: string | null
          clear?: number | null
          course_code_fk?: string | null
          created_at?: string | null
          engaging?: number | null
          id?: string
          instructor_name_fk?: string | null
          liked?: number | null
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
            columns: ["instructor_name_fk"]
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
          },
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
          },
        ]
      }
      sections: {
        Row: {
          course_code_fk: string | null
          course_registration_number: number
          instructor_name_fk: string | null
          term: string
        }
        Insert: {
          course_code_fk?: string | null
          course_registration_number: number
          instructor_name_fk?: string | null
          term: string
        }
        Update: {
          course_code_fk?: string | null
          course_registration_number?: number
          instructor_name_fk?: string | null
          term?: string
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
          },
        ]
      }
      user_schedule: {
        Row: {
          class: string | null
          date: string | null
          grade: string | null
          id: number
          instructor: string | null
          location: string | null
          section: string | null
          term: string | null
          time: string | null
          type: string | null
          user_id_fk: string | null
        }
        Insert: {
          class?: string | null
          date?: string | null
          grade?: string | null
          id?: number
          instructor?: string | null
          location?: string | null
          section?: string | null
          term?: string | null
          time?: string | null
          type?: string | null
          user_id_fk?: string | null
        }
        Update: {
          class?: string | null
          date?: string | null
          grade?: string | null
          id?: number
          instructor?: string | null
          location?: string | null
          section?: string | null
          term?: string | null
          time?: string | null
          type?: string | null
          user_id_fk?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_schedule_user_id_fk_fkey"
            columns: ["user_id_fk"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
