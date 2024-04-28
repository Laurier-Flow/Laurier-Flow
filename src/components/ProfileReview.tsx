'use client'

import { courseReview } from "@/app/course/CourseReviews"
import { useManageBodyScroll } from "./Header"
import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { instructorReview } from "@/app/instructor/InstructorReviews"
import DeleteReviewPopup from "./DeleteReviewPopup"
import EditReviewPopup from "./EditReviewPopup"

export function CourseProfileReview({
    index,
    review,
    instructors
}: {
    index: number,
    review: courseReview,
    instructors: Set<string>
}) {
    const [showDeleteReviewPopup, setShowDeleteReviewPopup] = useState<boolean>(false)
    const [showEditReviewPopup, setShowEditReviewPopup] = useState<boolean>(false)

    const toggleDeleteReviewPopup = () => {
        setShowDeleteReviewPopup(!showDeleteReviewPopup)
    }

    const toggleEditReviewPopup = () => {
        setShowEditReviewPopup(!showEditReviewPopup)
    }

    useManageBodyScroll(showDeleteReviewPopup || showEditReviewPopup)

    return (
        <>
            <div key={index} className="mt-4 flex flex-col bg-slate-50 border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="items-center flex flex-row justify-between bg-gray-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-slate-900 dark:border-gray-700">
                    <p className="mt-1 font-medium text-xl text-gray-700 dark:text-gray-300">
                        {review.course_code_fk}
                    </p>
                    <div className="inline-flex rounded-lg shadow-sm">
                        <button onClick={toggleEditReviewPopup} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                            <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={toggleDeleteReviewPopup} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-red-500 text-white shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-red-800 dark:border-neutral-700 dark:text-white">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 md:p-5 flex flex-col lg:flex-row">
                    <p className="mt-2 text-gray-500 dark:text-gray-400 flex flex-1 lg:mr-4">
                        {review.body}
                    </p>

                    <div className="flex flex-col pt-2 pr-2 mt-4 lg:mt-0">
                        <div className="flex flex-row">
                            <div className="flex items-center">
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 0 ? 'text-secondary' : 'text-gray-300'} ${review.easy > 0 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 1 ? 'text-secondary' : 'text-gray-300'} ${review.easy > 1 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 2 ? 'text-secondary' : 'text-gray-300'} ${review.easy > 2 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 3 ? 'text-secondary' : 'text-gray-300'} ${review.easy > 3 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.easy > 4 ? 'text-secondary' : 'text-gray-300'} ${review.easy > 4 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                            </div>
                            <p className="pl-4">Easy</p>
                        </div>
                        <div className="flex flex-row pt-2">
                            <div className="flex items-center">
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 0 ? 'text-secondary' : 'text-gray-300'} ${review.useful > 0 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 1 ? 'text-secondary' : 'text-gray-300'} ${review.useful > 1 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 2 ? 'text-secondary' : 'text-gray-300'} ${review.useful > 2 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 3 ? 'text-secondary' : 'text-gray-300'} ${review.useful > 3 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.useful > 4 ? 'text-secondary' : 'text-gray-300'} ${review.useful > 4 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                            </div>
                            <p className="pl-4">Useful</p>
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
                        — Reviewed on {review.created_at}
                    </p>
                </div>
            </div>
            {showDeleteReviewPopup ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <DeleteReviewPopup reviewId={review.id} onClose={toggleDeleteReviewPopup} instructor={false} />
                </div>
            ) : (
                null
            )}
            {showEditReviewPopup ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <EditReviewPopup instructorSelected={review.instructor_name_fk} id={review.id} instructors={instructors} courseName={review.course_code_fk} isInstructor={false} easyRating={review.easy} usefulRating={review.useful} likedRating={review.liked} textBody={review.body} onClose={toggleEditReviewPopup} />
                </div>
            ) : (
                null
            )}
        </>
    )
}

export function InstructorProfileReview({
    index,
    review,
    courses
}: {
    index: number,
    review: instructorReview,
    courses: Set<string>
}) {
    const [showDeleteReviewPopup, setShowDeleteReviewPopup] = useState<boolean>(false)
    const [showEditReviewPopup, setShowEditReviewPopup] = useState<boolean>(false)

    const toggleDeleteReviewPopup = () => {
        setShowDeleteReviewPopup(!showDeleteReviewPopup)
    }

    const toggleEditReviewPopup = () => {
        setShowEditReviewPopup(!showEditReviewPopup)
    }

    useManageBodyScroll(showDeleteReviewPopup || showEditReviewPopup)

    return (
        <>
            <div key={index} className="mt-4 flex flex-col bg-slate-50 border shadow-sm rounded-xl dark:bg-slate-900 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                <div className="items-center flex flex-row justify-between bg-gray-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5 dark:bg-slate-900 dark:border-gray-700">
                    <p className="mt-1 font-medium text-xl text-gray-700 dark:text-gray-300">
                        {review.instructor_name_fk}
                    </p>
                    <div className="inline-flex rounded-lg shadow-sm">
                        <button onClick={toggleEditReviewPopup} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                            <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={toggleDeleteReviewPopup} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-red-500 text-white shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-red-800 dark:border-neutral-700 dark:text-white">
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="p-4 md:p-5 flex flex-col lg:flex-row">
                    <p className="mt-2 text-gray-500 dark:text-gray-400 flex flex-1 lg:mr-4">
                        {review.body}
                    </p>

                    <div className="flex flex-col pt-2 pr-2 mt-4 lg:mt-0">
                        <div className="flex flex-row">
                            <div className="flex items-center">
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 0 ? 'text-secondary' : 'text-gray-300'} ${review.clear > 0 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 1 ? 'text-secondary' : 'text-gray-300'} ${review.clear > 1 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 2 ? 'text-secondary' : 'text-gray-300'} ${review.clear > 2 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 3 ? 'text-secondary' : 'text-gray-300'} ${review.clear > 3 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.clear > 4 ? 'text-secondary' : 'text-gray-300'} ${review.clear > 4 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                            </div>
                            <p className="pl-4">Clear</p>
                        </div>
                        <div className="flex flex-row pt-2">
                            <div className="flex items-center">
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 0 ? 'text-secondary' : 'text-gray-300'} ${review.engaging > 0 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 1 ? 'text-secondary' : 'text-gray-300'} ${review.engaging > 1 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 2 ? 'text-secondary' : 'text-gray-300'} ${review.engaging > 2 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 3 ? 'text-secondary' : 'text-gray-300'} ${review.engaging > 3 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                </svg>
                                <svg className={`flex-shrink-0 w-5 h-5 ${review.engaging > 4 ? 'text-secondary' : 'text-gray-300'} ${review.engaging > 4 ? 'dark:text-secondary' : 'dark:text-gray-600'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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
                        — Reviewed on {review.created_at}
                    </p>
                </div>
            </div>
            {showDeleteReviewPopup ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <DeleteReviewPopup instructor={true} reviewId={review.id} onClose={toggleDeleteReviewPopup} />
                </div>
            ) : (
                null
            )}
            {showEditReviewPopup ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <EditReviewPopup instructorSelected={review.course_code_fk} id={review.id} instructors={courses} courseName={review.instructor_name_fk} isInstructor={true} easyRating={review.clear} usefulRating={review.engaging} likedRating={review.liked} textBody={review.body} onClose={toggleEditReviewPopup} />
                </div>
            ) : (
                null
            )}
        </>
    )
}