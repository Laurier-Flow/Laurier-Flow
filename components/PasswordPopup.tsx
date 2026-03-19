import { handleResetPassword } from '@/utils/supabase/authActions'
import { useRef, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function PasswordPopup({
	searchParams,
	onClose,
	toggleLogIn
}: {
	searchParams: { message: string }
	onClose: () => void
	toggleLogIn: () => void
}): React.ReactElement {
	const [resetError, setResetError] = useState<string>('')
	const [successMessage, setSuccessMessage] = useState<string>('')
	const [isVisible, setIsVisible] = useState(false)

	const popupRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		requestAnimationFrame(() => setIsVisible(true))
	}, [])

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

	const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const result = await handleResetPassword(window.location.origin, formData)
		if (result.success) {
			setResetError('')
			setSuccessMessage(result.message)
		} else {
			setSuccessMessage('')
			setResetError(result.message)
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
				onSubmit={handleReset}
				onChange={() => setResetError('')}
			>
				<div className='auth-header'>
					<h1 className='auth-title'>Reset password</h1>
				</div>

				{resetError && (
					<div className='auth-alert auth-alert--error'>{resetError}</div>
				)}

				{successMessage && (
					<div className='auth-alert auth-alert--success'>{successMessage}</div>
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

				<button type='submit' className='auth-btn'>Reset Password</button>

				<p className='auth-privacy'>
					Read our{' '}
					<Link href='/privacy'>Privacy Policy</Link>
				</p>

				<hr className='auth-divider' />

				<p className='auth-switch'>
					Back to{' '}
					<button type='button' onClick={handleLogInClick}>Log In</button>
				</p>
			</form>
		</div>
	)
}
