'use client'

import { signIn, signUp, handleResetPassword } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useState } from 'react'
import { programOptions } from '@/utils/programOptions'
import { Eye, EyeOff } from 'lucide-react'
import { ProgramDropdown } from './Combobox'
import React from 'react'

interface ToggleVisibilityButtonProps {
	visible: boolean
	toggleVisibility: () => void
	className?: string
}

const ToggleVisibilityButton: React.FC<ToggleVisibilityButtonProps> = ({
	visible,
	toggleVisibility,
	className
}) => {
	return (
		<button
			onClick={toggleVisibility}
			type='button'
			className={`hp-eye-btn ${className ?? ''}`}
		>
			{visible ? <EyeOff size={18} /> : <Eye size={18} />}
		</button>
	)
}

export default function LoginComponent({ user }: { user: User | null }) {
	const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
	const [error, setError] = useState<string>('')
	const [confirmMessage, setConfirmMessage] = useState(false)
	const [checkInboxMessage, setCheckInboxMessage] = useState(false)
	const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false)
	const [showSignupPassword, setShowSignupPassword] = useState<boolean>(false)
	const [program, setProgram] = React.useState('')

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const result = await signIn(formData)
		if (result.success) {
			location.reload()
		} else {
			setError(result.message)
		}
	}

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const emailRegex = /(@mylaurier\.ca|@wlu\.ca)$/i
		const email = formData.get('email')?.toString()
		if (email && !emailRegex.test(email)) {
			setError('Email needs to be of type @mylaurier.ca or @wlu.ca')
		} else {
			const result = await signUp(formData, program)
			if (result.success) {
				setConfirmMessage(true)
			} else {
				setError(result.message)
				setConfirmMessage(false)
			}
		}
	}

	const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const result = await handleResetPassword(window.location.origin, formData)
		if (result.success) {
			setCheckInboxMessage(true)
		} else {
			setError(result.message)
			setCheckInboxMessage(false)
		}
	}

	return (
		<div className={`hp-card ${user ? 'hidden' : 'hidden md:block'}`}>
			{mode === 'login' && (
				<form
					className='hp-card-form'
					onSubmit={handleLogin}
					onChange={() => setError('')}
				>
					<p className='hp-card-title'>Log In</p>

					{error && <div className='hp-error'>{error}</div>}

					<div className='hp-field'>
						<input
							className='hp-input'
							placeholder=' '
							name='email'
							required
						/>
						<label className='hp-label'>Laurier Email</label>
					</div>

					<div className='hp-field'>
						<input
							className='hp-input hp-input-with-toggle'
							placeholder=' '
							type={showLoginPassword ? 'text' : 'password'}
							name='password'
							required
						/>
						<label className='hp-label'>Password</label>
						<ToggleVisibilityButton
							visible={showLoginPassword}
							toggleVisibility={() => setShowLoginPassword(!showLoginPassword)}
						/>
					</div>

					<div className='hp-forgot'>
						<button
							type='button'
							onClick={() => {
								setMode('forgot')
								setError('')
								setCheckInboxMessage(false)
							}}
						>
							Forgot password?
						</button>
					</div>

					<button type='submit' className='hp-btn-primary'>
						Log In
					</button>

					<p className='hp-privacy'>
						Read our{' '}
						<Link href='/privacy'>Privacy Policy</Link>
					</p>

					<hr className='hp-divider' />

					<p className='hp-switch-mode'>
						New to Laurier Flow?{' '}
						<button
							type='button'
							onClick={() => {
								setMode('signup')
								setError('')
								setConfirmMessage(false)
							}}
						>
							Sign Up
						</button>
					</p>
				</form>
			)}

			{mode === 'signup' && (
				<form
					className='hp-card-form'
					onSubmit={handleSignUp}
					onChange={() => {
						setError('')
						setConfirmMessage(false)
					}}
				>
					<p className='hp-card-title'>Sign Up</p>

					{error && <p className='hp-error'>{error}</p>}
					{confirmMessage && (
						<div className='hp-success'>
							<strong>Success!</strong> Check your inbox for a verification link
							then{' '}
							<button
								type='button'
								onClick={() => {
									setMode('login')
									setError('')
									setConfirmMessage(false)
								}}
								style={{
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									textDecoration: 'underline',
									color: 'inherit',
									padding: 0,
									font: 'inherit'
								}}
							>
								login.
							</button>{' '}
							It may take a minute to arrive.
						</div>
					)}

					<div className='hp-field-row'>
						<div className='hp-field'>
							<input
								className='hp-input'
								placeholder=' '
								name='first name'
								required
							/>
							<label className='hp-label'>First Name</label>
						</div>
						<div className='hp-field'>
							<input
								className='hp-input'
								placeholder=' '
								name='last name'
								required
							/>
							<label className='hp-label'>Last Name</label>
						</div>
					</div>

					<ProgramDropdown value={program} setValue={setProgram} />

					<div className='hp-field'>
						<input
							className='hp-input'
							placeholder=' '
							name='email'
							required
						/>
						<label className='hp-label'>Email</label>
					</div>

					<div className='hp-field'>
						<input
							className='hp-input hp-input-with-toggle'
							placeholder=' '
							type={showSignupPassword ? 'text' : 'password'}
							name='password'
							required
						/>
						<label className='hp-label'>Password</label>
						<ToggleVisibilityButton
							visible={showSignupPassword}
							toggleVisibility={() => setShowSignupPassword(!showSignupPassword)}
						/>
					</div>

					<button type='submit' className='hp-btn-primary'>
						Sign Up
					</button>

					<p className='hp-privacy'>
						Read our{' '}
						<Link href='/privacy'>Privacy Policy</Link>
					</p>

					<hr className='hp-divider' />

					<p className='hp-switch-mode'>
						Already have an account?{' '}
						<button
							type='button'
							onClick={() => {
								setMode('login')
								setError('')
								setConfirmMessage(false)
							}}
						>
							Log In
						</button>
					</p>
				</form>
			)}

			{mode === 'forgot' && (
				<form
					className='hp-card-form'
					onSubmit={handlePasswordReset}
					onChange={() => {
						setError('')
						setCheckInboxMessage(false)
					}}
				>
					<p className='hp-card-title'>Reset Password</p>

					{error && <p className='hp-error'>{error}</p>}
					{checkInboxMessage && (
						<p className='hp-success'>Please check your inbox.</p>
					)}

					<div className='hp-field'>
						<input
							className='hp-input'
							placeholder=' '
							name='email'
							required
						/>
						<label className='hp-label'>Email</label>
					</div>

					<button type='submit' className='hp-btn-primary'>
						Reset Password
					</button>

					<p className='hp-privacy'>
						Read our{' '}
						<Link href='/privacy'>Privacy Policy</Link>
					</p>

					<hr className='hp-divider' />

					<p className='hp-switch-mode'>
						Back to{' '}
						<button
							type='button'
							onClick={() => {
								setMode('login')
								setError('')
								setConfirmMessage(false)
							}}
						>
							Log In
						</button>
					</p>
				</form>
			)}
		</div>
	)
}
