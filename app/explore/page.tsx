import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getCurrentTerm, getNextTerm } from "../course/CourseSchedule";
import Body from "./body";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { instructorInfoDBResponse } from "../instructor/InstructorInfo";
import { fetchUser } from "@/utils/supabase/authActions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

interface courseOffering {
    isOfferedThisTerm: boolean;
    isOfferedNextTerm: boolean;
}

interface courseOfferingsMap {
    [key: string]: courseOffering;
}

async function getCourses(supabase: SupabaseClient, currentTerm: string, nextTerm: string): Promise<courseInfoDBResponseExplore[]> {
    let sectionsPage = 0;
    const limit = 1000;
    let hasMoreSections = true;
    let sectionsData: any[] = []; // Consider defining a more specific type for your data structure
    const courseOfferingsMap: courseOfferingsMap = {};

    // Fetch sections and map course offerings to terms
    try {
        while (hasMoreSections) {
            const { data, error } = await supabase
                .from('sections')
                .select('course_code_fk, term')
                .in('term', [currentTerm, nextTerm])
                .range(sectionsPage * limit, (sectionsPage + 1) * limit - 1);

            if (error) {
                throw new Error(error.message);
            }

            data.forEach(({ course_code_fk, term }) => {
                if (!courseOfferingsMap[course_code_fk]) {
                    courseOfferingsMap[course_code_fk] = { isOfferedThisTerm: false, isOfferedNextTerm: false };
                }

                courseOfferingsMap[course_code_fk].isOfferedThisTerm ||= term === currentTerm;
                courseOfferingsMap[course_code_fk].isOfferedNextTerm ||= term === nextTerm;
            });

            hasMoreSections = data.length === limit;
            sectionsPage++;
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
        return [];
    }

    let allCourses: courseInfoDBResponseExplore[] = [];
    let coursesPage = 0;
    let hasMoreCourses = true;

    // Fetch courses and enrich with offerings data
    try {
        while (hasMoreCourses) {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .range(coursesPage * limit, (coursesPage + 1) * limit - 1);

            if (error) {
                throw new Error(error.message);
            }

            const processedCourses: courseInfoDBResponseExplore[] = data.map(course => ({
                ...course,
                isOfferedThisTerm: courseOfferingsMap[course.course_code]?.isOfferedThisTerm || false,
                isOfferedNextTerm: courseOfferingsMap[course.course_code]?.isOfferedNextTerm || false,
                easy: course.total_reviews > 0 ? Math.round((course.easy / course.total_reviews) * 20) : null,
                useful: course.total_reviews > 0 ? Math.round((course.useful / course.total_reviews) * 20) : null,
                liked: course.total_reviews > 0 ? Math.round((course.liked / course.total_reviews) * 100) : null,
            }));

            allCourses.push(...processedCourses);
            hasMoreCourses = data.length === limit;
            coursesPage++;
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    return allCourses;
}

async function getInstructors(supabase: SupabaseClient) {
    let hasMoreSections = true;
    let sectionsPage = 0;
    const limit = 1000;
    const coursesTaughtMap = new Map();

    try {
        while (hasMoreSections) {
            const { data, error } = await supabase
                .from('sections')
                .select('course_code_fk, instructor_name_fk')
                .range(sectionsPage * limit, (sectionsPage + 1) * limit - 1);

            if (error) {
                throw new Error(error.message);
            }

            data.forEach(({ course_code_fk, instructor_name_fk }) => {
                const courses = coursesTaughtMap.get(instructor_name_fk) || new Set();
                courses.add(course_code_fk);
                coursesTaughtMap.set(instructor_name_fk, courses);
            });

            if (data.length < limit) {
                hasMoreSections = false;
            } else {
                sectionsPage++;
            }
        }
    } catch (error) {
        console.error("Failed to fetch sections:", error);
        return [];
    }

    let hasMoreInstructors = true;
    let instructorPage = 0;
    let allInstructors = [];

    try {
        while (hasMoreInstructors) {
            const { data, error } = await supabase
                .from('instructors')
                .select('*')
                .range(instructorPage * limit, (instructorPage + 1) * limit - 1);

            if (error) {
                throw new Error(error.message);
            }

            const processedInstructors = data.map(instructor => ({
                ...instructor,
                clear: instructor.total_reviews > 0 ? Math.round((instructor.clear / instructor.total_reviews) * 20) : 0,
                engaging: instructor.total_reviews > 0 ? Math.round((instructor.engaging / instructor.total_reviews) * 20) : 0,
                liked: instructor.total_reviews > 0 ? Math.round((instructor.liked / instructor.total_reviews) * 100) : 0,
                coursesTaught: Array.from(coursesTaughtMap.get(instructor.instructor_name) || [])
            }));

            allInstructors.push(...processedInstructors);

            if (data.length < limit) {
                hasMoreInstructors = false;
            } else {
                instructorPage++;
            }
        }
    } catch (error) {
        console.error("Failed to fetch instructors:", error);
        return [];
    }

    return allInstructors;
}


export default async function ExplorePage() {
    const [currentTerm, nextTerm, currentTermServer, nextTermServer] = await Promise.all([
        getCurrentTerm(true),
        getNextTerm(true),
        getCurrentTerm(false),
        getNextTerm(false),
    ]);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore)
    const user = await fetchUser();

    const [courses, instructors] = await Promise.all([
        getCourses(supabase, currentTermServer, nextTermServer),
        getInstructors(supabase),
    ]);

    return (
        <>
            <Header user={user} />
            <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
                <Body currentTerm={currentTerm} nextTerm={nextTerm} courses={courses} instructors={instructors} />
            </Suspense>
            <Footer />
        </>
    );
}