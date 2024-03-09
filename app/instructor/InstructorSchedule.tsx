import ScheduleTable from "../course/ScheduleTab";
import { getNextTerm, getPreviousTerm, getCurrentTerm, section, sections, getCourseSections } from "../course/CourseSchedule";
import { SupabaseClient } from "@supabase/supabase-js";

async function InstructorSchedule({
    supabase,
    instructorName
}: {
    supabase: SupabaseClient<any, "public", any>,
    instructorName: string
}) {
    const nextTerm = await getNextTerm(true)
    const previousTerm = await getPreviousTerm(true)
    const currentTerm = await getCurrentTerm(true)
    const termSections: sections = await getCourseSections(await getNextTerm(false), await getCurrentTerm(false), await getPreviousTerm(false), 'instructor_name_fk', instructorName, supabase)
    const currentTermSections: section[] = termSections['currentTerm']
    const previousTermSections: section[] = termSections['previousTerm']
    const nextTermSections: section[] = termSections['nextTerm']

    return (
        <div className="flex flex-col p-4 lg:mt-8">
            <h1 className="text-xl">Instructor Schedule</h1>
            <ScheduleTable nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={currentTermSections} previousTermSections={previousTermSections} nextTermSections={nextTermSections} professor={true} />
        </div>
    )

}

export default InstructorSchedule;