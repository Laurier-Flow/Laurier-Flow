'use server'

import CourseStats from "@/components/CourseStats"

export interface courseInfoDBResponse {
  course_code: string,
  total_reviews: number,
  easy: number,
  useful: number,
  liked: number,
  course_title: string
}

import React from "react"
import axios from "axios"
import * as cheerio from 'cheerio'
import { SupabaseClient } from '@supabase/supabase-js'

export async function getCourseData(supabase: SupabaseClient<any, "public", any>, courseName: string) {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('course_code', courseName)

  return data || []
}

async function getCourseDescription(subjectCode: string, courseNumber: string) {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getCourseDescription?term=202401&subjectCode=' + subjectCode + '&courseNumber=' + courseNumber)
    const $ = cheerio.load(response.data)
    const sectionElement = $('section[aria-labelledby="courseDescription"]')
    const courseInfo = sectionElement ? sectionElement.text().trim().replace(/<[^>]*>/g, '') : ''

    return courseInfo
  } catch (error) {
    console.error(error)
    return ''
  }
}

async function CourseInfo({
  supabase,
  courseName
}: {
  supabase: SupabaseClient<any, "public", any>,
  courseName: string
}) {
  const subjectCode = courseName.slice(0, 2)
  const courseNumber = courseName.slice(3)
  const [courseDescription, courseData] = await Promise.all([
    getCourseDescription(subjectCode, courseNumber),
    getCourseData(supabase, courseName)
  ])

  return (
    <div className="md:bg-white md:dark:bg-slate-950">
      <div className="flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
        <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
          <div className="flex flex-1 flex-col justify-end pl-4 text-background dark:text-foreground">
            <h1 className='text-2xl font-bold md:text-5xl'>{courseName}</h1>
            <h2 className='text-xl md:text-3xl pt-2'>{courseData[0].course_title}</h2>
          </div>
          <div className="hidden md:inline w-1/2 translate-y-28">
            <CourseStats courseData={courseData} courseDescription={courseDescription} />
          </div>
        </div>
      </div>

      <div className="hidden md:flex max-w-6xl mx-auto pt-8 pr-10 pl-4">
        <h3 className="w-1/2">{courseDescription}</h3>
      </div>

      <div className="md:hidden">
        <CourseStats courseData={courseData} courseDescription={courseDescription} />
      </div>
      <hr className="mb-8 md:mb-0 mt-8 border-gray-300 dark:border-gray-800"></hr>
    </div>
  )
};

export default CourseInfo