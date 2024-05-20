'use client'

import React, { useEffect, useState } from 'react'
import { ThemeToggleButton } from './ThemeToggleButton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import LoginPopup from './LoginPopup'
import SignUpPopup from './SignUpPopup'
import PasswordPopup from './PasswordPopup'
import { fetchUser, signOut } from '@/utils/supabase/authActions'
import SearchBar from '@/components/SearchBar'
import { UserNav } from './UserProfileNav'
import Image from 'next/image'

export const useManageBodyScroll = (condition: boolean) => {
	useEffect(() => {
		if (condition) {
			document.body.classList.add('overflow-hidden')
		} else {
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			document.body.classList.remove('overflow-hidden')
		}
	}, [condition])
}

export const usePopupManager = () => {
	const [showLoginPopup, setShowLoginPopup] = useState(false)
	const [showSignUpPopup, setShowSignUpPopup] = useState(false)
	const [showPasswordPopup, setShowPasswordPopup] = useState(false)

	const toggleLoginPopup = () => {
		setShowLoginPopup(!showLoginPopup)
	}

	const toggleSignUpPopup = () => {
		setShowSignUpPopup(!showSignUpPopup)
	}

	const togglePasswordPopup = () => {
		setShowPasswordPopup(!showPasswordPopup)
	}

	return {
		showLoginPopup,
		setShowLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		setShowSignUpPopup,
		toggleSignUpPopup,
		showPasswordPopup,
		setShowPasswordPopup,
		togglePasswordPopup
	}
}

export default function Header({
	user
}: {
	user: User | null
}): React.ReactElement {
	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		showPasswordPopup,
		togglePasswordPopup
	} = usePopupManager()

	useManageBodyScroll(showLoginPopup || showSignUpPopup)

	return (
		<>
			<header className='sticky top-0 z-50 w-full self-center border-b border-border/40 bg-white dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/60'>
				<div className='container flex h-14 items-center lg:max-w-6xl'>
					<div className='mr-4 flex flex-1 gap-2'>
						<Link href='/' className='hidden md:inline'>
							<Image
								className='mr-4'
								src='/icon.png'
								width={50}
								height={50}
								alt='Laurier Flow'
							/>
						</Link>
						<nav className='flex flex-1 items-center gap-6 text-sm'>
							<SearchBar />
							{/* {!user && (
                <button
                  onClick={toggleLoginPopup}
                  className="text-sm text-foreground hover:underline cursor-pointer"
                >
                  Login
                </button>
              )} */}
						</nav>
					</div>
					<div className='flex items-center justify-between space-x-2 md:justify-end'>
						<ThemeToggleButton />
						{user ? (
							<UserNav user={user} />
						) : (
							<Button onClick={toggleLoginPopup} variant='outline'>
								Login
							</Button>
						)}
					</div>
				</div>
			</header>
			{showLoginPopup && !showSignUpPopup && !showPasswordPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>
			)}
			{showSignUpPopup && !showLoginPopup && !showPasswordPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>
			)}
			{showPasswordPopup && !showLoginPopup && !showLoginPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
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
