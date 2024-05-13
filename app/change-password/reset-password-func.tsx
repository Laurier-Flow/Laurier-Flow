'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'

export const resetUserPassword = async (
	new_password: string
): Promise<boolean> => {
	'use server'

	const user = await fetchUser()
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const { error } = await supabase.auth.updateUser({
		email: user!.email!,
		password: new_password
	})
	if (error) {
		console.log(error)
		return false
	} else {
		// Sign the user in again
		const { data, error } = await supabase.auth.signInWithPassword({
			email: user!.email!,
			password: new_password
		})
		if (error) {
			console.log(error)
			return false
		}
		console.log(data)
		return true
	}
}
