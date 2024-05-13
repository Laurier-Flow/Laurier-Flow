import React, { useRef, useEffect, useState } from 'react'
import {
	handleCourseReviewEdit,
	handleInstructorReviewEdit
} from '@/app/profile/EditReviewActions'
import { X } from 'lucide-react'

export default function EditReviewPopup({
	onClose,
	instructors,
	courseName,
	isInstructor,
	easyRating,
	usefulRating,
	likedRating,
	textBody,
	id,
	instructorSelected
}: {
	onClose: () => void
	instructors: Set<string>
	courseName: string
	isInstructor: boolean
	easyRating: number
	usefulRating: number
	likedRating: number
	textBody: string
	id: string
	instructorSelected: string
}): React.ReactElement {
	const popupRef = useRef<HTMLDivElement | null>(null)
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	const handleClickOutside = (event: MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
			onClose()
			document.body.classList.remove('overflow-hidden')
		}
	}

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			handleClickOutside(event)
		}

		document.addEventListener('mousedown', handleOutsideClick)

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [handleClickOutside])

	const instructorArray = Array.from(instructors)
	const [easyHover, setEasyHover] = useState(easyRating)
	const [usefulHover, setUsefulHover] = useState(usefulRating)
	const [easy, setEasy] = useState(easyRating)
	const [useful, setUseful] = useState(usefulRating)
	const [liked, setLiked] = useState(likedRating)
	const [instructor, setInstructor] = useState(instructorSelected || 'Other')
	const [text, setText] = useState(textBody)

	const handleTextChange = (event: {
		target: { value: React.SetStateAction<string> }
	}) => {
		const newText = event.target.value
		if (newText.length <= 1000) {
			setText(newText)
		}
	}

	const submitEditReview = async (
		easy: number,
		useful: number,
		liked: number,
		instructor: string,
		text: string,
		courseName: string
	) => {
		if (isInstructor) {
			handleInstructorReviewEdit(
				easy,
				useful,
				liked,
				instructor === 'Other' ? null : instructor,
				text,
				id
			)
		} else {
			handleCourseReviewEdit(
				easy,
				useful,
				liked,
				instructor === 'Other' ? null : instructor,
				text,
				id
			)
		}
		onClose()
		window.location.href =
			window.location.href.split('?')[0] + '?upd=' + new Date().getTime()
	}

	return (
		<div
			ref={popupRef}
			className={`transform transition-all duration-500 ${isVisible ? '-translate-y-1/2 opacity-100' : '-translate-y-2/3 opacity-0'} fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background backdrop-blur dark:border-secondary dark:bg-background/80`}
		>
			<form
				className='flex w-full flex-1 flex-col justify-center animate-in dark:text-white'
				action={() =>
					submitEditReview(easy, useful, liked, instructor, text, courseName)
				}
			>
				<div className='flex justify-between p-2'>
					<label className='mt-1 pl-2 text-xl font-bold'>Edit Review</label>
					<button
						onClick={onClose}
						type='button'
						className='inline-flex items-center px-4 py-2'
					>
						<X />
					</button>
				</div>
				<hr className='border-gray-300 dark:border-gray-800 md:inline'></hr>
				<div className='flex flex-col justify-between p-4'>
					<div className='flex flex-1 flex-col text-xl font-medium'>
						<label
							htmlFor='hs-select-label'
							className='mb-2 block text-sm font-medium dark:text-white'
						>
							Which {isInstructor ? 'course' : 'instructor'} did you have?
						</label>
						<select
							value={instructor}
							onChange={(e) => setInstructor(e.target.value)}
							id='hs-select-label'
							className='block w-full rounded-lg border-gray-200 px-4 py-2 pe-9 text-sm focus:border-amber-300 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600'
						>
							{instructorArray.map(
								(instructor, index) =>
									instructor !== null &&
									instructor !== '' && <option key={index}>{instructor}</option>
							)}
							<option>Other</option>
						</select>

						<div className='mt-8 flex flex-col justify-around rounded-lg border p-4 dark:border-gray-700 dark:bg-slate-900 sm:flex-row'>
							<div className='self-center pb-4 sm:self-start sm:pb-0'>
								<label className='text-sm'>
									{isInstructor ? 'Clear' : 'Easy'}
								</label>
								<div className='flex items-center py-2'>
									<button
										onMouseLeave={() => setEasyHover(easy)}
										onMouseOver={() => setEasyHover(1)}
										onClick={() => setEasy(1)}
										type='button'
										className={`${easy > 0 ? 'text-secondary' : 'text-gray-300'} ${easy > 0 || easyHover > 0 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setEasyHover(easy)}
										onMouseOver={() => setEasyHover(2)}
										onClick={() => setEasy(2)}
										type='button'
										className={`${easy > 1 ? 'text-secondary' : 'text-gray-300'} ${easy > 1 || easyHover > 1 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setEasyHover(easy)}
										onMouseOver={() => setEasyHover(3)}
										onClick={() => setEasy(3)}
										type='button'
										className={`${easy > 2 ? 'text-secondary' : 'text-gray-300'} ${easy > 2 || easyHover > 2 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setEasyHover(easy)}
										onMouseOver={() => setEasyHover(4)}
										onClick={() => setEasy(4)}
										type='button'
										className={`${easy > 3 ? 'text-secondary' : 'text-gray-300'} ${easy > 3 || easyHover > 3 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setEasyHover(easy)}
										onMouseOver={() => setEasyHover(5)}
										onClick={() => setEasy(5)}
										type='button'
										className={`${easy > 4 || easyHover > 4 ? 'text-secondary' : 'text-gray-300'} ${easy > 4 || easyHover > 4 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0 '
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
								</div>
							</div>

							<hr className='border-gray-300 dark:border-gray-700 sm:hidden'></hr>

							<div className='self-center py-4 dark:border-gray-700 sm:self-start sm:border-x sm:px-8 sm:py-0'>
								<label className='text-sm'>
									{isInstructor ? 'Engaging' : 'Useful'}
								</label>
								<div className='flex items-center py-2 pt-2'>
									<button
										onMouseLeave={() => setUsefulHover(useful)}
										onMouseOver={() => setUsefulHover(1)}
										onClick={() => setUseful(1)}
										type='button'
										className={`${useful > 0 ? 'text-secondary' : 'text-gray-300'} ${useful > 0 || usefulHover > 0 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setUsefulHover(useful)}
										onMouseOver={() => setUsefulHover(2)}
										onClick={() => setUseful(2)}
										type='button'
										className={`${useful > 1 ? 'text-secondary' : 'text-gray-300'} ${useful > 1 || usefulHover > 1 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setUsefulHover(useful)}
										onMouseOver={() => setUsefulHover(3)}
										onClick={() => setUseful(3)}
										type='button'
										className={`${useful > 2 ? 'text-secondary' : 'text-gray-300'} ${useful > 2 || usefulHover > 2 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setUsefulHover(useful)}
										onMouseOver={() => setUsefulHover(4)}
										onClick={() => setUseful(4)}
										type='button'
										className={`${useful > 3 ? 'text-secondary' : 'text-gray-300'} ${useful > 3 || usefulHover > 3 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0'
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
									<button
										onMouseLeave={() => setUsefulHover(useful)}
										onMouseOver={() => setUsefulHover(5)}
										onClick={() => setUseful(5)}
										type='button'
										className={`${useful > 4 || usefulHover > 4 ? 'text-secondary' : 'text-gray-300'} ${useful > 4 || usefulHover > 4 ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex items-center justify-center rounded-full text-2xl text-gray-300 hover:text-secondary disabled:pointer-events-none disabled:opacity-50 dark:text-gray-600 dark:hover:text-secondary`}
									>
										<svg
											className='size-5 h-6 w-6 flex-shrink-0 '
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											fill='currentColor'
											viewBox='0 0 16 16'
										>
											<path d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z' />
										</svg>
									</button>
								</div>
							</div>

							<hr className='border-gray-300 dark:border-gray-700 sm:hidden'></hr>

							<div className='inline-flex self-center rounded-lg pt-4 shadow-sm sm:self-start sm:pb-0'>
								<button
									onClick={() => setLiked(1)}
									type='button'
									className={`-ms-px inline-flex items-center gap-x-2 border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 shadow-sm first:ms-0 first:rounded-s-lg last:rounded-e-lg focus:z-10 disabled:pointer-events-none disabled:opacity-50 ${liked ? 'bg-white dark:bg-slate-600' : 'bg-neutral-300 dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
								>
									<svg
										className='size-4 flex-shrink-0'
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										stroke-width='2'
										stroke-linecap='round'
										stroke-linejoin='round'
									>
										<path d='M7 10v12' />
										<path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z' />
									</svg>
								</button>
								<button
									onClick={() => setLiked(0)}
									type='button'
									className={`-ms-px inline-flex items-center gap-x-2 border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 shadow-sm first:ms-0 first:rounded-s-lg last:rounded-e-lg focus:z-10 disabled:pointer-events-none disabled:opacity-50 ${!liked ? 'bg-white dark:bg-slate-600' : 'bg-neutral-300 dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
								>
									<svg
										className='size-4 flex-shrink-0'
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										stroke-width='2'
										stroke-linecap='round'
										stroke-linejoin='round'
									>
										<path d='M17 14V2' />
										<path d='M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z' />
									</svg>
								</button>
							</div>
						</div>
					</div>
					<div className='flex flex-1 flex-col pt-8'>
						<div className='flex items-center justify-between'>
							<label
								htmlFor='hs-textarea-with-corner-hint'
								className='mb-2 block text-sm font-medium dark:text-white'
							>
								Share your thoughts
							</label>
							<span className='mb-2 block text-sm text-gray-500'>
								{1000 - text.length} characters left
							</span>
						</div>
						<textarea
							onChange={handleTextChange}
							value={text}
							id='hs-textarea-with-corner-hint'
							className='text-md block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-amber-300 focus:ring-amber-400 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600'
							rows={3}
							placeholder='Say something...'
						></textarea>
					</div>
				</div>
				<div className='flex flex-row-reverse p-4'>
					<button
						type='submit'
						className='inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-secondary px-4 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	)
}
