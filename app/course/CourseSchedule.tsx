'use server'

import axios from 'axios'
import { SupabaseClient, User } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'
import dynamic from 'next/dynamic'
import { getTerms, getDefaultTab } from './getTerms'
const ScheduleTable = dynamic(() => import('./ScheduleTab'), { ssr: false })

export interface days {
	monday: boolean
	tuesday: boolean
	wednesday: boolean
	thursday: boolean
	friday: boolean
	saturday: boolean
	sunday: boolean
}

export interface section {
	crn: string | undefined | null
	type: string | undefined | null
	section: string | undefined | null
	campus: string | undefined | null
	enrollment: string | undefined | null
	enrollmentMax: string | undefined | null
	beginTime: string | undefined | null
	endTime: string | undefined | null
	days: days | null
	location: string | undefined | null
	instructor: string | undefined | null
}

export interface sections {
	springTerm: section[]
	fallTerm: section[]
	winterTerm: section[]
	nextSpringTerm: section[]
}

interface sectionResponseDB {
	course_registration_number: number
	term: string
	instructor_name_fk: string
	course_code_fk: string
}

async function fetchSectionData(
	sectionData: sectionResponseDB,
	retryCount = 0,
	maxRetries = 5
) {
	try {
		const [
			classDetailsResponse,
			enrollmentInfoResponse,
			facultyMeetingTimesResponse
		] = await Promise.all([
			axios.get(
				'https://loris.wlu.ca/register/ssb/searchResults/getClassDetails?term=' +
				sectionData.term +
				'&courseReferenceNumber=' +
				sectionData.course_registration_number.toString(),
				{ timeout: 10000 }
			),
			axios.post(
				'https://loris.wlu.ca/register/ssb/searchResults/getEnrollmentInfo?term=' +
				sectionData.term +
				'&courseReferenceNumber=' +
				sectionData.course_registration_number.toString(),
				null,
				{ timeout: 10000 }
			),
			axios.get(
				'https://loris.wlu.ca/register/ssb/searchResults/getFacultyMeetingTimes?term=' +
				sectionData.term +
				'&courseReferenceNumber=' +
				sectionData.course_registration_number.toString(),
				{ timeout: 10000 }
			)
		])

		return {
			sectionData: sectionData,
			classDetails: classDetailsResponse.data,
			enrollmentInfo: enrollmentInfoResponse.data,
			facultyMeetingTimes: facultyMeetingTimesResponse.data
		}
	} catch (error) {
		if (retryCount < maxRetries) {
			const delay = Math.pow(2, retryCount) * 100
			console.error(`Attempt ${retryCount + 1}: Retrying after ${delay} ms`)
			await new Promise((resolve) => setTimeout(resolve, delay))
			return fetchSectionData(sectionData, retryCount + 1, maxRetries)
		} else {
			return null
		}
	}
}

