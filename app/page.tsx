import SearchBar from '../components/SearchBar'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import { fetchUser, signIn } from '@/utils/supabase/authActions'
import LoginComponent from '@/components/LoginComponent'
import { Metadata } from 'next'
import HomeHeader from '@/components/HomeHeader'
import HomeFooter from '@/components/HomeFooter'

export const metadata: Metadata = {
	title: `Laurier Flow`,
	description: `Plan your courses. Read about your professors. Get the most out of your experience at Wilfrid Laurier University.`
}

export default async function Index(): Promise<React.ReactElement> {
	const user = await fetchUser()

	const homepageTitleWordArray = [
		{
			text: 'Explore',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'thousands',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'of',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'course',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'and',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'professor',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'reviews',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'from',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'Laurier',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		},
		{
			text: 'students',
			className: 'text-2xl md:text-4xl text-background dark:text-foreground'
		}
	]

	return (
		<>
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
				<HomeHeader user={user} />
				<div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl flex-row items-center justify-center gap-12 p-6'>
					<div className='flex w-full flex-col lg:w-2/3'>
						<div className='p-1'>
							<TypewriterEffect
								words={homepageTitleWordArray}
								cursorClassName='md:h-10'
							/>
						</div>

						<div className='z-[100] pt-12'>
							<SearchBar />
						</div>

						<h1 className='pt-4 text-sm font-normal italic text-background dark:text-foreground md:text-lg'>
							Plan your courses • Read course and professor reviews • Find
							classes
						</h1>
					</div>
					<LoginComponent user={user} />
				</div>
			</BackgroundGradientAnimation>
			<HomeFooter />
		</>
	)
}
