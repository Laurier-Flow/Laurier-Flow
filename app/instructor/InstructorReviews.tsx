import { SupabaseClient } from '@supabase/supabase-js'
import ReviewSection from './ReviewSection'

export interface instructorReview {
	id: string
	instructor_name_fk: string
	created_at: string
	clear: number
	engaging: number
	liked: number
	course_code_fk: string
	program: string
	body: string
}

async function getInstructorReviews(
	supabase: SupabaseClient<any, 'public', any>,
	instructorName: string
) {
	try {
		const { data, error } = await supabase
			.from('instructor_reviews')
			.select()
			.eq('instructor_name_fk', instructorName)

		if (!data || data.length === 0) return {}

		const userIds = [...new Set(data.map((r: any) => r.user_id_fk))]
		const { data: profiles } = await supabase
			.from('profiles')
			.select('user_id, program')
			.in('user_id', userIds)

		const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.program]))

		const reviews: Record<string, instructorReview[]> = {}
		for (const s of data) {
			const review: instructorReview = {
				id: s.id,
				instructor_name_fk: s.instructor_name_fk,
				created_at: s.created_at,
				clear: s.clear,
				engaging: s.engaging,
				liked: s.liked,
				course_code_fk: s.course_code_fk,
				program: profileMap.get(s.user_id_fk) ?? null,
				body: s.body
			}
			if (s.course_code_fk in reviews) {
				reviews[s.course_code_fk].push(review)
			} else {
				reviews[s.course_code_fk] = [review]
			}
		}
		return reviews
	} catch (error) {
		console.error(error)
		return {}
	}
}

export default async function InstructorReviews({
	supabase,
	instructorName
}: {
	supabase: SupabaseClient<any, 'public', any>
	instructorName: string
}) {
	const instructorReviews: Record<string, instructorReview[]> =
		await getInstructorReviews(supabase, instructorName)

	return <ReviewSection instructorReviews={instructorReviews} />
}
