import { courseReview } from '@/app/course/CourseReviews'
import { instructorReview } from '@/app/instructor/InstructorReviews'

function StarIcon({ filled }: { filled: boolean }) {
	return (
		<svg
			className={`cp-review-star ${filled ? 'cp-review-star-filled' : 'cp-review-star-empty'}`}
			xmlns='http://www.w3.org/2000/svg'
			width='16'
			height='16'
			fill='currentColor'
			viewBox='0 0 16 16'
		>
			<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
		</svg>
	)
}

function Stars({ count }: { count: number }) {
	return (
		<div className='cp-review-stars'>
			{[1, 2, 3, 4, 5].map((i) => (
				<StarIcon key={i} filled={count >= i} />
			))}
		</div>
	)
}

function ThumbIcon({ up }: { up: boolean }) {
	return up ? (
		<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M7 10v12' />
			<path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z' />
		</svg>
	) : (
		<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
			<path d='M17 14V2' />
			<path d='M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z' />
		</svg>
	)
}

export function Review({
	index,
	review
}: {
	index: number
	review: courseReview
}) {
	return (
		<div className='cp-review-card'>
			<div className='cp-review-body'>
				<p className='cp-review-text'>{review.body}</p>
				<div className='cp-review-ratings'>
					<div className='cp-review-rating-row'>
						<Stars count={review.easy} />
						<span className='cp-review-rating-label'>Easy</span>
					</div>
					<div className='cp-review-rating-row'>
						<Stars count={review.useful} />
						<span className='cp-review-rating-label'>Useful</span>
					</div>
					<div className='cp-review-liked-row'>
						<span className={`cp-review-thumb ${review.liked === 1 ? 'cp-review-thumb-active' : ''}`}>
							<ThumbIcon up={true} />
						</span>
						<span className={`cp-review-thumb ${review.liked === 0 ? 'cp-review-thumb-active' : ''}`}>
							<ThumbIcon up={false} />
						</span>
						<span className='cp-review-rating-label'>Liked</span>
					</div>
				</div>
			</div>
			<div className='cp-review-footer'>
				<p className='cp-review-meta'>
					— {review.program} student
					{review.instructor_name_fk
						? `, taught by ${review.instructor_name_fk}`
						: ''}
				</p>
			</div>
		</div>
	)
}

export function InstructorReview({
	review,
	index
}: {
	review: instructorReview
	index: any
}) {
	return (
		<div className='cp-review-card'>
			<div className='cp-review-body'>
				<p className='cp-review-text'>{review.body}</p>
				<div className='cp-review-ratings'>
					<div className='cp-review-rating-row'>
						<Stars count={review.clear} />
						<span className='cp-review-rating-label'>Clear</span>
					</div>
					<div className='cp-review-rating-row'>
						<Stars count={review.engaging} />
						<span className='cp-review-rating-label'>Engaging</span>
					</div>
					<div className='cp-review-liked-row'>
						<span className={`cp-review-thumb ${review.liked === 1 ? 'cp-review-thumb-active' : ''}`}>
							<ThumbIcon up={true} />
						</span>
						<span className={`cp-review-thumb ${review.liked === 0 ? 'cp-review-thumb-active' : ''}`}>
							<ThumbIcon up={false} />
						</span>
						<span className='cp-review-rating-label'>Liked</span>
					</div>
				</div>
			</div>
			<div className='cp-review-footer'>
				<p className='cp-review-meta'>
					— {review.program} student
				</p>
			</div>
		</div>
	)
}
