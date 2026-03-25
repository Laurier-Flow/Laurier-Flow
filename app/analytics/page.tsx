import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Analytics',
	description: 'LaurierFlow site analytics',
}

export default async function AnalyticsPage() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const [user, visits, usersRes, courseReviewsRes, instructorReviewsRes, coursesRes] = await Promise.all([
		fetchUser(),
		getAndIncrementPageVisits(),
		supabase.from('profiles').select('*', { count: 'exact', head: true }),
		supabase.from('course_reviews').select('*', { count: 'exact', head: true }),
		supabase.from('instructor_reviews').select('*', { count: 'exact', head: true }),
		supabase.from('courses').select('*', { count: 'exact', head: true }),
	])

	const stats = [
		{ value: visits?.toLocaleString() ?? '—', label: 'Site Visits' },
		{ value: usersRes.count?.toLocaleString() ?? '—', label: 'Registered Users' },
		{ value: courseReviewsRes.count?.toLocaleString() ?? '—', label: 'Course Reviews' },
		{ value: instructorReviewsRes.count?.toLocaleString() ?? '—', label: 'Instructor Reviews' },
		{ value: coursesRes.count?.toLocaleString() ?? '—', label: 'Courses Tracked' },
	]

	return (
		<div className='cp-root'>
			<div className='cp-bg-layer'>
				<div className='cp-orb cp-orb-1' />
				<div className='cp-orb cp-orb-2' />
				<div className='cp-noise' />
			</div>
			<Header user={user} />
			<main className='an-content'>
				<div className='an-hero'>
					<p className='an-label'>LaurierFlow</p>
					<h1 className='an-title'>Analytics</h1>
					<p className='an-desc'>A live snapshot of the platform.</p>
				</div>
				<div className='an-grid'>
					{stats.map((stat) => (
						<div key={stat.label} className='an-card'>
							<p className='an-card-value'>{stat.value}</p>
							<p className='an-card-label'>{stat.label}</p>
						</div>
					))}
				</div>
			</main>
			<Footer />
		</div>
	)
}
