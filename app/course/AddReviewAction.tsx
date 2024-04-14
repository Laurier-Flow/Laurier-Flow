'use server'

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const handleCourseReviewSubmit = async (easy: number, useful: number, liked: number, instructor: string | null, text: string, courseName: string, user: User | null) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('course_reviews')
        .insert({body: text, easy: easy, useful: useful, liked: liked, user_id_fk: user?.id, instructor_name_fk: instructor, course_code_fk: courseName,})

    console.log(error)
}

export const handleInstructorReviewSubmit = async (clear: number, engaging: number, liked: number, course: string | null, text: string, instructorName: string, user: User | null) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('instructor_reviews')
        .insert({body: text, clear: clear, engaging: engaging, liked: liked, user_id_fk: user?.id, course_code_fk: course, instructor_name_fk: instructorName})

    console.log(error)
}