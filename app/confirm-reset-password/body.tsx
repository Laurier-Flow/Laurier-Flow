import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import { redirect, useSearchParams } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useManageBodyScroll, usePopupManager } from '@/components/Header'
import { useRouter } from 'next/navigation'

export default function Body() {
	const searchParams = useSearchParams()
	const token_hash = searchParams.get('token_hash')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false)
	const router = useRouter()

	useManageBodyScroll(showErrorPopup)

	if (!token_hash) {
		redirect('/')
	}

	const handleChangePasswordClick = async () => {
		router.push(`https://laurierflow.ca/auth/confirm?token_hash=${token_hash}&type=recovery&next=/change-password`)
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
						Reset Your Password
					</h1>
					<h2 className='text-lg font-light text-background dark:text-foreground md:text-2xl'>
						Click reset to complete the password reset process.
					</h2>
					<button
						onClick={handleChangePasswordClick}
						type='button'
						className='hover:bg-secondary-dark mt-8 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-4 text-lg font-semibold text-black transition-all duration-1000 ease-in-out dark:text-white'
					>
						<ShieldCheck />
						<h1>Reset Password</h1>
					</button>
				</div>
			)}
		</BackgroundGradientAnimation>
	)
}
