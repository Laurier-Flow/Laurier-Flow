'use server'

import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import CourseInfo from './CourseInfo';
import dynamic from 'next/dynamic';
import CourseReviews from './CourseReviews';
import { SupabaseClient } from '@supabase/supabase-js';
import { Suspense } from 'react';
import CourseSchedule from './CourseSchedule';
const AddReview = dynamic(() => import('./AddReview'), { ssr: false })

export interface days {
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean
}

export interface section {
  crn: string | undefined | null,
  type: string | undefined | null,
  section: string | undefined | null,
  campus: string | undefined | null,
  enrollment: string | undefined | null,
  enrollmentMax: string | undefined | null,
  beginTime: string | undefined | null,
  endTime: string | undefined | null,
  days: days | null
}

function loading() {
  return (
    <div className="flex animate-pulse">
      <div className="flex-shrink-0">
        <span className="size-12 block bg-gray-200 rounded-full dark:bg-gray-700"></span>
      </div>

      <div className="ms-4 mt-2 w-full">
        <h3 className="h-4 bg-gray-200 rounded-full dark:bg-gray-700"></h3>

        <ul className="mt-5 space-y-3">
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700"></li>
        </ul>
      </div>
    </div>
  )
}

async function CoursePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  return (
    <div className="flex flex-col justify-evenly max-w-full lg:max-w-6xl">
      <Suspense fallback={loading()}>
        <CourseInfo supabase={supabase} />
      </Suspense>
      <CourseSchedule supabase={supabase} />
      <AddReview courseName='BU 283' />
      <Suspense fallback={loading()}>
        <CourseReviews supabase={supabase} />
      </Suspense>
    </div>
  )
}

export default CoursePage
