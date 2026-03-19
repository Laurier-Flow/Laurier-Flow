'use client'

import { useEffect, useRef, useState } from 'react'
import DaysDisplay from '../course/DaysDisplay'
import { days } from '../course/CourseSchedule'
import Spinner from '@/components/Spinner'
import {
	addClassesToSchedule,
	deleteSpecificClassFromSchedule,
	getUserSchedule,
	updateUserClass,
	searchCourses,
	fetchSectionsForCourse,
	SectionOption
} from './user-data-functions'

interface UserClasses {
	class: string
	location: string
	time: string
	date: string
	type: string
	grade: string
	id: number
	term: string
	instructor: string
	section: string
}

interface UserTerm {
	term: string
	classes: UserClasses[]
}

interface SortingInterface {
	term: string
	id: number
}

const TABLE_HEADERS = ['Class', 'Section', 'Instructor', 'Location', 'Time', 'Days', 'Type', 'Grade']

const DAY_LABELS: { key: keyof days; label: string }[] = [
	{ key: 'monday', label: 'M' },
	{ key: 'tuesday', label: 'T' },
	{ key: 'wednesday', label: 'W' },
	{ key: 'thursday', label: 'T' },
	{ key: 'friday', label: 'F' },
	{ key: 'saturday', label: 'S' },
	{ key: 'sunday', label: 'Su' }
]

const DAY_NAMES: Record<keyof days, string> = {
	monday: 'Monday',
	tuesday: 'Tuesday',
	wednesday: 'Wednesday',
	thursday: 'Thursday',
	friday: 'Friday',
	saturday: 'Saturday',
	sunday: 'Sunday'
}

function DaySelector({
	daysState,
	onToggle
}: {
	daysState: days
	onToggle: (dayName: string) => void
}) {
	return (
		<div className='pf-day-selector'>
			{DAY_LABELS.map(({ key, label }) => (
				<button
					key={key}
					type='button'
					className={`pf-day-btn ${daysState[key] ? 'active' : ''}`}
					onClick={() => onToggle(DAY_NAMES[key])}
				>
					{label}
				</button>
			))}
		</div>
	)
}

function CourseSearch({
	onSelect
}: {
	onSelect: (courseCode: string) => void
}) {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<{ course_code: string; course_title: string }[]>([])
	const [open, setOpen] = useState(false)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClick)
		return () => document.removeEventListener('mousedown', handleClick)
	}, [])

	const handleSearch = (value: string) => {
		setQuery(value)
		if (debounceRef.current) clearTimeout(debounceRef.current)
		if (value.length < 2) {
			setResults([])
			setOpen(false)
			return
		}
		debounceRef.current = setTimeout(async () => {
			const data = await searchCourses(value)
			setResults(data)
			setOpen(data.length > 0)
		}, 250)
	}

	return (
		<div ref={wrapperRef} className='pf-course-search'>
			<input
				type='text'
				className='pf-schedule-input pf-course-search-input'
				placeholder='Search courses...'
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
				onFocus={() => results.length > 0 && setOpen(true)}
			/>
			{open && (
				<div className='pf-course-search-dropdown'>
					{results.map((c) => (
						<button
							key={c.course_code}
							type='button'
							className='pf-course-search-item'
							onClick={() => {
								onSelect(c.course_code)
								setQuery(c.course_code)
								setOpen(false)
							}}
						>
							<span className='pf-course-search-code'>{c.course_code}</span>
							<span className='pf-course-search-title'>{c.course_title}</span>
						</button>
					))}
				</div>
			)}
		</div>
	)
}

