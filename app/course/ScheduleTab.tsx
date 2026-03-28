'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { section, fetchTermSections } from './CourseSchedule'
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
	user,
	isLoading,
}: {
	activeTab: number
	tabNumber: number
	termSections: section[]
	professor: boolean
	user: User | null
	isLoading?: boolean
}) {
	const [currentPage, setCurrentPage] = useState(1)

	// Reset to page 1 and update visible sections whenever termSections changes
	useEffect(() => {
		setCurrentPage(1)
	}, [termSections])

	const termSectionsVisible = termSections.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10)

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
				key={i}
				type='button'
				onClick={() => setCurrentPage(i)}
				className={`cp-page-btn ${currentPage === i ? 'cp-page-btn-active' : ''}`}
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
			<div className={activeTab === tabNumber ? '' : 'hidden'}>
				<div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
					<table className='cp-sched-table'>
						<thead>
							<tr>
								<th>CRN</th>
								<th>Type</th>
								<th>Section</th>
								<th>Campus</th>
								<th>Enrolled</th>
								<th>Time</th>
								<th>Days</th>
								<th>Location</th>
								<th>{professor ? 'Course' : 'Instructor'}</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<tr key={i} className='cp-sched-skeleton-row'>
										{Array.from({ length: 9 }).map((_, j) => (
											<td key={j}><div className='cp-sched-skeleton' /></td>
										))}
									</tr>
								))
							) : professor && !user ? (
								<tr>
									<td>
										<button
											className='cp-sched-login-btn'
											onClick={toggleLoginPopup}
										>
											Login to View
										</button>
									</td>
								</tr>
							) : termSectionsVisible.length ? (
								termSectionsVisible.map((item: section, index) => (
									<tr key={index}>
										<td>{item.crn}</td>
										<td>{item.type}</td>
										<td>{item.section}</td>
										<td>{item.campus}</td>
										<td>{item.enrollment + '/' + item.enrollmentMax}</td>
										<td>
											{item.beginTime
												? convertTo12HourFormat(item.beginTime) +
													' – ' +
													convertTo12HourFormat(item.endTime)
												: null}
										</td>
										<td>
											<DaysDisplay days={item.days} />
										</td>
										<td>
											{index === 0 && !user ? (
												<button
													className='cp-sched-login-btn'
													onClick={toggleLoginPopup}
												>
													Login to View
												</button>
											) : (
												item.location
											)}
										</td>
										<td>
											{index === 0 && !user ? (
												<button
													className='cp-sched-login-btn'
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
									<td colSpan={9} className='cp-sched-empty'>
										No Sections Found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{termSections.length > 0 && ((professor && user) || !professor) ? (
					<div className='cp-pagination'>
						<button
							onClick={handlePreviousPageClick}
							type='button'
							className='cp-page-btn cp-page-arrow'
						>
							«
						</button>
						{pageButtons}
						<button
							onClick={handleNextPageClick}
							type='button'
							className='cp-page-btn cp-page-arrow'
						>
							»
						</button>
					</div>
				) : null}
			</div>
			{showLoginPopup && !showSignUpPopup && createPortal(
				<div className='hp-popup-overlay'>
					<LoginPopup
						searchParams={{ message: '' }}
						onClose={toggleLoginPopup}
						toggleSignUp={toggleSignUpPopup}
						togglePasswordReset={togglePasswordPopup}
					/>
				</div>,
				document.body
			)}
			{showSignUpPopup && !showLoginPopup && createPortal(
				<div className='hp-popup-overlay'>
					<SignUpPopup
						searchParams={{ message: '' }}
						onClose={toggleSignUpPopup}
						toggleLogIn={toggleLoginPopup}
					/>
				</div>,
				document.body
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
	user,
	defaultTab = 1,
	filterCol,
	colValue,
	dataTerms,
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
	defaultTab?: number
	filterCol?: string
	colValue?: string
	dataTerms?: { springTerm: string; fallTerm: string; winterTerm: string; nextSpringTerm: string }
}) {
	const [activeTab, setActiveTab] = useState(defaultTab)
	const [sections, setSections] = useState({
		1: springTermSections,
		2: fallTermSections,
		3: winterTermSections,
		4: nextSpringTermSections,
	})
	const [loading, setLoading] = useState<number | null>(null)
	// Track which tabs have been fetched (including those that returned empty)
	const [fetched, setFetched] = useState<Set<number>>(() => new Set([defaultTab]))

	const termDataMap: Record<number, string> = {
		1: dataTerms?.springTerm ?? '',
		2: dataTerms?.fallTerm ?? '',
		3: dataTerms?.winterTerm ?? '',
		4: dataTerms?.nextSpringTerm ?? '',
	}

	const handleTabClick = async (tabNum: number) => {
		setActiveTab(tabNum)
		if (fetched.has(tabNum) || !filterCol || !colValue || !dataTerms) return
		setLoading(tabNum)
		try {
			const data = await fetchTermSections(termDataMap[tabNum], filterCol, colValue, user?.id ?? null)
			setSections(prev => ({ ...prev, [tabNum]: data }))
			setFetched(prev => new Set(prev).add(tabNum))
		} finally {
			setLoading(null)
		}
	}

	return (
		<>
			<div className='cp-schedule-tabs'>
				{[
					{ num: 1, label: springTerm },
					{ num: 2, label: fallTerm },
					{ num: 3, label: winterTerm },
					{ num: 4, label: nextSpringTerm },
				].map((tab) => (
					<button
						key={tab.num}
						suppressHydrationWarning
						onClick={() => handleTabClick(tab.num)}
						type='button'
						className={`cp-schedule-tab ${activeTab === tab.num ? 'cp-schedule-tab-active' : ''}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<ScheduleTab
				termSections={sections[1]}
				activeTab={activeTab}
				tabNumber={1}
				professor={professor}
				user={user}
				isLoading={loading === 1}
			/>
			<ScheduleTab
				termSections={sections[2]}
				activeTab={activeTab}
				tabNumber={2}
				professor={professor}
				user={user}
				isLoading={loading === 2}
			/>
			<ScheduleTab
				termSections={sections[3]}
				activeTab={activeTab}
				tabNumber={3}
				professor={professor}
				user={user}
				isLoading={loading === 3}
			/>
			<ScheduleTab
				termSections={sections[4]}
				activeTab={activeTab}
				tabNumber={4}
				professor={professor}
				user={user}
				isLoading={loading === 4}
			/>
		</>
	)
}
