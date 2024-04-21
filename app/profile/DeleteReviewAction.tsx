'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const handleCourseReviewDelete = async (id: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('course_reviews')
        .delete()
        .eq('id', id)

    console.log(error)
}