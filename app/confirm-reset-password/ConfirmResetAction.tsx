'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const handleVerifyReset = async (tokenHash: string) => {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.auth.verifyOtp({
		token_hash: tokenHash,
		type: 'recovery'
	})

	if (error) {
		return error.message
	} else {
		redirect('/change-password')
	}
}
