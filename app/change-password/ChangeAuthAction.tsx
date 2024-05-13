'use server'

import { createClient } from '@/utils/supabase/server'
import { UserAttributes } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const handleChangePassword = async (newPassword: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.updateUser({
		password: newPassword
	})

	if (error) {
		return error.message
	} else {
		redirect('/')
	}
}

export const authenticateWithTokens = async (
	accessToken: string,
	refreshToken: string
) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const getSessionWithTokens = async () => {
		if (accessToken && refreshToken) {
			const { data, error } = await supabase.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			})

			if (error) {
				throw new Error(`Error signing in: ${error.message}`)
			}
		}
	}

	if (accessToken && refreshToken) {
		await getSessionWithTokens()
	}
}
