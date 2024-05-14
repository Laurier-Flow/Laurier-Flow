'use client'

import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { facultyCoursePrefix } from '@/utils/lib/facultyCoursePrefix'
import { disciplineCodes } from '@/utils/lib/disciplineCodes'
import { redirectToExploreAll } from '@/utils/lib/clientSideRedirects'
import {
	Search,
	Telescope,
	BookOpenText,
	UserRound,
	GalleryVerticalEnd
} from 'lucide-react'

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
			className='flex w-full flex-row bg-transparent p-2 pl-3 last:rounded-b-md hover:bg-stone-200 dark:hover:bg-stone-800'
		>
			<BookOpenText />
			<span className='pl-3'>
				<span className='font-bold text-secondary'>{params.course_code}</span> -{' '}
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
			className='flex w-full flex-row bg-transparent p-2 pl-3 last:rounded-b-md hover:bg-stone-200 dark:hover:bg-stone-800'
		>
			<UserRound />
			<span className='pl-3 font-bold text-secondary'>
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
			className='flex w-full flex-row bg-transparent p-2 pl-3 last:rounded-b-md hover:bg-stone-200 dark:hover:bg-stone-800'
		>
			<Telescope />
			<span className='pl-3 font-bold'>
				Search for all <span className='text-secondary'>{faculty}</span> courses
			</span>
		</Link>
	)
}

const ExploreAllListItem = () => {
	return (
		<Link
			href={`/explore`}
			className='flex w-full flex-row bg-transparent p-2 pl-3 last:rounded-b-md hover:bg-stone-200 dark:hover:bg-stone-800'
		>
			<GalleryVerticalEnd />
			<span className='pl-3 font-bold'>
				Search for all <span className='text-secondary'>ALL</span> courses
			</span>
		</Link>
	)
}

export default function SearchBar() {
	const [searchQuery, setSearchQuery] = useState<string>('') // Search Query State
	const [courseResults, setCourseResults] = useState<CourseResult[]>([]) // Course Results State
	const [profResults, setProfResults] = useState<ProfResult[]>([]) // Professor Results State
	const [exploreResults, setExploreResults] = useState<string[]>([]) // Explore Results State
	const [focused, setFocused] = useState<boolean>(false) // Focus State

	const handleFocus = () => {
		setFocused(true)
	}
	const handleBlur = () => {
		setFocused(false)
	}

	// Use Effect Hook to fetch results from backend
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

	return (
		<div className='has-[:focus-visible]:peer peer relative z-[100] box-border block w-full text-base'>
			<Search className='absolute left-2.5 top-2.5 z-[100] h-4 w-4 text-muted-foreground' />
			<Input
				type='search'
				placeholder='Search for courses, professors or faculties'
				name='q'
				onInput={(e) => {
					e.preventDefault()
					setSearchQuery(e.currentTarget.value)
				}}
				onFocus={handleFocus}
				onBlur={handleBlur}
				autoComplete={'off'}
				className={
					focused
						? 'peer relative box-border block w-full rounded-b-none border-[2px] border-b-0 border-b-transparent bg-background pl-8 text-base focus-visible:ring-0 focus-visible:ring-transparent'
						: 'relative box-border block w-full border-[2px] bg-background pl-8 text-base focus-visible:ring-0 focus-visible:ring-transparent'
				}
			/>
			<div
				className={
					focused
						? 'rounded-t-transparent absolute flex w-full rounded-b-md border-[2px] border-t-0 border-input bg-background text-base text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 peer-focus-visible:border-secondary'
						: 'peer absolute z-[100] w-full border-[2px] border-transparent bg-transparent px-3 text-base text-foreground'
				}
			>
				{focused && (
					<div className='divide-{secondary} z-[100] w-full divide-y rounded-lg bg-background text-base text-foreground '>
						{courseResults.map((course) => (
							<CourseResultListItem params={course} />
						))}
						{profResults.map((prof) => (
							<ProfResultListItem params={prof} />
						))}
						{exploreResults.map((faculty) => (
							<ExploreResultListItem faculty={faculty} />
						))}
						<ExploreAllListItem />
					</div>
				)}
			</div>
		</div>
	)
}
