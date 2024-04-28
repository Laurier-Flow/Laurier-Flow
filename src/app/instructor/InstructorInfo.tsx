import { SupabaseClient } from "@supabase/supabase-js"
import { getCurrentTerm } from "../course/CourseSchedule"
import React from "react"
import InstructorStats from "@/components/InstructorStats"

export interface instructorInfoDBResponse {
  instructor_name: string,
  total_reviews: number,
  clear: number,
  engaging: number,
  liked: number,
  instructor_email: string
}

async function getInstructorData(supabase: SupabaseClient<any, "public", any>, instructorName: string) {
  const { data, error } = await supabase
    .from('instructors')
    .select()
    .eq('instructor_name', instructorName)

  return data || []
}

async function getCurrentCourses(supabase: SupabaseClient<any, "public", any>, instructorName: string) {
  const { data, error } = await supabase
    .from('sections')
    .select()
    .eq('instructor_name_fk', instructorName)

  const courses = new Set<string>()
  const currentTerm = await getCurrentTerm(false)

  data?.forEach(section => {
    if (section.term === currentTerm) {
      courses.add(section.course_code_fk)
    }
  })

  return (courses)
}

async function InstructorInfo({
  supabase,
  instructorName
}: {
  supabase: SupabaseClient<any, "public", any>,
  instructorName: string
}) {
  const [instructorData, currentCourses] = await Promise.all([
    getInstructorData(supabase, instructorName),
    getCurrentCourses(supabase, instructorName)
  ])

  return (
    <div className="md:bg-white md:dark:bg-slate-950">
      <div className="flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
        <div className="flex flex-1 pt-20 flex-row justify-between max-w-6xl">
          <div className="flex flex-1 flex-col justify-end pl-4">
            <h1 className='text-2xl font-bold md:text-5xl text-white'>{instructorData[0].instructor_name}</h1>
            <h2 className='text-xl md:text-3xl pt-2 text-white'>{instructorData[0].instructor_email}</h2>
          </div>
          <div className="hidden md:inline w-1/2 translate-y-28">
            <InstructorStats instructorData={instructorData} currentCourses={currentCourses} />
          </div>
        </div>
      </div>

      <div className="hidden md:flex max-w-6xl mx-auto pt-8 pr-10 pl-4">
        {currentCourses.size > 0 ? (
          <h3 className='w-1/3 pt-4 text-lg font-medium'>Currently teaches {
            Array.from(currentCourses).map((course, index) => (
              <React.Fragment key={index}>
                {index === currentCourses.size - 1 ? (
                  course
                ) : (
                  `${course}, `
                )}
              </React.Fragment>
            ))}
          </h3>
        ) : (
          <h3 className="w-1/3 pt-4 text-lg font-medium">Not currently teaching anything</h3>
        )}
      </div>

      <div className="md:hidden">
        <InstructorStats instructorData={instructorData} currentCourses={currentCourses} />
      </div>
      <hr className="mb-8 md:mb-0 mt-8 border-gray-300 dark:border-gray-800"></hr>
    </div>
  )
}

export default InstructorInfo