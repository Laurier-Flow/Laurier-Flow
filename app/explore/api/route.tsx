import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const url = new URL(req.url)
    const page = Number(url.searchParams.get("page"))

    if (page) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .range(page * 100, (page + 1) * 100 - 1)

        if (error) return Response.error()
        return Response.json({ 'data': data })
    } else {
        return Response.error()
    }
}