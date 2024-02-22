'use server'

import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import CourseInfo from './CourseInfo';
import dynamic from 'next/dynamic';
import CourseReviews from './CourseReviews';
import { SupabaseClient } from '@supabase/supabase-js';
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

async function getCourseData(supabase: SupabaseClient<any, "public", any>) {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('course_code', 'BU 283')

  return data || [];
}

async function getCourseReviews(supabase: SupabaseClient<any, "public", any>) {
  try {
    const { data, error } = await supabase
      .from('course_reviews')
      .select()
      .eq('course_code_fk', 'BU 283')

    let reviews = []

    if (data !== null && data !== undefined) {
      for (const s of data) {
        const createdAt = s.created_at;
        const easy = s.easy;
        const useful = s.useful;
        const liked = s.liked;
        const instructor = s.instructor;
        const body = s.body;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('user_id', s.user_id_fk);

          let userData = null;

          if (data !== null && data !== undefined && data.length > 0) {
            userData = data[0].program;
          }

          const review = {
            createdAt: createdAt,
            easy: easy,
            useful: useful,
            liked: liked,
            instructor: instructor,
            program: userData,
            body: body
          };

          reviews.push(review);

        } catch (error) {
          console.error(error);
        }
      }

      return reviews || [];
    }
  } catch (error) {
    console.error(error);
  }
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

async function getPrerequisites() {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getPrerequisites?term=202401&subjectCode=BU&courseNumber=283');
    const $ = cheerio.load(response.data);

    const prerequisites: { andOr: string; leftParentheses: string; rightParentheses: string; subject: string; courseNumber: string; level: string; grade: string; }[] = [];

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
    return '';
  }
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


async function CoursePage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const nextTerm = getNextTerm(true)
  const previousTerm = getPreviousTerm(true)
  const currentTerm = getCurrentTerm(true)

  const [
    courseData,
    courseDescription,
    prerequisites,
    courseReviews,
    sections
  ] = await Promise.all([
    getCourseData(supabase),
    getCourseDescription(),
    getPrerequisites(),
    getCourseReviews(supabase),
    getCourseSections(getNextTerm(false), getCurrentTerm(false), getPreviousTerm(false), supabase)
  ]);

  return (
    <div className="flex flex-col justify-evenly max-w-full lg:max-w-6xl">
      <CourseInfo courseData={courseData} courseInfo={courseDescription} prerequisites={prerequisites} />
      <CourseSchedule nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={sections['currentTerm']} previousTermSections={sections['previousTerm']} nextTermSections={sections['nextTerm']} />
      <AddReview courseName='BU 283' />
      <CourseReviews courseReviews={courseReviews} />
    </div>
  )
}

export default CoursePage
