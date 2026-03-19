import React, { useRef, useEffect, useState } from 'react'
import { signUp } from '@/utils/supabase/authActions'
import Link from 'next/link'
import { X, Eye, EyeOff } from 'lucide-react'
import { ProgramDropdown } from './Combobox'

export default function SignUpPopup({
	searchParams,
	onClose,
	toggleLogIn
}: {
	searchParams: { message: string }
	onClose: () => void
	toggleLogIn: () => void
}): React.ReactElement {
	const [program, setProgram] = useState('')
	const [signUpError, setSignUpError] = useState<string>('')
	const [confirmMessage, setConfirmMessage] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	const popupRef = useRef<HTMLDivElement | null>(null)
	const dropdownRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		requestAnimationFrame(() => setIsVisible(true))
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				(!dropdownRef.current || !dropdownRef.current.contains(event.target as Node))
			) {
				onClose()
				document.body.classList.remove('overflow-hidden')
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [popupRef, dropdownRef, onClose])

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const emailRegex = /(@mylaurier\.ca|@wlu\.ca)$/i
		const email = formData.get('email')?.toString()

		if (email && !emailRegex.test(email)) {
			setSignUpError('Email needs to be of type @mylaurier.ca or @wlu.ca')
		} else {
			const result = await signUp(formData, program)
			if (result.success) {
				setSignUpError('')
				setConfirmMessage(true)
			} else {
				setSignUpError(result.message)
				setConfirmMessage(false)
			}
		}
	}

	const handleLogInClick = () => {
		toggleLogIn()
		onClose()
	}

	return (
		<div
			ref={popupRef}
			className={`auth-modal ${isVisible ? 'auth-modal--visible' : ''}`}
		>
			<form
				className='auth-form'
				onSubmit={handleSignUp}
				onChange={() => setSignUpError('')}
			>
				<div className='auth-header'>
					<h1 className='auth-title'>Create account</h1>
				</div>

				{signUpError && (
					<div className='auth-alert auth-alert--error'>{signUpError}</div>
				)}

				{confirmMessage && (
					<div className='auth-alert auth-alert--success'>
						<strong>Success!</strong> Check your inbox for a verification link then{' '}
						<button type='button' className='auth-inline-link' onClick={handleLogInClick}>
							login.
						</button>{' '}
						It may take a minute to arrive
					</div>
				)}

				<div className='auth-field-row'>
					<div className='auth-field'>
						<input
							className='auth-input'
							name='first name'
							placeholder=' '
							required
						/>
						<label className='auth-label'>First Name</label>
					</div>
					<div className='auth-field'>
						<input
							className='auth-input'
							name='last name'
							placeholder=' '
							required
						/>
						<label className='auth-label'>Last Name</label>
					</div>
				</div>

				<div className='auth-field'>
					<ProgramDropdown
						value={program}
						setValue={setProgram}
						ref={dropdownRef}
					/>
				</div>

				<div className='auth-field'>
					<input
						className='auth-input'
						name='email'
						placeholder=' '
						required
					/>
					<label className='auth-label'>Email</label>
				</div>

				<div className='auth-field'>
					<input
						className='auth-input auth-input--has-toggle'
						type={showPassword ? 'text' : 'password'}
						placeholder=' '
						name='password'
						required
					/>
					<label className='auth-label'>Password</label>
					<button
						type='button'
						className='auth-eye'
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>

				<button type='submit' className='auth-btn'>Create account</button>

				<p className='auth-privacy'>
					Read our{' '}
					<Link href='/privacy'>Privacy Policy</Link>
				</p>

				<hr className='auth-divider' />

				<p className='auth-switch'>
					Already have an account?{' '}
					<button type='button' onClick={handleLogInClick}>Log In</button>
				</p>
			</form>
		</div>
	)
}
