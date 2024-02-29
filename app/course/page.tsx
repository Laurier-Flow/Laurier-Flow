"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CourseInfo from "./CourseInfo";
import dynamic from "next/dynamic";
import CourseReviews from "./CourseReviews";
import { Suspense } from "react";
import CourseSchedule from "./CourseSchedule";
import Loading from "@/components/Loading";
const AddReview = dynamic(() => import("./AddReview"), { ssr: false });

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

async function CoursePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return (
    <div className="card">
      <Suspense fallback={<Loading />}>
        <CourseInfo supabase={supabase} />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CourseSchedule supabase={supabase} />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <AddReview courseName="BU 283" />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CourseReviews supabase={supabase} />
        <hr className="mt-8 mb-8 border-0"></hr>
      </Suspense>
    </div>
  );
}

export default CoursePage;
