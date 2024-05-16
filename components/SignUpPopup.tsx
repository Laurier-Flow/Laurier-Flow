// SignUpPopup.tsx
import React, { useRef, useEffect, useState } from 'react'
import { signUp } from '@/utils/supabase/authActions'
import Link from 'next/link'
import { X } from 'lucide-react'
import { programOptions } from "@/utils/programOptions";
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

export default function SignUpPopup({
	searchParams,
	onClose,
	toggleLogIn
}: {
	searchParams: { message: string }
	onClose: () => void
	toggleLogIn: () => void
}): React.ReactElement {
	const [selectedProgram, setSelectedProgram] = useState('')
	const [signUpError, setSignUpError] = useState<string>('')
	const [confirmMessage, setConfirmMessage] = useState(false)
	const [showPassword, setShowPassword] = useState<boolean>(false)

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

	const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedProgram(event.target.value)
	}

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const emailRegex = /(@mylaurier\.ca|@wlu\.ca)$/i

		const email = formData.get('email')?.toString()

		if (email && !emailRegex.test(email)) {
            setSignUpError('Email needs to be of type @mylaurier.ca or @wlu.ca')
		} else {
			const result = await signUp(formData)

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
			className='fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background p-8 backdrop-blur dark:border-secondary dark:bg-background/80'
		>
			<form
				className='flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in'
				onSubmit={handleSignUp}
				onChange={() => setSignUpError('')}
			>
				<label className='mb-5 flex flex-row items-center justify-between text-3xl font-bold text-foreground'>
					<h1>Sign Up</h1>
					<X className='cursor-pointer' onClick={() => onClose()} />
				</label>
				{signUpError && (
					<p className='mb-2 rounded-md bg-red-500 p-4 text-center text-white'>
						{signUpError}
					</p>
				)}
				{confirmMessage &&
                    <div className="my-2 bg-teal-500 text-md text-white rounded-lg p-4 text-center" role="alert">
                        <span className="font-bold">Success!</span> Check your inbox for a verification link then <span onClick={() => { handleLogInClick() }} className="cursor-pointer underline underline-offset-2 decoration-1">login.</span> It may take a minute to arrive
                    </div>
                }
				<div className='mb-2 flex flex-row gap-4'>
					<input
						className='w-1/2 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:placeholder-gray-400'
						name='first name'
						placeholder='First Name'
						required
					/>
					<input
						className='w-1/2 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:placeholder-gray-400'
						name='last name'
						placeholder='Last Name'
						required
					/>
				</div>
				<select
					className='mb-2 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 text-stone-600 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:text-gray-400 dark:placeholder-gray-400'
					name='program'
					value={selectedProgram}
					onChange={handleProgramChange}
					required
				>
					<option value='' disabled>
						Select your program
					</option>
					{programOptions.map((program) => (
						<option className='' key={program} value={program}>
							{program}
						</option>
					))}
				</select>
				<input
					className='mb-2 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:placeholder-gray-400'
					name='email'
					placeholder='Email'
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
				<button
					formAction={signUp}
					className='mb-2 rounded-md bg-secondary px-4 py-2 text-foreground'
				>
					Sign Up
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
					onClick={handleLogInClick}
					className='flex justify-center text-foreground'
				>
					<h1>
						Already have an account?{' '}
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
