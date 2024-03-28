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
        .limit(50)

    return data || []
}

async function getCourseTotalCount(supabase: SupabaseClient) {
    const { count, error } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
    
    return count
}

export default async function ExplorePage() {
    const currentTerm = await getCurrentTerm(true)
    const nextTerm = await getNextTerm(true)
    const currentTermServer = await getCurrentTerm(false)
    const nextTermServer = await getNextTerm(false)
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const courses = await getCourses(supabase)
    const courseTotalCount = await getCourseTotalCount(supabase)

    return (
        <Body currentTerm={currentTerm} nextTerm={nextTerm} initialCourses={courses} courseTotalCount={courseTotalCount} currentTermServer={currentTermServer} nextTermServer={nextTermServer} />
    );
}