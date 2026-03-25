'use client'

import { Review } from '@/components/Review'
import { courseReview } from './CourseReviews'
import { useEffect, useRef, useState } from 'react'

export default function CourseReviewsDisplay({
	courseReviews,
	hasReviewsWithBody
}: {
	courseReviews: courseReview[] | undefined
	hasReviewsWithBody: boolean
}) {
	const itemsPerPage = 20
	const [visibleReviewCount, setVisibleReviewCount] = useState(itemsPerPage)
	const reviewLoaderRef = useRef(null)

	useEffect(() => {
		const currentLoader = reviewLoaderRef.current

		const observer = new IntersectionObserver(
			(entries) => {
				const firstEntry = entries[0]
				if (firstEntry.isIntersecting) {
					if (courseReviews) {
						setVisibleReviewCount((prevCount) =>
							Math.min(courseReviews.length, prevCount + itemsPerPage)
						)
					}
				}
			},
			{ threshold: 0.1, rootMargin: '200px' }
		)

		if (currentLoader) {
			observer.observe(currentLoader)
		}

		return () => observer.disconnect()
	}, [])

	return (
		<div>
			<h2 className='cp-section-label'>Reviews</h2>
			{courseReviews?.length != 0 && hasReviewsWithBody ? (
				<div className='cp-reviews-list'>
					{courseReviews
						?.slice(0, visibleReviewCount)
						.map((review: courseReview, index: any) =>
							review.body && review.body != '' ? (
								<Review key={review.id} review={review} index={index} />
							) : null
						)}
				</div>
			) : (
				<p className='cp-no-reviews'>No Reviews With Body Yet</p>
			)}
			<div ref={reviewLoaderRef} style={{ height: '20px' }}></div>
		</div>
	)
}
