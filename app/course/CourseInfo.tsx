'use server'

import CourseStats from '@/components/CourseStats'

export interface courseInfoDBResponse {
	course_code: string
	total_reviews: number
	easy: number
	useful: number
	liked: number
	course_title: string
}

import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { SupabaseClient } from '@supabase/supabase-js'

export async function getCourseData(
	supabase: SupabaseClient<any, 'public', any>,
	courseName: string
) {
	const { data, error } = await supabase
		.from('courses')
		.select('course_code, total_reviews, easy, useful, liked, course_title, leads_to, year, course_number, course_prefix, is_uwaterloo_course, course_description')
		.eq('course_code', courseName)

	return data || []
}

async function getCourseDescription(subjectCode: string, courseNumber: string) {
	try {
		const response = await axios.get(
			'https://loris.wlu.ca/register/ssb/courseSearchResults/getCourseDescription?term=202401&subjectCode=' +
				subjectCode +
				'&courseNumber=' +
				courseNumber,
			{ timeout: 5000 }
		)
		const $ = cheerio.load(response.data)
		const sectionElement = $('section[aria-labelledby="courseDescription"]')
		const courseInfo = sectionElement
			? sectionElement
					.text()
					.trim()
					.replace(/<[^>]*>/g, '')
			: ''

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
	supabase: SupabaseClient<any, 'public', any>
	courseName: string
}) {
	const subjectCode = courseName.slice(0, 2)
	const courseNumber = courseName.slice(3)
	const [courseDescription, courseData] = await Promise.all([
		getCourseDescription(subjectCode, courseNumber),
		getCourseData(supabase, courseName)
	])

	return (
		<div className='cp-hero'>
			<p className='cp-course-code'>{courseName}</p>
			<h1 className='cp-course-title'>
				{courseData[0].course_title}
			</h1>
			{courseDescription && (
				<p className='cp-course-desc'>{courseDescription}</p>
			)}
			<CourseStats
				courseData={courseData}
				courseDescription={courseDescription}
			/>
		</div>
	)
}

export default CourseInfo
