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
        return { success: false, message: error.message}
    } else {
        return { success: true, message: ''}
    }
};
