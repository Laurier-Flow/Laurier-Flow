'use client'

import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { disciplineCodes } from '@/app/course/disciplineCodes'

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
		<Link href={courseLink} className='w-full'>
			<div className='flex flex-row p-2 bg-transparent'>
				<div></div>
				<div>
					{params.course_code} - {params.course_title}
				</div>
			</div>
		</Link>
	)
}

const ProfResultListItem = ({ params }: { params: ProfResult }) => {
	const profLink = '/instructor/' + slugify(params.instructor_name)

	return (
		<Link href={profLink}>
			<div className='flex flex-row p-2 bg-transparent'>
				<div>
				</div>
				<div>
					{params.instructor_name}
				</div>
			</div>
		</Link>

	)
}

export default function SearchBar() {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [courseResults, setCourseResults] = useState<CourseResult[]>([])
	const [profResults, setProfResults] = useState<ProfResult[]>([])

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
		} else {
			// console.log(sanitizedString)
			fetchResults(sanitizedString)
		}
	}, [searchQuery])

	let searchBarStyle =
		'peer relative block box-border w-full bg-background text-base focus-visible:ring-0 focus-visible:ring-transparent border-[2px]'
	let searchResultStyle =
		'absolute bg-transparent text-foreground z-[1] w-full text-base px-3 border-[2px] border-transparent'

	if (courseResults.length !== 0 || profResults.length !== 0) {
		searchBarStyle =
			'peer relative block box-border w-full bg-background text-base focus-visible:ring-0 focus-visible:ring-transparent border-[2px] rounded-b-none border-b-transparent border-b-0'
		searchResultStyle =
			'flex absolute bg-background text-foreground w-full text-base rounded-b-md border-input border-[2px] peer-focus-visible:border-[#2563eb] border-t-0 rounded-t-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50'
	}

	return (
		<div className='relative z-[1] block box-border w-full text-base'>
			<Input
				type='search'
				placeholder='Search for courses, subjects or professors'
				onChange={(e) => {
					console.log(e.target.value)
					setSearchQuery(e.target.value)
				}}
				className={searchBarStyle}
			/>
			<div className={searchResultStyle}>
				<div className='bg-transparent text-foreground divide-y divide-{input} text-base w-full '>
					{courseResults.map((course) => (
						<CourseResultListItem params={course} />
					))}
					{profResults.map((prof) => (
						<ProfResultListItem params={prof} />
					))}
				</div>
			</div>
		</div>
	)
}
