"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CourseInfo from "../CourseInfo";
import dynamic from "next/dynamic";
import CourseReviews from "../CourseReviews";
import { Suspense } from "react";
import CourseSchedule from "../CourseSchedule";
import CourseRequisites from "../CourseRequisites";
import Spinner from "@/components/Spinner";
import Header from "@/components/Header";
import { fetchUser } from "@/utils/supabase/authActions";
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
    let courseCode = decodeURIComponent(params.code.toUpperCase())
    const user = await fetchUser();

    return (
        <>
            <Header user={user} />
            <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
                <div className="hidden lg:inline min-w-full">
                    <CourseInfo supabase={supabase} courseName={courseCode} />
                </div>
                <div className="card">
                    <div className="lg:hidden">
                        <CourseInfo supabase={supabase} courseName={courseCode} />
                    </div>
                    <CourseSchedule supabase={supabase} courseName={courseCode} user={user} />
                    <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                    <div className="lg:flex lg:flex-row-reverse lg:justify-around">
                        <CourseRequisites supabase={supabase} courseName={courseCode} />
                        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                        <div className="lg:flex lg:flex-col lg:flex-1 lg:pr-4">
                            <AddReview courseName={courseCode} supabase={supabase} instructor={false} />
                            <CourseReviews supabase={supabase} courseName={courseCode} />
                            <hr className="mt-8 mb-8 border-0"></hr>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
}

export default CoursePage;
