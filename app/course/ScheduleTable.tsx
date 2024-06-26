'use client'

import { useState } from 'react'
import { section } from './CourseSchedule'
import DaysDisplay from './DaysDisplay'

async function ScheduleTab({
	activeTab,
	tabNumber,
	termSections
}: {
	activeTab: number
	tabNumber: number
	termSections: section[]
}) {
	return (
		<div
			id='equal-width-elements-1'
			className={activeTab === tabNumber ? '' : 'hidden'}
			role='tabpanel'
			aria-labelledby='equal-width-elements-item-1'
		>
			<div className='flex flex-col'>
				<div className='-m-1.5 overflow-x-auto'>
					<div className='inline-block min-w-full p-1.5 align-middle'>
						<div className='overflow-hidden'>
							<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
								<thead>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											CRN
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Type
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Section
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Campus
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Enrolled
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Time
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Date
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Location
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
										>
											Instructor
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
									{termSections.length ? (
										termSections.map((item: section, index) => (
											<tr key={index}>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													{item.crn}
												</td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													{item.type}
												</td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													{item.section}
												</td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													{item.campus}
												</td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													{item.enrollment + '/' + item.enrollmentMax}
												</td>
												{item.beginTime ? (
													<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
														{convertTo12HourFormat(item.beginTime) +
															' - ' +
															convertTo12HourFormat(item.endTime)}
													</td>
												) : (
													<td></td>
												)}
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													<DaysDisplay days={item.days} />
												</td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'></td>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'></td>
											</tr>
										))
									) : (
										<tr>
											<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
												No Sections Found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function convertTo12HourFormat(timeString: string | null | undefined) {
	if (!timeString) {
		return null
	}
	const hours = timeString.slice(0, 2)
	const minutes = timeString.slice(2, 4)
	const parsedHours = parseInt(hours, 10)

	if (parsedHours >= 0 && parsedHours < 12) {
		return `${parsedHours === 0 ? 12 : parsedHours}:${minutes} AM`
	} else if (parsedHours === 12) {
		return `12:${minutes} PM`
	} else {
		return `${parsedHours - 12}:${minutes} PM`
	}
}

export default function ScheduleTable({
	nextTerm,
	currentTerm,
	previousTerm,
	nextTermSections,
	currentTermSections,
	previousTermSections
}: {
	nextTerm: string
	currentTerm: string
	previousTerm: string
	nextTermSections: section[]
	currentTermSections: section[]
	previousTermSections: section[]
}) {
	const [activeTab, setActiveTab] = useState(1)
	const handleTabClick = (tabNumber: number) => {
		setActiveTab(tabNumber)
	}

	return (
		<>
			<nav
				suppressHydrationWarning
				className='flex space-x-2 pt-4'
				aria-label='Tabs'
				role='tablist'
			>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(1)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`}
					id='equal-width-elements-item-1'
					data-hs-tab='#equal-width-elements-1'
					aria-controls='equal-width-elements-1'
					role='tab'
				>
					{nextTerm}
				</button>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(2)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`}
					data-hs-tab='#equal-width-elements-2'
					aria-controls='equal-width-elements-2'
					role='tab'
				>
					{currentTerm}
				</button>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(3)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 rounded-lg bg-transparent px-4 py-3 text-center text-center text-sm font-medium text-gray-500 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 3 ? 'active' : ''}`}
					data-hs-tab='#equal-width-elements-3'
					aria-controls='equal-width-elements-3'
					role='tab'
				>
					{previousTerm}
				</button>
			</nav>

			<ScheduleTab
				termSections={nextTermSections}
				activeTab={activeTab}
				tabNumber={1}
			/>
			<ScheduleTab
				termSections={currentTermSections}
				activeTab={activeTab}
				tabNumber={2}
			/>
			<ScheduleTab
				termSections={previousTermSections}
				activeTab={activeTab}
				tabNumber={3}
			/>
		</>
	)
}
