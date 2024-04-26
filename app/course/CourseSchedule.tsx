'use server'

import axios from 'axios';
import { SupabaseClient, User } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import dynamic from 'next/dynamic';
const ScheduleTable = dynamic(() => import('./ScheduleTab'), { ssr: false });

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
  days: days | null,
  location: string | undefined | null,
  instructor: string | undefined | null
}

export interface sections {
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

async function fetchSectionData(sectionData: sectionResponseDB, retryCount = 0, maxRetries = 5) {
  try {
    const [classDetailsResponse, enrollmentInfoResponse, facultyMeetingTimesResponse] = await Promise.all([
      axios.get('https://loris.wlu.ca/register/ssb/searchResults/getClassDetails?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString()),
      axios.post('https://loris.wlu.ca/register/ssb/searchResults/getEnrollmentInfo?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString()),
      axios.get('https://loris.wlu.ca/register/ssb/searchResults/getFacultyMeetingTimes?term=' + sectionData.term + '&courseReferenceNumber=' + sectionData.course_registration_number.toString())
    ]);

    return {
      sectionData: sectionData,
      classDetails: classDetailsResponse.data,
      enrollmentInfo: enrollmentInfoResponse.data,
      facultyMeetingTimes: facultyMeetingTimesResponse.data
    };
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 100;
      console.error(`Attempt ${retryCount + 1}: Retrying after ${delay} ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchSectionData(sectionData, retryCount + 1, maxRetries);
    } else {
      throw new Error(`Failed after ${maxRetries} retries: ${error}`);
    }
  }
}

export async function getCourseSections(nextTerm: string, currentTerm: string, previousTerm: string, filterCol: string, colValue: string, supabase: SupabaseClient<any, "public", any>, user: User | null) {
  const { data: sectionData, error: sectionError } = await supabase
    .from('sections')
    .select()
    .eq(filterCol, colValue)

  const courseSections: sections = {
    nextTerm: [],
    currentTerm: [],
    previousTerm: []
  }

  const sectionDataRequests = sectionData?.map(data => fetchSectionData(data))

  if (sectionDataRequests) {
    const sectionDataResponses = await Promise.all(sectionDataRequests);

    sectionDataResponses.forEach(element => {
      let $ = cheerio.load(element.classDetails)
      const section = $('#sectionNumber').text();
      // ts-ignore is used because of issues with types in the cheerio dependency
      /** @ts-ignore */
      const campus = $('span').filter((index, element) => $(element).text().includes('Campus:'))[0]?.next?.data?.trim()
      /** @ts-ignore */
      const type = $('span').filter((index, element) => $(element).text().includes('Instructional Method:'))[0]?.next?.data?.trim()

      $ = cheerio.load(element.enrollmentInfo)

      const enrollment = $('span:contains("Enrolment Actual:")').next().text();
      const enrollmentMax = $('span:contains("Enrolment Maximum:")').next().text();

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
      const location = (user ? element.facultyMeetingTimes.fmt[0]?.meetingTime?.room : null)

      let instructor = null
      if (filterCol === 'instructor_name_fk') {
        instructor = (user ? element.sectionData.course_code_fk : null)
      } else {
        instructor = (user ? element.sectionData.instructor_name_fk : null)
      }

      let c: section = {
        crn: element.sectionData.course_registration_number.toString(),
        type: type,
        section: section,
        campus: campus,
        enrollment: enrollment,
        enrollmentMax: enrollmentMax,
        beginTime: beginTime,
        endTime: endTime,
        days: days,
        location: location,
        instructor: instructor
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
  supabase,
  courseName,
  user
}: {
  supabase: SupabaseClient<any, "public", any>,
  courseName: string,
  user: User | null
}) {
  const [nextTerm, previousTerm, currentTerm, nextTermData, currentTermData, previousTermData] = await Promise.all([
    getNextTerm(true),
    getPreviousTerm(true),
    getCurrentTerm(true),
    getNextTerm(false),
    getCurrentTerm(false),
    getPreviousTerm(false)
  ]);

  const termSections = await getCourseSections(nextTermData, currentTermData, previousTermData, 'course_code_fk', courseName, supabase, user);

  const currentTermSections: section[] = termSections['currentTerm']
  const previousTermSections: section[] = termSections['previousTerm']
  const nextTermSections: section[] = termSections['nextTerm']

  return (
    <div className="flex flex-col p-4 lg:mt-8">
      <h1 className="text-xl">Course Schedule</h1>
      <ScheduleTable nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={currentTermSections} previousTermSections={previousTermSections} nextTermSections={nextTermSections} professor={false} user={user} />
    </div>
  );
}

export async function getNextTerm(pretty: boolean) {
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

export async function getCurrentTerm(pretty: boolean) {
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

export async function getPreviousTerm(pretty: boolean) {
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