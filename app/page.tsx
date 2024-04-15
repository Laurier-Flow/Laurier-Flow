import React from 'react'
import SearchBar from './search/SearchBar'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import {
	TypewriterEffect,
	TypewriterEffectSmooth
} from '@/components/ui/typewriter-effect'

export default function Index(): React.ReactElement {
	const homepageTitleWordArray = [
		{ text: 'Explore', className: 'text-4xl text-foreground' },
		{ text: 'thousands', className: 'text-4xl text-foreground' },
		{ text: 'of', className: 'text-4xl text-foreground' },
		{ text: 'course', className: 'text-4xl text-foreground' },
		{ text: 'and', className: 'text-4xl text-foreground' },
		{ text: 'professor', className: 'text-4xl text-foreground' },
		{ text: 'reviews', className: 'text-4xl text-foreground' },
		{ text: 'from', className: 'text-4xl text-foreground' },
		{ text: 'Laurier', className: 'text-4xl text-foreground' },
		{ text: 'students', className: 'text-4xl text-foreground' }
	]

	return (
		<BackgroundGradientAnimation>
			<div className=' flex flex-col justify-center items-center fixed inset-0 z-10'>
				<div>
					<TypewriterEffect
						words={homepageTitleWordArray}
						cursorClassName='h-10'
					/>
				</div>
				<div className='max-w-6xl'>
					<SearchBar />
				</div>

				<h1 className='text-lg font-normal italic mt-6'>
					Plan your courses • Read course and professor reviews • Find classes
				</h1>
			</div>
		</BackgroundGradientAnimation>
	)
}
