'use server'

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const handleVerifyEmail = async (tokenHash: string) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })    
}