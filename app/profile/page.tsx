import Header from '@/components/Header'
import Spinner from '@/components/Spinner'
import { fetchUser } from '@/utils/supabase/authActions'
import { Suspense } from 'react'
import UserReviews from './UserReviews'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import PageContent from './pageContent'
import Footer from '@/components/Footer'

export default async function Profile() {
	const user = await fetchUser()
	if (!user) redirect('/')
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	return (
		<div className='pf-root cp-root'>
			<div className='cp-bg-layer'>
				<div className='cp-orb pf-orb-1 cp-orb-1' />
				<div className='cp-orb pf-orb-2 cp-orb-2' />
				<div className='pf-noise cp-noise' />
			</div>
			<Header user={user} />
			<div className='pf-content'>
				<Suspense
					fallback={
						<div className='h-full w-full'>
							<Spinner />
						</div>
					}
				>
					<PageContent
						userReviews={<UserReviews user={user} supabase={supabase} />}
						user={user}
					/>
				</Suspense>
			</div>
			<Footer />
		</div>
	)
}
