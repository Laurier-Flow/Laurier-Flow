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
	const [resetError, setResetError] = useState<String>('')
	const [successMessage, setSuccessMessage] = useState<String>('')

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
			className='fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background p-8 backdrop-blur dark:border-secondary dark:bg-background/80'
		>
			<form
				className='flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in'
				onSubmit={handleReset}
				onChange={() => setResetError('')}
			>
				<label className='mb-5 flex flex-row items-center justify-between text-3xl font-bold text-foreground'>
					<h1>Reset Password</h1>
					<X className='cursor-pointer' onClick={() => onClose()} />
				</label>
				{resetError && (
					<p className='mb-4 rounded-md bg-red-500 p-2 text-center text-white'>
						{resetError}
					</p>
				)}
				{successMessage && (
					<p className='mb-4 rounded-md bg-green-500 p-2 text-center text-white'>
						{successMessage}
					</p>
				)}
				<input
					className='mb-4 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
					name='email'
					placeholder='Email'
					required
				/>

				<button
					type='submit'
					className='mb-2 rounded-md bg-secondary px-4 py-2 text-foreground'
				>
					Reset Password
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

				<div className='flex justify-center text-foreground'>
					<h1>
						Back to{' '}
						<span
							onClick={handleLogInClick}
							className='cursor-pointer underline decoration-1 underline-offset-2'
						>
							Log In
						</span>
					</h1>
				</div>
			</form>
		</div>
	)
}