async function fetchTermSectionsFromDB(
	term: string,
	filterCol: string,
	colValue: string,
	supabase: SupabaseClient<any, 'public', any>,
	user: User | null
): Promise<section[]> {
	const { data: sectionData } = await (supabase
		.from('sections')
		.select()
		.eq(filterCol, colValue)
		.eq('term', term) as any)

	if (!sectionData || sectionData.length === 0) return []

	const batchSize = 10
	const sectionDataResponses: any[] = []

	for (let i = 0; i < sectionData.length; i += batchSize) {
		const batch = sectionData.slice(i, i + batchSize)
		const batchResults = await Promise.all(batch.map((data: any) => fetchSectionData(data)))
		sectionDataResponses.push(...batchResults)
	}

	const result: section[] = []

	sectionDataResponses.forEach((element) => {
		if (!element) return

		let $ = cheerio.load(element.classDetails)
		const section = $('#sectionNumber').text()
		/** @ts-ignore */
		const campus = $('span').filter((_, el) => $(el).text().includes('Campus:'))[0]?.next?.data?.trim()
		/** @ts-ignore */
		const type = $('span').filter((_, el) => $(el).text().includes('Instructional Method:'))[0]?.next?.data?.trim()

		$ = cheerio.load(element.enrollmentInfo)
		const enrollment =
			$('span:contains("Enrolment Actual:")').next().text() ||
			$('span:contains("Enrollment Actual:")').next().text()
		const enrollmentMax =
			$('span:contains("Enrolment Maximum:")').next().text() ||
			$('span:contains("Enrollment Maximum:")').next().text()

		const fmt = element.facultyMeetingTimes.fmt[0]?.meetingTime
		const days = {
			monday: fmt?.monday,
			tuesday: fmt?.tuesday,
			wednesday: fmt?.wednesday,
			thursday: fmt?.thursday,
			friday: fmt?.friday,
			saturday: fmt?.saturday,
			sunday: fmt?.sunday,
		}

		result.push({
			crn: element.sectionData.course_registration_number.toString(),
			type,
			section,
			campus,
			enrollment,
			enrollmentMax,
			beginTime: fmt?.beginTime,
			endTime: fmt?.endTime,
			days,
			location: user ? fmt?.room : null,
			instructor: user
				? filterCol === 'instructor_name_fk'
					? element.sectionData.course_code_fk
					: element.sectionData.instructor_name_fk
				: null,
		})
	})

	return result
}

export async function fetchTermSections(
	term: string,
	filterCol: string,
	colValue: string,
	userId: string | null
): Promise<section[]> {
	'use server'
	const { createClient } = await import('@/utils/supabase/server')
	const { cookies } = await import('next/headers')
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const user = userId ? { id: userId } as User : null
	return fetchTermSectionsFromDB(term, filterCol, colValue, supabase, user)
}

export async function getCourseSections(
	_springTerm: string,
	_fallTerm: string,
	winterTerm: string,
	nextSpringTerm: string,
	filterCol: string,
	colValue: string,
	supabase: SupabaseClient<any, 'public', any>,
	user: User | null
) {
	const defaultTab = getDefaultTab()
	const courseSections: sections = {
		springTerm: [],
		fallTerm: [],
		winterTerm: [],
		nextSpringTerm: []
	}

	// Only pre-fetch the current term — everything else lazy-loads on tab click
	const termMap: Record<number, string> = {
		1: _springTerm,
		2: _fallTerm,
		3: winterTerm,
		4: nextSpringTerm,
	}
	const keyMap: Record<number, keyof sections> = {
		1: 'springTerm',
		2: 'fallTerm',
		3: 'winterTerm',
		4: 'nextSpringTerm',
	}
	courseSections[keyMap[defaultTab]] = await fetchTermSectionsFromDB(
		termMap[defaultTab], filterCol, colValue, supabase, user
	)

	return courseSections
}

async function CourseSchedule({
	supabase,
	courseName,
	user
}: {
	supabase: SupabaseClient<any, 'public', any>
	courseName: string
	user: User | null
}) {
	const prettyTerms = getTerms(true)
	const dataTerms = getTerms(false)
	const defaultTab = getDefaultTab()

	const termSections = await getCourseSections(
		dataTerms.springTerm,
		dataTerms.fallTerm,
		dataTerms.winterTerm,
		dataTerms.nextSpringTerm,
		'course_code_fk',
		courseName,
		supabase,
		user
	)

	return (
		<div className='cp-schedule'>
			<h2 className='cp-section-label'>Schedule</h2>
			<ScheduleTable
				springTerm={prettyTerms.springTerm}
				fallTerm={prettyTerms.fallTerm}
				winterTerm={prettyTerms.winterTerm}
				nextSpringTerm={prettyTerms.nextSpringTerm}
				springTermSections={termSections.springTerm}
				fallTermSections={termSections.fallTerm}
				winterTermSections={termSections.winterTerm}
				nextSpringTermSections={termSections.nextSpringTerm}
				professor={false}
				user={user}
				defaultTab={defaultTab}
				filterCol='course_code_fk'
				colValue={courseName}
				dataTerms={dataTerms}
			/>
		</div>
	)
}

export default CourseSchedule
