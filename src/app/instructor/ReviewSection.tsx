'use client'

import { useState } from "react"
import { instructorReview } from "./InstructorReviews"
import { InstructorReview } from "@/components/Review"

function ReviewSection({ instructorReviews }: { instructorReviews: Record<string, instructorReview[]> }) {
    const [courseFilter, setCourseFilter] = useState<string>('All Courses')

    return (
        <div className="p-4">
            <h1 className="text-xl">Instructor Reviews</h1>

            <select
                className="mt-6 py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-slate-50 dark:bg-slate-900 dark:border-gray-700 text-gray-500 dark:text-gray-400 dark:focus:ring-gray-600"
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
                            <InstructorReview review={review} index={index} />
                        ))}
                    </div>
                ))
            ) : (
                instructorReviews[courseFilter]?.map((review: instructorReview, index: any) => (
                    <InstructorReview review={review} index={index} />
                ))
            )}
        </div>
    )
}

export default ReviewSection