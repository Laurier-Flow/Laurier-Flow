'use client'

import { useSearchParams } from 'next/navigation'
import { SetStateAction, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	courseInfoDBResponseExplore,
	instructorInfoDBResponseExplore
} from './Explore'
import Link from 'next/link'

type SortableCourseFields = keyof courseInfoDBResponseExplore
type SortableInstructorFields = keyof instructorInfoDBResponseExplore

export default function Body({
	springTerm,
	fallTerm,
	winterTerm,
	nextSpringTerm,
	courses,
	instructors
}: {
	springTerm: string
	fallTerm: string
	winterTerm: string
	nextSpringTerm: string
	courses: courseInfoDBResponseExplore[]
	instructors: instructorInfoDBResponseExplore[]
}) {
	const searchParams = useSearchParams()
	const subject = searchParams.get('subject') || 'all'

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
		springTerm: false,
		fallTerm: false,
		winterTerm: false,
		nextSpringTerm: false
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
				springTerm: false,
				fallTerm: false,
				winterTerm: false,
				nextSpringTerm: false
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
			if (!course.isOfferedSpringTerm && courseFilters.springTerm) return false
			if (!course.isOfferedFallTerm && courseFilters.fallTerm) return false
			if (!course.isOfferedWinterTerm && courseFilters.winterTerm) return false
			if (!course.isOfferedNextSpringTerm && courseFilters.nextSpringTerm) return false

			let firstSpaceIndex = course.course_code.indexOf(' ')
			let charAfterSpace = course.course_code[firstSpaceIndex + 1]

			if (!courseFilters.firstYear && charAfterSpace === '1') return false
			if (!courseFilters.secondYear && charAfterSpace === '2') return false
			if (!courseFilters.thirdYear && charAfterSpace === '3') return false
			if (!courseFilters.fourthYear && charAfterSpace === '4') return false
			if (!courseFilters.seniorYear && charAfterSpace >= '5') return false

			if (courseFilters.springTerm && !course.isOfferedSpringTerm) return false
			if (courseFilters.fallTerm && !course.isOfferedFallTerm) return false
			if (courseFilters.winterTerm && !course.isOfferedWinterTerm) return false
			if (courseFilters.nextSpringTerm && !course.isOfferedNextSpringTerm) return false
			if (subject !== 'all') {
				let codeLength = subject.length
				let extractedCode = course.course_code.substring(0, codeLength)
				if (extractedCode !== subject.toUpperCase()) return false
			}

			return true
		})

		setFilteredCourses(filtered)
		handleCourseResort(courseSortField, filtered)
	}, [courseFilters, subject])

	useEffect(() => {
		const filtered = instructors.filter((instructor) => {
			if (instructor.total_reviews < instructorFilters.minRatings) return false
			if (subject !== 'all') {
				let codeLength = subject.length
				let codes: string[] = []
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
	}, [instructorFilters, subject])

	const handleSpringTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			springTerm: !prevFilters.springTerm
		}))
	}

	const handleFallTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			fallTerm: !prevFilters.fallTerm
		}))
	}

	const handleWinterTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			winterTerm: !prevFilters.winterTerm
		}))
	}

	const handleNextSpringTermChange = () => {
		setCourseFilters((prevFilters) => ({
			...prevFilters,
			nextSpringTerm: !prevFilters.nextSpringTerm
		}))
	}

	const minRatings = activeTab === 1 ? courseFilters.minRatings : instructorFilters.minRatings

	const sortIndicator = (field: string, sortField: string, order: string) => {
		if (sortField !== field) return null
		if (order === 'desc') return <span className='ex-sort-arrow'>↓</span>
		if (order === 'asc') return <span className='ex-sort-arrow'>↑</span>
		return null
	}

	return (
		<>
			{/* Page header */}
			<div className='ex-page-header'>
				<h1 className='ex-page-title'>{`Showing ${subject === 'all' ? 'all' : subject} courses and professors`}</h1>
				<p className='ex-page-subtitle'>
					{sortedCourses.length.toLocaleString()} courses · {sortedInstructors.length.toLocaleString()} instructors
				</p>
			</div>

			{/* Main grid: sidebar + content */}
			<div className='ex-grid'>
				{/* Left sidebar — filters */}
				<aside className='ex-sidebar'>
					{/* Course-specific filters */}
					{activeTab === 1 && (
						<>
							<div className='ex-filter-section'>
								<h3 className='ex-filter-label'>Course Code</h3>
								<div className='ex-pills'>
									{[
										{ key: 'firstYear', label: '1XX' },
										{ key: 'secondYear', label: '2XX' },
										{ key: 'thirdYear', label: '3XX' },
										{ key: 'fourthYear', label: '4XX' },
										{ key: 'seniorYear', label: '5XX+' }
									].map(({ key, label }) => (
										<button
											key={key}
											onClick={() =>
												setCourseFilters((prev) => ({
													...prev,
													[key]: !(prev as any)[key]
												}))
											}
											className={`ex-pill ${(courseFilters as any)[key] ? 'ex-pill-active' : ''}`}
										>
											{label}
										</button>
									))}
								</div>
							</div>

							<div className='ex-filter-section'>
								<div className='ex-slider-header'>
									<h3 className='ex-filter-label'>Min # of ratings</h3>
									<span className='ex-slider-value'>≥ {courseFilters.minRatings} ratings</span>
								</div>
								<input
									type='range'
									className='ex-range'
									min='0'
									max='9'
									step='1'
									value={courseSlider}
									onChange={handleSliderChange}
								/>
							</div>

							<div className='ex-filter-section'>
								<h3 className='ex-filter-label'>Offered in</h3>
								<div className='ex-checkboxes'>
									<label className='ex-checkbox-label'>
										<span
											className={`ex-checkbox ${!courseFilters.springTerm && !courseFilters.fallTerm && !courseFilters.winterTerm && !courseFilters.nextSpringTerm ? 'ex-checkbox-checked' : ''}`}
											onClick={() =>
												setCourseFilters((prev) => ({
													...prev,
													springTerm: false,
													fallTerm: false,
													winterTerm: false,
													nextSpringTerm: false
												}))
											}
										>
											{!courseFilters.springTerm && !courseFilters.fallTerm && !courseFilters.winterTerm && !courseFilters.nextSpringTerm && (
												<svg width='10' height='8' viewBox='0 0 10 8' fill='none'><path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/></svg>
											)}
										</span>
										<span>All terms</span>
									</label>
									{[
										{ handler: handleSpringTermChange, checked: courseFilters.springTerm, label: springTerm },
										{ handler: handleFallTermChange, checked: courseFilters.fallTerm, label: fallTerm },
										{ handler: handleWinterTermChange, checked: courseFilters.winterTerm, label: winterTerm },
										{ handler: handleNextSpringTermChange, checked: courseFilters.nextSpringTerm, label: nextSpringTerm }
									].map(({ handler, checked, label }) => (
										<label key={label} className='ex-checkbox-label'>
											<span
												className={`ex-checkbox ${checked ? 'ex-checkbox-checked' : ''}`}
												onClick={handler}
											>
												{checked && (
													<svg width='10' height='8' viewBox='0 0 10 8' fill='none'><path d='M1 4L3.5 6.5L9 1' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/></svg>
												)}
											</span>
											<span>{label}</span>
										</label>
									))}
								</div>
							</div>
						</>
					)}

					{/* Instructor-specific filters */}
					{activeTab === 2 && (
						<div className='ex-filter-section'>
							<div className='ex-slider-header'>
								<h3 className='ex-filter-label'>Min # of ratings</h3>
								<span className='ex-slider-value'>≥ {instructorFilters.minRatings} ratings</span>
							</div>
							<input
								type='range'
								className='ex-range'
								min='0'
								max='9'
								step='1'
								value={instructorSlider}
								onChange={handleSliderChange}
							/>
						</div>
					)}

					<button onClick={resetFilter} className='ex-reset-btn'>
						Reset Filter
					</button>
				</aside>

				{/* Main content */}
				<main className='ex-main'>
					{/* Tabs */}
					<nav className='ex-tabs' aria-label='Tabs' role='tablist' suppressHydrationWarning>
						<button
							suppressHydrationWarning
							onClick={() => { setActiveTab(1); setVisibleCourseCount(50) }}
							className={`ex-tab ${activeTab === 1 ? 'ex-tab-active' : ''}`}
							role='tab'
						>
							Courses <span className='ex-tab-count'>{sortedCourses.length.toLocaleString()}</span>
						</button>
						<button
							suppressHydrationWarning
							onClick={() => { setActiveTab(2); setVisibleInstructorCount(50) }}
							className={`ex-tab ${activeTab === 2 ? 'ex-tab-active' : ''}`}
							role='tab'
						>
							Instructors <span className='ex-tab-count'>{sortedInstructors.length.toLocaleString()}</span>
						</button>
					</nav>

					{/* Courses table */}
					<div className={activeTab === 1 ? '' : 'hidden'} role='tabpanel'>
						<div className='ex-table-wrap'>
							<table className='ex-table'>
								<thead>
									<tr className='ex-thead-row'>
										<th onClick={() => handleCourseSort('course_code')} className='ex-th'>
											Course Code {sortIndicator('course_code', courseSortField, courseOrder)}
										</th>
										<th onClick={() => handleCourseSort('course_title')} className='ex-th'>
											Course Name {sortIndicator('course_title', courseSortField, courseOrder)}
										</th>
										<th onClick={() => handleCourseSort('total_reviews')} className='ex-th'>
											Ratings {sortIndicator('total_reviews', courseSortField, courseOrder)}
										</th>
										<th onClick={() => handleCourseSort('useful')} className='ex-th'>
											Useful {sortIndicator('useful', courseSortField, courseOrder)}
										</th>
										<th onClick={() => handleCourseSort('easy')} className='ex-th'>
											Easy {sortIndicator('easy', courseSortField, courseOrder)}
										</th>
										<th onClick={() => handleCourseSort('liked')} className='ex-th'>
											Liked {sortIndicator('liked', courseSortField, courseOrder)}
										</th>
									</tr>
								</thead>
								<tbody>
									{sortedCourses.slice(0, visibleCourseCount).map((course, index) => (
										<tr key={index} className='ex-row'>
											<td className='ex-td ex-td-code'>
												<Link href={`/course/${course.course_code.replace(/\s+/g, '%20')}`}>
													{course.course_code}
												</Link>
											</td>
											<td className='ex-td ex-td-name'>{course.course_title}</td>
											<td className='ex-td ex-td-num'>{course.total_reviews}</td>
											<td className={`ex-td ${course.useful || course.useful === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{course.useful || course.useful === 0 ? course.useful + '%' : 'N/A'}
											</td>
											<td className={`ex-td ${course.easy || course.easy === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{course.easy || course.easy === 0 ? course.easy + '%' : 'N/A'}
											</td>
											<td className={`ex-td ${course.liked || course.liked === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{course.liked || course.liked === 0 ? course.liked + '%' : 'N/A'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div ref={courseLoaderRef} style={{ height: '20px' }} />
						</div>
						{filteredCourses.length === 0 && (
							<p className='ex-empty'>
								No courses found matching your criteria. Try adjusting your
								filters to broaden your search.
							</p>
						)}
					</div>

					{/* Instructors table */}
					<div className={activeTab === 2 ? '' : 'hidden'} role='tabpanel'>
						<div className='ex-table-wrap'>
							<table className='ex-table'>
								<thead>
									<tr className='ex-thead-row'>
										<th onClick={() => handleInstructorSort('instructor_name')} className='ex-th'>
											Instructor Name {sortIndicator('instructor_name', instructorSortField, instructorOrder)}
										</th>
										<th onClick={() => handleInstructorSort('total_reviews')} className='ex-th'>
											Ratings {sortIndicator('total_reviews', instructorSortField, instructorOrder)}
										</th>
										<th onClick={() => handleInstructorSort('clear')} className='ex-th'>
											Clear {sortIndicator('clear', instructorSortField, instructorOrder)}
										</th>
										<th onClick={() => handleInstructorSort('engaging')} className='ex-th'>
											Engaging {sortIndicator('engaging', instructorSortField, instructorOrder)}
										</th>
										<th onClick={() => handleInstructorSort('liked')} className='ex-th'>
											Liked {sortIndicator('liked', instructorSortField, instructorOrder)}
										</th>
									</tr>
								</thead>
								<tbody>
									{sortedInstructors.slice(0, visibleInstructorCount).map((instructor, index) => (
										<tr key={index} className='ex-row'>
											<td className='ex-td ex-td-code'>
												<Link href={`/instructor/${instructor.instructor_name.replace(/\s+/g, '%20')}`}>
													{instructor.instructor_name}
												</Link>
											</td>
											<td className='ex-td ex-td-num'>{instructor.total_reviews}</td>
											<td className={`ex-td ${instructor.clear || instructor.clear === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{instructor.clear || instructor.clear === 0 ? instructor.clear + '%' : 'N/A'}
											</td>
											<td className={`ex-td ${instructor.engaging || instructor.engaging === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{instructor.engaging || instructor.engaging === 0 ? instructor.engaging + '%' : 'N/A'}
											</td>
											<td className={`ex-td ${instructor.liked || instructor.liked === 0 ? 'ex-td-num' : 'ex-td-na'}`}>
												{instructor.liked || instructor.liked === 0 ? instructor.liked + '%' : 'N/A'}
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<div ref={instructorLoaderRef} style={{ height: '20px' }} />
						</div>
						{filteredInstructors.length === 0 && (
							<p className='ex-empty'>
								No instructors found matching your criteria. Try adjusting your
								filters to broaden your search.
							</p>
						)}
					</div>
				</main>
			</div>
		</>
	)
}
