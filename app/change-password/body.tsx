'use client'

import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import { handleChangePassword } from './ChangeAuthAction'
import { useState } from 'react'
import { redirect } from 'next/navigation'
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
			className={`focus:outline-none ${className}`}
		>
			{visible ? <EyeOff size={20} /> : <Eye size={20} />}
		</button>
	)
}

export default function Body() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [showTopPassword, setShowTopPassword] = useState<boolean>(false)
	const [showBottomPassword, setShowBottomPassword] = useState<boolean>(false)

	const handleChangeClick = async () => {
		if (password !== confirmPassword) {
			setErrorMessage('Passwords do not match.')
			return
		}

		const result = await handleChangePassword(password)

		if (result.success) {
			redirect('/')
		} else {
			setErrorMessage(result.message)
		}
	}

	return (
		<BackgroundGradientAnimation
			gradientBackgroundStart='var(--gradient-start)'
			gradientBackgroundEnd='var(--gradient-end)'
			firstColor='var(--bubble)'
			secondColor='var(--bubble)'
			thirdColor='var(--bubble)'
			fourthColor='var(--bubble)'
			fifthColor='var(--bubble)'
			pointerColor='var(--bubble)'
		>
			<div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 p-6'>
				<h1 className='text-3xl font-bold text-background dark:text-foreground md:text-4xl'>
					Change Password
				</h1>
				<div className='flex w-full max-w-md flex-col gap-4'>
					{errorMessage && (
						<p className='mb-2 rounded-md bg-red-500 p-2 text-center text-white'>
							{errorMessage}
						</p>
					)}
					<div className='relative flex'>
						<input
							className='flex-1 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
							type={showTopPassword ? 'text' : 'password'}
							placeholder='New Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							style={{ paddingRight: '2rem' }}
							required
						/>
						<ToggleVisibilityButton
							visible={showTopPassword}
							toggleVisibility={() => setShowTopPassword(!showTopPassword)}
							className='absolute inset-y-0 right-0 flex items-center pr-3'
						/>
					</div>
					<div className='relative flex'>
						<input
							className='flex-1 rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
							type={showBottomPassword ? 'text' : 'password'}
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<ToggleVisibilityButton
							visible={showBottomPassword}
							toggleVisibility={() =>
								setShowBottomPassword(!showBottomPassword)
							}
							className='absolute inset-y-0 right-0 flex items-center pr-3'
						/>
					</div>
					<button
						onClick={handleChangeClick}
						type='button'
						className='hover:bg-secondary-dark w-full rounded-lg bg-secondary px-6 py-2 text-base font-semibold text-black transition-all duration-1000 ease-in-out dark:text-white'
					>
						<h1>Confirm</h1>
					</button>
				</div>
			</div>
		</BackgroundGradientAnimation>
	)
}
