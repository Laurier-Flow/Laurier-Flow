import React, { useRef, useEffect, useState } from 'react'
import {
	handleCourseReviewEdit,
	handleInstructorReviewEdit
} from '@/app/profile/EditReviewActions'
import { X } from 'lucide-react'

const STAR_PATH = 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'

function StarRow({
	value,
	hoverValue,
	onChange,
	onHover,
	onLeave
}: {
	value: number
	hoverValue: number
	onChange: (v: number) => void
	onHover: (v: number) => void
	onLeave: () => void
}) {
	return (
		<div className='rv-stars'>
			{[1, 2, 3, 4, 5].map((i) => (
				<button
					key={i}
					type='button'
					className={`rv-star ${(hoverValue >= i || value >= i) ? 'active' : ''}`}
					onClick={() => onChange(i)}
					onMouseOver={() => onHover(i)}
					onMouseLeave={onLeave}
				>
					<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'>
						<path d={STAR_PATH} />
					</svg>
				</button>
			))}
		</div>
	)
}

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

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				onClose()
				document.body.classList.remove('overflow-hidden')
			}
		}
		document.addEventListener('mousedown', handleOutsideClick)
		return () => document.removeEventListener('mousedown', handleOutsideClick)
	}, [onClose])

	const instructorArray = Array.from(instructors)
	const [easyHover, setEasyHover] = useState(easyRating)
	const [usefulHover, setUsefulHover] = useState(usefulRating)
	const [easy, setEasy] = useState(easyRating)
	const [useful, setUseful] = useState(usefulRating)
	const [liked, setLiked] = useState(likedRating)
	const [instructor, setInstructor] = useState(instructorSelected || 'Other')
	const [text, setText] = useState(textBody)

	const handleTextChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		const newText = event.target.value
		if (newText.length <= 1000) {
			setText(newText)
		}
	}

	const submitEditReview = async () => {
		if (isInstructor) {
			handleInstructorReviewEdit(
				easy, useful, liked,
				instructor === 'Other' ? null : instructor,
				text, id
			)
		} else {
			handleCourseReviewEdit(
				easy, useful, liked,
				instructor === 'Other' ? null : instructor,
				text, id
			)
		}
		onClose()
		window.location.href = window.location.href.split('?')[0] + '?upd=' + new Date().getTime()
	}

	return (
		<div ref={popupRef} className='rv-modal'>
			<form action={submitEditReview}>
				<div className='rv-header'>
					<h2 className='rv-title'>Edit Review</h2>
					<button onClick={onClose} type='button' className='rv-close'>
						<X size={20} />
					</button>
				</div>
				<hr className='rv-divider' />
				<div className='rv-body'>
					<label className='rv-label'>
						Which {isInstructor ? 'course' : 'instructor'} did you have?
					</label>
					<select
						value={instructor}
						onChange={(e) => setInstructor(e.target.value)}
						className='rv-select'
					>
						{instructorArray.map((inst, i) =>
							inst !== null && inst !== '' && <option key={i}>{inst}</option>
						)}
						<option>Other</option>
					</select>

					<div className='rv-ratings-row'>
						<div className='rv-rating-group'>
							<span className='rv-label'>{isInstructor ? 'Clear' : 'Easy'}</span>
							<StarRow
								value={easy}
								hoverValue={easyHover}
								onChange={setEasy}
								onHover={setEasyHover}
								onLeave={() => setEasyHover(easy)}
							/>
						</div>
						<div className='rv-rating-group'>
							<span className='rv-label'>{isInstructor ? 'Engaging' : 'Useful'}</span>
							<StarRow
								value={useful}
								hoverValue={usefulHover}
								onChange={setUseful}
								onHover={setUsefulHover}
								onLeave={() => setUsefulHover(useful)}
							/>
						</div>
						<div className='rv-rating-group'>
							<span className='rv-label'>Liked</span>
							<div className='rv-liked-group'>
								<button
									type='button'
									onClick={() => setLiked(1)}
									className={`rv-like-btn ${liked === 1 ? 'active' : ''}`}
								>
									<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M7 10v12' />
										<path d='M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z' />
									</svg>
								</button>
								<button
									type='button'
									onClick={() => setLiked(0)}
									className={`rv-like-btn ${liked === 0 ? 'active' : ''}`}
								>
									<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<path d='M17 14V2' />
										<path d='M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z' />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<div className='rv-textarea-wrap'>
						<div className='rv-textarea-header'>
							<label className='rv-label' style={{ margin: 0 }}>Share your thoughts</label>
							<span className='rv-char-count'>{1000 - text.length}</span>
						</div>
						<textarea
							onChange={handleTextChange}
							value={text}
							className='rv-textarea'
							rows={3}
							placeholder='Say something...'
						/>
					</div>
				</div>
				<div className='rv-footer'>
					<button type='submit' className='rv-submit'>Submit</button>
				</div>
			</form>
		</div>
	)
}
