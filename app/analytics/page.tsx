'use client'
import Spinner from '@/components/Spinner'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import { BackgroundGradientAnimation } from '@/components/background-gradient-animation'
import {
	getAllUsers,
	getAllCourseReviews,
	getUser,
	getAllInstructorReviews,
	getAllCourses
} from './count-function'
import { User } from '@supabase/supabase-js'
import useScreenWidth from './screen-width'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'

const CountPage = () => {
	const [numberUsers, setNumberUsers] = useState('---')
	const [numberCourseReviews, setNumberCourseReviews] = useState('---')
	const [numberInstructorReviews, setNumberInstructorReviews] = useState('---')
	const [numberCourses, setNumberCourses] = useState('---')
	const [pageVisits, setTotalPageVisits] = useState('---')
	const [user, setUser] = useState<User | null>()
	const [curDate, setCurDate] = useState<string>()
	const [fetched, setFetched] = useState<boolean>(false)
	const width = useScreenWidth()
	useEffect(() => {
		const getData = async () => {
			const curUser = await getUser()
			if (curUser) {
				setUser(curUser)
			} else {
				setUser(null)
			}

			const allUsers = await getAllUsers()
			const allCourseReviews = await getAllCourseReviews()
			const allInstructorReviews = await getAllInstructorReviews()
			const allCourses = await getAllCourses()
			const totalVisits = await getAndIncrementPageVisits()

			if (allUsers) {
				setNumberUsers(allUsers)
			}
			if (allCourseReviews) {
				setNumberCourseReviews(allCourseReviews)
			}
			if (allInstructorReviews) {
				setNumberInstructorReviews(allInstructorReviews)
			}
			if (allCourses) {
				setNumberCourses(allCourses)
			}
			if (totalVisits) {
				setTotalPageVisits(totalVisits.toLocaleString())
			}
			if (
				totalVisits &&
				allUsers &&
				allCourseReviews &&
				allInstructorReviews &&
				allCourses
			) {
				setFetched(true)
			}
		}
		getData()
	}, [])

	return (
		<BackgroundGradientAnimation
			gradientBackgroundStart='var(--gradient-start)'
			gradientBackgroundEnd='var(--gradient-end)'
			firstColor='var(--bubble)'
			secondColor='var(--bubble)'
			thirdColor='var(--bubble)'
			fourthColor='var(--bubble)'
			fifthColor='var(--bubble)'
			pointerColor='var(--bubble)'
		>
			<div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 p-6'>
				<h1 className='text-3xl font-bold text-background dark:text-foreground md:text-4xl'>
					Analytics
				</h1>

				<div className={`grid grid-rows-2 mt-10 grid-cols-2 place-content-center gap-2`}>
					<div className='mx-4 my-4'>
						{fetched ? (
							<h1 className='text-center text-2xl text-white'>
								{pageVisits} site visits
							</h1>
						) : (
							<div className='mx-8 my-8'>
								<Spinner />
							</div>
						)}
					</div>
					<div className='mx-4 my-4'>
						{fetched ? (
							<h1 className='text-center text-2xl text-white'>
								{numberUsers} registered users
							</h1>
						) : (
							<div className='mx-8 my-8'>
								<Spinner />
							</div>
						)}
					</div>
					<div className='mx-4 my-4'>
						{fetched ? (
							<h1 className='text-center text-2xl text-white'>
								{numberCourseReviews} course reviews
							</h1>
						) : (
							<div className='mx-8 my-8'>
								<Spinner />
							</div>
						)}
					</div>
					<div className='mx-4 my-4'>
						{fetched ? (
							<h1 className='text-center text-2xl text-white'>
								{numberInstructorReviews} instructor reviews
							</h1>
						) : (
							<div className='mx-8 my-8'>
								<Spinner />
							</div>
						)}
					</div>
				</div>
				
			</div>
		</BackgroundGradientAnimation>
	)
}
export default CountPage
