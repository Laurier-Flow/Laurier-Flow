import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const url = new URL(req.url)

    const firstYear = url.searchParams.get("firstYear") === "true"
    const secondYear = url.searchParams.get("secondYear") === "true"
    const thirdYear = url.searchParams.get("thirdYear") === "true"
    const fourthYear = url.searchParams.get("fourthYear") === "true"
    const seniorYear = url.searchParams.get("seniorYear") === "true"
    const minRatings = Number(url.searchParams.get("minRatings"))
    const thisTerm = url.searchParams.get("thisTerm") === "true"
    const afterTerm = url.searchParams.get("afterTerm") === "true"

    const currentTerm = url.searchParams.get("currentTerm")
    const nextTerm = url.searchParams.get("nextTerm")
    let subject = url.searchParams.get("subject")

    const page = Number(url.searchParams.get("page"))

    const levelPatterns = []
    if (firstYear) levelPatterns.push('% 1%')
    if (secondYear) levelPatterns.push('% 2%')
    if (thirdYear) levelPatterns.push('% 3%')
    if (fourthYear) levelPatterns.push('% 4%')
    if (seniorYear) {
        levelPatterns.push('% 5%')
        levelPatterns.push('% 6%')
        levelPatterns.push('% 7%')
        levelPatterns.push('% 8%')
    }

    const termPattern = []
    if (thisTerm && currentTerm) {
        termPattern.push(currentTerm)
    }

    if (afterTerm && nextTerm) {
        termPattern.push(nextTerm)
    }

    if (!afterTerm && !thisTerm) {
        termPattern.push('%')
    }

    if (page || page === 0) {
        const { data, error, count } = await supabase
            .from('courses')
            .select(`
                *, sections!inner(*)
            `, { count: 'exact' })
            .ilikeAnyOf('course_code', levelPatterns)
            .ilike('course_code', `${(subject === 'all') ? ('%') : (`${subject}%`)}`)
            .gte('total_reviews', minRatings)
            .range(page * 50, (page + 1) * 50 - 1);

        if (error) return Response.error()
        return Response.json({ 'data': data, 'totalCount': count })
    } else {
        return Response.error()
    }
}