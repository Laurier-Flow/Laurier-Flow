import Loading from "@/components/Loading";
import { Suspense } from "react";
import InstructorInfo from "./InstructorInfo";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import InstructorReviews from "./InstructorReviews";
import InstructorSchedule from "./InstructorSchedule";
import AddReview from "../course/AddReview";

function InstructorPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  return (
    <div className="card">
      <Suspense fallback={<Loading />}>
        <InstructorInfo supabase={supabase} />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <InstructorSchedule supabase={supabase} />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <AddReview courseName="Kenneth Jackson" />
        <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
      </Suspense>
      <Suspense fallback={<Loading />}>
        <InstructorReviews supabase={supabase} />
        <hr className="mt-8 mb-8 border-0"></hr>
      </Suspense>
    </div>
  );
}

export default InstructorPage;
