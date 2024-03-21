'use client'

import { useState } from "react"
import { instructorReview } from "./InstructorReviews"

function ReviewSection({ instructorReviews }: { instructorReviews: Record<string, instructorReview[]> }) {
    const [courseFilter, setCourseFilter] = useState<string>('All Courses')

    return (
        <div className="p-4">
            <h1 className="text-xl">Instructor Reviews</h1>

            <select
                className="mt-6 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:focus:ring-gray-600"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
            >
                <option value="All Courses">All Courses</option>
                {Object.entries(instructorReviews).map(([course, reviews]) => (
                    <option key={course} value={course}>
                        {course}
                    </option>
                ))}
            </select>

            {courseFilter === 'All Courses' ? (
                Object.entries(instructorReviews).map(([course, reviews]) => (
                    <div key={course}>
                        {reviews?.map((review: instructorReview, index: any) => (
                            <Review review={review} index={index} />
                        ))}
                    </div>
                ))
            ) : (
                instructorReviews[courseFilter]?.map((review: instructorReview, index: any) => (
                    <Review review={review} index={index} />
                ))
            )}
        </div>
    )
}

function Review({review, index}: {review: instructorReview, index: any}) {
    return (
        <div key={index} className="mt-4 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div className="p-4 md:p-5 flex flex-col lg:flex-row">
                <p className="mt-2 text-gray-500 dark:text-gray-400 flex flex-1 lg:mr-4">
                    {review.body}
                </p>

                <div className="flex flex-col pt-2 pr-2 mt-4 lg:mt-0">
                    <div className="flex flex-row">
                        <div className="flex items-center">
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 0 ? 'text-yellow-400' : 'text-gray-300'} ${review.clear > 0 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 1 ? 'text-yellow-400' : 'text-gray-300'} ${review.clear > 1 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 2 ? 'text-yellow-400' : 'text-gray-300'} ${review.clear > 2 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 3 ? 'text-yellow-400' : 'text-gray-300'} ${review.clear > 3 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 4 ? 'text-yellow-400' : 'text-gray-300'} ${review.clear > 4 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </div>
                        <p className="pl-4">Clear</p>
                    </div>
                    <div className="flex flex-row pt-2">
                        <div className="flex items-center">
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 0 ? 'text-yellow-400' : 'text-gray-300'} ${review.engaging > 0 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 1 ? 'text-yellow-400' : 'text-gray-300'} ${review.engaging > 1 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 2 ? 'text-yellow-400' : 'text-gray-300'} ${review.engaging > 2 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 3 ? 'text-yellow-400' : 'text-gray-300'} ${review.engaging > 3 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                            <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 4 ? 'text-yellow-400' : 'text-gray-300'} ${review.engaging > 4 ? 'dark:text-yellow-600' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </div>
                        <p className="pl-4">Engaging</p>
                    </div>
                    <div className="flex flex-row pt-3">
                        <button type="button" className={`py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 ${review.liked === 0 ? 'bg-gray-200' : 'bg-white'} text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${review.liked === 1 ? 'dark:bg-slate-600' : 'dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                        </button>
                        <button type="button" className={`ml-2 py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 ${review.liked === 1 ? 'bg-gray-200' : 'bg-white'} text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${review.liked === 0 ? 'dark:bg-slate-600' : 'dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                        </button>
                        <p className="pl-6">Liked</p>
                    </div>
                </div>


            </div>
            <div className="bg-gray-100 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5 dark:bg-slate-900 dark:border-gray-700">
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    — {review.program} student
                </p>
            </div>
        </div>
    )
}

export default ReviewSection