import ScheduleTable from '../course/ScheduleTab'
import {
	getNextTerm,
	getPreviousTerm,
	getCurrentTerm,
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
	const [
		nextTerm,
		previousTerm,
		currentTerm,
		nextTermData,
		currentTermData,
		previousTermData
	] = await Promise.all([
		getNextTerm(true),
		getPreviousTerm(true),
		getCurrentTerm(true),
		getNextTerm(false),
		getCurrentTerm(false),
		getPreviousTerm(false)
	])
	const termSections: sections = await getCourseSections(
		nextTermData,
		currentTermData,
		previousTermData,
		'instructor_name_fk',
		instructorName,
		supabase,
		user
	)
	const currentTermSections: section[] = termSections['currentTerm']
	const previousTermSections: section[] = termSections['previousTerm']
	const nextTermSections: section[] = termSections['nextTerm']

	return (
		<div className='flex flex-col p-4 lg:mt-8'>
			<h1 className='text-xl'>Instructor Schedule</h1>
			<ScheduleTable
				nextTerm={nextTerm}
				previousTerm={previousTerm}
				currentTerm={currentTerm}
				currentTermSections={currentTermSections}
				previousTermSections={previousTermSections}
				nextTermSections={nextTermSections}
				professor={true}
				user={user}
			/>
		</div>
	)
}

export default InstructorSchedule
