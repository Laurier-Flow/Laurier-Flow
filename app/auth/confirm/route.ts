import { type EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next

    console.log(token_hash)
    
    if (token_hash && type) {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        console.log(error)

        if (!error) {
            return NextResponse.redirect(redirectTo)
        }
    }

    redirectTo.pathname = '/'
    return NextResponse.redirect(redirectTo)
}