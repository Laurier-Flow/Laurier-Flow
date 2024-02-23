'use server'

interface courseInfoDBResponse {
  course_code: string,
  total_reviews: number,
  easy: number,
  useful: number,
  liked: number,
  course_title: string
}

interface prerequisite {
  andOr: string,
  leftParentheses: string,
  rightParentheses: string,
  subject: string,
  courseNumber: string,
  level: string,
  grade: string
}

import React from "react";
import axios from "axios";
import * as cheerio from 'cheerio';
import { SupabaseClient } from '@supabase/supabase-js';

async function getPrerequisites() {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getPrerequisites?term=202401&subjectCode=BU&courseNumber=283');
    const $ = cheerio.load(response.data);

    const prerequisites: prerequisite[] = [];

    $('section[aria-labelledby="preReqs"] tbody tr').each((index, element) => {
      const columns = $(element).find('td');

      const andOr = $(columns[0]).text().trim().toLowerCase();
      const leftParentheses = $(columns[1]).text().trim();
      const rightParentheses = $(columns[8]).text().trim();
      const subject = $(columns[4]).text().trim();
      const courseNumber = $(columns[5]).text().trim();
      const level = $(columns[6]).text().trim();
      const grade = $(columns[7]).text().trim();

      prerequisites.push({
        andOr,
        leftParentheses,
        rightParentheses,
        subject,
        courseNumber,
        level,
        grade,
      });
    });

    return prerequisites;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getCourseData(supabase: SupabaseClient<any, "public", any>) {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('course_code', 'BU 283')

  return data || [];
}

async function getCourseDescription() {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getCourseDescription?term=202401&subjectCode=BU&courseNumber=283');
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
  supabase
}: {
  supabase: SupabaseClient<any, "public", any>
}) {
  const prerequisites: prerequisite[] = await getPrerequisites();
  const courseDescription = await getCourseDescription();
  const courseData: courseInfoDBResponse[] = await getCourseData(supabase);

  return (
    <>
      <div className='flex flex-col p-4'>
        <h1 className='text-2xl font-bold'>{courseData[0].course_code}</h1>
        <h2 className='text-xl'>{courseData[0].course_title}</h2>
      </div>

      <div className='flex flex-col p-4'>
        <div className='flex flex-row'>
          <div className="relative h-40 w-40">
            <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-800" strokeWidth="2"></circle>
              <g className="origin-center -rotate-90 transform">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary dark:text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={`${courseData[0].total_reviews !== 0
                  ? 100 - (courseData[0].liked / courseData[0].total_reviews) * 100
                  : 100}`}></circle>
              </g>
            </svg>
            <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className='flex flex-col items-center'>
                <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{courseData[0].total_reviews !== 0
                  ? (courseData[0].liked / courseData[0].total_reviews) * 100
                  : 0}%</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">Liked</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-evenly p-4">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Easy</h3>
                <span className="text-sm text-gray-800 dark:text-white">
                  {courseData[0].total_reviews !== 0 ? (courseData[0].easy * 20) + '%' : '0%'}
                </span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-primary" style={{ width: `${courseData[0].easy * 20}%` }}></div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white pt-6">Useful</h3>
                <span className="text-sm text-gray-800 dark:text-white pt-6">{courseData[0].total_reviews !== 0 ? (courseData[0].useful * 20) + '%' : '0%'}</span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-primary text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-primary" style={{ width: `${courseData[0].useful * 20}%` }}></div>
              </div>
            </div>

            <p className='pt-4'>{courseData[0].total_reviews} ratings</p>
          </div>
        </div>
        <h3 className='pt-4'>{courseDescription}</h3>
      </div>

      <div className="flex flex-col p-4">
        <h1 className="text-xl">{courseData[0].course_code} Prerequisites</h1>
        <h2 className="pt-2">
          {prerequisites.length > 0 ? (
            prerequisites.map((prerequisite: prerequisite, index) => (
              <React.Fragment key={index}>
                {' ' + prerequisite?.andOr} {prerequisite?.leftParentheses}
                <b>
                  {prerequisite?.subject} {prerequisite?.courseNumber}
                </b>{' '}
                (Min. Grade {prerequisite?.grade}) {prerequisite?.rightParentheses}
              </React.Fragment>
            ))
          ) : (
            'No Prerequisite Information Available'
          )}
        </h2>
      </div>
    </>
  );
};

export default CourseInfo;