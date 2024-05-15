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

	return (
		<>
			<Header user={user} />
			<Suspense
				fallback={
					<div className='h-full w-full'>
						<Spinner />
					</div>
				}
			>
				<div className='hidden min-w-full lg:inline'>
					<InstructorInfo supabase={supabase} instructorName={decodedName} />
				</div>
				<div className='card'>
					<div className='lg:hidden'>
						<InstructorInfo supabase={supabase} instructorName={decodedName} />
					</div>
					<InstructorSchedule
						supabase={supabase}
						instructorName={decodedName}
						user={user}
					/>
					<hr className='mb-8 mt-8 border-gray-300 dark:border-gray-800'></hr>
					<div className='lg:flex lg:flex-1 lg:flex-col lg:pr-4'>
						<AddReview
							courseName={decodedName}
							supabase={supabase}
							instructor={true}
						/>
						<InstructorReviews
							supabase={supabase}
							instructorName={decodedName}
						/>
						<hr className='mb-8 mt-8 border-0'></hr>
					</div>
				</div>
			</Suspense>
			<Footer />
		</>
	)
}

export default InstructorPage
