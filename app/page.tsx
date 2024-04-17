'use client'

import React, { useEffect, useState } from 'react'
import SearchBar from './search/SearchBar'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import {
	TypewriterEffect,
	TypewriterEffectSmooth
} from '@/components/ui/typewriter-effect'
import Link from 'next/link'

export default function Index(): React.ReactElement {
	const homepageTitleWordArray = [
		{ text: 'Explore', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'thousands', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'of', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'course', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'and', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'professor', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'reviews', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'from', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'Laurier', className: 'text-2xl md:text-4xl text-foreground' },
		{ text: 'students', className: 'text-2xl md:text-4xl text-foreground' }
	]

	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const checkDarkMode = () => {
			const isDark = document.documentElement.classList.contains('dark');
			setIsDarkMode(isDark);
		};

		checkDarkMode();

		const observer = new MutationObserver(checkDarkMode);

		observer.observe(document.documentElement, { attributes: true });

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
			<div className='flex flex-row justify-center items-center fixed inset-0 z-10 p-6 max-w-6xl w-full mx-auto gap-12'>
				<div className='flex flex-col w-full lg:w-2/3'>
					<div className='p-1'>
						<TypewriterEffect
							words={homepageTitleWordArray}
							cursorClassName='md:h-10'
						/>
					</div>

					<div className='pt-12'>
						<SearchBar />
					</div>

					<h1 className='text-sm md:text-lg font-normal italic pt-4'>
						Plan your courses • Read course and professor reviews • Find classes
					</h1>
				</div>
				<div className='hidden md:flex md:flex-col bg-background p-8 border-slate-800 border backdrop-blur rounded-md lg:w-1/3'>
					<form
						className="flex flex-col gap-4 text-foreground"
					>
						<label className="text-3xl font-bold mb-5 text-foreground">Log In</label>
						<input
							className="rounded-md px-4 py-2 bg-inherit border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0"
							name="email"
							placeholder="Laurier Email"
							required
						/>

						<input
							className="rounded-md px-4 py-2 bg-inherit border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0"
							type="password"
							name="password"
							placeholder="Password"
							required
						/>
						<div className="flex justify-end text-foreground cursor-pointer">
							Forgot password?
						</div>
						<button className="bg-secondary rounded-md px-4 py-2 text-foreground">
							Log In
						</button>
						<div className="flex justify-center text-gray-500 text-sm mb-4">
							<h1>Read our <Link href="/privacy" className='underline'>Privacy Policy</Link></h1>
						</div>

						<hr className="mb-6 border-gray-300 dark:border-gray-800"></hr>

						<div className="flex justify-center text-foreground">
							New to Laurier Flow? Sign Up.
						</div>

					</form>
				</div>
			</div>
		</BackgroundGradientAnimation>
	)
}
