"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CourseInfo from "../CourseInfo";
import dynamic from "next/dynamic";
import CourseReviews from "../CourseReviews";
import { Suspense } from "react";
import CourseSchedule from "../CourseSchedule";
import Loading from "@/components/Loading";
import CourseRequisites from "../CourseRequisites";
const AddReview = dynamic(() => import("../AddReview"), { ssr: false });

export interface days {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export interface section {
    crn: string | undefined | null;
    type: string | undefined | null;
    section: string | undefined | null;
    campus: string | undefined | null;
    enrollment: string | undefined | null;
    enrollmentMax: string | undefined | null;
    beginTime: string | undefined | null;
    endTime: string | undefined | null;
    days: days | null;
}

async function CoursePage({ params }: { params: { code: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    let courseCode = params.code.toUpperCase();
    courseCode = courseCode.slice(0, 2) + " " + courseCode.slice(2);

    return (
        <>
            <div className="hidden lg:inline min-w-full">
                <Suspense fallback={<Loading />}>
                    <CourseInfo supabase={supabase} courseName={courseCode} />
                </Suspense>
            </div>
            <div className="card">
                <div className="lg:hidden">
                    <Suspense fallback={<Loading />}>
                        <CourseInfo supabase={supabase} courseName={courseCode} />
                    </Suspense>
                </div>
                <Suspense fallback={<Loading />}>
                    <CourseSchedule supabase={supabase} courseName={courseCode} />
                    <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                </Suspense>
                <div className="lg:flex lg:flex-row-reverse lg:justify-around">
                    <Suspense fallback={<Loading />}>
                        <CourseRequisites supabase={supabase} courseName={courseCode} />
                        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                    </Suspense>
                    <div className="lg:flex lg:flex-col lg:flex-1 lg:pr-4">
                        <Suspense fallback={<Loading />}>
                            <AddReview courseName={courseCode} />
                            <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            <CourseReviews supabase={supabase} courseName={courseCode} />
                            <hr className="mt-8 mb-8 border-0"></hr>
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CoursePage;
