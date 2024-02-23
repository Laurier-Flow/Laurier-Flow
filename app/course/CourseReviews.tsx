import { SupabaseClient } from "@supabase/supabase-js";

interface courseReview {
    createdAt: string,
    easy: number,
    useful: number,
    liked: number,
    instructor: string,
    program: string,
    body: string
}

async function getCourseReviews(supabase: SupabaseClient<any, "public", any>) {
    try {
        const { data, error } = await supabase
            .from('course_reviews')
            .select()
            .eq('course_code_fk', 'BU 283')

        let reviews = []

        if (data !== null && data !== undefined) {
            for (const s of data) {
                const createdAt = s.created_at;
                const easy = s.easy;
                const useful = s.useful;
                const liked = s.liked;
                const instructor = s.instructor;
                const body = s.body;

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
                    };

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
    supabase
}: {
    supabase: SupabaseClient<any, "public", any>
}) {
    const courseReviews: courseReview[] | undefined = await getCourseReviews(supabase);

    return (
        <div className="p-4">
            <h1 className="text-xl">Course Reviews</h1>
            {courseReviews?.map((review: courseReview, index: any) => (
                <div key={index} className="mt-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                    <div className="p-4 md:p-5 flex flex-row">
                        <p className="mt-2 text-gray-500 dark:text-gray-400 flex flex-1">
                            {review.body}
                        </p>

                        <div className="flex flex-col pt-2 pr-2">
                            <div className="flex flex-row">
                                <div className="flex items-center">
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 0 ? 'text-yellow-400' : 'text-gray-300'} ${review.easy > 0 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 1 ? 'text-yellow-400' : 'text-gray-300'} ${review.easy > 1 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 2 ? 'text-yellow-400' : 'text-gray-300'} ${review.easy > 2 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 3 ? 'text-yellow-400' : 'text-gray-300'} ${review.easy > 3 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 4 ? 'text-yellow-400' : 'text-gray-300'} ${review.easy > 4 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                </div>
                                <p className="pl-4">Easy</p>
                            </div>
                            <div className="flex flex-row pt-2">
                                <div className="flex items-center">
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 0 ? 'text-yellow-400' : 'text-gray-300'} ${review.useful > 0 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 1 ? 'text-yellow-400' : 'text-gray-300'} ${review.useful > 1 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 2 ? 'text-yellow-400' : 'text-gray-300'} ${review.useful > 2 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 3 ? 'text-yellow-400' : 'text-gray-300'} ${review.useful > 3 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                    <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 4 ? 'text-yellow-400' : 'text-gray-300'} ${review.useful > 4 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                    </svg>
                                </div>
                                <p className="pl-4">Useful</p>
                            </div>
                            <div className="flex flex-row pt-3">
                                <button type="button" className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 ${review.liked === 1 ? 'bg-gray-100' : 'bg-white'} text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${review.liked === 1 ? 'dark:bg-slate-600' : 'dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                                    <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                </button>
                                <button type="button" className={`ml-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 ${review.liked === 1 ? 'bg-gray-100' : 'bg-white'} text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${review.liked === 0 ? 'dark:bg-slate-600' : 'dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                                    <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                                </button>
                                <p className="pl-6">Liked</p>
                            </div>
                        </div>


                    </div>
                    <div className="bg-gray-100 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-slate-900 dark:border-gray-700">
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                            — {review.program} student {review.instructor ? `, taught by ${review.instructor}` : ''}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}