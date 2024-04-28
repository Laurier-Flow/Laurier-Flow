'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const handleCourseReviewEdit = async (easy: number, useful: number, liked: number, instructor: string | null, text: string, id: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('course_reviews')
        .update({easy: easy, useful: useful, liked: liked, instructor_name_fk: instructor, body: text})
        .eq('id', id)

    console.error(error)
}

export const handleInstructorReviewEdit = async (easy: number, useful: number, liked: number, instructor: string | null, text: string, id: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('instructor_reviews')
        .update({clear: easy, engaging: useful, liked: liked, course_code_fk: instructor, body: text})
        .eq('id', id)

    console.error(error)
}