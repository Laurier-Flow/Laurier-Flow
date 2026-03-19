'use client'

import { courseReview } from '@/app/course/CourseReviews'
import { useManageBodyScroll } from './Header'
import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { instructorReview } from '@/app/instructor/InstructorReviews'
import DeleteReviewPopup from './DeleteReviewPopup'
import EditReviewPopup from './EditReviewPopup'

function StarRating({ rating, label }: { rating: number; label: string }) {
	return (
		<div className='pf-rating-group'>
			<div className='pf-rating-stars'>
				{[1, 2, 3, 4, 5].map((i) => (
					<svg
						key={i}
						className={rating >= i ? 'star-active' : 'star-inactive'}
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						fill='currentColor'
						viewBox='0 0 16 16'
					>
						<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
					</svg>
				))}
			</div>
			<span className='pf-rating-label'>{label}</span>
		</div>
	)
}

function LikedDisplay({ liked }: { liked: number }) {
	return (
		<div className='pf-review-liked'>
			<div className={`pf-like-btn ${liked === 0 ? 'active' : ''}`}>
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M7 10v12' />
					<path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z' />
				</svg>
			</div>
			<div className={`pf-like-btn ${liked === 1 ? 'active' : ''}`}>
				<svg
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M17 14V2' />
					<path d='M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z' />
				</svg>
			</div>
			<span className='pf-rating-label'>Liked</span>
		</div>
	)
}

export function CourseProfileReview({
	index,
	review,
	instructors
}: {
	index: number
	review: courseReview
	instructors: Set<string>
}) {
	const [showDeleteReviewPopup, setShowDeleteReviewPopup] =
		useState<boolean>(false)
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
			<div key={index} className='pf-review-card'>
				<div className='pf-review-header'>
					<span className='pf-review-title'>{review.course_code_fk}</span>
					<div className='pf-review-actions'>
						<button
							onClick={toggleEditReviewPopup}
							type='button'
							className='pf-review-action-btn'
						>
							<Edit className='h-4 w-4' />
						</button>
						<button
							onClick={toggleDeleteReviewPopup}
							type='button'
							className='pf-review-action-btn pf-delete'
						>
							<Trash2 className='h-4 w-4' />
						</button>
					</div>
				</div>
				<div className='pf-review-body'>
					<p className='pf-review-text'>{review.body}</p>
					<div className='pf-review-ratings'>
						<StarRating rating={review.easy} label='Easy' />
						<StarRating rating={review.useful} label='Useful' />
						<LikedDisplay liked={review.liked} />
					</div>
				</div>
				<div className='pf-review-footer'>
					<span className='pf-review-date'>
						Reviewed on {review.created_at}
					</span>
				</div>
			</div>
			{showDeleteReviewPopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<DeleteReviewPopup
						reviewId={review.id}
						onClose={toggleDeleteReviewPopup}
						instructor={false}
					/>
				</div>
			) : null}
			{showEditReviewPopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<EditReviewPopup
						instructorSelected={review.instructor_name_fk}
						id={review.id}
						instructors={instructors}
						courseName={review.course_code_fk}
						isInstructor={false}
						easyRating={review.easy}
						usefulRating={review.useful}
						likedRating={review.liked}
						textBody={review.body}
						onClose={toggleEditReviewPopup}
					/>
				</div>
			) : null}
		</>
	)
}

export function InstructorProfileReview({
	index,
	review,
	courses
}: {
	index: number
	review: instructorReview
	courses: Set<string>
}) {
	const [showDeleteReviewPopup, setShowDeleteReviewPopup] =
		useState<boolean>(false)
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
			<div key={index} className='pf-review-card'>
				<div className='pf-review-header'>
					<span className='pf-review-title'>
						{review.instructor_name_fk}
					</span>
					<div className='pf-review-actions'>
						<button
							onClick={toggleEditReviewPopup}
							type='button'
							className='pf-review-action-btn'
						>
							<Edit className='h-4 w-4' />
						</button>
						<button
							onClick={toggleDeleteReviewPopup}
							type='button'
							className='pf-review-action-btn pf-delete'
						>
							<Trash2 className='h-4 w-4' />
						</button>
					</div>
				</div>
				<div className='pf-review-body'>
					<p className='pf-review-text'>{review.body}</p>
					<div className='pf-review-ratings'>
						<StarRating rating={review.clear} label='Clear' />
						<StarRating rating={review.engaging} label='Engaging' />
						<LikedDisplay liked={review.liked} />
					</div>
				</div>
				<div className='pf-review-footer'>
					<span className='pf-review-date'>
						Reviewed on {review.created_at}
					</span>
				</div>
			</div>
			{showDeleteReviewPopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<DeleteReviewPopup
						instructor={true}
						reviewId={review.id}
						onClose={toggleDeleteReviewPopup}
					/>
				</div>
			) : null}
			{showEditReviewPopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<EditReviewPopup
						instructorSelected={review.course_code_fk}
						id={review.id}
						instructors={courses}
						courseName={review.instructor_name_fk}
						isInstructor={true}
						easyRating={review.clear}
						usefulRating={review.engaging}
						likedRating={review.liked}
						textBody={review.body}
						onClose={toggleEditReviewPopup}
					/>
				</div>
			) : null}
		</>
	)
}
