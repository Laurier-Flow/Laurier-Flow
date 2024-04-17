'use client'

import React, { useEffect, useState } from 'react'
import SearchBar from './search/SearchBar'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import {
	TypewriterEffect,
	TypewriterEffectSmooth
} from '@/components/ui/typewriter-effect'

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
		<BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)' className='h-screen'>
			<div className='flex flex-col justify-center items-center fixed inset-0 z-10 p-8'>
				<div className='max-w-5xl w-full'>
					<div>
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
			</div>
		</BackgroundGradientAnimation>
	)
}
