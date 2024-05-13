'use client'

import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import { redirect, useSearchParams } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import {
	handleChangePassword,
	authenticateWithTokens
} from './ChangeAuthAction'
import { useEffect, useState } from 'react'
import { useManageBodyScroll, usePopupManager } from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function Body() {
	const searchParams = useSearchParams()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [accessToken, setAccessToken] = useState<string | null>(null)
	const [refreshToken, setRefreshToken] = useState<string | null>(null)
	const router = useRouter()

	useEffect(() => {
		const hashParams = new URLSearchParams(window.location.hash.substring(1))
		setAccessToken(hashParams.get('access_token') || '')
	}, [])

	useEffect(() => {
		if (accessToken && refreshToken) {
			authenticateWithTokens(accessToken, refreshToken)
		}
	}, [accessToken, refreshToken])

	useManageBodyScroll(showErrorPopup)

	const handleChangeClick = async () => {
		if (password !== confirmPassword) {
			setErrorMessage('Passwords do not match.')
			setShowErrorPopup(true)
			return
		}

		const error = await handleChangePassword(password)
		setErrorMessage(error)
		setShowErrorPopup(true)
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
			{showErrorPopup ? (
				<div className='fixed left-1/2 top-1/2 z-[100] max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-background p-8 backdrop-blur dark:border-gray-600 dark:bg-background/80'>
					<div className='flex flex-col items-center justify-center'>
						<h1 className='text-xl font-bold'>{errorMessage}</h1>
						<button
							onClick={() => router.push('/')}
							type='button'
							className='text-md hover:bg-secondary-dark mt-8 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-4 font-semibold text-black dark:text-white'
						>
							<h1>Signup again or login</h1>
						</button>
					</div>
				</div>
			) : (
				<div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 p-6'>
					<h1>{errorMessage}</h1>
					<h1 className='text-3xl font-bold text-background dark:text-foreground md:text-4xl'>
						Change Password
					</h1>
					<div className='flex w-full max-w-md flex-col gap-4'>
						<input
							className='rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
							type='password'
							placeholder='New Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							className='rounded-md border-neutral-300 bg-stone-200 px-4 py-2 placeholder-gray-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900'
							type='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<button
							onClick={handleChangeClick}
							type='button'
							className='hover:bg-secondary-dark w-full rounded-lg bg-secondary px-6 py-2 text-base font-semibold text-black transition-all duration-1000 ease-in-out dark:text-white'
						>
							<h1>Confirm</h1>
						</button>
					</div>
				</div>
			)}
		</BackgroundGradientAnimation>
	)
}
