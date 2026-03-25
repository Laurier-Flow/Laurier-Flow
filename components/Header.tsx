'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
import { LogIn } from 'lucide-react'

export const useManageBodyScroll = (condition: boolean) => {
	useEffect(() => {
		if (condition) {
			document.documentElement.classList.add('overflow-hidden')
			document.body.classList.add('overflow-hidden')
		} else {
			document.documentElement.classList.remove('overflow-hidden')
			document.body.classList.remove('overflow-hidden')
		}

		return () => {
			document.documentElement.classList.remove('overflow-hidden')
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
			<header className='nav-bar'>
				<Link href='/' className='nav-bar-logo'>
					<Image
						src='/icon.png'
						width={56}
						height={56}
						alt='Laurier Flow'
						style={{ borderRadius: 7 }}
					/>
				</Link>

				<div className='nav-bar-search'>
					<SearchBar />
				</div>

				<div className='nav-bar-actions'>
					<ThemeToggleButton />
					{user ? (
						<UserNav user={user} />
					) : (
						<button onClick={toggleLoginPopup} className='hp-nav-login'>
							Log In
						</button>
					)}
				</div>
			</header>

			{showLoginPopup && !showSignUpPopup && !showPasswordPopup && createPortal(
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
			{showSignUpPopup && !showLoginPopup && !showPasswordPopup && createPortal(
				<div className='hp-popup-overlay'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>,
				document.body
			)}
			{showPasswordPopup && !showLoginPopup && !showLoginPopup && createPortal(
				<div className='hp-popup-overlay'>
					<PasswordPopup
						searchParams={{ message: '' }}
						onClose={togglePasswordPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>,
				document.body
			)}
		</>
	)
}
