import { User } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'
import CourseOutlinesDisplay from './CourseOutlinesDisplay'

export type Outline = {
	id: string
	file_name: string
	file_url: string
	term: string
	uploaded_by_name: string | null
	uploaded_by_program: string | null
	created_at: string
}

export default async function CourseOutlines({
	supabase,
	courseCode,
	user,
}: {
	supabase: SupabaseClient
	courseCode: string
	user: User | null
}) {
	const { data } = await supabase
		.from('course_outlines')
		.select('id, file_url, file_name, term, uploaded_by_name, uploaded_by_program, created_at')
		.eq('course_code_fk', courseCode)
		.order('created_at', { ascending: false })

	return (
		<CourseOutlinesDisplay
			outlines={(data as Outline[]) ?? []}
			courseCode={courseCode}
			user={user}
		/>
	)
}
