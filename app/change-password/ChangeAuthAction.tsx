'use server'

import { createClient } from "@/utils/supabase/server"
import { UserAttributes } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const handleChangePassword = async (newPassword: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        if (error.message.startsWith("Password should")) {
            return { success: false, message: "Password must be at least 6 characters and include at least one uppercase letter, lowercase letter, number, and special character"}
        }
        return { success: false, message: error.message}
    } else {
        redirect('/');
        return { success: true, message: ""}
    }
};
