'use client'

import { useSearchParams } from 'next/navigation'
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import {
	courseInfoDBResponseExplore,
	instructorInfoDBResponseExplore
} from './Explore'
import Link from 'next/link'

type SortableCourseFields = keyof courseInfoDBResponseExplore
type SortableInstructorFields = keyof instructorInfoDBResponseExplore

export default function Body({
	currentTerm,
	nextTerm,
	courses,
	instructors
}: {
	currentTerm: string
	nextTerm: string
	courses: courseInfoDBResponseExplore[]
	instructors: instructorInfoDBResponseExplore[]
}) {
	const searchParams = useSearchParams()
	const subject = searchParams.get('subject')?.toUpperCase() || 'all'

	const itemsPerPage = 50
	const [visibleCourseCount, setVisibleCourseCount] = useState(itemsPerPage)
	const [visibleInstructorCount, setVisibleInstructorCount] =
		useState(itemsPerPage)
	const courseLoaderRef = useRef(null)
	const instructorLoaderRef = useRef(null)

	/////////////////////////////////////////////////////////////////////////////// COURSE HOOKS AND VARS
	const [filteredCourses, setFilteredCourses] = useState(courses)
	const [sortedCourses, setSortedCourses] = useState(courses)

	const [courseOrder, setCourseOrder] = useState('none')
	const [courseSortField, setCourseSortField] =
		useState<SortableCourseFields>('course_code')

	const [courseFilters, setCourseFilters] = useState({
		firstYear: true,
		secondYear: true,
		thirdYear: true,
		fourthYear: true,
		seniorYear: true,
		minRatings: 0,
		thisTerm: false,
		afterTerm: false
	})
	/////////////////////////////////////////////////////////////////////////////// INSTRUCTOR HOOKS AND VARS
	const [filteredInstructors, setFilteredInstructors] = useState(instructors)
	const [sortedInstructors, setSortedInstructors] = useState(instructors)

	const [instructorOrder, setInstructorOrder] = useState('none')
	const [instructorSortField, setInstructorSortField] =
		useState<SortableInstructorFields>('instructor_name')

	const [instructorFilters, setInstructorFilters] = useState({
		minRatings: 0
	})

	function sortCoursesArray(
		sortField: SortableCourseFields,
		order: string,
		filtered: courseInfoDBResponseExplore[] = filteredCourses
	) {
		const sorted = [...filtered].sort((a, b) => {
			if (a[sortField] === null) return 1
			if (b[sortField] === null) return -1

			if (order === 'asc') {
				return a[sortField] < b[sortField]
					? -1
					: a[sortField] > b[sortField]
						? 1
						: 0
			} else {
				return a[sortField] > b[sortField]
					? -1
					: a[sortField] < b[sortField]
						? 1
						: 0
			}
		})

		setSortedCourses(sorted)
	}

	function sortInstructorsArray(
		sortField: SortableInstructorFields,
		order: string,
		filtered: instructorInfoDBResponseExplore[] = filteredInstructors
	) {
		const sorted = [...filtered].sort((a, b) => {
			if (a[sortField] === null) return 1
			if (b[sortField] === null) return -1

			if (order === 'asc') {
				return a[sortField] < b[sortField]
					? -1
					: a[sortField] > b[sortField]
						? 1
						: 0
			} else {
				return a[sortField] > b[sortField]
					? -1
					: a[sortField] < b[sortField]
						? 1
						: 0
			}
		})

		setSortedInstructors(sorted)
	}

	const handleCourseResort = (
		sortField: SortableCourseFields,
		filtered: courseInfoDBResponseExplore[] = filteredCourses
	) => {
		if (courseOrder === 'none') {
			setSortedCourses(filtered)
		} else if (courseOrder === 'desc') {
			sortCoursesArray(sortField, 'desc', filtered)
		} else {
			sortCoursesArray(sortField, 'asc', filtered)
		}
	}

	const handleInstructorResort = (
		sortField: SortableInstructorFields,
		filtered: instructorInfoDBResponseExplore[] = filteredInstructors
	) => {
		if (instructorOrder === 'none') {
			setSortedInstructors(filtered)
		} else if (instructorOrder === 'desc') {
			sortInstructorsArray(sortField, 'desc', filtered)
		} else {
			sortInstructorsArray(sortField, 'asc', filtered)
		}
	}

	const handleCourseSort = (sortField: SortableCourseFields) => {
		setCourseSortField(sortField)
		if (courseOrder === 'none') {
			setCourseOrder('desc')
			sortCoursesArray(sortField, 'desc')
		} else if (courseOrder === 'desc') {
			setCourseOrder('asc')
			sortCoursesArray(sortField, 'asc')
		} else {
			setCourseOrder('none')
			setSortedCourses(filteredCourses)
		}
	}

	const handleInstructorSort = (sortField: SortableInstructorFields) => {
		setInstructorSortField(sortField)
		if (instructorOrder === 'none') {
			setInstructorOrder('desc')
			sortInstructorsArray(sortField, 'desc')
		} else if (instructorOrder === 'desc') {
			setInstructorOrder('asc')
			sortInstructorsArray(sortField, 'asc')
		} else {
			setInstructorOrder('none')
			setSortedInstructors(filteredInstructors)
		}
	}

	const [courseSlider, setCourseSlider] = useState(0)
	const [instructorSlider, setInstructorSlider] = useState(0)

	const [activeTab, setActiveTab] = useState(1)

	useEffect(() => {
		const currentLoader =
			activeTab === 1 ? courseLoaderRef.current : instructorLoaderRef.current

		const observer = new IntersectionObserver(
			(entries) => {
				const firstEntry = entries[0]
				if (firstEntry.isIntersecting) {
					if (activeTab === 1) {
						setVisibleCourseCount((prevCount) =>
							Math.min(filteredCourses.length, prevCount + itemsPerPage)
						)
					} else if (activeTab === 2) {
						setVisibleInstructorCount((prevCount) =>
							Math.min(filteredInstructors.length, prevCount + itemsPerPage)
						)
					}
				}
			},
			{ threshold: 0.1, rootMargin: '200px' }
		)

		if (currentLoader) {
			observer.observe(currentLoader)
		}

		return () => observer.disconnect()
	}, [activeTab, filteredCourses.length, filteredInstructors.length])

	const handleSliderChange = (e: {
		target: { value: SetStateAction<string> }
	}) => {
		const val = e.target.value
		const setSlider = activeTab === 1 ? setCourseSlider : setInstructorSlider
		setSlider(Number(val))
		const setFilters = activeTab === 1 ? setCourseFilters : setInstructorFilters

		switch (val) {
			case '0':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 0
				}))
				break
			case '1':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 1
				}))
				break
			case '2':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 5
				}))
				break
			case '3':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 10
				}))
				break
			case '4':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 20
				}))
				break
			case '5':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 50
				}))
				break
			case '6':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 75
				}))
				break
			case '7':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 100
				}))
				break
			case '8':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 200
				}))
				break
			case '9':
				setFilters((prevFilters: any) => ({
					...prevFilters,
					minRatings: 500
				}))
				break
		}
	}

	const resetFilter = () => {
		const setSlider = activeTab === 1 ? setCourseSlider : setInstructorSlider

		if (activeTab === 1) {
			setCourseFilters({
				firstYear: true,
				secondYear: true,
				thirdYear: true,
				fourthYear: true,
				seniorYear: true,
				minRatings: 0,
				thisTerm: false,
				afterTerm: false
			})
		} else {
			setInstructorFilters({
				minRatings: 0
			})
		}

		setSlider(0)
	}

	useEffect(() => {
		const filtered = courses.filter((course) => {
			if (course.total_reviews < courseFilters.minRatings) return false
			if (!course.isOfferedThisTerm && courseFilters.thisTerm) return false
			if (!course.isOfferedNextTerm && courseFilters.afterTerm) return false

			let firstSpaceIndex = course.course_code.indexOf(' ')
			let charAfterSpace = course.course_code[firstSpaceIndex + 1]

			if (!courseFilters.firstYear && charAfterSpace === '1') return false
			if (!courseFilters.secondYear && charAfterSpace === '2') return false
			if (!courseFilters.thirdYear && charAfterSpace === '3') return false
			if (!courseFilters.fourthYear && charAfterSpace === '4') return false
			if (!courseFilters.seniorYear && charAfterSpace >= '5') return false

			if (courseFilters.thisTerm && !course.isOfferedThisTerm) return false
			if (courseFilters.afterTerm && !course.isOfferedNextTerm) return false
			if (subject !== 'all') {
				let codeLength = subject.length
				let extractedCode = course.course_code.substring(0, codeLength)
				if (extractedCode !== subject.toUpperCase()) return false
			}

			return true
		})

		setFilteredCourses(filtered)
		handleCourseResort(courseSortField, filtered)
	}, [courseFilters])

	useEffect(() => {
		const filtered = instructors.filter((instructor) => {
			if (instructor.total_reviews < instructorFilters.minRatings) return false
			if (subject !== 'all') {
				let codeLength = subject.length
				let codes = []
				instructor.coursesTaught.forEach((course: string) => {
					let extractedCode = course.substring(0, codeLength)
					if (extractedCode == subject) codes.push(extractedCode)
				})
				if (codes.length === 0) return false
			}

			return true
		})

		setFilteredInstructors(filtered)
		handleInstructorResort(instructorSortField, filtered)
	}, [instructorFilters])

	const handleCurrentTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			thisTerm: !prevFilters.thisTerm
		}))
	}

	const handleNextTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			afterTerm: !prevFilters.afterTerm
		}))
	}

	return (
		<>
			<div className="flex min-w-full flex-col bg-[url('/banner-sm-light.jpg')] p-4 dark:bg-[url('/banner-sm.jpg')] md:flex-row md:justify-center md:bg-[url('/banner-md-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] lg:bg-[url('/banner-light.jpg')] lg:dark:bg-[url('/banner.jpg')]">
				<div className='w-f flex max-w-6xl flex-1 flex-row justify-between pt-20'>
					<div className='flex flex-1 flex-col justify-end pl-4'>
						<h1 className='mb-2 text-2xl text-3xl font-bold text-white md:text-4xl'>{`Showing ${subject} courses and professors`}</h1>
					</div>
				</div>
			</div>

			<div className='exploreCard flex-1 lg:flex-row-reverse'>
				<div
					className={`flex flex-col p-6 lg:w-1/3 lg:p-12 lg:pt-8 ${activeTab === 1 ? '' : 'hidden'}`}
				>
					<h1 className='text-2xl font-semibold'>Filter your results</h1>
					<h1 className='pt-8'>Course Code</h1>
					<div className='flex flex-row flex-wrap pt-2'>
						<button
							onClick={() =>
								setCourseFilters((prevFilters) => ({
									...prevFilters,
									firstYear: !courseFilters.firstYear
								}))
							}
							className={`text-md inline-flex items-center gap-x-1.5 rounded-full border-2 border-amber-300 px-3 py-1.5 text-sm font-medium dark:border-secondary dark:text-white ${courseFilters.firstYear ? 'bg-amber-300 dark:bg-secondary' : null} mr-4 mt-2`}
						>
							1XX
						</button>
						<button
							onClick={() =>
								setCourseFilters((prevFilters) => ({
									...prevFilters,
									secondYear: !courseFilters.secondYear
								}))
							}
							className={`text-md inline-flex items-center gap-x-1.5 rounded-full border-2 border-amber-300 px-3 py-1.5 text-sm font-medium dark:border-secondary dark:text-white ${courseFilters.secondYear ? 'bg-amber-300 dark:bg-secondary' : null} mr-4 mt-2`}
						>
							2XX
						</button>
						<button
							onClick={() =>
								setCourseFilters((prevFilters) => ({
									...prevFilters,
									thirdYear: !courseFilters.thirdYear
								}))
							}
							className={`text-md inline-flex items-center gap-x-1.5 rounded-full border-2 border-amber-300 px-3 py-1.5 text-sm font-medium dark:border-secondary dark:text-white ${courseFilters.thirdYear ? 'bg-amber-300 dark:bg-secondary' : null} mr-4 mt-2`}
						>
							3XX
						</button>
						<button
							onClick={() =>
								setCourseFilters((prevFilters) => ({
									...prevFilters,
									fourthYear: !courseFilters.fourthYear
								}))
							}
							className={`text-md inline-flex items-center gap-x-1.5 rounded-full border-2 border-amber-300 px-3 py-1.5 text-sm font-medium dark:border-secondary dark:text-white ${courseFilters.fourthYear ? 'bg-amber-300 dark:bg-secondary' : null} mr-4 mt-2`}
						>
							4XX
						</button>
						<button
							onClick={() =>
								setCourseFilters((prevFilters) => ({
									...prevFilters,
									seniorYear: !courseFilters.seniorYear
								}))
							}
							className={`text-md inline-flex items-center gap-x-1.5 rounded-full border-2 border-amber-300 px-3 py-1.5 text-sm font-medium dark:border-secondary dark:text-white ${courseFilters.seniorYear ? 'bg-amber-300 dark:bg-secondary' : null} mt-2`}
						>
							5XX+
						</button>
					</div>
					<div className='flex flex-row justify-between pt-8'>
						<h1>Min # of ratings</h1>
						<h1>≥ {courseFilters.minRatings} ratings</h1>
					</div>
					<input
						type='range'
						className='w-full cursor-pointer appearance-none bg-transparent pt-4 focus:outline-none disabled:pointer-events-none disabled:opacity-50
[&::-moz-range-thumb]:h-2.5
[&::-moz-range-thumb]:w-2.5
[&::-moz-range-thumb]:appearance-none
[&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:border-4
[&::-moz-range-thumb]:border-primary
[&::-moz-range-thumb]:bg-white
[&::-moz-range-thumb]:transition-all
[&::-moz-range-thumb]:duration-150
[&::-moz-range-thumb]:ease-in-out
[&::-moz-range-track]:h-2
[&::-moz-range-track]:w-full

[&::-moz-range-track]:rounded-full
[&::-moz-range-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:h-2
[&::-webkit-slider-runnable-track]:w-full
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:dark:bg-gray-700
[&::-webkit-slider-thumb]:-mt-0.5
[&::-webkit-slider-thumb]:h-2.5
[&::-webkit-slider-thumb]:w-2.5

[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:rounded-full
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(252,211,77,1)]
[&::-webkit-slider-thumb]:transition-all

[&::-webkit-slider-thumb]:duration-150
[&::-webkit-slider-thumb]:ease-in-out
[&::-webkit-slider-thumb]:dark:bg-white
[&::-webkit-slider-thumb]:dark:shadow-secondary'
						id='steps-range-slider-usage'
						min='0'
						max='9'
						step='1'
						value={courseSlider}
						onChange={handleSliderChange}
					></input>

					<h1 className='pt-8'>Offered in</h1>
					<div className='ml-1 flex flex-row pt-4 lg:flex-col'>
						<div className='flex flex-row items-center'>
							<input
								type='checkbox'
								className='mt-0.5 shrink-0 scale-150 rounded border-gray-200 text-amber-400 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-primary dark:checked:border-secondary dark:checked:bg-secondary dark:focus:ring-secondary dark:focus:ring-offset-gray-800'
								id='hs-default-checkbox'
								onChange={() =>
									setCourseFilters((prevFilters) => ({
										...prevFilters,
										thisTerm: false,
										afterTerm: false
									}))
								}
								checked={!courseFilters.thisTerm && !courseFilters.afterTerm}
							/>
							<h1 className='ms-4 text-sm text-gray-500 dark:text-gray-400'>
								All terms
							</h1>
						</div>

						<div className='flex flex-row items-center'>
							<input
								type='checkbox'
								className='ml-8 mt-0.5 shrink-0 scale-150 rounded border-gray-200 text-amber-400 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-primary dark:checked:border-secondary dark:checked:bg-secondary dark:focus:ring-secondary dark:focus:ring-offset-gray-800 lg:ml-0 lg:mt-6'
								id='hs-default-checkbox'
								onChange={handleCurrentTermChange}
								checked={courseFilters.thisTerm}
							/>
							<h1 className='ms-4 text-sm text-gray-500 dark:text-gray-400 lg:mt-6'>
								This term ({currentTerm})
							</h1>
						</div>

						<div className='flex flex-row items-center'>
							<input
								type='checkbox'
								className='ml-8 mt-0.5 shrink-0 scale-150 rounded border-gray-200 text-amber-400 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-primary dark:checked:border-secondary dark:checked:bg-secondary dark:focus:ring-secondary dark:focus:ring-offset-gray-800 lg:ml-0 lg:mt-6'
								id='hs-default-checkbox'
								onChange={handleNextTermChange}
								checked={courseFilters.afterTerm}
							/>
							<h1 className='ms-4 text-sm text-gray-500 dark:text-gray-400 lg:mt-6'>
								Next term ({nextTerm})
							</h1>
						</div>
					</div>

					<button
						onClick={resetFilter}
						type='button'
						className='mt-12 gap-x-2 rounded-lg border border-transparent bg-amber-300 px-4 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 dark:bg-secondary dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
					>
						Reset Filter
					</button>
				</div>

				<div
					className={`flex flex-col p-6 lg:w-1/3 lg:p-12 lg:pt-8 ${activeTab === 2 ? '' : 'hidden'}`}
				>
					<h1 className='text-2xl font-semibold'>Filter your results</h1>
					<div className='flex flex-row justify-between pt-8'>
						<h1>Min # of ratings</h1>
						<h1>≥ {instructorFilters.minRatings} ratings</h1>
					</div>
					<input
						type='range'
						className='w-full cursor-pointer appearance-none bg-transparent pt-4 focus:outline-none disabled:pointer-events-none disabled:opacity-50
[&::-moz-range-thumb]:h-2.5
[&::-moz-range-thumb]:w-2.5
[&::-moz-range-thumb]:appearance-none
[&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:border-4
[&::-moz-range-thumb]:border-primary
[&::-moz-range-thumb]:bg-white
[&::-moz-range-thumb]:transition-all
[&::-moz-range-thumb]:duration-150
[&::-moz-range-thumb]:ease-in-out
[&::-moz-range-track]:h-2
[&::-moz-range-track]:w-full

[&::-moz-range-track]:rounded-full
[&::-moz-range-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:h-2
[&::-webkit-slider-runnable-track]:w-full
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:dark:bg-gray-700
[&::-webkit-slider-thumb]:-mt-0.5
[&::-webkit-slider-thumb]:h-2.5
[&::-webkit-slider-thumb]:w-2.5

[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:rounded-full
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(252,211,77,1)]
[&::-webkit-slider-thumb]:transition-all

[&::-webkit-slider-thumb]:duration-150
[&::-webkit-slider-thumb]:ease-in-out
[&::-webkit-slider-thumb]:dark:bg-white
[&::-webkit-slider-thumb]:dark:shadow-secondary'
						id='steps-range-slider-usage'
						min='0'
						max='9'
						step='1'
						value={instructorSlider}
						onChange={handleSliderChange}
					></input>
					<button
						onClick={resetFilter}
						type='button'
						className='mt-12 gap-x-2 rounded-lg border border-transparent bg-amber-300 px-4 py-3 text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 dark:bg-secondary dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
					>
						Reset Filter
					</button>
				</div>
				<hr className='mb-8 mt-8 border-gray-300 dark:border-gray-800'></hr>

				<div className='flex-1 lg:flex lg:flex-col lg:pt-6'>
					<nav
						suppressHydrationWarning
						className='flex space-x-2'
						aria-label='Tabs'
						role='tablist'
					>
						<button
							suppressHydrationWarning
							onClick={() => {
								setActiveTab(1)
								setVisibleCourseCount(50)
							}}
							type='button'
							className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-lg font-medium ${activeTab === 1 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 1 ? 'dark:text-white' : 'text-gray-400'} dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`}
							id='equal-width-elements-item-1'
							data-hs-tab='#equal-width-elements-1'
							aria-controls='equal-width-elements-1'
							role='tab'
						>
							Courses ({sortedCourses.length})
						</button>
						<button
							suppressHydrationWarning
							onClick={() => {
								setActiveTab(2)
								setVisibleInstructorCount(50)
							}}
							type='button'
							className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-lg font-medium ${activeTab === 2 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 2 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`}
							data-hs-tab='#equal-width-elements-2'
							aria-controls='equal-width-elements-2'
							role='tab'
						>
							Instructors ({sortedInstructors.length})
						</button>
					</nav>

					<div
						id='equal-width-elements-1'
						className={activeTab === 1 ? '' : 'hidden'}
						role='tabpanel'
						aria-labelledby='equal-width-elements-item-1'
					>
						<div className='flex flex-col pt-6'>
							<div className='overflow-x-auto'>
								<div className='inline-block min-w-full align-middle'>
									<div className='overflow-hidden'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead>
												<tr>
													<th
														onClick={() => {
															handleCourseSort('course_code')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Course Code{' '}
														{courseSortField === 'course_code' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'course_code' &&
															courseOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleCourseSort('course_title')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Course Name{' '}
														{courseSortField === 'course_title' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'course_title' &&
															courseOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleCourseSort('total_reviews')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Ratings{' '}
														{courseSortField === 'total_reviews' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'total_reviews' &&
															courseOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleCourseSort('useful')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Useful{' '}
														{courseSortField === 'useful' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'useful' &&
															courseOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleCourseSort('easy')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Easy{' '}
														{courseSortField === 'easy' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'easy' && courseOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleCourseSort('liked')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Liked{' '}
														{courseSortField === 'liked' &&
															courseOrder === 'desc'
															? '˅'
															: null}{' '}
														{courseSortField === 'liked' &&
															courseOrder === 'asc'
															? '˄'
															: null}
													</th>
												</tr>
											</thead>
											<tbody>
												{sortedCourses
													.slice(0, visibleCourseCount)
													.map((course, index) => (
														<tr
															key={index}
															className='odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900'
														>
															<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 underline dark:text-gray-200'>
																<Link
																	href={`/course/${course.course_code.replace(/\s+/g, '%20')}`}
																>
																	{course.course_code}
																</Link>
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{course.course_title}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{course.total_reviews}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{course.useful || course.useful === 0
																	? course.useful + '%'
																	: 'N/A'}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{course.easy || course.easy === 0
																	? course.easy + '%'
																	: 'N/A'}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{course.liked || course.liked === 0
																	? course.liked + '%'
																	: 'N/A'}
															</td>
														</tr>
													))}
											</tbody>
										</table>
										<div ref={courseLoaderRef} style={{ height: '20px' }}></div>
									</div>
								</div>
							</div>
							<h1
								className={`flex-1 p-6 ${filteredCourses.length !== 0 ? 'hidden' : null}`}
							>
								No courses found matching your criteria. Try adjusting your
								course filters to broaden your search. Consider using less
								specific terms.
							</h1>
						</div>
					</div>

					<div
						id='equal-width-elements-1'
						className={activeTab === 2 ? '' : 'hidden'}
						role='tabpanel'
						aria-labelledby='equal-width-elements-item-1'
					>
						<div className='flex flex-col pt-6'>
							<div className='overflow-x-auto'>
								<div className='inline-block min-w-full align-middle'>
									<div className='overflow-hidden'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead>
												<tr>
													<th
														onClick={() => {
															handleInstructorSort('instructor_name')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Instructor Name{' '}
														{instructorSortField === 'instructor_name' &&
															instructorOrder === 'desc'
															? '˅'
															: null}{' '}
														{instructorSortField === 'instructor_name' &&
															instructorOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleInstructorSort('total_reviews')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Ratings{' '}
														{instructorSortField === 'total_reviews' &&
															instructorOrder === 'desc'
															? '˅'
															: null}{' '}
														{instructorSortField === 'total_reviews' &&
															instructorOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleInstructorSort('clear')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Clear{' '}
														{instructorSortField === 'clear' &&
															instructorOrder === 'desc'
															? '˅'
															: null}{' '}
														{instructorSortField === 'clear' &&
															instructorOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleInstructorSort('engaging')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Engaging{' '}
														{instructorSortField === 'engaging' &&
															instructorOrder === 'desc'
															? '˅'
															: null}{' '}
														{instructorSortField === 'engaging' &&
															instructorOrder === 'asc'
															? '˄'
															: null}
													</th>
													<th
														onClick={() => {
															handleInstructorSort('liked')
														}}
														scope='col'
														className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 underline hover:cursor-pointer'
													>
														Liked{' '}
														{instructorSortField === 'liked' &&
															instructorOrder === 'desc'
															? '˅'
															: null}{' '}
														{instructorSortField === 'liked' &&
															instructorOrder === 'asc'
															? '˄'
															: null}
													</th>
												</tr>
											</thead>
											<tbody>
												{sortedInstructors
													.slice(0, visibleInstructorCount)
													.map((instructor, index) => (
														<tr
															key={index}
															className='odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900'
														>
															<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 underline dark:text-gray-200'>
																<Link
																	href={`/instructor/${instructor.instructor_name.replace(/\s+/g, '%20')}`}
																>
																	{instructor.instructor_name}
																</Link>
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{instructor.total_reviews}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{instructor.clear || instructor.clear === 0
																	? instructor.clear + '%'
																	: 'N/A'}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{instructor.engaging ||
																	instructor.engaging === 0
																	? instructor.engaging + '%'
																	: 'N/A'}
															</td>
															<td className='whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200'>
																{instructor.liked || instructor.liked === 0
																	? instructor.liked + '%'
																	: 'N/A'}
															</td>
														</tr>
													))}
											</tbody>
										</table>
										<div
											ref={instructorLoaderRef}
											style={{ height: '20px' }}
										></div>
									</div>
									<h1
										className={`flex-1 p-6 ${filteredInstructors.length !== 0 ? 'hidden' : null}`}
									>
										No instructors found matching your criteria. Try adjusting your
										instructor filters to broaden your search. Consider using less
										specific terms.
									</h1>
								</div>
							</div>
							<h1
								className={`flex-1 p-6 ${filteredCourses.length !== 0 ? 'hidden' : null}`}
							>
								No instructors found matching your criteria. Try adjusting your
								instructor filters to broaden your search. Consider using less
								specific terms.
							</h1>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
