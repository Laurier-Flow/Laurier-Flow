'use client'

import Image from 'next/image'
import { useState } from 'react'
import SearchBar from './SearchBar'
import { UserNav } from './UserProfileNav'
import { User } from '@supabase/supabase-js'
import LoginPopup from './LoginPopup'
import SignUpPopup from './SignUpPopup'
import PasswordPopup from './PasswordPopup'
import { LogIn } from 'lucide-react'
import { useManageBodyScroll } from './Header'

export default function HomepageHero({ user }: { user: User | null }) {
	const [showLogin, setShowLogin] = useState(false)
	const [showSignUp, setShowSignUp] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const toggleLogin = () => setShowLogin(v => !v)
	const toggleSignUp = () => setShowSignUp(v => !v)
	const togglePassword = () => setShowPassword(v => !v)

	useManageBodyScroll(showLogin || showSignUp || showPassword)

	return (
		<div className='hp-above-fold'>
			{/* Floating navbar */}
			<nav className='hp-nav'>
				<div className='hp-nav-logo'>
					<Image
						src='/icon.png'
						width={64}
						height={64}
						alt='Laurier Flow'
						className='hp-logo-icon'
					/>
				</div>
				<div className='hp-nav-right'>
					{user ? (
						<UserNav user={user} />
					) : (
						<button onClick={toggleLogin} className='hp-nav-login'>
							<LogIn size={16} strokeWidth={2} />
							<span>Log In</span>
						</button>
					)}
				</div>
			</nav>

			{/* Hero — centered column */}
			<div className='hp-hero'>
				<h1 className='hp-headline'>
					Explore <em className='hp-italic-purple'>thousands</em> of course &amp; professor reviews from{' '}
					<strong className='hp-bold-primary'>Laurier students</strong>
				</h1>

				<p className='hp-tagline'>
					Plan your courses · Read reviews · Find the right professors
				</p>

				<div className='hp-search-wrap'>
					<SearchBar />
				</div>

				<div className='hp-stats'>
					<div className='hp-stat'>
						<span className='hp-stat-number'>3,419</span>
						<span className='hp-stat-label'>Courses</span>
					</div>
					<span className='hp-stat-sep'>·</span>
					<div className='hp-stat'>
						<span className='hp-stat-number'>1,517</span>
						<span className='hp-stat-label'>Instructors</span>
					</div>
					<span className='hp-stat-sep'>·</span>
					<div className='hp-stat'>
						<span className='hp-stat-number'>12,400+</span>
						<span className='hp-stat-label'>Reviews</span>
					</div>
				</div>
			</div>

			{/* Auth popups */}
			{showLogin && (
				<div className='hp-popup-overlay'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLogin}
						toggleSignUp={toggleSignUp}
						togglePasswordReset={togglePassword}
					/>
				</div>
			)}
			{showSignUp && (
				<div className='hp-popup-overlay'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUp}
						toggleLogIn={toggleLogin}
					/>
				</div>
			)}
			{showPassword && (
				<div className='hp-popup-overlay'>
					<PasswordPopup
						searchParams={{ message: '' }}
						onClose={togglePassword}
						toggleLogIn={toggleLogin}
					/>
				</div>
			)}
		</div>
	)
}
