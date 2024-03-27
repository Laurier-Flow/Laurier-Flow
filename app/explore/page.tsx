import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCurrentTerm, getNextTerm } from "../course/CourseSchedule";
import Body from "./body";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

async function getCourses(supabase: SupabaseClient) {
    const { data } = await supabase
        .from('courses')
        .select('*')
        .limit(100)

    return data || []
}

export default async function ExplorePage() {
    const currentTerm = await getCurrentTerm(true)
    const nextTerm = await getNextTerm(true)
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const courses = await getCourses(supabase)

    return (
        <Body currentTerm={currentTerm} nextTerm={nextTerm} initialCourses={courses} />
    );
}