function SectionPicker({
	sections,
	loading,
	onSelect,
	onManual
}: {
	sections: SectionOption[]
	loading: boolean
	onSelect: (s: SectionOption) => void
	onManual: () => void
}) {
	if (loading) {
		return <span className='pf-section-loading'>Loading sections...</span>
	}

	return (
		<div className='pf-section-picker'>
			{sections.length > 0 ? (
				<>
					<label className='pf-add-term-label'>Select a section</label>
					<div className='pf-section-list'>
						{sections.map((s, i) => (
							<button
								key={`${s.crn}-${i}`}
								type='button'
								className='pf-section-option'
								onClick={() => onSelect(s)}
							>
								<span className='pf-section-option-main'>
									{s.section && <span>Sec {s.section}</span>}
									{s.type && <span className='pf-section-option-dim'>{s.type}</span>}
								</span>
								<span className='pf-section-option-details'>
									{s.instructor && <span>{s.instructor}</span>}
									{s.time && <span className='pf-section-option-dim'>{s.time}</span>}
									{s.location && <span className='pf-section-option-dim'>{s.location}</span>}
								</span>
							</button>
						))}
					</div>
				</>
			) : (
				<p className='pf-section-empty'>No sections found for current terms.</p>
			)}
			<button type='button' className='pf-btn-ghost' onClick={onManual} style={{ marginTop: 12 }}>
				Enter details manually
			</button>
		</div>
	)
}

function ScheduleTableHeaders() {
	return (
		<thead>
			<tr>
				{TABLE_HEADERS.map((h) => (
					<th key={h}>{h}</th>
				))}
				<th />
			</tr>
		</thead>
	)
}

