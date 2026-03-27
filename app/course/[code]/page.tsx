'use server'

import { cookies, headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import CourseInfo from '../CourseInfo'
import dynamic from 'next/dynamic'
import CourseReviews from '../CourseReviews'
import { Suspense } from 'react'
import CourseSchedule from '../CourseSchedule'
import CourseRequisites from '../CourseRequisites'
import CourseOutlines from '../CourseOutlines'
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

function CourseInfoSkeleton() {
	return (
		<div style={{ padding: '64px 0 0' }}>
			{/* Course code */}
			<div className='cp-skel' style={{ height: 13, width: 70, marginBottom: 20 }} />
			{/* Title */}
			<div className='cp-skel' style={{ height: 52, width: '58%', marginBottom: 14, borderRadius: 10 }} />
			<div className='cp-skel' style={{ height: 52, width: '36%', marginBottom: 36, borderRadius: 10 }} />
			{/* Description */}
			<div className='cp-skel' style={{ height: 15, width: '88%', marginBottom: 10 }} />
			<div className='cp-skel' style={{ height: 15, width: '74%', marginBottom: 10 }} />
			<div className='cp-skel' style={{ height: 15, width: '60%', marginBottom: 48 }} />
			{/* Stats */}
			<div style={{ display: 'flex', gap: 48, marginTop: 40 }}>
				{[0, 1, 2].map(i => (
					<div key={i} style={{ flex: 1 }}>
						<div className='cp-skel' style={{ height: 30, width: 60, marginBottom: 16, borderRadius: 6 }} />
						<div className='cp-skel' style={{ height: 8, width: '100%', marginBottom: 10, borderRadius: 4 }} />
						<div className='cp-skel' style={{ height: 12, width: 90, borderRadius: 4 }} />
					</div>
				))}
			</div>
		</div>
	)
}

function CourseScheduleSkeleton() {
	return (
		<div style={{ padding: '40px 0' }}>
			{/* Section heading */}
			<div className='cp-skel' style={{ height: 22, width: 160, marginBottom: 28, borderRadius: 6 }} />
			{/* Term tabs */}
			<div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
				{[100, 86, 72].map((w, i) => (
					<div key={i} className='cp-skel' style={{ height: 34, width: w, borderRadius: 20 }} />
				))}
			</div>
			{/* Table header */}
			<div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
				{[60, 80, 120, 100, 80].map((w, i) => (
					<div key={i} className='cp-skel' style={{ height: 11, width: w, borderRadius: 4 }} />
				))}
			</div>
			{/* Table rows */}
			{[0, 1, 2, 3, 4].map(i => (
				<div key={i} style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'center' }}>
					<div className='cp-skel' style={{ height: 16, flex: 0.6, borderRadius: 4 }} />
					<div className='cp-skel' style={{ height: 16, flex: 1.2, borderRadius: 4 }} />
					<div className='cp-skel' style={{ height: 16, flex: 1.8, borderRadius: 4 }} />
					<div className='cp-skel' style={{ height: 16, flex: 1.4, borderRadius: 4 }} />
					<div className='cp-skel' style={{ height: 16, flex: 1, borderRadius: 4 }} />
				</div>
			))}
		</div>
	)
}

function CourseReviewsSkeleton() {
	return (
		<div style={{ paddingTop: 24 }}>
			{[0, 1, 2].map(i => (
				<div key={i} style={{ marginBottom: 18, padding: '22px 24px', background: 'rgba(255,255,255,0.04)', borderRadius: 14 }}>
					<div style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
						<div className='cp-skel' style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
						<div style={{ flex: 1 }}>
							<div className='cp-skel' style={{ height: 13, width: 130, marginBottom: 8, borderRadius: 4 }} />
							<div className='cp-skel' style={{ height: 11, width: 90, borderRadius: 4 }} />
						</div>
					</div>
					<div className='cp-skel' style={{ height: 13, width: '96%', marginBottom: 9, borderRadius: 4 }} />
					<div className='cp-skel' style={{ height: 13, width: '78%', borderRadius: 4 }} />
				</div>
			))}
		</div>
	)
}

async function CoursePage({ params }: CoursePageProps) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let courseCode = decodeURIComponent(params.code.toUpperCase())
	const [user] = await Promise.all([
		fetchUser(),
		getAndIncrementPageVisits()
	])

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
				<Suspense fallback={<CourseInfoSkeleton />}>
					{/* @ts-ignore */}
					<CourseInfo supabase={supabase} courseName={courseCode} />

					<hr className='cp-divider' />

					<Suspense fallback={<CourseScheduleSkeleton />}>
						<CourseSchedule
							supabase={supabase}
							courseName={courseCode}
							user={user}
						/>
					</Suspense>

					<hr className='cp-divider' />

					<CourseOutlines supabase={supabase} courseCode={courseCode} user={user} />

					<hr className='cp-divider' />

					<div className='cp-two-col'>
						<div className='cp-reviews-col'>
							<AddReview
								courseName={courseCode}
								supabase={supabase}
								instructor={false}
							/>
							<Suspense fallback={<CourseReviewsSkeleton />}>
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
