'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function insertOutline(
	courseCode: string,
	fileUrl: string,
	_fileName: string,
	term: string,
) {
	const supabase = createClient(cookies())
	const { data: { user } } = await supabase.auth.getUser()

	if (!user?.email_confirmed_at) {
		return { error: 'You must be logged in to upload outlines.' }
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('first_name, program')
		.eq('user_id', user.id)
		.single()

	const cleanCode = courseCode.replace(/\s+/g, '_')
	const cleanTerm = term.replace(/\s+/g, '_')
	const cleanFileName = `${cleanCode}_${cleanTerm}.pdf`

	const { error } = await supabase.from('course_outlines').insert({
		course_code_fk: courseCode,
		user_id_fk: user.id,
		file_url: fileUrl,
		file_name: cleanFileName,
		term,
		uploaded_by_name: profile?.first_name ?? null,
		uploaded_by_program: profile?.program ?? null,
	})

	if (error) return { error: error.message }
	return { error: null }
}
