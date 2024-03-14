import { User } from '@supabase/supabase-js';
import LoginPopup from "@/components/LoginPopup";
import SignUpPopup from "@/components/SignUpPopup";
import { fetchUser } from '@/utils/supabase/authActions';
import { SupabaseClient } from '@supabase/supabase-js';

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


const userReviewed = async (supabase: SupabaseClient<any, "public", any>, courseName: string, instructor: boolean) => {
    const user = await fetchUser();
    const table = (instructor ? ('instructor_reviews') : ('course_reviews'))

    if (user) {
        const { data, error } = await supabase
            .from(table)
            .select()
            .eq('user_id_fk', user.id)
            .eq('course_code_fk', courseName)

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
    const reviewed = await userReviewed(supabase, courseName, instructor);

    return (
        reviewed ? null : (
            <>
                <div className="flex flex-col p-4">
                    <h1 className="pb-4 text-xl">What do you think of {courseName}?</h1>
                    <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent dark:bg-primary bg-amber-400 dark:text-white hover:bg-amber-700 hover:dark:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Add your review
                    </button>
                </div>
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>
            </>
        )
    );
}

export default AddReview;