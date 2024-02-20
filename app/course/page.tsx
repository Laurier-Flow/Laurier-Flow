'use server'

import { cookies, headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import CourseInfo from './CourseInfo';
import dynamic from 'next/dynamic';
import CourseReviews from './CourseReviews';
const CourseSchedule = dynamic(() => import('./CourseSchedule'), { ssr: false });
const AddReview = dynamic(() => import('./AddReview'), { ssr: false })
const cookieStore = cookies();
const supabase = createClient(cookieStore);

async function getCourseData() {
  const { data, error } = await supabase
    .from('courses')
    .select()
    .eq('course_code', 'BU 283')

  return data || [];
}

async function getCourseReviews() {
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
    const dom = new JSDOM(response.data);
    const sectionElement = dom.window.document.querySelector('section[aria-labelledby="courseDescription"]');
    const textContent = sectionElement ? sectionElement.textContent : '';
    const courseInfo = textContent ? textContent.replace(/<[^>]*>/g, '') : '';
    return courseInfo;
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function getPrerequisites() {
  try {
    const response = await axios.get('https://loris.wlu.ca/register/ssb/courseSearchResults/getPrerequisites?term=202401&subjectCode=BU&courseNumber=283');
    const dom = new JSDOM(response.data);
    const { document } = dom.window;

    const prerequisites: { andOr: string; leftParentheses: string; rightParentheses: string; subject: string; courseNumber: string; level: string; grade: string; }[] = [];

    document.querySelectorAll('section[aria-labelledby="preReqs"] tbody tr').forEach((element) => {
      const columns = element.querySelectorAll('td');

      const andOr: string = (columns[0].textContent || '').trim().toLowerCase();
      const leftParentheses: string = (columns[1].textContent || '').trim();
      const rightParentheses: string = (columns[8].textContent || '').trim();
      const subject: string = (columns[4].textContent || '').trim();
      const courseNumber: string = (columns[5].textContent || '').trim();
      const level: string = (columns[6].textContent || '').trim();
      const grade: string = (columns[7].textContent || '').trim();

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

async function getRestrictions() {


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

async function getCourseSectionsByTerm(term: string) {
  const { data: termData, error: nextTermError } = await supabase
    .from('sections')
    .select()
    .eq('course_code_fk', 'BU 283')
    .eq('term', term);

  let sections: any[] = [];

  if (termData !== null && termData !== undefined) {
    for (const s of termData) {
      let crn = null;
      let type = null;
      let section = null;
      let campus = null;
      let enrollment = null;
      let enrollementMax = null;
      let waitlist = null;
      let waitlistMax = null;
      let beginTime = null;
      let endTime = null;
      let days = null;

      try {
        const response = await axios.get('https://loris.wlu.ca/register/ssb/searchResults/getClassDetails?term=' + s.term + '&courseReferenceNumber=' + s.course_registration_number.toString());
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        crn = document.getElementById('courseReferenceNumber')?.textContent;
        section = document.getElementById('sectionNumber')?.textContent;
        campus = Array.from(document.querySelectorAll('span')).find(span => span.textContent?.includes('Campus:'))?.nextSibling?.textContent?.trim();
        type = Array.from(document.querySelectorAll('span')).find(span => span.textContent?.includes('Instructional Method:'))?.nextSibling?.textContent?.trim();
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await axios.get('https://loris.wlu.ca/register/ssb/searchResults/getEnrollmentInfo?term=' + s.term + '&courseReferenceNumber=' + s.course_registration_number.toString());
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        enrollment = Array.from(document.querySelectorAll('span')).find(span => span.textContent?.includes('Enrolment Actual:'))?.nextElementSibling?.textContent?.trim();
        enrollementMax = Array.from(document.querySelectorAll('span')).find(span => span.textContent?.includes('Enrolment Maximum:'))?.nextElementSibling?.textContent?.trim();
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await axios.get('https://loris.wlu.ca/register/ssb/searchResults/getFacultyMeetingTimes?term=' + s.term + '&courseReferenceNumber=' + s.course_registration_number.toString());

        beginTime = response.data.fmt[0]?.meetingTime?.beginTime;
        endTime = response.data.fmt[0]?.meetingTime?.endTime;
        days = {
          monday: response.data.fmt[0]?.meetingTime?.monday,
          tuesday: response.data.fmt[0]?.meetingTime?.tuesday,
          wednesday: response.data.fmt[0]?.meetingTime?.wednesday,
          thursday: response.data.fmt[0]?.meetingTime?.thursday,
          friday: response.data.fmt[0]?.meetingTime?.friday,
          saturday: response.data.fmt[0]?.meetingTime?.saturday,
          sunday: response.data.fmt[0]?.meetingTime?.sunday
        }
      } catch (error) {
        console.error(error);
      }

      section = {
        crn: crn,
        type: type,
        section: section,
        campus: campus,
        enrollment: enrollment,
        enrollementMax: enrollementMax,
        beginTime: beginTime,
        endTime: endTime,
        days: days
      }

      sections.push(section)
    }

    return sections
  }

  return sections || [];
}


async function CoursePage() {
  const courseData = await getCourseData()
  const courseDescription = await getCourseDescription()
  const prerequisites = await getPrerequisites()
  const nextTerm = getNextTerm(true)
  const previousTerm = getPreviousTerm(true)
  const currentTerm = getCurrentTerm(true)
  const nextTermSections = await getCourseSectionsByTerm(getNextTerm(false))
  const previousTermSections = await getCourseSectionsByTerm(getPreviousTerm(false))
  const currentTermSections = await getCourseSectionsByTerm(getCurrentTerm(false))
  const courseReviews = await getCourseReviews();

  return (
    <div className="flex flex-col justify-evenly max-w-full lg:max-w-6xl">
      <CourseInfo courseData={courseData} courseInfo={courseDescription} prerequisites={prerequisites} />
      <CourseSchedule nextTerm={nextTerm} previousTerm={previousTerm} currentTerm={currentTerm} currentTermSections={currentTermSections} previousTermSections={previousTermSections} nextTermSections={nextTermSections} />
      <AddReview courseName='BU 283' />
      <CourseReviews courseReviews={courseReviews} />
    </div>
  )
}

export default CoursePage
