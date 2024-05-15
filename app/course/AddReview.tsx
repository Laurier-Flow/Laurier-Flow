import { User } from '@supabase/supabase-js'
import { fetchUser } from '@/utils/supabase/authActions'
import { SupabaseClient } from '@supabase/supabase-js'
import ReviewButton from '@/components/ReviewButton'

export async function getInstructors(
	supabase: SupabaseClient<any, 'public', any>,
	courseName: string,
	instructor: boolean,
	user: User | null
) {
	const fkName = instructor ? 'instructor_name_fk' : 'course_code_fk'
	const instructors = new Set<string>()

	const { data, error } = await supabase
		.from('sections')
		.select('*')
		.eq(fkName, courseName)

	if (data) {
		for (const section of data) {
			if (instructor) {
				instructors.add(section.course_code_fk)
			} else {
				instructors.add(section.instructor_name_fk)
			}
		}
	}

	return instructors
}

const userReviewed = async (
	supabase: SupabaseClient<any, 'public', any>,
	courseName: string,
	instructor: boolean,
	user: User | null
) => {
	const tableName = instructor ? 'instructor_reviews' : 'course_reviews'
	const fkName = instructor ? 'instructor_name_fk' : 'course_code_fk'

	if (user) {
		const { data, error } = await supabase
			.from(tableName)
			.select()
			.eq('user_id_fk', user.id)
			.eq(fkName, courseName)

		if (data?.length === 0) {
			return false
		} else {
			return true
		}
	} else {
		return false
	}
}

async function AddReview({
	supabase,
	courseName,
	instructor
}: {
	supabase: SupabaseClient<any, 'public', any>
	courseName: string
	instructor: boolean
}) {
	const user = await fetchUser()
	const reviewed = await userReviewed(supabase, courseName, instructor, user)
	const instructors = await getInstructors(
		supabase,
		courseName,
		instructor,
		user
	)

	return reviewed ? null : (
		<>
			<div className='flex flex-col p-4'>
				<h1 className='pb-4 text-xl'>What do you think of {courseName}?</h1>
				<ReviewButton
					instructor={instructor}
					user={user}
					instructors={instructors}
					courseName={courseName}
				/>
			</div>
			<hr className='mb-8 mt-8 border-gray-300 dark:border-gray-800'></hr>
		</>
	)
}

export default AddReview
