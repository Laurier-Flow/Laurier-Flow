'use server'

import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import CourseInfo from './CourseInfo';
import dynamic from 'next/dynamic';
import CourseReviews from './CourseReviews';
import { SupabaseClient } from '@supabase/supabase-js';
import { Suspense } from 'react';
const CourseSchedule = dynamic(() => import('./CourseSchedule'), { ssr: false });
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
    <div className="flex flex-col justify-evenly max-w-full lg:max-w-6xl">
      <Suspense fallback={<p>LOADING COURSE DATA WORKS!!!!</p>}>
        <CourseInfo supabase={supabase} />
      </Suspense>
      <Suspense fallback={<p>LOADING COURSE SCHEDULE WORKS!!!!</p>}>
        <CourseSchedule supabase={supabase} />
      </Suspense>
      <AddReview courseName='BU 283' />
      <Suspense fallback={<p>LOADING COURSE REVIEWS WORKS!!!!</p>}>
        <CourseReviews supabase={supabase} />
      </Suspense>
    </div>
  )
}

export default CoursePage
