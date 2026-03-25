import { SupabaseClient } from '@supabase/supabase-js'
import React from 'react'
import InstructorStats from '@/components/InstructorStats'

export interface instructorInfoDBResponse {
	instructor_name: string
	total_reviews: number
	clear: number
	engaging: number
	liked: number
	instructor_email: string
}

async function getInstructorData(
	supabase: SupabaseClient<any, 'public', any>,
	instructorName: string
) {
	const { data, error } = await supabase
		.from('instructors')
		.select()
		.eq('instructor_name', instructorName)

	return data || []
}

async function getCurrentCourses(
	supabase: SupabaseClient<any, 'public', any>,
	instructorName: string
) {
	const currentDate = new Date()
	const currentMonth = currentDate.getMonth()
	const currentYear = currentDate.getFullYear()
	let currentTerm = ''

	if (currentMonth <= 3) {
		currentTerm = `${currentYear}01`
	} else if (currentMonth <= 7) {
		currentTerm = `${currentYear}05`
	} else {
		currentTerm = `${currentYear}09`
	}

	const { data } = await supabase
		.from('sections')
		.select('course_code_fk')
		.eq('instructor_name_fk', instructorName)
		.eq('term', currentTerm)

	const courses = new Set<string>()
	data?.forEach((section) => courses.add(section.course_code_fk))
	return courses
}

async function InstructorInfo({
	supabase,
	instructorName
}: {
	supabase: SupabaseClient<any, 'public', any>
	instructorName: string
}) {
	const [instructorData, currentCourses] = await Promise.all([
		getInstructorData(supabase, instructorName),
		getCurrentCourses(supabase, instructorName)
	])

	return (
		<div className='cp-hero'>
			<p className='cp-course-code'>{instructorData[0].instructor_name}</p>
			<h1 className='cp-course-title' style={{ fontSize: 'clamp(28px, 3.5vw, 42px)' }}>
				{instructorData[0].instructor_email || 'Instructor'}
			</h1>
			{currentCourses.size > 0 && (
				<p className='cp-course-desc'>
					Currently teaches{' '}
					{Array.from(currentCourses).map((course, index) => (
						<React.Fragment key={index}>
							<a
								href={`/course/${course.replace(/\s+/g, '%20')}`}
								style={{ color: '#b07030', textDecoration: 'none' }}
							>
								{course}
							</a>
							{index < currentCourses.size - 1 ? ', ' : ''}
						</React.Fragment>
					))}
				</p>
			)}
			{currentCourses.size === 0 && (
				<p className='cp-course-desc'>Not currently teaching any courses</p>
			)}
			<InstructorStats
				instructorData={instructorData}
				currentCourses={currentCourses}
			/>
		</div>
	)
}

export default InstructorInfo
