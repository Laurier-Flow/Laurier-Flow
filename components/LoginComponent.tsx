'use client'

import { signIn, signUp } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useState } from 'react'
import { programOptions } from './SignUpPopup'

export default function LoginComponent({ user }: { user: User | null }) {
	const [signup, setSignup] = useState(false)
	const [signUpError, setSignUpError] = useState<string>('')
	const [loginError, setLoginError] = useState<string>('')
	const [confirmMessage, setConfirmMessage] = useState(false)
	const [selectedProgram, setSelectedProgram] = useState('')

	const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const result = await signIn(formData)

		if (result.success) {
			location.reload()
		} else {
			setLoginError(result.message)
		}
	}

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const emailRegex = /(@mylaurier\.ca|@wlu\.ca)$/i

		const email = formData.get('email')?.toString()

		if (email && !emailRegex.test(email)) {
			setSignUpError('Email needs to be of type mylaurier.ca or wlu.ca')
		} else {
			const result = await signUp(formData)

			if (result.success) {
				setConfirmMessage(true)
			} else {
				setSignUpError(result.message)
				setConfirmMessage(false)
			}
		}
	}

	const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedProgram(event.target.value)
	}

	return !signup ? (
		<div
			className={`hidden ${user ? null : 'md:flex'} max-h-full w-1/2 overflow-auto rounded-md border border-slate-800 bg-background p-8 backdrop-blur md:flex-col lg:w-1/3`}
		>
			<form
				className='flex flex-col gap-4 bg-background text-foreground'
				onSubmit={handleLogin}
				onChange={() => setLoginError('')}
			>
				<label className='mb-5 text-3xl font-bold text-foreground'>
					Log In
				</label>
				{loginError && (
					<div
						className='text-md my-2 rounded-lg bg-red-500 p-4 text-white'
						role='alert'
					>
						{loginError}
					</div>
				)}
				<input
					className='rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
					name='email'
					placeholder='Laurier Email'
					required
				/>

				<input
					className='rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
					type='password'
					name='password'
					placeholder='Password'
					required
				/>
				<div className='flex cursor-pointer justify-end text-foreground'>
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

				<div className='flex justify-center text-foreground'>
					<h1>
						New to Laurier Flow?{' '}
						<span
							onClick={() => {
								setSignup(true)
								setLoginError('')
							}}
							className='cursor-pointer underline decoration-1 underline-offset-2'
						>
							Sign Up
						</span>
					</h1>
				</div>
			</form>
		</div>
	) : (
		<div
			className={`hidden ${user ? null : 'md:flex'} max-h-full w-1/2 overflow-auto rounded-md border border-slate-800 bg-stone-100 p-8 backdrop-blur dark:bg-background md:flex-col lg:w-1/3`}
		>
			<form
				className='flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in'
				onSubmit={handleSignUp}
				onChange={() => {
					setSignUpError('')
					setConfirmMessage(false)
				}}
			>
				<label className='mb-5 text-3xl font-bold text-foreground'>
					Sign Up
				</label>
				{signUpError && (
					<p className='mb-2 rounded-md bg-red-500 p-2 text-center text-white'>
						{signUpError}
					</p>
				)}
				{confirmMessage && (
					<div
						className='text-md my-2 rounded-lg bg-teal-500 p-4 text-white'
						role='alert'
					>
						<span className='font-bold'>Success!</span> Check your inbox for a
						verification link then{' '}
						<span
							onClick={() => {
								setSignup(false)
								setSignUpError('')
								setConfirmMessage(false)
							}}
							className='cursor-pointer underline decoration-1 underline-offset-2'
						>
							login.
						</span>{' '}
						It may take a minute to arrive
					</div>
				)}
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

				<input
					className='mb-4 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:placeholder-gray-400'
					type='password'
					name='password'
					placeholder='Password'
					required
				/>
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
					onClick={() => setSignup(false)}
					className='flex justify-center text-foreground'
				>
					<h1>
						Already have an account?{' '}
						<span
							onClick={() => {
								setSignup(false)
								setSignUpError('')
								setConfirmMessage(false)
							}}
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

function setSelectedProgram(value: string) {
	throw new Error('Function not implemented.')
}
