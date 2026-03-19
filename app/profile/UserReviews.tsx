import { SupabaseClient, User } from '@supabase/supabase-js'
import {
	CourseProfileReview,
	InstructorProfileReview
} from '@/components/ProfileReview'
import { courseReview } from '../course/CourseReviews'
import { instructorReview } from '../instructor/InstructorReviews'
import { getInstructors } from '../course/AddReview'

export interface profileReviews {
	courseReviews: courseReview[]
	instructorReviews: instructorReview[]
}

export interface getUserReviewsInterface {
	supabase: SupabaseClient<any, 'public', any>
	user: User | null
}

async function getUserReviews(
	supabase: SupabaseClient<any, 'public', any>,
	user: User | null
) {
	const { data: userCourseReview, error: courseError } = await supabase
		.from('course_reviews')
		.select()
		.eq('user_id_fk', user?.id)

	const { data: userInstructorReview, error: instructorError } = await supabase
		.from('instructor_reviews')
		.select()
		.eq('user_id_fk', user?.id)

	const courseReviews: courseReview[] = userCourseReview as courseReview[]
	const instructorReviews: instructorReview[] =
		userInstructorReview as instructorReview[]

	return {
		courseReviews: courseReviews || [],
		instructorReviews: instructorReviews || []
	}
}

const UserReviews: React.FC<getUserReviewsInterface> = async ({
	user,
	supabase
}) => {
	const userReviews = await getUserReviews(supabase, user)

	return (
		<div>
			<p className='pf-section-label'>Course Reviews</p>
			{userReviews.courseReviews.map(
				async (review: courseReview, index: any) => {
					return (
						<CourseProfileReview
							instructors={await getInstructors(
								supabase,
								review.course_code_fk,
								false,
								user
							)}
							review={review}
							index={index}
						/>
					)
				}
			)}
			{userReviews.courseReviews.length === 0 ? (
				<p className='pf-no-reviews'>No course reviews yet</p>
			) : null}

			<hr className='pf-schedule-divider' style={{ margin: '32px 0' }} />

			<p className='pf-section-label'>Instructor Reviews</p>
			{userReviews.instructorReviews.map(
				async (review: instructorReview, index: any) => {
					return (
						<InstructorProfileReview
							courses={await getInstructors(
								supabase,
								review.instructor_name_fk,
								true,
								user
							)}
							review={review}
							index={index}
						/>
					)
				}
			)}
			{userReviews.instructorReviews.length === 0 ? (
				<p className='pf-no-reviews'>No instructor reviews yet</p>
			) : null}
		</div>
	)
}
export default UserReviews
