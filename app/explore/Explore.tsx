import { Suspense } from "react";
import { getTerms } from "../course/getTerms";
import Body from "./body";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore",
    description: "Explore courses at Wilfrid Laurier University",
}


export interface courseInfoDBResponseExplore {
    course_code: string,
    total_reviews: number,
    easy: number,
    useful: number,
    liked: number,
    course_title: string,
    isOfferedSpringTerm: boolean,
    isOfferedFallTerm: boolean
    isOfferedWinterTerm: boolean
    isOfferedNextSpringTerm: boolean
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
    isOfferedSpringTerm: boolean,
    isOfferedFallTerm: boolean
    isOfferedWinterTerm: boolean
    isOfferedNextSpringTerm: boolean
}

interface courseOfferingsMap {
    [key: string]: courseOffering;
}

export function ExploreSkeleton() {
    const rowWidths = [72, 85, 68, 90, 62, 78, 55, 80, 70, 65, 88, 74]
    return (
        <div>
            {/* Page header */}
            <div style={{ padding: '80px 60px 48px' }}>
                <div className='cp-skel' style={{ height: 42, width: 400, marginBottom: 16, borderRadius: 8 }} />
                <div className='cp-skel' style={{ height: 14, width: 240, borderRadius: 4 }} />
            </div>

            {/* Grid: sidebar + main */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', padding: '0 60px 80px' }}>
                {/* Sidebar */}
                <div style={{ paddingRight: 32, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                    {/* Year pills */}
                    <div style={{ marginBottom: 32 }}>
                        <div className='cp-skel' style={{ height: 11, width: 80, marginBottom: 14, borderRadius: 3 }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {[38, 38, 38, 38, 46].map((w, i) => (
                                <div key={i} className='cp-skel' style={{ height: 28, width: w, borderRadius: 20 }} />
                            ))}
                        </div>
                    </div>
                    {/* Ratings slider */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div className='cp-skel' style={{ height: 11, width: 110, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 11, width: 70, borderRadius: 3 }} />
                        </div>
                        <div className='cp-skel' style={{ height: 4, width: '100%', borderRadius: 4 }} />
                    </div>
                    {/* Offered in checkboxes */}
                    <div style={{ marginBottom: 32 }}>
                        <div className='cp-skel' style={{ height: 11, width: 65, marginBottom: 14, borderRadius: 3 }} />
                        {[80, 90, 85, 100, 88].map((w, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div className='cp-skel' style={{ width: 16, height: 16, borderRadius: 3, flexShrink: 0 }} />
                                <div className='cp-skel' style={{ height: 13, width: w, borderRadius: 3 }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main */}
                <div style={{ paddingLeft: 40 }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 32, paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className='cp-skel' style={{ height: 20, width: 85, borderRadius: 4 }} />
                        <div className='cp-skel' style={{ height: 20, width: 105, borderRadius: 4 }} />
                    </div>
                    {/* Table header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 72px 72px 72px 72px', gap: 16, paddingBottom: 12, marginBottom: 4 }}>
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <div key={i} className='cp-skel' style={{ height: 11, borderRadius: 3 }} />
                        ))}
                    </div>
                    {/* Table rows */}
                    {rowWidths.map((w, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 72px 72px 72px 72px', gap: 16, height: 52, alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className='cp-skel' style={{ height: 14, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 14, width: `${w}%`, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 14, width: 28, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 14, width: 36, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 14, width: 32, borderRadius: 3 }} />
                            <div className='cp-skel' style={{ height: 14, width: 34, borderRadius: 3 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

async function getAllSections(supabase: SupabaseClient): Promise<any[]> {
    const limit = 1000;
    let page = 0;
    let allSections: any[] = [];
    let hasMore = true;

    try {
        while (hasMore) {
            const { data, error } = await supabase
                .from('sections')
                .select('course_code_fk, term, instructor_name_fk')
                .range(page * limit, (page + 1) * limit - 1);

            if (error) throw new Error(error.message);
            allSections.push(...data);
            hasMore = data.length === limit;
            page++;
        }
    } catch (error) {
        console.error("Error fetching sections:", error);
    }

    return allSections;
}

async function getCourses(supabase: SupabaseClient, sections: any[], springTerm: string, fallTerm: string, winterTerm: string, nextSpringTerm: string): Promise<courseInfoDBResponseExplore[]> {
    const courseOfferingsMap: courseOfferingsMap = {};

    sections.forEach(({ course_code_fk, term }) => {
        if (!courseOfferingsMap[course_code_fk]) {
            courseOfferingsMap[course_code_fk] = { isOfferedSpringTerm: false, isOfferedFallTerm: false, isOfferedWinterTerm: false, isOfferedNextSpringTerm: false };
        }
        courseOfferingsMap[course_code_fk].isOfferedSpringTerm ||= term === springTerm;
        courseOfferingsMap[course_code_fk].isOfferedFallTerm ||= term === fallTerm;
        courseOfferingsMap[course_code_fk].isOfferedWinterTerm ||= term === winterTerm;
        courseOfferingsMap[course_code_fk].isOfferedNextSpringTerm ||= term === nextSpringTerm;
    });

    let allCourses: courseInfoDBResponseExplore[] = [];
    let coursesPage = 0;
    let hasMoreCourses = true;
    const limit = 1000;

    try {
        while (hasMoreCourses) {
            const { data, error } = await supabase
                .from('courses')
                .select('course_code, total_reviews, easy, useful, liked, course_title, leads_to, year, course_number, course_prefix, is_uwaterloo_course, course_description')
                .range(coursesPage * limit, (coursesPage + 1) * limit - 1);

            if (error) throw new Error(error.message);

            const processedCourses: any = data.map(course => ({
                ...course,
                isOfferedSpringTerm: courseOfferingsMap[course.course_code]?.isOfferedSpringTerm || false,
                isOfferedFallTerm: courseOfferingsMap[course.course_code]?.isOfferedFallTerm || false,
                isOfferedWinterTerm: courseOfferingsMap[course.course_code]?.isOfferedWinterTerm || false,
                isOfferedNextSpringTerm: courseOfferingsMap[course.course_code]?.isOfferedNextSpringTerm || false,
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

async function getInstructors(supabase: SupabaseClient, sections: any[]) {
    const coursesTaughtMap = new Map();

    sections.forEach(({ course_code_fk, instructor_name_fk }) => {
        const courses = coursesTaughtMap.get(instructor_name_fk) || new Set();
        courses.add(course_code_fk);
        coursesTaughtMap.set(instructor_name_fk, courses);
    });

    let hasMoreInstructors = true;
    let instructorPage = 0;
    let allInstructors = [];
    const limit = 1000;

    try {
        while (hasMoreInstructors) {
            const { data, error } = await supabase
                .from('instructors')
                .select('*')
                .range(instructorPage * limit, (instructorPage + 1) * limit - 1);

            if (error) throw new Error(error.message);

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

export default async function Explore() {
    const prettyTerms = getTerms(true);
    const dataTerms = getTerms(false);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore)

    const sections = await getAllSections(supabase);

    const [courses, instructors] = await Promise.all([
        getCourses(supabase, sections, dataTerms.springTerm, dataTerms.fallTerm, dataTerms.winterTerm, dataTerms.nextSpringTerm),
        getInstructors(supabase, sections),
    ]);

    return (
        <Suspense fallback={<ExploreSkeleton />}>
            <Body springTerm={prettyTerms.springTerm} fallTerm={prettyTerms.fallTerm} winterTerm={prettyTerms.winterTerm} nextSpringTerm={prettyTerms.nextSpringTerm} courses={courses} instructors={instructors} />
        </Suspense>
    )
}
