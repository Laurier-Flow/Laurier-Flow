'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'

export const getAllUsers = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, count, error } = await supabase
		.from('profiles')
		.select('*', { count: 'exact' })

	if (error) {
		return error
	}
	return count
}

export const getAllCourseReviews = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, count, error } = await supabase
		.from('course_reviews')
		.select('*', { count: 'exact' })

	if (error) {
		return error
	}
	return count
}

export const getAllInstructorReviews = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, count, error } = await supabase
		.from('instructor_reviews')
		.select('*', { count: 'exact' })

	if (error) {
		return error
	}
	return count
}

export const getAllCourses = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, count, error } = await supabase
		.from('courses')
		.select('*', { count: 'exact' })
	if (error) {
		return error
	}
	return count
}

export const getUser = async (): Promise<any> => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const user = await fetchUser()
	return user
}
