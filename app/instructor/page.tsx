import Loading from "@/components/Loading";
import { Suspense } from "react";
import InstructorInfo from "./InstructorInfo";
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import InstructorReviews from "./InstructorReviews";
import InstructorSchedule from "./InstructorSchedule";
import AddReview from "../course/AddReview";

function InstructorPage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    return (
        <div className="flex flex-col justify-evenly w-full bg-slate-50 dark:bg-slate-950 lg:max-w-6xl lg:border-x-2 dark:lg:border-slate-900 lg:pl-6 lg:pr-6">
            <Suspense fallback={<Loading />}>
                <InstructorInfo supabase={supabase} />
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
            </Suspense>
            <Suspense fallback={<Loading />}>
                <InstructorSchedule supabase={supabase} />
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
            </Suspense>
            <Suspense fallback={<Loading />}>
                <AddReview courseName='Kenneth Jackson' />
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
            </Suspense>
            <Suspense fallback={<Loading />}>
                <InstructorReviews supabase={supabase} />
                <hr className="mt-8 mb-8 border-0"></hr>
            </Suspense>
        </div>
    )
}

export default InstructorPage;