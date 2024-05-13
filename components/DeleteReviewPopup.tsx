import {
	handleCourseReviewDelete,
	handleInstructorReviewDelete
} from '@/app/profile/DeleteReviewAction'
import { useRef } from 'react'

export default function DeleteReviewPopup({
	onClose,
	reviewId,
	instructor
}: {
	onClose: () => void
	reviewId: string
	instructor: boolean
}) {
	const popupRef = useRef<HTMLDivElement | null>(null)

	const deleteReview = async (reviewId: string) => {
		if (instructor) {
			handleInstructorReviewDelete(reviewId)
		} else {
			handleCourseReviewDelete(reviewId)
		}
		onClose()
		window.location.href =
			window.location.href.split('?')[0] + '?upd=' + new Date().getTime()
	}

	return (
		<div
			ref={popupRef}
			className='fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background p-8 backdrop-blur dark:border-red-800 dark:bg-background/80'
		>
			<form
				className='flex flex-col gap-4 bg-background text-foreground'
				action={() => deleteReview(reviewId)}
			>
				<label className='text-3xl font-bold text-foreground'>
					Delete for all eternity?
				</label>
				<label className='text-md font-base mb-5 text-foreground'>
					This cannot be undone
				</label>

				<hr className='mb-6 border-gray-300 dark:border-gray-800'></hr>

				<div>
					<button
						type='submit'
						className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-red-800 dark:bg-red-800 dark:text-foreground'
					>
						Delete
					</button>
					<button
						onClick={onClose}
						type='button'
						className='ml-4 inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-gray-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-700 dark:text-foreground'
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	)
}
