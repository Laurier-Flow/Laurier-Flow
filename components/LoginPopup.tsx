import Link from 'next/link'
import { signIn } from '@/utils/supabase/authActions'
import { useRef, useEffect, useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

export default function LoginPopup({
	searchParams,
	onClose,
	toggleSignUp,
	togglePasswordReset
}: {
	searchParams: { message: string }
	onClose: () => void
	toggleSignUp: () => void
	togglePasswordReset: () => void
}): React.ReactElement {
	const [loginError, setLoginError] = useState<string>('')
	const [isVisible, setIsVisible] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		const id = requestAnimationFrame(() =>
			requestAnimationFrame(() => setIsVisible(true))
		)
		return () => cancelAnimationFrame(id)
	}, [])

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

	const handleSignUpClick = () => {
		toggleSignUp()
		onClose()
	}

	const handlePasswordResetClick = () => {
		togglePasswordReset()
		onClose()
	}

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const result = await signIn(formData)
		if (result.success) {
			onClose()
			location.reload()
		} else {
			setLoginError(result.message)
		}
	}

	return (
		<div
			ref={popupRef}
			className={`auth-modal ${isVisible ? 'auth-modal--visible' : ''}`}
		>
			<form
				className='auth-form'
				onSubmit={handleLogin}
				onChange={() => setLoginError('')}
			>
				<div className='auth-header'>
					<h1 className='auth-title'>Login</h1>
				</div>

				{loginError && (
					<div className='auth-alert auth-alert--error'>{loginError}</div>
				)}

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

				<div className='auth-forgot'>
					<button type='button' onClick={handlePasswordResetClick}>
						Forgot password?
					</button>
				</div>

				<button type='submit' className='auth-btn'>Sign in</button>

				<p className='auth-privacy'>
					Read our{' '}
					<Link href='/privacy'>Privacy Policy</Link>
				</p>

				<hr className='auth-divider' />

				<p className='auth-switch'>
					New to Laurier Flow?{' '}
					<button type='button' onClick={handleSignUpClick}>Sign Up</button>
				</p>
			</form>
		</div>
	)
}
