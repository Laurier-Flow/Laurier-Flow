'use server'

import { useState } from "react";
import DaysDisplay from "./DaysDisplay";
import axios from 'axios';
import { SupabaseClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import ScheduleTable from "./ScheduleTab";

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

interface sections {
    nextTerm: section[],
    currentTerm: section[],
    previousTerm: section[]
}

interface sectionResponseDB {
    course_registration_number: number,
    term: string,
    instructor_name_fk: string,
    course_code_fk: string
}

async function fetchSectionData(sectionData: sectionResponseDB) {
    try {
        const [classDetailsResponse, enrollmentInfoResponse, facultyMeetingTimesResponse] = await Promise.all([
            axios.get('https://loris.wlu.ca/register/ssb/searchResults/getClassDetails?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString()),
            axios.get('https://loris.wlu.ca/register/ssb/searchResults/getEnrollmentInfo?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString()),
            axios.get('https://loris.wlu.ca/register/ssb/searchResults/getFacultyMeetingTimes?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString())
        ]);

        return {
            sectionData: sectionData,
            classDetails: classDetailsResponse.data,
            enrollmentInfo: enrollmentInfoResponse.data,
            facultyMeetingTimes: facultyMeetingTimesResponse.data
        };
    } catch (error) {
        return fetchSectionData(sectionData)
    }
}

async function getCourseSections(nextTerm: string, currentTerm: string, previousTerm: string, supabase: SupabaseClient<any, "public", any>) {
    const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select()
        .eq('course_code_fk', 'BU 283')

    const courseSections: sections = {
        nextTerm: [],
        currentTerm: [],
        previousTerm: []
    }

    const sectionDataRequests = sectionData?.map(fetchSectionData)

    if (sectionDataRequests) {
        const sectionDataResponses = await Promise.all(sectionDataRequests);

        sectionDataResponses.forEach(element => {
            let $ = cheerio.load(element.classDetails)
            const section = $('#sectionNumber').text();
            // ts-ignore is used because of issues with types in the cheerio dependency
            /** @ts-ignore */
            const campus = $('span').filter((index, element) => $(element).text().includes('Campus:'))[0].next?.data?.trim()
            /** @ts-ignore */
            const type = $('span').filter((index, element) => $(element).text().includes('Instructional Method:'))[0].next?.data?.trim()

            $ = cheerio.load(element.enrollmentInfo)
            /** @ts-ignore */
            const enrollment = $('span').filter((index, element) => $(element).text().includes('Enrolment Actual:'))[0].next?.next?.children[0].data.trim()
            /** @ts-ignore */
            const enrollmentMax = $('span').filter((index, element) => $(element).text().includes('Enrolment Maximum:'))[0].next?.next?.children[0].data.trim()

            const beginTime = element.facultyMeetingTimes.fmt[0]?.meetingTime?.beginTime
            const endTime = element.facultyMeetingTimes.fmt[0]?.meetingTime?.endTime
            const days = {
                monday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.monday,
                tuesday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.tuesday,
                wednesday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.wednesday,
                thursday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.thursday,
                friday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.friday,
                saturday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.saturday,
                sunday: element.facultyMeetingTimes.fmt[0]?.meetingTime?.sunday
            };

            let c: section = {
                crn: element.sectionData.course_registration_number.toString(),
                type: type,
                section: section,
                campus: campus,
                enrollment: enrollment,
                enrollmentMax: enrollmentMax,
                beginTime: beginTime,
                endTime: endTime,
                days: days
            }

            if (element.sectionData.term == nextTerm) {
                courseSections['nextTerm']?.push(c)
            } else if (element.sectionData.term == currentTerm) {
                courseSections['currentTerm']?.push(c)
            } else if (element.sectionData.term == previousTerm) {
                courseSections['previousTerm']?.push(c)
            }
        });
    }

    return courseSections;
}

async function CourseSchedule({
    supabase
}: {
    supabase: any
}) {
    const nextTerm = getNextTerm(true)
    const previousTerm = getPreviousTerm(true)
    const currentTerm = getCurrentTerm(true)
    const termSections: sections = await getCourseSections(getNextTerm(false), getCurrentTerm(false), getPreviousTerm(false), supabase)
    const currentTermSections: section[] = termSections['currentTerm']
    const previousTermSections: section[] = termSections['previousTerm']
    const nextTermSections: section[] = termSections['nextTerm']

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl">Course Schedule</h1>
            <ScheduleTable nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={currentTermSections} previousTermSections={previousTermSections} nextTermSections={nextTermSections} />
        </div>
    );
}

function getNextTerm(pretty: boolean) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    if (pretty) {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `Spring ${currentYear}`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `Fall ${currentYear}`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `Winter ${currentYear + 1}`
      }
    } else {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `${currentYear}05`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `${currentYear}09`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `${currentYear + 1}01`
      }
    }
  
    return ''
  }
  
  function getCurrentTerm(pretty: boolean) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    if (pretty) {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `Winter ${currentYear}`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `Spring ${currentYear}`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `Fall ${currentYear}`
      }
    } else {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `${currentYear}01`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `${currentYear}05`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `${currentYear}09`
      }
    }
  
    return ''
  }
  
  function getPreviousTerm(pretty: boolean) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    if (pretty) {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `Fall ${currentYear - 1}`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `Winter ${currentYear}`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `Spring ${currentYear}`
      }
    } else {
      if (0 <= currentMonth && currentMonth <= 3) {
        return `${currentYear - 1}09`
      } else if (4 <= currentMonth && currentMonth <= 7) {
        return `${currentYear}01`
      } else if (8 <= currentMonth && currentMonth <= 11) {
        return `${currentYear}09`
      }
    }
  
    return ''
  }

export default CourseSchedule;