const Schedule = () => {
	const initialClassStatus: UserClasses = {
		class: '',
		instructor: '',
		section: '',
		location: '',
		time: '',
		date: '',
		type: '',
		grade: '',
		id: 0,
		term: ''
	}
	const initialDateStatus: days = {
		monday: false,
		tuesday: false,
		wednesday: false,
		thursday: false,
		friday: false,
		saturday: false,
		sunday: false
	}

	const [userPreExistingSchedule, setUserPreExistingSchedule] =
		useState<UserTerm[]>()

	const [pageLoaded, setPageLoaded] = useState(false)
	const [update, setUpdate] = useState(false)

	// Add course flow states
	const [addCourseStep, setAddCourseStep] = useState<'idle' | 'search' | 'pick-section' | 'manual'>('idle')
	const [addForTerm, setAddForTerm] = useState<string | null>(null)
	const [selectedCourseCode, setSelectedCourseCode] = useState('')
	const [availableSections, setAvailableSections] = useState<SectionOption[]>([])
	const [sectionsLoading, setSectionsLoading] = useState(false)
	const [newClass, setNewClass] = useState<UserClasses>(initialClassStatus)
	const [addClassDatesDisplay, setAddClassDatesDisplay] = useState<days>(initialDateStatus)

	// Add new term
	const [addNewTerm, setAddNewTerm] = useState(false)
	const [newTermName, setNewTermName] = useState('')

	// Edit states
	const [editSchedule, setEditSchedule] = useState(false)
	const [editClass, setEditClass] = useState<UserClasses>(initialClassStatus)
	const [editClassDatesDisplay, setEditClassDatesDisplay] = useState<days>(initialDateStatus)

	const [error, setError] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')

	useEffect(() => {
		const getData = async () => {
			const data = await getUserSchedule()
			if (data && data.length > 0) {
				let determineTermOrder: SortingInterface[] = []
				const mapOfClasses: Map<number, UserClasses> = new Map()

				data.forEach((course: UserClasses) => {
					determineTermOrder.push({ term: course.term, id: course.id })
					mapOfClasses.set(course.id, course)
				})

				determineTermOrder = determineTermOrder.sort(
					(a, b) => a.term.localeCompare(b.term)
				)

				const userTerms: UserTerm[] = []
				let classesInTerm: UserClasses[] = []
				let currentTerm = determineTermOrder[0].term

				determineTermOrder.forEach((course) => {
					if (currentTerm === course.term) {
						classesInTerm.push(mapOfClasses.get(course.id)!)
					} else {
						userTerms.push({ term: currentTerm, classes: classesInTerm })
						currentTerm = course.term
						classesInTerm = [mapOfClasses.get(course.id)!]
					}
				})
				userTerms.push({ term: currentTerm, classes: classesInTerm })
				setUserPreExistingSchedule(userTerms)
			} else {
				setUserPreExistingSchedule(undefined)
			}
		}
		getData()
			.then(() => { setUpdate(false); setPageLoaded(true) })
			.catch(() => { setError(true); setErrorMsg('An unexpected error has occurred when loading your schedule') })
	}, [update])

	const resetAddState = () => {
		setAddCourseStep('idle')
		setAddForTerm(null)
		setSelectedCourseCode('')
		setAvailableSections([])
		setNewClass(initialClassStatus)
		setAddClassDatesDisplay(initialDateStatus)
		setError(false)
	}

	const handleCourseSelect = async (courseCode: string) => {
		setSelectedCourseCode(courseCode)
		setNewClass({ ...initialClassStatus, class: courseCode })
		setSectionsLoading(true)
		setAddCourseStep('pick-section')

		try {
			const sections = await fetchSectionsForCourse(courseCode)
			setAvailableSections(sections)
		} catch {
			setAvailableSections([])
		} finally {
			setSectionsLoading(false)
		}
	}

	const handleSectionSelect = (s: SectionOption) => {
		const daysObj: days = {
			monday: s.days.includes('Monday'),
			tuesday: s.days.includes('Tuesday'),
			wednesday: s.days.includes('Wednesday'),
			thursday: s.days.includes('Thursday'),
			friday: s.days.includes('Friday'),
			saturday: s.days.includes('Saturday'),
			sunday: s.days.includes('Sunday')
		}
		setAddClassDatesDisplay(daysObj)
		setNewClass({
			...newClass,
			class: selectedCourseCode,
			section: s.section,
			instructor: s.instructor,
			location: s.location,
			time: s.time,
			date: s.days,
			type: s.type,
			grade: ''
		})
		setAddCourseStep('manual')
	}

	const handleGoManual = () => {
		setAddCourseStep('manual')
	}

	const buildDateString = (d: days) => {
		let str = ''
		if (d.monday) str += 'Monday'
		if (d.tuesday) str += 'Tuesday'
		if (d.wednesday) str += 'Wednesday'
		if (d.thursday) str += 'Thursday'
		if (d.friday) str += 'Friday'
		if (d.saturday) str += 'Saturday'
		if (d.sunday) str += 'Sunday'
		return str
	}

	const handleAddDateChange = (dayName: string) => {
		const key = dayName.toLowerCase() as keyof days
		const updated = { ...addClassDatesDisplay, [key]: !addClassDatesDisplay[key] }
		setAddClassDatesDisplay(updated)
		setNewClass({ ...newClass, date: buildDateString(updated) })
	}

	const handleEditDateChange = (dayName: string) => {
		const key = dayName.toLowerCase() as keyof days
		const updated = { ...editClassDatesDisplay, [key]: !editClassDatesDisplay[key] }
		setEditClassDatesDisplay(updated)
		setEditClass({ ...editClass, date: buildDateString(updated) })
	}

	const handleDeleteClass = async (id: number) => {
		await deleteSpecificClassFromSchedule(id)
		setUpdate(true)
	}

	const handleStartEdit = (userClass: UserClasses) => {
		setEditClassDatesDisplay({
			monday: userClass.date.includes('Monday'),
			tuesday: userClass.date.includes('Tuesday'),
			wednesday: userClass.date.includes('Wednesday'),
			thursday: userClass.date.includes('Thursday'),
			friday: userClass.date.includes('Friday'),
			saturday: userClass.date.includes('Saturday'),
			sunday: userClass.date.includes('Sunday')
		})
		setEditClass(userClass)
		setEditSchedule(true)
	}

	const handleSaveEdit = async () => {
		if (editClass.class && editClass.instructor && editClass.location &&
			editClass.time && editClass.date && editClass.type && editClass.section) {
			await updateUserClass(
				editClass.term, editClass.class, editClass.instructor,
				editClass.location, editClass.time, editClass.date,
				editClass.type, editClass.grade, editClass.id, editClass.section
			)
			setError(false)
			setUpdate(true)
			setTimeout(() => setEditSchedule(false), 500)
		} else {
			setError(true)
			setErrorMsg('Please fill out all fields (Grade is optional)')
		}
	}

	const handleSubmitNewClass = async (term: string) => {
		if (term && newClass.class && newClass.instructor && newClass.location &&
			newClass.time && newClass.date && newClass.type && newClass.section) {
			const res = await addClassesToSchedule(
				term, newClass.class, newClass.instructor, newClass.location,
				newClass.time, newClass.date, newClass.type, newClass.grade, newClass.section
			)
			if (res) {
				resetAddState()
				setAddNewTerm(false)
				setNewTermName('')
				setUpdate(true)
			} else {
				setError(true)
				setErrorMsg('Failed to add course. Please try again.')
			}
		} else {
			setError(true)
			setErrorMsg('Please fill out all fields (Grade is optional)')
		}
	}

	const renderAddFlow = (termName: string) => {
		if (addForTerm !== termName && addCourseStep !== 'idle') return null

		if (addCourseStep === 'search') {
			return (
				<div className='pf-add-flow'>
					<label className='pf-add-term-label'>Search for a course</label>
					<CourseSearch onSelect={handleCourseSelect} />
					<button type='button' className='pf-btn-ghost' onClick={resetAddState} style={{ marginTop: 12 }}>
						Cancel
					</button>
				</div>
			)
		}

		if (addCourseStep === 'pick-section') {
			return (
				<div className='pf-add-flow'>
					<p className='pf-add-flow-course'>{selectedCourseCode}</p>
					<SectionPicker
						sections={availableSections}
						loading={sectionsLoading}
						onSelect={handleSectionSelect}
						onManual={handleGoManual}
					/>
					<button type='button' className='pf-btn-ghost' onClick={resetAddState} style={{ marginTop: 8 }}>
						Cancel
					</button>
				</div>
			)
		}

		if (addCourseStep === 'manual') {
			return (
				<div className='pf-add-flow'>
					<p className='pf-add-flow-course'>{selectedCourseCode || 'New Course'}</p>
					<div className='pf-manual-grid'>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Class</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.class}
								onChange={(e) => setNewClass({ ...newClass, class: e.target.value })}
								placeholder='BU111'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Section</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.section}
								onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
								placeholder='A'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Instructor</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.instructor}
								onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
								placeholder='Dave Swanston'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Location</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.location}
								onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
								placeholder='LH3094'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Time</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.time}
								onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
								placeholder='8:30 AM - 9:30 AM'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Type</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.type}
								onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
								placeholder='Lecture'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Grade</label>
							<input
								type='text'
								className='pf-schedule-input'
								value={newClass.grade}
								onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
								placeholder='Optional'
							/>
						</div>
						<div className='pf-manual-field'>
							<label className='pf-add-term-label'>Days</label>
							<DaySelector daysState={addClassDatesDisplay} onToggle={handleAddDateChange} />
						</div>
					</div>
					<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
						<button
							type='button'
							className='pf-btn-primary'
							onClick={() => handleSubmitNewClass(termName)}
						>
							Add Course
						</button>
						<button type='button' className='pf-btn-ghost' onClick={resetAddState}>
							Cancel
						</button>
					</div>
				</div>
			)
		}

		return null
	}

	const renderEditRow = () => (
		<tr>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.class}
					onChange={(e) => setEditClass({ ...editClass, class: e.target.value })} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.section}
					onChange={(e) => setEditClass({ ...editClass, section: e.target.value })} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.instructor}
					onChange={(e) => setEditClass({ ...editClass, instructor: e.target.value })} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.location}
					onChange={(e) => setEditClass({ ...editClass, location: e.target.value })} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.time}
					onChange={(e) => setEditClass({ ...editClass, time: e.target.value })} placeholder='8:30 AM - 9:30 AM' />
			</td>
			<td>
				<DaySelector daysState={editClassDatesDisplay} onToggle={handleEditDateChange} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.type}
					onChange={(e) => setEditClass({ ...editClass, type: e.target.value })} />
			</td>
			<td>
				<input type='text' className='pf-schedule-input' value={editClass.grade}
					onChange={(e) => setEditClass({ ...editClass, grade: e.target.value })} />
			</td>
			<td>
				<div style={{ display: 'flex', gap: 8 }}>
					<button type='button' className='pf-btn-primary' onClick={handleSaveEdit}>Save</button>
					<button type='button' className='pf-btn-danger' onClick={() => { setError(false); setEditSchedule(false) }}>Cancel</button>
				</div>
			</td>
		</tr>
	)

	const renderDisplayRow = (userClass: UserClasses) => (
		<tr key={userClass.id}>
			<td>{userClass.class}</td>
			<td>{userClass.section}</td>
			<td>{userClass.instructor}</td>
			<td>{userClass.location}</td>
			<td>{userClass.time}</td>
			<td>
				<DaysDisplay
					days={{
						monday: userClass.date.includes('Monday'),
						tuesday: userClass.date.includes('Tuesday'),
						wednesday: userClass.date.includes('Wednesday'),
						thursday: userClass.date.includes('Thursday'),
						friday: userClass.date.includes('Friday'),
						saturday: userClass.date.includes('Saturday'),
						sunday: userClass.date.includes('Sunday')
					}}
				/>
			</td>
			<td>{userClass.type}</td>
			<td>{userClass.grade}</td>
			<td>
				<div style={{ display: 'flex', gap: 8 }}>
					<button type='button' className='pf-btn-ghost' onClick={() => handleStartEdit(userClass)}>
						Edit
					</button>
					<button type='button' className='pf-btn-danger' onClick={() => handleDeleteClass(userClass.id)}>
						Delete
					</button>
				</div>
			</td>
		</tr>
	)

	return (
		<div>
			{error && (
				<div className='pf-alert-error'>
					<strong>Error!</strong> {errorMsg}
				</div>
			)}
			{pageLoaded ? (
				<>
					{userPreExistingSchedule?.map((term, index) => (
						<div key={index} className='pf-schedule-term'>
							<h3 className='pf-schedule-term-title'>{term.term}</h3>
							<div style={{ overflowX: 'auto' }}>
								<table className='pf-schedule-table'>
									<ScheduleTableHeaders />
									<tbody>
										{term.classes.map((userClass) =>
											editSchedule && editClass.id === userClass.id
												? renderEditRow()
												: renderDisplayRow(userClass)
										)}
									</tbody>
								</table>
							</div>

							{renderAddFlow(term.term)}

							{addCourseStep === 'idle' && (
								<div style={{ marginTop: 16 }}>
									<button
										type='button'
										className='pf-btn-ghost'
										onClick={() => {
											setAddForTerm(term.term)
											setAddCourseStep('search')
										}}
									>
										+ Add Course
									</button>
								</div>
							)}

							<hr className='pf-schedule-divider' />
						</div>
					))}

					{addNewTerm ? (
						<div className='pf-schedule-term'>
							<h3 className='pf-schedule-term-title'>{newTermName}</h3>
							{renderAddFlow(newTermName)}
							{addCourseStep === 'idle' && (
								<div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
									<button
										type='button'
										className='pf-btn-ghost'
										onClick={() => {
											setAddForTerm(newTermName)
											setAddCourseStep('search')
										}}
									>
										+ Add Course
									</button>
									<button
										type='button'
										className='pf-btn-danger'
										onClick={() => { setAddNewTerm(false); setNewTermName('') }}
									>
										Cancel
									</button>
								</div>
							)}
						</div>
					) : (
						<div className='pf-add-term-section'>
							<label className='pf-add-term-label'>Add New Term</label>
							<div className='pf-add-term-row'>
								<input
									type='text'
									className='pf-schedule-input'
									placeholder='1A'
									value={newTermName}
									onChange={(e) => setNewTermName(e.target.value)}
								/>
								<button
									type='button'
									className='pf-btn-primary'
									onClick={() => {
										if (newTermName.length > 0) {
											setError(false)
											setAddNewTerm(true)
										} else {
											setError(true)
											setErrorMsg('Please enter a term name')
										}
									}}
								>
									Add Term
								</button>
							</div>
						</div>
					)}
				</>
			) : (
				<Spinner />
			)}
		</div>
	)
}

export default Schedule
