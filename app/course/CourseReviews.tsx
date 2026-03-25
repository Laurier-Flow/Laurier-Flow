import { SupabaseClient } from '@supabase/supabase-js'
import CourseReviewsDisplay from './CourseReviewsDisplay'

export interface courseReview {
	id: string
	course_code_fk: string
	created_at: string
	easy: number
	useful: number
	liked: number
	instructor_name_fk: string
	program: string
	body: string
}

async function getCourseReviews(
	supabase: SupabaseClient<any, 'public', any>,
	courseName: string
) {
	try {
		const { data, error } = await supabase
			.from('course_reviews')
			.select()
			.eq('course_code_fk', courseName)

		if (!data || data.length === 0) return []

		const userIds = [...new Set(data.map((r: any) => r.user_id_fk))]
		const { data: profiles } = await supabase
			.from('profiles')
			.select('user_id, program')
			.in('user_id', userIds)

		const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.program]))

		return data.map((s: any) => ({
			id: s.id,
			course_code_fk: s.course_code_fk,
			created_at: s.created_at,
			easy: s.easy,
			useful: s.useful,
			liked: s.liked,
			instructor_name_fk: s.instructor_name_fk,
			program: profileMap.get(s.user_id_fk) ?? null,
			body: s.body
		}))
	} catch (error) {
		console.error(error)
		return []
	}
}

export default async function CourseReviews({
	supabase,
	courseName
}: {
	supabase: SupabaseClient<any, 'public', any>
	courseName: string
}) {
	const courseReviews: courseReview[] | undefined = await getCourseReviews(
		supabase,
		courseName
	)
	let hasReviewsWithBody: boolean = false

	if (courseReviews) {
		for (const review of courseReviews) {
			if (review.body && review.body != '') {
				hasReviewsWithBody = true
				break
			}
		}
	}

	return (
		<CourseReviewsDisplay
			courseReviews={courseReviews}
			hasReviewsWithBody={hasReviewsWithBody}
		/>
	)
}
