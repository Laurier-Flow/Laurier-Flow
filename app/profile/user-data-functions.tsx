'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { SupabaseClient, User } from '@supabase/supabase-js'
import { section, getCourseSections } from '../course/CourseSchedule'
import { getTerms } from '../course/getTerms'

export const updateUserFirstName = async (
	first_name: string
): Promise<boolean> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('profiles')
		.upsert({ user_id: user?.id, first_name: first_name })
		.select()

	if (error) {
		return false
	}

	console.log(data)

	return true
}

export const updateUserLastName = async (
	last_name: string
): Promise<boolean> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('profiles')
		.upsert({ user_id: user?.id, last_name: last_name })
		.select()

	if (error) {
		return false
	}

	console.log(data)

	return true
}

export const updateUserProgram = async (program: string): Promise<boolean> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('profiles')
		.upsert({ user_id: user?.id, program: program })
		.select()

	if (error) {
		return false
	}

	console.log(data)

	return true
}

export const getUserData = async (): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('user_id', user?.id)

	if (error) {
		return null
	}
	return data
}

export const getUserSchedule = async (): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('user_schedule')
		.select()
		.eq('user_id_fk', user?.id)

	if (error) {
		return null
	}

	return data
}

export const getUserScheduleForTerm = async (term: string): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('user_schedule')
		.select()
		.eq('user_id_fk', user?.id)
		.eq('term', term)

	if (error) {
		return null
	}

	return data
}

export const addClassesToSchedule = async (
	term: string,
	course: string,
	instructor: string,
	location: string,
	time: string,
	date: string,
	type: string,
	grade: string,
	section: string
): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('user_schedule')
		.upsert({
			user_id_fk: user?.id,
			term: term,
			class: course,
			location: location,
			time: time,
			date: date,
			type: type,
			grade: grade,
			instructor: instructor,
			section: section
		})
		.select()

	if (error) {
		return error
	}

	return data
}

export const updateUserClass = async (
	term: string,
	course: string,
	instructor: string,
	location: string,
	time: string,
	date: string,
	type: string,
	grade: string,
	id: number,
	section: string
): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('user_schedule')
		.update({
			user_id_fk: user?.id,
			term: term,
			class: course,
			location: location,
			time: time,
			date: date,
			type: type,
			grade: grade,
			instructor: instructor,
			section: section
		})
		.eq('id', id)

	if (error) {
		return error
	}

	return data
}

// Delete functions

export const deleteUserAccount = async (): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	await deleteUserCourseReviews(supabase, user?.id!)

	await deleteUserInstructorReviews(supabase, user?.id!)

	const res = await deleteUserProfile(supabase, user?.id!)
	return res
}

const deleteUserCourseReviews = async (
	supabase: SupabaseClient,
	userID: string
): Promise<boolean> => {
	'use server'
	const { data, error } = await supabase
		.from('course_reviews')
		.delete()
		.eq('user_id_fk', userID)
	if (error) {
		return false
	}
	return true
}

const deleteUserInstructorReviews = async (
	supabase: SupabaseClient,
	userID: string
): Promise<boolean> => {
	'use server'
	const { data, error } = await supabase
		.from('instructor_reviews')
		.delete()
		.eq('user_id_fk', userID)
	if (error) {
		return false
	}
	return true
}

const deleteUserProfile = async (
	supabase: SupabaseClient,
	userID: string
): Promise<any> => {
	'use server'
	const { data, error } = await supabase
		.from('profiles')
		.delete()
		.eq('user_id', userID)
	if (error) {
		return error
	}
	return data
}

export const deleteSpecificClassFromSchedule = async (
	id: number
): Promise<any> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase
		.from('user_schedule')
		.delete()
		.eq('id', id)

	if (error) {
		return error
	}

	return data
}

export const searchCourses = async (
	query: string
): Promise<{ course_code: string; course_title: string }[]> => {
	'use server'

	if (!query || query.length < 2) return []

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const fuzzy = query.replace(/\s+/g, '%')

	const { data, error } = await supabase
		.from('courses')
		.select('course_code, course_title')
		.or(`course_code.ilike.%${fuzzy}%,course_title.ilike.%${fuzzy}%`)
		.is('is_uwaterloo_course', false)
		.order('course_code', { ascending: true })
		.limit(8)

	if (error || !data) return []
	return data
}

export interface SectionOption {
	section: string
	type: string
	instructor: string
	location: string
	time: string
	days: string
	crn: string
}

export const fetchSectionsForCourse = async (
	courseCode: string
): Promise<SectionOption[]> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const dataTerms = getTerms(false)

	const termSections = await getCourseSections(
		dataTerms.springTerm,
		dataTerms.fallTerm,
		dataTerms.winterTerm,
		dataTerms.nextSpringTerm,
		'course_code_fk',
		courseCode,
		supabase,
		user
	)

	const allSections = [
		...termSections.springTerm,
		...termSections.fallTerm,
		...termSections.winterTerm,
		...termSections.nextSpringTerm
	]

	const convertTime = (t: string | null | undefined) => {
		if (!t) return ''
		const h = parseInt(t.slice(0, 2), 10)
		const m = t.slice(2, 4)
		if (h === 0) return `12:${m} AM`
		if (h < 12) return `${h}:${m} AM`
		if (h === 12) return `12:${m} PM`
		return `${h - 12}:${m} PM`
	}

	const buildDaysString = (d: any) => {
		if (!d) return ''
		let str = ''
		if (d.monday) str += 'Monday'
		if (d.tuesday) str += 'Tuesday'
		if (d.wednesday) str += 'Wednesday'
		if (d.thursday) str += 'Thursday'
		if (d.friday) str += 'Friday'
		if (d.saturday) str += 'Saturday'
		if (d.sunday) str += 'Sunday'
		return str
	}

	return allSections.map((s) => ({
		section: s.section || '',
		type: s.type || '',
		instructor: s.instructor || '',
		location: s.location || '',
		time: s.beginTime ? `${convertTime(s.beginTime)} - ${convertTime(s.endTime)}` : '',
		days: buildDaysString(s.days),
		crn: s.crn || ''
	}))
}
