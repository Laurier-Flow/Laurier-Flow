import Review from "@/components/Review";
import { SupabaseClient } from "@supabase/supabase-js";

export interface courseReview {
    createdAt: string,
    easy: number,
    useful: number,
    liked: number,
    instructor: string,
    program: string,
    body: string
}

async function getCourseReviews(supabase: SupabaseClient<any, "public", any>, courseName: string) {
    try {
        const { data, error } = await supabase
            .from('course_reviews')
            .select()
            .eq('course_code_fk', courseName)

        let reviews = []

        if (data !== null && data !== undefined) {
            for (const s of data) {
                const createdAt = s.created_at
                const easy = s.easy
                const useful = s.useful
                const liked = s.liked
                const instructor = s.instructor_name_fk
                const body = s.body

                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select()
                        .eq('user_id', s.user_id_fk);

                    let userData = null;

                    if (data !== null && data !== undefined && data.length > 0) {
                        userData = data[0].program;
                    }

                    const review = {
                        createdAt: createdAt,
                        easy: easy,
                        useful: useful,
                        liked: liked,
                        instructor: instructor,
                        program: userData,
                        body: body
                    }

                    reviews.push(review);

                } catch (error) {
                    console.error(error);
                }
            }

            return reviews || [];
        }
    } catch (error) {
        console.error(error);
        return []
    }
}

export default async function CourseReviews({
    supabase,
    courseName
}: {
    supabase: SupabaseClient<any, "public", any>,
    courseName: string
}) {
    const courseReviews: courseReview[] | undefined = await getCourseReviews(supabase, courseName);

    return (
        <div className="p-4">
            <h1 className="text-xl">Course Reviews</h1>
            {courseReviews?.length != 0 ? (
                courseReviews?.map((review: courseReview, index: any) => (
                    (((review.body) && (review.body != '')) ? (index === 0 ? (
                        <Review review={review} index={index} />
                    ) : (
                        <div className="pt-4">
                            <Review review={review} index={index} />
                        </div>
                    )
                    ) : null)
                ))) : (<p className="mt-4 whitespace-nowrap text-md text-gray-800 dark:text-gray-200">No Reviews Yet</p>)}
        </div>
    );
}