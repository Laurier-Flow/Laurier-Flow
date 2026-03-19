'use client'

import { SupabaseClient, User } from '@supabase/supabase-js'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import LoginPopup from './LoginPopup'
import SignUpPopup from './SignUpPopup'
import { useManageBodyScroll, usePopupManager } from './Header'
import AddReviewPopup from './AddReviewPopup'

export default function ReviewButton({
	user,
	instructors,
	courseName,
	instructor
}: {
	user: User | null
	instructors: Set<string>
	courseName: string
	instructor: boolean
}) {
	const [showAddReviewPopup, setShowAddReviewPopup] = useState<boolean>(false)

	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		setShowPasswordPopup,
		togglePasswordPopup
	} = usePopupManager()

	useManageBodyScroll(showLoginPopup || showSignUpPopup || showAddReviewPopup)

	const toggleAddReviewPopup = () => {
		setShowAddReviewPopup(!showAddReviewPopup)
	}

	return user ? (
		user.confirmed_at ? (
			<>
				<button
					onClick={toggleAddReviewPopup}
					type='button'
					className='cp-add-review-btn'
				>
					Add your review
				</button>
				{showAddReviewPopup ? createPortal(
					<div className='hp-popup-overlay'>
						<AddReviewPopup
							isInstructor={instructor}
							user={user}
							instructors={instructors}
							onClose={toggleAddReviewPopup}
							courseName={courseName}
						/>
					</div>,
					document.body
				) : null}
			</>
		) : (
			<div className='cp-alert'>
				<div className='cp-alert-icon'>
					<svg
						width='20'
						height='20'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
						<path d='M12 9v4' />
						<path d='M12 17h.01' />
					</svg>
				</div>
				<div>
					<h3 className='cp-alert-title'>Email not authenticated</h3>
					<p className='cp-alert-text'>
						We need to confirm you're a Laurier student! Check your mylaurier
						inbox for a confirmation link so we can be sure, then you can
						access all features of the site.
					</p>
				</div>
			</div>
		)
	) : (
		<>
			<button
				onClick={toggleLoginPopup}
				type='button'
				className='cp-add-review-btn'
			>
				Add your review
			</button>
			{showLoginPopup && !showSignUpPopup && createPortal(
				<div className='hp-popup-overlay'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>,
				document.body
			)}
			{showSignUpPopup && !showLoginPopup && createPortal(
				<div className='hp-popup-overlay'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>,
				document.body
			)}
		</>
	)
}
