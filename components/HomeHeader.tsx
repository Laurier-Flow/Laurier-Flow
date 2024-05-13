'use client'

import { User } from '@supabase/supabase-js'
import { UserNav } from './UserProfileNav'
import { Button } from '@/components/ui/button'
import { useManageBodyScroll, usePopupManager } from './Header'
import LoginPopup from './LoginPopup'
import SignUpPopup from './SignUpPopup'
import Image from 'next/image'
import PasswordPopup from './PasswordPopup'

export default function HomeHeader({ user }: { user: User | null }) {
	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		showPasswordPopup,
		togglePasswordPopup
	} = usePopupManager()

	useManageBodyScroll(showLoginPopup || showSignUpPopup || showPasswordPopup)

	return (
		<>
			<div
				className={`z-[100] mx-auto flex w-full flex-row items-center justify-between p-6 md:max-w-6xl ${user ? 'flex' : 'md:hidden'}`}
			>
				<Image
					className='z-[100] mr-4'
					src='/icon.png'
					width={50}
					height={50}
					alt='Laurier Flow'
				/>
				{user ? (
					<UserNav user={user} />
				) : (
					<Button
						onClick={toggleLoginPopup}
						variant='outline'
						className='z-[150]'
					>
						Login
					</Button>
				)}
			</div>
			{showLoginPopup && !showSignUpPopup && (
				<div className='fixed left-0 top-0 z-[200] flex h-full w-full items-center justify-center bg-black bg-opacity-50 md:hidden'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>
			)}
			{showSignUpPopup && !showLoginPopup && (
				<div className='fixed left-0 top-0 z-[200] flex h-full w-full items-center justify-center bg-black bg-opacity-50 md:hidden'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>
			)}
			{showPasswordPopup && !showLoginPopup && !showLoginPopup && (
				<div className='fixed left-0 top-0 z-[200] flex h-full w-full items-center justify-center bg-black bg-opacity-50 md:hidden'>
					<PasswordPopup
						searchParams={{ message: '' }}
						onClose={togglePasswordPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>
			)}
		</>
	)
}
