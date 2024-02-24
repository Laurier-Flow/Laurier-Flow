'use server'

import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import CourseInfo from './CourseInfo';
import dynamic from 'next/dynamic';
import CourseReviews from './CourseReviews';
import { Suspense } from 'react';
import CourseSchedule from './CourseSchedule';
import Loading from '@/components/Loading';
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

async function CoursePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  return (
    <div className="flex flex-col justify-evenly w-full bg-slate-50 dark:bg-slate-950 lg:max-w-6xl lg:border-x-2 dark:lg:border-slate-900 lg:pl-6 lg:pr-6">
      <Suspense fallback={<Loading />}>
        <CourseInfo supabase={supabase} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CourseSchedule supabase={supabase} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <AddReview courseName='BU 283' />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CourseReviews supabase={supabase} />
      </Suspense>
    </div>
  )
}

export default CoursePage
