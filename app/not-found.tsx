import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'

export default function NotFound() {
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
			<div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 p-6'>
				<h1 className='text-4xl font-bold text-background dark:text-foreground md:text-6xl'>
					Feeling lost?
				</h1>
				<h2 className='text-lg font-semibold text-background dark:text-foreground md:text-xl'>
					The page you're trying to reach doesn't exist
				</h2>
				<a href='/'>
					<h2 className='text-xl font-semibold text-background underline underline-offset-4 dark:text-foreground'>
						Return Home
					</h2>
				</a>
				<h3 className='text-md mt-8 font-semibold text-slate-300 dark:text-foreground'>
					404 - Not Found
				</h3>
			</div>
		</BackgroundGradientAnimation>
	)
}
