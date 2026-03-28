'use client'

import { useState } from 'react'
import { instructorReview } from './InstructorReviews'
import { InstructorReview } from '@/components/Review'

function ReviewSection({
	instructorReviews
}: {
	instructorReviews: Record<string, instructorReview[]>
}) {
	const [courseFilter, setCourseFilter] = useState<string>('All Courses')

	return (
		<div>
			<h2 className='cp-section-label'>Reviews</h2>

			<select
				className='cp-review-filter'
				value={courseFilter}
				onChange={(e) => setCourseFilter(e.target.value)}
			>
				<option value='All Courses'>All Courses</option>
				{Object.entries(instructorReviews).map(([course, reviews]) => (
					<option key={course} value={course}>
						{course}
					</option>
				))}
			</select>

			<div className='cp-reviews-list' style={{ marginTop: '20px' }}>
				{courseFilter === 'All Courses'
					? Object.entries(instructorReviews).flatMap(([course, reviews]) =>
							reviews?.map((review: instructorReview, index: any) => (
								<InstructorReview key={review.id || `${course}-${index}`} review={review} index={index} />
							))
						)
					: instructorReviews[courseFilter]?.map(
							(review: instructorReview, index: any) => (
								<InstructorReview key={review.id || index} review={review} index={index} />
							)
						)}
			</div>
		</div>
	)
}

export default ReviewSection
