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
        if (error.message.startsWith("Password should contain at least one")) {
            return { success: false, message: "Password should contain: 1 upper-case character, 1 lower-case character, a number, a special character"}
        }
        return { success: false, message: error.message}
    } else {
        redirect('/');
        return { success: true, message: ""}
    }
};