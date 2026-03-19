import { Suspense } from 'react'
import InstructorInfo from '../InstructorInfo'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import InstructorReviews from '../InstructorReviews'
import InstructorSchedule from '../InstructorSchedule'
import AddReview from '@/app/course/AddReview'
import Spinner from '@/components/Spinner'
import { fetchUser } from '@/utils/supabase/authActions'
import { Metadata, ResolvingMetadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'

type InstructorPageProps = {
	params: {
		name: string
	}
}

export async function generateMetadata(
	{ params }: InstructorPageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	let profName = decodeURIComponent(params.name.toUpperCase())
	return {
		title: `${profName
			.toLowerCase()
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ')}`,
		description: `Instructor Information & Reviews for ${profName}`
	}
}

async function InstructorPage({ params }: InstructorPageProps) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const decodedName = decodeURIComponent(params.name)
	const user = await fetchUser()
	await getAndIncrementPageVisits()

	return (
		<div className='cp-root'>
			{/* Background layer */}
			<div className='cp-bg-layer'>
				<div className='cp-orb cp-orb-1' />
				<div className='cp-orb cp-orb-2' />
				<div className='cp-noise' />
			</div>

			<Header user={user} />

			<div className='cp-content'>
				<Suspense
					fallback={
						<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Spinner />
						</div>
					}
				>
					{/* @ts-ignore */}
					<InstructorInfo supabase={supabase} instructorName={decodedName} />

					<hr className='cp-divider' />

					<Suspense
						fallback={
							<div style={{ padding: '32px 0' }}>
								<Spinner />
							</div>
						}
					>
						<InstructorSchedule
							supabase={supabase}
							instructorName={decodedName}
							user={user}
						/>
					</Suspense>

					<hr className='cp-divider' />

					<div>
						<AddReview
							courseName={decodedName}
							supabase={supabase}
							instructor={true}
						/>
						<InstructorReviews
							supabase={supabase}
							instructorName={decodedName}
						/>
					</div>
				</Suspense>
			</div>

			<Footer />
		</div>
	)
}

export default InstructorPage
