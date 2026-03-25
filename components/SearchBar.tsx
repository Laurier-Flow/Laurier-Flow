'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { facultyCoursePrefix } from '@/utils/lib/facultyCoursePrefix'
import { disciplineCodes } from '@/utils/lib/disciplineCodes'
import { Search, Telescope, BookOpenText, UserRound, GalleryVerticalEnd, Bot } from 'lucide-react'

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

type SearchItem =
	| { type: 'course'; data: CourseResult; href: string }
	| { type: 'prof'; data: ProfResult; href: string }
	| { type: 'explore'; faculty: string; href: string }
	| { type: 'exploreAll'; href: string }
	| { type: 'chat'; query: string; href: string }

const slugify = (s: string) => s.replaceAll(/\s/g, '%20')

export default function SearchBar() {
	const router = useRouter()
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const selectedRef = useRef<HTMLAnchorElement>(null)

	const [searchQuery, setSearchQuery] = useState('')
	const [courseResults, setCourseResults] = useState<CourseResult[]>([])
	const [profResults, setProfResults] = useState<ProfResult[]>([])
	const [exploreResults, setExploreResults] = useState<string[]>([])
	const [isFocused, setIsFocused] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)

	// Flat navigable list kept in sync with results
	const items: SearchItem[] = useMemo(() => {
		const list: SearchItem[] = []
		courseResults.forEach(c =>
			list.push({ type: 'course', data: c, href: '/course/' + slugify(c.course_code) })
		)
		profResults.forEach(p =>
			list.push({ type: 'prof', data: p, href: '/instructor/' + slugify(p.instructor_name) })
		)
		exploreResults.forEach(f =>
			list.push({ type: 'explore', faculty: f, href: `/explore?subject=${disciplineCodes[f]}` })
		)
		if (exploreResults.length === 0)
			list.push({ type: 'exploreAll', href: '/explore' })
		if (searchQuery.length > 0)
			list.push({ type: 'chat', query: searchQuery, href: `/chat?q=${searchQuery}` })
		return list
	}, [courseResults, profResults, exploreResults, searchQuery])

	// Reset selection when results change
	useEffect(() => { setSelectedIndex(-1) }, [items])

	// Scroll selected item into view
	useEffect(() => {
		selectedRef.current?.scrollIntoView({ block: 'nearest' })
	}, [selectedIndex])

	// Close on outside click
	useEffect(() => {
		const onMouseDown = (e: MouseEvent) => {
			if (!containerRef.current?.contains(e.target as Node)) setIsFocused(false)
		}
		document.addEventListener('mousedown', onMouseDown)
		return () => document.removeEventListener('mousedown', onMouseDown)
	}, [])

	// Global ⌘K / Ctrl+K shortcut
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				inputRef.current?.focus()
				setIsFocused(true)
			}
		}
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setSelectedIndex(i => Math.min(i + 1, items.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setSelectedIndex(i => Math.max(i - 1, -1))
		} else if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedIndex >= 0 && items[selectedIndex]) {
				router.push(items[selectedIndex].href)
				setIsFocused(false)
				inputRef.current?.blur()
			}
		} else if (e.key === 'Escape') {
			setIsFocused(false)
			inputRef.current?.blur()
		}
	}

	// All Supabase fetching — logic identical to original
	useEffect(() => {
		const sanitize = (raw: string): string => {
			if (raw.trim() === '') return ''
			return raw.replace(/[^a-zA-Z0-9&\s]/g, '')
		}

		const fetchResults = async (query: string) => {
			const supabase = createClient()
			const fuzzyCode = query.replace(/\s+/g, '').split('').join('%')
			const fuzzyPhrase = query.replace(/\s+/g, ' ').split(' ').join('%')
			try {
				const [courseRes, profRes] = await Promise.all([
					supabase
						.from('courses')
						.select()
						.or(`course_code.ilike.%${fuzzyCode}%,course_title.ilike.%${fuzzyPhrase}%`)
						.is('is_uwaterloo_course', false)
						.order('course_code', { ascending: true })
						.limit(4),
					supabase
						.from('instructors')
						.select()
						.ilike('instructor_name', `%${fuzzyPhrase}%`)
						.order('instructor_name')
						.limit(2)
				])
				setCourseResults(courseRes.data as CourseResult[])
				setProfResults(profRes.data as ProfResult[])
			} catch (err) {
				console.error(err)
			}
		}

		const q = sanitize(searchQuery)
		if (q === '') {
			setCourseResults([])
			setProfResults([])
			setExploreResults([])
		} else {
			fetchResults(q)
		}

		if (q.length === 2 || q.length === 4) {
			const faculty = facultyCoursePrefix[q.toUpperCase()]
			if (faculty) setExploreResults([faculty])
		}
	}, [searchQuery])

	const showDropdown = isFocused

	return (
		<div ref={containerRef} className='sb-root'>
			{/* Input */}
			<div className={`sb-input-wrap ${showDropdown ? 'sb-open' : ''}`}>
				<Search className='sb-search-icon' size={18} />
				<input
					ref={inputRef}
					type='text'
					placeholder='Search for courses, professors or faculties'
					className='sb-input'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onKeyDown={handleKeyDown}
					autoComplete='off'
					autoCorrect='off'
					spellCheck={false}
				/>
				{!showDropdown && (
					<div className='sb-kbd' aria-hidden>
						<kbd>⌘</kbd><kbd>K</kbd>
					</div>
				)}
			</div>

			{/* Dropdown */}
			{showDropdown && (
				<div className='sb-dropdown'>
					{items.map((item, i) => {
						const isSelected = selectedIndex === i
						const ref = isSelected ? selectedRef : undefined

						if (item.type === 'course') {
							return (
								<a
									key={item.data.course_code}
									href={item.href}
									ref={ref}
									className={`sb-item ${isSelected ? 'sb-selected' : ''}`}
								>
									<BookOpenText size={15} className='sb-item-icon' />
									<span>
										<span className='sb-accent'>{item.data.course_code}</span>
										<span className='sb-dim'> — </span>
										<span className='sb-title'>{item.data.course_title}</span>
									</span>
								</a>
							)
						}

						if (item.type === 'prof') {
							return (
								<a
									key={item.data.instructor_name}
									href={item.href}
									ref={ref}
									className={`sb-item ${isSelected ? 'sb-selected' : ''}`}
								>
									<UserRound size={15} className='sb-item-icon' />
									<span className='sb-accent'>{item.data.instructor_name}</span>
								</a>
							)
						}

						if (item.type === 'explore') {
							return (
								<a
									key={item.faculty}
									href={item.href}
									ref={ref}
									className={`sb-item ${isSelected ? 'sb-selected' : ''}`}
								>
									<Telescope size={15} className='sb-item-icon' />
									<span>
										Search for all{' '}
										<span className='sb-accent'>{item.faculty}</span> courses
									</span>
								</a>
							)
						}

						if (item.type === 'exploreAll') {
							return (
								<a
									key='exploreAll'
									href={item.href}
									ref={ref}
									className={`sb-item ${isSelected ? 'sb-selected' : ''}`}
								>
									<GalleryVerticalEnd size={15} className='sb-item-icon' />
									<span>
										Browse{' '}
										<span className='sb-accent'>all courses</span>
									</span>
								</a>
							)
						}

						if (item.type === 'chat') {
							return (
								<a
									key='chat'
									href={item.href}
									ref={ref}
									className={`sb-item ${isSelected ? 'sb-selected' : ''}`}
								>
									<Bot size={15} className='sb-item-icon' />
									<span>
										Ask Flow Bot{' '}
										<span className='sb-dim'>about</span>{' '}
										<span className='sb-accent'>{item.query}</span>
									</span>
								</a>
							)
						}

						return null
					})}

					<div className='sb-footer'>
						<span>↑↓ navigate</span>
						<span>↵ open</span>
						<span>esc close</span>
					</div>
				</div>
			)}
		</div>
	)
}
