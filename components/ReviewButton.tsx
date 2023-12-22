import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ReviewButton() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return user ? (
        <Link
            href="/review"
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            Add Review
        </Link>
    ) : (
        <>
        </>
    )
}