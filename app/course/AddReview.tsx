import { User } from '@supabase/supabase-js';
import LoginPopup from "@/components/LoginPopup";
import SignUpPopup from "@/components/SignUpPopup";
import { fetchUser } from '@/utils/supabase/authActions';
import { SupabaseClient } from '@supabase/supabase-js';
import ReviewButton from '@/components/ReviewButton';

const getUser = async () => {
    const user = await fetchUser();
    if (user) {
        return user
    } else {
        return null
    }
}

/*
export async function getCourseData(supabase: SupabaseClient<any, "public", any>, courseName: string) {
    const { data, error } = await supabase
      .from('courses')
      .select()
      .eq('course_code', courseName)
  
    return data || [];
  }
  */


const userReviewed = async (supabase: SupabaseClient<any, "public", any>, courseName: string, instructor: boolean, user: User | null) => {
    const tableName = (instructor ? ('instructor_reviews') : ('course_reviews'))
    const fkName = (instructor ? ('instructor_fk') : ('course_code_fk'))

    if (user) {
        const { data, error } = await supabase
            .from(tableName)
            .select()
            .eq('user_id_fk', user.id)
            .eq(fkName, courseName)

        if (data?.length === 0) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

async function AddReview({
    supabase,
    courseName,
    instructor
}: {
    supabase: SupabaseClient<any, "public", any>,
    courseName: string,
    instructor: boolean
}) {
    const user = await fetchUser();
    const reviewed = await userReviewed(supabase, courseName, instructor, user);

    return (
        reviewed ? null : (
            <>
                <div className="flex flex-col p-4">
                    <h1 className="pb-4 text-xl">What do you think of {courseName}?</h1>
                    <ReviewButton user={user} />
                </div>
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
            </>
        )
    );
}

export default AddReview;