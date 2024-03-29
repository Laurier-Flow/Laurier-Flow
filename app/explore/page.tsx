import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCurrentTerm, getNextTerm } from "../course/CourseSchedule";
import Body from "./body";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { courseInfoDBResponse } from "../course/CourseInfo";

export interface courseInfoDBResponseExplore {
    course_code: string,
    total_reviews: number,
    easy: number,
    useful: number,
    liked: number,
    course_title: string,
    isOfferedThisTerm: boolean,
    isOfferedNextTerm: boolean
  }

async function getCourses(supabase: SupabaseClient, currentTerm: string, nextTerm: string) {
    let hasMore = true;
    let page = 0;
    const limit = 1000;
    let allCourses: courseInfoDBResponseExplore[] = [];

    const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('course_code_fk, term')
        .in('term', [currentTerm, nextTerm])

    if (sectionsError) {
        console.error(sectionsError)
        return []
    }

    interface CourseOffering {
        isOfferedThisTerm: boolean;
        isOfferedNextTerm: boolean;
    }

    interface CourseOfferingsMap {
        [key: string]: CourseOffering;
    }

    const courseOfferings = sectionsData.reduce<CourseOfferingsMap>((acc, { course_code_fk, term }) => {
        if (!acc[course_code_fk]) {
            acc[course_code_fk] = { isOfferedThisTerm: false, isOfferedNextTerm: false };
        }

        if (term === currentTerm) {
            acc[course_code_fk].isOfferedThisTerm = true
        }

        if (term === nextTerm) {
            acc[course_code_fk].isOfferedNextTerm = true
        }

        return acc
    }, {})

    while (hasMore) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .range(page * limit, (page + 1) * limit - 1);

        if (error) {
            console.error(error);
            break;
        }

        const processedCourses = data.map(course => ({
            ...course,
            isOfferedThisTerm: courseOfferings[course.course_code]?.isOfferedThisTerm || false,
            isOfferedNextTerm: courseOfferings[course.course_code]?.isOfferedNextTerm || false
        }));

        allCourses = [...allCourses, ...processedCourses];

        if (data.length < limit) {
            hasMore = false;
        } else {
            page++;
        }
    }

    return allCourses;
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
    const courses = await getCourses(supabase, currentTermServer, nextTermServer)
    const courseTotalCount = await getCourseTotalCount(supabase)

    return (
        <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <Body currentTerm={currentTerm} nextTerm={nextTerm} courses={courses} />
        </Suspense>
    );
}