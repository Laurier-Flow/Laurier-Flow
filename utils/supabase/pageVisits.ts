'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'
export const getAndIncrementPageVisits = async (): Promise<any> => {
	'use server'

	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { data, error } = await supabase.from('analytics').select('*')
	if (error) {
		console.log(error)
		return error
	}
	const newCount = data[0].page_visits + 1

	await supabase.from('analytics').upsert({ id: 1, page_visits: newCount })

	return newCount
}
