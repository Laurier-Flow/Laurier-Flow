import ScheduleTable from '../course/ScheduleTab'
import { getTerms } from '../course/getTerms'
import {
	section,
	sections,
	getCourseSections
} from '../course/CourseSchedule'
import { SupabaseClient, User } from '@supabase/supabase-js'

async function InstructorSchedule({
	supabase,
	instructorName,
	user
}: {
	supabase: SupabaseClient<any, 'public', any>
	instructorName: string
	user: User | null
}) {
	const prettyTerms = getTerms(true)
	const dataTerms = getTerms(false)

	const [
		springTerm,
		fallTerm,
		winterTerm,
		nextSpringTerm,
		springTermData,
		fallTermData,
		winterTermData,
		nextSpringTermData,
	] = await Promise.all([
		prettyTerms.springTerm,
		prettyTerms.fallTerm,
		prettyTerms.winterTerm,
		prettyTerms.nextSpringTerm,
		dataTerms.springTerm,
		dataTerms.fallTerm,
		dataTerms.winterTerm,
		dataTerms.nextSpringTerm,
	])

	const termSections: sections = await getCourseSections(
		springTermData,
		fallTermData,
		winterTermData,
		nextSpringTermData,
		'instructor_name_fk',
		instructorName,
		supabase,
		user
	)
	const springTermSections: section[] = termSections['springTerm']
	const fallTermSections: section[] = termSections['fallTerm']
	const winterTermSections: section[] = termSections['winterTerm']
	const nextSpringTermSections: section[] = termSections['nextSpringTerm']

	return (
		<div className='flex flex-col p-4 lg:mt-8'>
			<h1 className='text-xl'>Instructor Schedule</h1>
			<ScheduleTable
				springTerm={springTerm}
				fallTerm={fallTerm}
				winterTerm={winterTerm}
				nextSpringTerm={nextSpringTerm}
				springTermSections={springTermSections}
				fallTermSections={fallTermSections}
				winterTermSections={winterTermSections}
				nextSpringTermSections={nextSpringTermSections}
				professor={true}
				user={user}
			/>
		</div>
	)
}

export default InstructorSchedule
