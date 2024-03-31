import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCurrentTerm, getNextTerm } from "../course/CourseSchedule";
import Body from "./body";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { instructorInfoDBResponse } from "../instructor/InstructorInfo";

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

export interface instructorInfoDBResponseExplore {
    instructor_name: string,
    total_reviews: number,
    clear: number,
    engaging: number,
    liked: number,
    coursesTaught: string[]
}

async function getCourses(supabase: SupabaseClient, currentTerm: string, nextTerm: string) {
    let hasMore = true;
    let hasMoreSections = true;
    let page = 0;
    let sectionsPage = 0;
    const limit = 1000;
    let allCourses: courseInfoDBResponseExplore[] = [];
    let sectionsData: any[] = []

    while (hasMoreSections) {
        const { data, error } = await supabase
            .from('sections')
            .select('course_code_fk, term')
            .in('term', [currentTerm, nextTerm])
            .range(sectionsPage * limit, (sectionsPage + 1) * limit - 1);

        if (error) {
            console.error(error)
            return []
        }

        sectionsData = [...sectionsData, ...data]

        if (data.length < limit) {
            hasMoreSections = false;
        } else {
            sectionsPage++;
        }
    }

    interface courseOffering {
        isOfferedThisTerm: boolean;
        isOfferedNextTerm: boolean;
    }

    interface CourseOfferingsMap {
        [key: string]: courseOffering;
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

async function getInstructors(supabase: SupabaseClient) {
    let hasMore = true
    let page = 0
    let sectionsPage = 0;
    let limit = 1000
    let hasMoreSections = true;
    let allInstructors: instructorInfoDBResponseExplore[] = []
    let sectionsData: any[] = []

    while (hasMoreSections) {
        const { data, error } = await supabase
            .from('sections')
            .select('course_code_fk, instructor_name_fk')
            .range(sectionsPage * limit, (sectionsPage + 1) * limit - 1);

        if (error) {
            console.error(error)
            return []
        }

        sectionsData = [...sectionsData, ...data]

        if (data.length < limit) {
            hasMoreSections = false;
        } else {
            sectionsPage++;
        }
    }

    interface CoursesTaughtMap {
        [key: string]: string[];
    }
    
    const coursesTaught = sectionsData.reduce<CoursesTaughtMap>((acc, {course_code_fk, instructor_name_fk}) => {
        if (!acc[instructor_name_fk]) {
            acc[instructor_name_fk] = [course_code_fk]
        } else if (!acc[instructor_name_fk].includes(course_code_fk)) {
            acc[instructor_name_fk].push(course_code_fk)
        }
    
        return acc
    }, {});
    

    while (hasMore) {
        const { data, error } = await supabase
            .from('instructors')
            .select('*')
            .range(page * limit, (page + 1) * limit - 1);

        if (error) {
            console.error(error);
            break;
        }

        allInstructors = [...allInstructors, ...data];

        if (data.length < limit) {
            hasMore = false;
        } else {
            page++;
        }
    }

    allInstructors = allInstructors.map(instructor => {
        const instructorName = instructor.instructor_name;
        const courses = coursesTaught[instructorName] || [];
    
        return {
            ...instructor,
            coursesTaught: courses
        };
    });

    return allInstructors;
}

export default async function ExplorePage() {
    const currentTerm = await getCurrentTerm(true)
    const nextTerm = await getNextTerm(true)
    const currentTermServer = await getCurrentTerm(false)
    const nextTermServer = await getNextTerm(false)
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const courses = await getCourses(supabase, currentTermServer, nextTermServer)
    const instructors = await getInstructors(supabase)

    return (
        <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <Body currentTerm={currentTerm} nextTerm={nextTerm} courses={courses} instructors={instructors} />
        </Suspense>
    );
}