import { SupabaseClient } from "@supabase/supabase-js"
import ReviewSection from "./ReviewSection"

export interface instructorReview {
    createdAt: string,
    clear: number,
    engaging: number,
    liked: number,
    course: string,
    program: string,
    body: string
}

async function getInstructorReviews(supabase: SupabaseClient<any, "public", any>, instructorName: string) {
    try {
        const { data, error } = await supabase
            .from('instructor_reviews')
            .select()
            .eq('instructor_name_fk', instructorName)

        let reviews: Record<string, instructorReview[]> = {}

        if (data !== null && data !== undefined) {
            for (const s of data) {
                const createdAt = s.created_at
                const clear = s.clear
                const engaging = s.engaging
                const liked = s.liked
                const course = s.course_code_fk
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

                    const review: instructorReview = {
                        createdAt: createdAt,
                        clear: clear,
                        engaging: engaging,
                        liked: liked,
                        course: course,
                        program: userData,
                        body: body
                    }

                    if (course in reviews) {
                        reviews[course].push(review)
                    } else {
                        reviews[course] = [review]
                    }
                } catch (error) {
                    console.error(error)
                }
            }

            return reviews
        } else {
            return {};
        }
    } catch (error) {
        console.error(error)
        return {}
    }
}

export default async function InstructorReviews({
    supabase,
    instructorName
}: {
    supabase: SupabaseClient<any, "public", any>,
    instructorName: string
}) {
    const instructorReviews: Record<string, instructorReview[]> = await getInstructorReviews(supabase, instructorName);

    return (
        <ReviewSection instructorReviews={instructorReviews} />
    )
}