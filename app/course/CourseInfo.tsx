'use server'

import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, Key } from "react";
import CourseSchedule from "./CourseSchedule";

function CourseInfo({
  courseData,
  courseInfo,
  prerequisites,
}: {
  courseData: any;
  courseInfo: any;
  prerequisites: any;
}) {
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
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" stroke-width="2"></circle>
              <g className="origin-center -rotate-90 transform">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-600 dark:text-blue-500" stroke-width="2" stroke-dasharray="100" stroke-dashoffset={`${courseData[0].total_reviews !== 0
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
                  {courseData[0].total_reviews !== 0 ? (courseData[0].easy * 10) + '%' : '0%'}
                </span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{ width: `${courseData[0].easy * 10}%` }}></div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white pt-6">Useful</h3>
                <span className="text-sm text-gray-800 dark:text-white pt-6">{courseData[0].total_reviews !== 0 ? (courseData[0].useful * 10) + '%' : '0%'}</span>
              </div>
              <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style={{ width: `${courseData[0].useful * 10}%` }}></div>
              </div>
            </div>

            <p className='pt-4'>{courseData[0].total_reviews} ratings</p>
          </div>
        </div>
        <h3 className='pt-4'>{courseInfo}</h3>
      </div>




      <div className="flex flex-col p-4">
        <h1 className="text-xl">{courseData[0].course_code} Prerequisites</h1>
        <h2 className="pt-2">
          {prerequisites.length > 0 ? (prerequisites.map((prerequisite: { andOr?: string; leftParentheses?: string; subject?: string; courseNumber?: string; grade?: string; rightParentheses?: string; }) =>
            <>
              {' ' + prerequisite?.andOr} {prerequisite?.leftParentheses}<b>{prerequisite?.subject} {prerequisite?.courseNumber}</b> (Min. Grade {prerequisite?.grade}) {prerequisite?.rightParentheses}
            </>
          )) : (
            'No Prerequisite Information Available'
          )}
        </h2>

      </div>
    </>
  );
};

export default CourseInfo;