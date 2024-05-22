'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'

export const countNumberUsers = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { data, error } = await supabase.from('profiles').select('*')

	if (error) {
		return error
	}
	return data
}

export const getUser = async (): Promise<any> => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const user = await fetchUser()
	return user
}
