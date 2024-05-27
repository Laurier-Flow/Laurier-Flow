'use client'
import Spinner from '@/components/Spinner'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import {
	getAllUsers,
	getAllCourseReviews,
	getUser,
	getAllInstructorReviews,
	getAllCourses
} from './count-function'
import { User } from '@supabase/supabase-js'

const CountPage = () => {
	const [numberUsers, setNumberUsers] = useState('---')
	const [numberCourseReviews, setNumberCourseReviews] = useState('---')
	const [numberInstructorReviews, setNumberInstructorReviews] = useState('---')
	const [numberCourses, setNumberCourses] = useState('---')
	const [user, setUser] = useState<User | null>()
	const [curDate, setCurDate] = useState<string>()
	const [fetched, setFetched] = useState<boolean>(false)
	useEffect(() => {
		const getData = async () => {
			var currentDate = new Date()
			setCurDate(
				currentDate.getDate() +
					'/' +
					(currentDate.getMonth() + 1) +
					'/' +
					currentDate.getFullYear() +
					' @ ' +
					currentDate.getHours() +
					':' +
					(currentDate.getMinutes() < 10
						? '0' + currentDate.getMinutes()
						: currentDate.getMinutes()) +
					(currentDate.getHours() > 12 ? ' PM' : ' AM')
			)
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
			if (allUsers) {
				setNumberUsers(allUsers.length)
			}
			if (allCourseReviews) {
				setNumberCourseReviews(allCourseReviews.length)
			}
			if (allInstructorReviews) {
				setNumberInstructorReviews(allInstructorReviews.length)
			}
			if (allCourses) {
				setNumberCourses(allCourses.length)
			}
			if (allUsers && allCourseReviews && allInstructorReviews && allCourses) {
				setFetched(true)
			}
		}
		getData()
	}, [])

	return (
		<>
			<Header user={user!} />
			<Suspense
				fallback={
					<div className='h-full w-full'>
						<Spinner />
					</div>
				}
			>
				<div className="flex min-w-full flex-col bg-[url('/banner-sm-light.jpg')] p-4 dark:bg-[url('/banner-sm.jpg')] md:flex-row md:justify-center md:bg-[url('/banner-md-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] lg:bg-[url('/banner-light.jpg')] lg:dark:bg-[url('/banner.jpg')]">
					<div className='w-f flex max-w-6xl flex-1 flex-row justify-between pt-20'>
						<div className='flex flex-1 flex-col pl-4'>
							<h1 className='mb-2 text-2xl font-bold text-white md:text-5xl'>
								<span className='text-purple-200'>Laurier</span>{' '}
								<span className='text-yellow-200'>Flow</span> Analytics
							</h1>
						</div>
					</div>
				</div>
				<div
					style={{ minHeight: '90vh', maxWidth: '80vw', minWidth: '80vw' }}
					className='card mt-5'
				>
					<h1
						style={{
							borderRadius: 20,
							marginTop: `${window.screen.width < 1000 ? '0' : '-150px'}`
						}}
						className='mb-5 bg-primary pb-5 pl-5 pr-5 pt-5 text-center text-2xl font-semibold text-white dark:bg-secondary'
					>
						As of {curDate}
					</h1>
					<div
						style={{
							marginTop: `${window.screen.width < 1000 ? '0' : '-200px'}`
						}}
						className={`grid grid-flow-col ${window.screen.width < 700 ? 'grid-rows-4' : 'grid-rows-2'} mt-5 place-content-center gap-5`}
					>
						<div
							style={{ borderRadius: 20, minWidth: '35vw', maxWidth: '35vw' }}
							className='mb-2 bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
						>
							<h3 className='font-regular text-center text-xl'>
								Signed Up Users
							</h3>
							<hr className='mb-2 mt-2' />
							{fetched ? (
								<div>
									<h3 className='font-regular text-center text-xl'>
										{numberUsers}
									</h3>
								</div>
							) : (
								<Spinner />
							)}
						</div>
						<div
							style={{ borderRadius: 20, minWidth: '35vw', maxWidth: '35vw' }}
							className='mb-2 bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
						>
							<h3 className='font-regular text-center text-xl'>
								Course Reviews Made
							</h3>
							<hr className='mb-2 mt-2' />
							{fetched ? (
								<div>
									<h3 className='font-regular text-center text-xl'>
										{numberCourseReviews}
									</h3>
								</div>
							) : (
								<Spinner />
							)}
						</div>
						<div
							style={{ borderRadius: 20, minWidth: '35vw', maxWidth: '35vw' }}
							className='mb-2 bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
						>
							<h3 className='font-regular text-center text-xl'>
								Instructor Reviews Made
							</h3>
							<hr className='mb-2 mt-2' />
							{fetched ? (
								<div>
									<h3 className='font-regular text-center text-xl'>
										{numberInstructorReviews}
									</h3>
								</div>
							) : (
								<Spinner />
							)}
						</div>
						<div
							style={{ borderRadius: 20, minWidth: '35vw', maxWidth: '35vw' }}
							className='mb-2 bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
						>
							<h3 className='font-regular text-center text-xl'>
								Courses on Laurier Flow
							</h3>
							<hr className='mb-2 mt-2' />
							{fetched ? (
								<div>
									<h3 className='font-regular text-center text-xl'>
										{numberCourses}
									</h3>
								</div>
							) : (
								<Spinner />
							)}
						</div>
					</div>
				</div>
				{/* <div style={{ minHeight: '90vh' }} className='place-content-center'>
					<div
						style={{ borderRadius: 20 }}
						className='mb-2 bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
					>
						<h1 className='text-center text-2xl font-semibold'>
							Users that have signed up for LaurierFlow
						</h1>
						<hr className='mb-2 mt-2' />
						{fetched ? (
							<div>
								<h1 className='text-center text-3xl font-semibold'>
									{numberUsers}
								</h1>
							</div>
						) : (
							<Spinner />
						)}
					</div>
				</div> */}
			</Suspense>
			<Footer />
		</>
	)
}
export default CountPage
