import { SupabaseClient } from "@supabase/supabase-js"
import { getCurrentTerm } from "../course/CourseSchedule"
import React from "react";

interface instructorInfoDBResponse {
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

  return data || [];
}

async function getCurrentCourses(supabase: SupabaseClient<any, "public", any>, instructorName: string) {
  const { data, error } = await supabase
    .from('sections')
    .select()
    .eq('instructor_name_fk', instructorName)

  const courses = new Set<string>();
  const currentTerm = await getCurrentTerm(false);

  data?.forEach(section => {
    if (section.term === currentTerm) {
      courses.add(section.course_code_fk)
    }
  });

  return (courses)
}

async function InstructorInfo({
  supabase,
  instructorName
}: {
  supabase: SupabaseClient<any, "public", any>,
  instructorName: string
}) {
  const instructorData: instructorInfoDBResponse[] = await getInstructorData(supabase, instructorName);
  const currentCourses = await getCurrentCourses(supabase, instructorName)


  return (
    <>
      <div className='flex flex-col p-4'>
        <h1 className='text-2xl font-bold'>{instructorData[0].instructor_name}</h1>
        <h2 className='text-xl'>{instructorData[0].instructor_email}</h2>
      </div>





      <div className='flex flex-col p-4'>
        <div className='flex flex-row'>
          <div className="relative h-40 w-40">
            <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-800" strokeWidth="2"></circle>
              <g className="origin-center -rotate-90 transform">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary dark:text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={`${instructorData[0].total_reviews !== 0
                  ? 100 - (instructorData[0].liked / instructorData[0].total_reviews) * 100
                  : 100}`}></circle>
              </g>
            </svg>
            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className='flex flex-col items-center'>
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{instructorData[0].total_reviews !== 0
                  ? (instructorData[0].liked / instructorData[0].total_reviews) * 100
                  : 0}%</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Liked</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-evenly p-4">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Clear</h3>
                <span className="text-sm text-gray-800 dark:text-white">
                  {instructorData[0].total_reviews !== 0 ? (instructorData[0].clear * 20) + '%' : '0%'}
                </span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-primary" style={{ width: `${instructorData[0].clear * 20}%` }}></div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white pt-6">Engaging</h3>
                <span className="text-sm text-gray-800 dark:text-white pt-6">{instructorData[0].total_reviews !== 0 ? (instructorData[0].engaging * 20) + '%' : '0%'}</span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-primary" style={{ width: `${instructorData[0].engaging * 20}%` }}></div>
              </div>
            </div>

            <p className='pt-4'>{instructorData[0].total_reviews} ratings</p>
          </div>
        </div>
        {currentCourses.size > 0 ? (
          <h3 className='pt-4 text-lg font-medium'>Currently teaches {
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
          <h3 className="pt-4 text-lg font-medium">Not currently teaching anything</h3>
        )}
      </div>
    </>
  )
}

export default InstructorInfo;