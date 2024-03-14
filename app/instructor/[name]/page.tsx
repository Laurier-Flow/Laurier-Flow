import { Suspense } from "react";
import InstructorInfo from "../InstructorInfo";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import InstructorReviews from "../InstructorReviews";
import InstructorSchedule from "../InstructorSchedule";
import AddReview from "@/app/course/AddReview";
import Spinner from "@/components/Spinner";

function InstructorPage({params} : {params: {name: string}}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const decodedName = decodeURIComponent(params.name)

  return (
    <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <div className="hidden lg:inline min-w-full">
                    <InstructorInfo supabase={supabase} instructorName={decodedName} />
            </div>
            <div className="card">
                <div className="lg:hidden">
                        <InstructorInfo supabase={supabase} instructorName={decodedName} />
                </div>
                    <InstructorSchedule supabase={supabase} instructorName={decodedName} />
                    <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                    <div className="lg:flex lg:flex-col lg:flex-1 lg:pr-4">
                            <AddReview courseName={decodedName} supabase={supabase} instructor={true} />
                            <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
                            <InstructorReviews supabase={supabase} instructorName={decodedName} />
                            <hr className="mt-8 mb-8 border-0"></hr>
                    </div>
            </div>
        </Suspense>
  );
}

export default InstructorPage;
