// LoginPopup.jsx
import Link from 'next/link'
import { signIn } from '@/utils/supabase/authActions'
import { useRef, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'

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
            type="button"
			className={`focus:outline-none ${className}`}
		>
			{visible ? <EyeOff size={20} /> : <Eye size={20} />}
		</button>
	)
}

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
	const [showPassword, setShowPassword] = useState<boolean>(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	const popupRef = useRef<HTMLDivElement | null>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
			onClose()
			document.body.classList.remove('overflow-hidden')
		}
	}

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			handleClickOutside(event)
		}

		document.addEventListener('mousedown', handleOutsideClick)

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [handleClickOutside])

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
			className={`transform transition-all duration-500 ${isVisible ? '-translate-y-1/2 opacity-100' : '-translate-y-2/3 opacity-0'} fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background p-8 backdrop-blur dark:border-secondary dark:bg-background/80`}
		>
			<form
				className='flex flex-col gap-4 text-foreground'
				onSubmit={handleLogin}
				onChange={() => setLoginError('')}
			>
				<label className='mb-5 flex flex-row items-center justify-between text-3xl font-bold text-foreground'>
					<h1>Log In</h1>
					<X className='cursor-pointer' onClick={() => onClose()} />
				</label>
				{loginError && (
					<p className='mb-2 rounded-md bg-red-500 p-4 text-center text-white'>
						{loginError}
					</p>
				)}
				<input
					className='rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
					name='email'
					placeholder='Laurier Email'
					required
				/>
				<div className='relative flex'>
                    <input
                        className='flex-1 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        name="password"
                        style={{ paddingRight: '2rem' }}
                        required
                    />
                    <ToggleVisibilityButton
                        visible={showPassword}
                        toggleVisibility={() => setShowPassword(!showPassword)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3'
                    />
                </div>
				<div
					onClick={handlePasswordResetClick}
					className='flex cursor-pointer justify-end text-foreground'
				>
					Forgot password?
				</div>
				<button className='rounded-md bg-secondary px-4 py-2 dark:text-foreground'>
					Log In
				</button>
				<div className='mb-4 flex justify-center text-sm text-gray-500'>
					<h1>
						Read our{' '}
						<Link href='/privacy' className='underline underline-offset-2'>
							Privacy Policy
						</Link>
					</h1>
				</div>

				<hr className='mb-6 border-gray-300 dark:border-gray-800'></hr>

				<div
					onClick={handleSignUpClick}
					className='flex justify-center text-foreground'
				>
					<h1>
						New to Laurier Flow?{' '}
						<span
							onClick={() => {
								handleSignUpClick
							}}
							className='cursor-pointer underline decoration-1 underline-offset-2'
						>
							Sign Up
						</span>
					</h1>
				</div>
			</form>
		</div>
	)
}
