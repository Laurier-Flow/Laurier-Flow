import { SupabaseClient, User } from "@supabase/supabase-js";
import { CourseProfileReview, InstructorProfileReview } from "@/components/Review";
import { courseReview } from "../course/CourseReviews";
import { instructorReview } from "../instructor/InstructorReviews";

export interface profileReviews {
    courseReviews: courseReview[]
    instructorReviews: instructorReview[]
}

async function getUserReviews(supabase: SupabaseClient<any, "public", any>, user: User | null) {
    const { data: userCourseReview, error: courseError } = await supabase
        .from('course_reviews')
        .select()
        .eq('user_id_fk', user?.id)

    const { data: userInstructorReview, error: instructorError } = await supabase
        .from('instructor_reviews')
        .select()
        .eq('user_id_fk', user?.id)

    const courseReviews: courseReview[] = userCourseReview as courseReview[];
    const instructorReviews: instructorReview[] = userInstructorReview as instructorReview[];

    return {
        courseReviews: courseReviews || [],
        instructorReviews: instructorReviews || []
    }
}

export default async function UserReviews({ user, supabase }: { user: User | null, supabase: SupabaseClient<any, "public", any> }) {
    const userReviews = await getUserReviews(supabase, user)
    console.log(userReviews)

    return (
        <div className="card">
            <div className="p-4">
                <h2 className="pt-4 text-xl py-2 font-semibold">Your Reviews</h2>
                <h2 className="pt-4 text-md py-2 font-semibold">Course Reviews</h2>
                {userReviews.courseReviews.map((review: courseReview, index: any) => {
                    return (
                        <CourseProfileReview review={review} index={index} />
                    )
                })}
                <hr className="mb-8 md:mb-0 mt-8 border-gray-300 dark:border-gray-800"></hr>
                <h2 className="pt-4 text-md py-2 font-semibold">Instructor Reviews</h2>
                {userReviews.instructorReviews.map((review: instructorReview, index: any) => {
                    return (
                        <InstructorProfileReview review={review} index={index} />
                    )
                })}
            </div>
        </div>
    )
}