'use client'

import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { facultyCoursePrefix } from '@/utils/lib/facultyCoursePrefix'
import { disciplineCodes } from '@/utils/lib/disciplineCodes'
import { redirectToExploreAll } from '@/utils/lib/clientSideRedirects'
import { Search, Telescope, BookOpenText, UserRound } from 'lucide-react'

type CourseResult = {
	course_code: string
	course_title: string | null
	easy: number | null
	liked: number | null
	total_reviews: number | null
	useful: number | null
}

type ProfResult = {
	clear: number | null
	engaging: number | null
	instructor_email: string | null
	instructor_name: string
	liked: number | null
	total_reviews: number | null
}

const slugify = (link: string) => {
	return link.replaceAll(/\s/g, '%20')
}

const CourseResultListItem = ({ params }: { params: CourseResult }) => {
	const courseLink = '/course/' + slugify(params.course_code)
	return (
		<Link
			href={courseLink}
			className='w-full flex flex-row p-2 pl-3 bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 last:rounded-b-md'
		>
			<BookOpenText />
			<span className='pl-3'>
				<span className='text-secondary font-bold'>{params.course_code}</span> -{' '}
				<span className='font-bold'>{params.course_title}</span>
			</span>
		</Link>
	)
}

const ProfResultListItem = ({ params }: { params: ProfResult }) => {
	const profLink = '/instructor/' + slugify(params.instructor_name)

	return (
		<Link
			href={profLink}
			className='w-full flex flex-row p-2 pl-3 bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 last:rounded-b-md'
		>
			<UserRound />
			<span className='text-secondary font-bold pl-3'>
				{params.instructor_name}
			</span>
		</Link>
	)
}

const ExploreResultListItem = ({ faculty }: { faculty: string }) => {
	const facultyCode = disciplineCodes[faculty]

	return (
		<Link
			href={{ pathname: '/explore', query: { subject: facultyCode } }}
			className='w-full flex flex-row p-2 pl-3 bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 last:rounded-b-md'
		>
			<Telescope />
			<span className='font-bold pl-3'>
				Search for all <span className='text-secondary'>{faculty}</span> courses
			</span>
		</Link>
	)
}

export default function SearchBar() {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [courseResults, setCourseResults] = useState<CourseResult[]>([])
	const [profResults, setProfResults] = useState<ProfResult[]>([])
	const [exploreResults, setExploreResults] = useState<string[]>([])

	useEffect(() => {
		/**
		 * Failsafes to parse the raw user inputted search string
		 * @param rawSearchQuery
		 * @returns sanitizedString
		 */
		const sanitizeSearchQuery = (rawSearchQuery: string): string => {
			if (searchQuery.trim() === '') {
				return ''
			}

			// Removes All Non-Alphanumeric Characters apart from '&' amd \s in the string
			let sanitizedString = rawSearchQuery.replace(/[^a-zA-Z0-9&\s]/g, '')
			return sanitizedString
		}

		/**
		 * Fetches the results from backend
		 * @param query
		 */
		const fetchResults = async (query: string) => {
			const supabase = createClient()
			const COURSE_LIMIT = 4
			const PROF_LIMIT = 2

			// Remove whitespace and add '%' between all chars for COURSE CODE
			const fuzzyCodeQuery = query.replace(/\s+/g, '').split('').join('%')

			// Collapse multiple spaces into singular and only split on those (Used for searching by course title)
			const fuzzyPhraseQuery = query.replace(/\s+/g, ' ').split(' ').join('%')
			try {
				const [courseResults, profResults] = await Promise.all([
					supabase
						.from('courses')
						.select()
						.or(
							`course_code.ilike.%${fuzzyCodeQuery}%,course_title.ilike.%${fuzzyPhraseQuery}%`
						) // Wack Syntax bc double .ilike() calls don't chain together properly
						.limit(COURSE_LIMIT),
					supabase
						.from('instructors')
						.select()
						.ilike('instructor_name', `%${fuzzyPhraseQuery}%`)
						.order('instructor_name')
						.limit(PROF_LIMIT)
				])
				setCourseResults(courseResults.data as CourseResult[])
				setProfResults(profResults.data as ProfResult[])
			} catch (error) {
				console.error(error)
			}
		}

		const sanitizedString = sanitizeSearchQuery(searchQuery)
		if (sanitizedString === '') {
			// If string is empty then simply set the result arrays to be empty and avoid fetch calls
			setCourseResults([])
			setProfResults([])
			setExploreResults([])
		} else {
			// console.log(sanitizedString)
			fetchResults(sanitizedString)
		}

		if (sanitizedString.length == 2 || sanitizedString.length == 4) {
			const faculty = facultyCoursePrefix[sanitizedString.toUpperCase()]
			if (faculty) {
				setExploreResults([faculty])
			}
		}
	}, [searchQuery])

	const barStyleOpen =
		'peer pl-8 relative block box-border w-full bg-background text-base focus-visible:ring-0 focus-visible:ring-transparent border-[2px] rounded-b-none border-b-transparent border-b-0'
	const barStyleClosed =
		'pl-8 relative block box-border w-full bg-background text-base focus-visible:ring-0 focus-visible:ring-transparent border-[2px]'
	const resultsStyleClosed =
		'peer absolute bg-transparent text-foreground z-[100] w-full text-base px-3 border-[2px] border-transparent '
	const resultsStyleOpen =
		'flex absolute bg-background text-foreground w-full text-base rounded-b-md border-input border-[2px] peer-focus-visible:border-secondary border-t-0 rounded-t-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'

	return (
		<div className='relative z-[100] block box-border w-full text-base peer has-[:focus-visible]:peer'>
			<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-[100]' />
			<Input
				type='search'
				placeholder='Search for courses, professors or faculties'
				name='q'
				onInput={(e) => {
					e.preventDefault()
					setSearchQuery(e.currentTarget.value)
				}}
				className={
					courseResults.length !== 0 || profResults.length !== 0
						? barStyleOpen
						: barStyleClosed
				}
			/>
			<div
				className={
					courseResults.length !== 0 || profResults.length !== 0
						? resultsStyleOpen
						: resultsStyleClosed
				}
			>
				<div className='bg-background rounded-lg text-foreground divide-y divide-{secondary} text-base w-full z-[100] '>
					{courseResults.map((course) => (
						<CourseResultListItem params={course} />
					))}
					{profResults.map((prof) => (
						<ProfResultListItem params={prof} />
					))}
					{exploreResults.map((faculty) => (
						<ExploreResultListItem faculty={faculty} />
					))}
				</div>
			</div>
		</div>
	)
}
