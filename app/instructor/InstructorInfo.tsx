import { SupabaseClient } from '@supabase/supabase-js'
import { getCurrentTerm } from '../course/CourseSchedule'
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
	const { data, error } = await supabase
		.from('sections')
		.select()
		.eq('instructor_name_fk', instructorName)

	const courses = new Set<string>()
	const currentTerm = await getCurrentTerm(false)

	data?.forEach((section) => {
		if (section.term === currentTerm) {
			courses.add(section.course_code_fk)
		}
	})

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
		<div className='md:bg-white md:dark:bg-slate-950'>
			<div className="flex flex-col bg-[url('/banner-sm-light.jpg')] p-4 dark:bg-[url('/banner-sm.jpg')] md:flex-row md:justify-center md:bg-[url('/banner-md-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] lg:bg-[url('/banner-light.jpg')] lg:dark:bg-[url('/banner.jpg')]">
				<div className='flex max-w-6xl flex-1 flex-row justify-between pt-20'>
					<div className='flex flex-1 flex-col justify-end pl-4'>
						<h1 className='text-2xl font-bold text-white md:text-5xl'>
							{instructorData[0].instructor_name}
						</h1>
						<h2 className='pt-2 text-xl text-white md:text-3xl'>
							{instructorData[0].instructor_email}
						</h2>
					</div>
					<div className='hidden w-1/2 translate-y-28 md:inline'>
						<InstructorStats
							instructorData={instructorData}
							currentCourses={currentCourses}
						/>
					</div>
				</div>
			</div>

			<div className='mx-auto hidden max-w-6xl pl-4 pr-10 pt-8 md:flex'>
				{currentCourses.size > 0 ? (
					<h3 className='w-1/3 pt-4 text-lg font-medium'>
						Currently teaches{' '}
						{Array.from(currentCourses).map((course, index) => (
							<React.Fragment key={index}>
								{index === currentCourses.size - 1 ? course : `${course}, `}
							</React.Fragment>
						))}
					</h3>
				) : (
					<h3 className='w-1/3 pt-4 text-lg font-medium'>
						Not currently teaching anything
					</h3>
				)}
			</div>

			<div className='md:hidden'>
				<InstructorStats
					instructorData={instructorData}
					currentCourses={currentCourses}
				/>
			</div>
			<hr className='mb-8 mt-8 border-gray-300 dark:border-gray-800 md:mb-0'></hr>
		</div>
	)
}

export default InstructorInfo
