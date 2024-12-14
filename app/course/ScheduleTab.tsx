'use client'

import { useEffect, useState } from 'react'
import { section } from './CourseSchedule'
import DaysDisplay from './DaysDisplay'
import React from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { useManageBodyScroll, usePopupManager } from '@/components/Header'
import LoginPopup from '@/components/LoginPopup'
import SignUpPopup from '@/components/SignUpPopup'

function ScheduleTab({
	activeTab,
	tabNumber,
	termSections,
	professor,
	user
}: {
	activeTab: number
	tabNumber: number
	termSections: section[]
	professor: boolean
	user: User | null
}) {
	const [currentPage, setCurrentPage] = useState(1)
	const [termSectionsVisible, setTermSectionVisible] = useState(
		termSections.slice(0, 11)
	)

	useEffect(() => {
		setTermSectionVisible(
			termSections.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10)
		)
	}, [currentPage])

	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		showPasswordPopup,
		togglePasswordPopup
	} = usePopupManager()

	useManageBodyScroll(showLoginPopup || showSignUpPopup || showPasswordPopup)

	const pages = Math.ceil(termSections.length / 10)
	const pageButtons = []

	for (let i = 1; i <= pages; i++) {
		pageButtons.push(
			<button
				type='button'
				onClick={() => setCurrentPage(i)}
				className={`flex min-w-[40px] items-center justify-center text-gray-800 ${currentPage !== i ? 'hover:bg-gray-100' : null} rounded-full py-2.5 text-sm disabled:pointer-events-none disabled:opacity-50 dark:text-white ${currentPage !== i ? 'dark:hover:bg-white/10' : null} ${currentPage === i ? 'bg-secondary' : null}`}
			>
				{i}
			</button>
		)
	}

	const handlePreviousPageClick = () => {
		if (currentPage !== 1) {
			setCurrentPage((p) => p - 1)
		}
	}

	const handleNextPageClick = () => {
		if (currentPage !== pages) {
			setCurrentPage((p) => p + 1)
		}
	}

	return (
		<>
			<div
				id='equal-width-elements-1'
				className={activeTab === tabNumber ? '' : 'hidden'}
				role='tabpanel'
				aria-labelledby='equal-width-elements-item-1'
			>
				<div className='flex flex-col'>
					<div className='-m-1.5 overflow-x-auto'>
						<div className='inline-block min-w-full overflow-x-auto p-1.5 align-middle'>
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
											{professor ? (
												<th
													scope='col'
													className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
												>
													Course
												</th>
											) : (
												<th
													scope='col'
													className='px-6 py-3 text-start text-xs font-medium uppercase text-gray-500'
												>
													Instructor
												</th>
											)}
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
										{professor && !user ? (
											<tr>
												<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
													<button
														className='underline'
														onClick={toggleLoginPopup}
													>
														Login to View
													</button>
												</td>
											</tr>
										) : termSectionsVisible.length ? (
											termSectionsVisible.map((item: section, index) => (
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
													<td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200'>
														{index === 0 && !user ? (
															<button
																className='underline'
																onClick={toggleLoginPopup}
															>
																Login to View
															</button>
														) : (
															<h1>{item.location}</h1>
														)}
													</td>
													<td
														className={`whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 ${item.instructor ? 'underline' : null}`}
													>
														{index === 0 && !user ? (
															<button
																className='underline'
																onClick={toggleLoginPopup}
															>
																Login to View
															</button>
														) : (
															<Link
																href={`/${professor ? 'course' : 'instructor'}/${item.instructor?.replace(/\s+/g, '%20')}`}
															>
																{item.instructor}
															</Link>
														)}
													</td>
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
					{termSections.length && ((professor && user) || !professor) ? (
						<div className='px-4 pt-4'>
							<nav className='flex items-center space-x-1'>
								<button
									onClick={handlePreviousPageClick}
									type='button'
									className='inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10'
								>
									<span aria-hidden='true'>«</span>
									<span className='sr-only'>Previous</span>
								</button>
								{pageButtons}
								<button
									onClick={handleNextPageClick}
									type='button'
									className='inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-white/10'
								>
									<span className='sr-only'>Next</span>
									<span aria-hidden='true'>»</span>
								</button>
							</nav>
						</div>
					) : null}
				</div>
			</div>
			{showLoginPopup && !showSignUpPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>
			)}
			{showSignUpPopup && !showLoginPopup && (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>
			)}
		</>
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
	springTerm,
	fallTerm,
	winterTerm,
	nextSpringTerm,
	springTermSections,
	fallTermSections,
	winterTermSections,
	nextSpringTermSections,
	professor,
	user
}: {
	springTerm: string
	fallTerm: string
	winterTerm: string
	nextSpringTerm: string
	springTermSections: section[]
	fallTermSections: section[]
	winterTermSections: section[]
	nextSpringTermSections: section[]
	professor: boolean
	user: User | null
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
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-sm font-medium ${activeTab === 1 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 1 ? 'dark:text-white' : 'text-gray-400'} dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`}
					id='equal-width-elements-item-1'
					data-hs-tab='#equal-width-elements-1'
					aria-controls='equal-width-elements-1'
					role='tab'
				>
					{springTerm}
				</button>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(2)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-sm font-medium ${activeTab === 2 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 2 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`}
					data-hs-tab='#equal-width-elements-2'
					aria-controls='equal-width-elements-2'
					role='tab'
				>
					{fallTerm}
				</button>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(3)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-sm font-medium ${activeTab === 3 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 3 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 3 ? 'active' : ''}`}
					data-hs-tab='#equal-width-elements-3'
					aria-controls='equal-width-elements-3'
					role='tab'
				>
					{winterTerm}
				</button>
				<button
					suppressHydrationWarning
					onClick={() => handleTabClick(4)}
					type='button'
					className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white inline-flex grow basis-0 items-center justify-center gap-x-2 bg-transparent px-4 py-3 text-center text-center text-sm font-medium ${activeTab === 4 ? 'text-slate-900' : 'text-gray-200'} rounded-lg hover:text-slate-800 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 3 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 4 ? 'active' : ''}`}
					data-hs-tab='#equal-width-elements-3'
					aria-controls='equal-width-elements-3'
					role='tab'
				>
					{nextSpringTerm}
				</button>
			</nav>

			<ScheduleTab
				termSections={springTermSections}
				activeTab={activeTab}
				tabNumber={1}
				professor={professor}
				user={user}
			/>
			<ScheduleTab
				termSections={fallTermSections}
				activeTab={activeTab}
				tabNumber={2}
				professor={professor}
				user={user}
			/>
			<ScheduleTab
				termSections={winterTermSections}
				activeTab={activeTab}
				tabNumber={3}
				professor={professor}
				user={user}
			/>
			<ScheduleTab
				termSections={nextSpringTermSections}
				activeTab={activeTab}
				tabNumber={4}
				professor={professor}
				user={user}
			/>
		</>
	)
}
