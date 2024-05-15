'use client'

import React, { JSXElementConstructor, ReactElement, useEffect } from 'react'
import WinBox from 'react-winbox'
import 'winbox/dist/css/winbox.min.css' // required
import { useState } from 'react'
type GPACalculatorProps = {
	title: string
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ title }) => {
	const [hide, setHide] = useState<boolean>(true)
	const [numCourses, setNumCourses] = useState<number>(3)
	const [courseObject, setCourseObject] = useState<React.ReactElement[]>([])

	useEffect(() => {
		console.log('here')
		var obj: React.JSX.Element[] = []
		for (var i = 0; i < numCourses; i++) {
			obj.push(
				<div className='mb-5 ml-5 mr-5 mt-5 grid grid-cols-3 gap-3'>
					<input
						type='text'
						id='course_code'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
						placeholder='Course Code'
						required
					/>
					<select
						id='weight'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					>
						<option value='0.25'>0.25</option>
						<option selected value='0.5'>
							0.50
						</option>
						<option value='0.25'>0.75</option>
						<option value='1.00'>1.00</option>
						<option value='1.25'>1.25</option>
					</select>
					<select
						id='grade'
						className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'
					>
						<option selected>--Choose One--</option>
						<option value='12'>12: A+ (90-100)</option>
						<option value='11'>11: A (85-89)</option>
						<option value='10'>10: A- (80-84)</option>
						<option value='9'>9: B+ (77-79)</option>
						<option value='8'>8: B (73-76)</option>
						<option value='7'>7: B- (70-72)</option>
						<option value='6'>6: C+ (67-69)</option>
						<option value='5'>5: C (63-66)</option>
						<option value='4'>4: C- (60-62)</option>
						<option value='3'>3: D+ (57-59)</option>
						<option value='2'>2: D (53-56)</option>
						<option value='1'>1: D- (50-52)</option>
						<option value='0'>0: F (0-49)</option>
						<option value='XF'>0: XF* - A (0-49)</option>
						<option value='DR'>0: DR** - A (0-49)</option>
					</select>
				</div>
			)
		}
		setCourseObject(
			obj.map((element, index) => (
				<React.Fragment key={index}>{element}</React.Fragment>
			))
		)
	}, [numCourses])

	return (
		<div>
			<button
				type='button'
				className='mb-2 me-2 bg-gradient-to-br from-purple-600 to-blue-500 px-10 py-2.5 text-center text-lg font-medium  text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
				onClick={() => {
					if (hide) {
						setHide(false)
					} else {
						setHide(true)
					}
				}}
			>
				GPA Calculator
			</button>
			<WinBox
				width={750}
				height={500}
				x='center'
				y={window.innerHeight / 4}
				hide={hide}
				title={title}
				noClose={true}
			>
				<div className='mt-5'>
					<h1 className='lg:text4xl mb-4 text-center font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-4xl'>
						GPA Calculator
					</h1>
					<div className='mb-5 ml-5 mr-5 mt-5 grid grid-cols-3 gap-3'>
						<button
							type='button'
							className='mb-2 me-2 bg-gradient-to-br from-purple-600 to-blue-500 px-10 py-2.5 text-center text-lg font-medium  text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
							aria-label='num-courses'
							onClick={() => {
								var num = numCourses + 1
								setNumCourses(num)
							}}
						>
							Add Course
						</button>
						<button
							type='button'
							className='mb-2 me-2 bg-gradient-to-br from-purple-600 to-blue-500 px-10 py-2.5 text-center text-lg font-medium  text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800'
							onClick={() => {
								var num = numCourses
								if (numCourses > 1) {
									num -= 1
									setNumCourses(num)
								}
							}}
						>
							Remove Course
						</button>
						<button
							type='button'
							className='mb-2 me-2 bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-2.5 text-center text-lg font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800'
							onClick={() => {
								alert('BRO UR FAILING!!!')
							}}
						>
							Calculate GPA
						</button>
					</div>
					<div className='mb-5 ml-5 mr-5 mt-5 grid grid-cols-3 gap-3'>
						<label>Course Code</label>
						<label>Credit Weight</label>
						<label>Grade</label>
					</div>
				</div>
				<>{courseObject}</>
			</WinBox>
		</div>
	)
}
export default GPACalculator
