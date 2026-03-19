import Spinner from '@/components/Spinner'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import Header from '@/components/Header'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import Explore from './Explore'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'

export const metadata: Metadata = {
	title: 'Explore',
	description: 'Explore courses at Wilfrid Laurier University'
}

export default async function ExplorePage() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const user = await fetchUser()
	await getAndIncrementPageVisits()

	return (
		<div className='ex-root'>
			<div className='ex-bg-layer'>
				<div className='ex-orb ex-orb-1' />
				<div className='ex-orb ex-orb-2' />
				<div className='ex-noise' />
			</div>
			<Header user={user} />
			<Suspense
				fallback={
					<div className='h-full w-full'>
						<Spinner />
					</div>
				}
			>
				<Explore />
			</Suspense>
			<Footer />
		</div>
	)
}
