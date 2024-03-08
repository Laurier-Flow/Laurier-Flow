'use server'

import CourseStats from "@/components/CourseStats";

export interface courseInfoDBResponse {
  course_code: string,
  total_reviews: number,
  easy: number,
  useful: number,
  liked: number,
  course_title: string
}

import React from "react";
import axios from "axios";
import * as cheerio from 'cheerio';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getCourseData(supabase: SupabaseClient<any, "public", any>, courseName: string) {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('course_code', courseName)

  return data || [];
}

async function getCourseDescription(subjectCode: string, courseNumber: string) {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getCourseDescription?term=202401&subjectCode=' + subjectCode + '&courseNumber=' + courseNumber);
    const $ = cheerio.load(response.data);
    const sectionElement = $('section[aria-labelledby="courseDescription"]');
    const courseInfo = sectionElement ? sectionElement.text().trim().replace(/<[^>]*>/g, '') : '';

    return courseInfo;
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function CourseInfo({
  supabase,
  courseName
}: {
  supabase: SupabaseClient<any, "public", any>,
  courseName: string
}) {
  const subjectCode = courseName.slice(0, 2);
  const courseNumber = courseName.slice(3);
  const courseDescription = await getCourseDescription(subjectCode, courseNumber);
  const courseData: courseInfoDBResponse[] = await getCourseData(supabase, courseName);

  return (
    <div className="lg:bg-slate-50 lg:dark:bg-slate-950">
      <div className="flex flex-col p-4 lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] lg:flex-row lg:justify-center">
        <div className="flex flex-1 lg:pt-20 flex-row justify-between max-w-6xl">
          <div className="flex flex-1 flex-col justify-end pl-4">
            <h1 className='text-2xl font-bold lg:text-5xl'>{courseData[0].course_code}</h1>
            <h2 className='text-xl lg:text-3xl pt-2'>{courseData[0].course_title}</h2>
          </div>
          <div className="hidden lg:inline w-1/2 translate-y-28">
            <CourseStats courseData={courseData} courseDescription={courseDescription} />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex max-w-6xl mx-auto pt-8 pr-10 pl-4">
        <h3 className="w-1/2">{courseDescription}</h3>
      </div>

      <div className="lg:hidden">
        <CourseStats courseData={courseData} courseDescription={courseDescription} />
      </div>
      <hr className="mb-8 lg:mb-0 mt-8 border-gray-300 dark:border-gray-800"></hr>
    </div>
  );
};

export default CourseInfo;