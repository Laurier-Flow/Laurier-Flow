'use server'

import { cookies, headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import CourseInfo from '../CourseInfo'
import dynamic from 'next/dynamic'
import CourseReviews from '../CourseReviews'
import { Suspense } from 'react'
import CourseSchedule from '../CourseSchedule'
import CourseRequisites from '../CourseRequisites'
import Spinner from '@/components/Spinner'
import Header from '@/components/Header'
import { fetchUser } from '@/utils/supabase/authActions'
import { Metadata, ResolvingMetadata } from 'next'
const AddReview = dynamic(() => import('../AddReview'), { ssr: false })
import Footer from '@/components/Footer'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'

type CoursePageProps = {
	params: {
		code: string
	}
}

export interface days {
	monday: boolean
	tuesday: boolean
	wednesday: boolean
	thursday: boolean
	friday: boolean
	saturday: boolean
	sunday: boolean
}

export interface section {
	crn: string | undefined | null
	type: string | undefined | null
	section: string | undefined | null
	campus: string | undefined | null
	enrollment: string | undefined | null
	enrollmentMax: string | undefined | null
	beginTime: string | undefined | null
	endTime: string | undefined | null
	days: days | null
}

export async function generateMetadata(
	{ params }: CoursePageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	let courseCode = decodeURIComponent(params.code.toUpperCase())
	return {
		title: `${courseCode.split(' ').join('')}`,
		description: `Course Information & Reviews for ${courseCode}`
	}
}

async function CoursePage({ params }: CoursePageProps) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let courseCode = decodeURIComponent(params.code.toUpperCase())
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
					<CourseInfo supabase={supabase} courseName={courseCode} />

					<hr className='cp-divider' />

					<Suspense
						fallback={
							<div style={{ padding: '32px 0' }}>
								<Spinner />
							</div>
						}
					>
						<CourseSchedule
							supabase={supabase}
							courseName={courseCode}
							user={user}
						/>
					</Suspense>

					<hr className='cp-divider' />

					<div className='cp-two-col'>
						<div className='cp-reviews-col'>
							<AddReview
								courseName={courseCode}
								supabase={supabase}
								instructor={false}
							/>
							<Suspense
								fallback={
									<div style={{ padding: '32px 0' }}>
										<Spinner />
									</div>
								}
							>
								<CourseReviews supabase={supabase} courseName={courseCode} />
							</Suspense>
						</div>
						<CourseRequisites supabase={supabase} courseName={courseCode} />
					</div>
				</Suspense>
			</div>

			<Footer />
		</div>
	)
}

export default CoursePage
