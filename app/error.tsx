'use client'

import FormWidget from '@/components/FormWidget'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import Link from 'next/link'

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
				<h1 className='text-3xl font-bold text-background dark:text-foreground md:text-6xl'>
					We ran into an error!
				</h1>
				<h2 className='text-lg font-semibold text-background dark:text-foreground md:text-xl'>
					This could be because you're trying to access a course that has not
					been offered recently/is no longer offered at Laurier
				</h2>
				<h3 className='font-base text-background dark:text-foreground md:text-lg'>
					<b>Why did this happen? Laurier Flow</b> only has access to courses
					offered in or after the Winter 2024 term. If a course you've accessed
					using our prerequisite/leads to tools brought you here, then the site
					is working properly. As more courses get offered in the future, our
					database will continue to get populated.
				</h3>
				<h2 className='font-semibold text-background dark:text-foreground md:text-xl'>
					If the reason above is NOT the reason you were brought here, then
					please report this bug/error and what we can do to replicate it using
					the feedback button on the right. <b>Laurier Flow</b> is still in beta
					as of the current term, so 🪳 are expected.
				</h2>
				<Link href='/'>
					<h2 className='text-lg font-semibold text-background underline underline-offset-4 dark:text-foreground md:text-xl'>
						Return Home
					</h2>
				</Link>
				<h3 className='text-md mt-8 font-semibold text-slate-300 dark:text-foreground'>
					500 - Error
				</h3>
			</div>
			<FormWidget />
		</BackgroundGradientAnimation>
	)
}
