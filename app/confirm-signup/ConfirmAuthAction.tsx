'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const handleVerifyEmail = async (tokenHash: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.verifyOtp({
		token_hash: tokenHash,
		type: 'email'
	})

	if (error) {
		return error.message
	} else {
		redirect('/')
	}
}
