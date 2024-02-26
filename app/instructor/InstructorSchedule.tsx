import ScheduleTable from "../course/ScheduleTab";
import { getNextTerm, getPreviousTerm, getCurrentTerm, section, sections, getCourseSections } from "../course/CourseSchedule";
import { SupabaseClient } from "@supabase/supabase-js";

async function InstructorSchedule({
    supabase
}: {
    supabase: SupabaseClient<any, "public", any>
}) {
    const nextTerm = await getNextTerm(true)
    const previousTerm = await getPreviousTerm(true)
    const currentTerm = await getCurrentTerm(true)
    const termSections: sections = await getCourseSections(await getNextTerm(false), await getCurrentTerm(false), await getPreviousTerm(false), 'instructor_name_fk', 'Kenneth Jackson', supabase)
    const currentTermSections: section[] = termSections['currentTerm']
    const previousTermSections: section[] = termSections['previousTerm']
    const nextTermSections: section[] = termSections['nextTerm']

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl">Instructor Schedule</h1>
            <ScheduleTable nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={currentTermSections} previousTermSections={previousTermSections} nextTermSections={nextTermSections} />
        </div>
    )

}

export default InstructorSchedule;