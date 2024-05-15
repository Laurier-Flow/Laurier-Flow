'use client'

import { SupabaseClient, User } from '@supabase/supabase-js'
import { useState } from 'react'
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
					className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-secondary px-4 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
				>
					Add your review
				</button>
				{showAddReviewPopup ? (
					<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
						<AddReviewPopup
							isInstructor={instructor}
							user={user}
							instructors={instructors}
							onClose={toggleAddReviewPopup}
							courseName={courseName}
						/>
					</div>
				) : null}
			</>
		) : (
			<div
				className='mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-secondary dark:border-yellow-900 dark:bg-yellow-800/10 dark:text-secondary'
				role='alert'
			>
				<div className='flex'>
					<div className='flex-shrink-0'>
						<svg
							className='size-4 mt-0.5 flex-shrink-0'
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
							<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
							<path d='M12 9v4' />
							<path d='M12 17h.01' />
						</svg>
					</div>
					<div className='ms-4'>
						<h3 className='text-sm font-semibold'>Email not authenticated</h3>
						<div className='mt-1 text-sm text-secondary'>
							We need to confirm you're a Laurier student! Check your mylaurier
							inbox for a confirmation link so we can be sure, then you can
							access all features of the site
						</div>
					</div>
				</div>
			</div>
		)
	) : (
		<>
			<button
				onClick={toggleLoginPopup}
				type='button'
				className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-secondary px-4 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
			>
				Add your review
			</button>
			{showLoginPopup && !showSignUpPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>
			)}
			{showSignUpPopup && !showLoginPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>
			)}
		</>
	)
}
