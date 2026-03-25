import { fetchUser } from '@/utils/supabase/authActions'
import HomepageHero from '@/components/HomepageHero'
import HomeFooter from '@/components/HomeFooter'
import { Metadata } from 'next'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'

export const metadata: Metadata = {
	title: `Laurier Flow`,
	description: `Plan your courses. Read about your professors. Get the most out of your experience at Wilfrid Laurier University.`
}

export default async function Index(): Promise<React.ReactElement> {
	const user = await fetchUser()
	await getAndIncrementPageVisits()

	return (
		<div className='hp-root'>
			<div className='hp-bg-layer'>
				<div className='hp-orb hp-orb-1' />
				<div className='hp-orb hp-orb-2' />
				<div className='hp-noise' />
			</div>

			<HomepageHero user={user} />

			<HomeFooter />
		</div>
	)
}
