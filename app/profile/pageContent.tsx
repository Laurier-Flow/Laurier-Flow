'use client'

import { Suspense, useEffect, useState } from 'react'
import UserDetails from './user-details'
import {
	getUserData,
	updateUserFirstName,
	updateUserLastName,
	updateUserProgram,
	deleteUserAccount
} from './user-data-functions'
import { User } from '@supabase/supabase-js'
import Schedule from './userSchedule'

interface PageContentProps {
	userReviews: any
	user: User
}

const PageContent: React.FC<PageContentProps> = ({ userReviews, user }) => {
	const [profileTabSelected, setProfileTabSelected] = useState<boolean>(true)
	const [myScheduleTabSelected, setMyScheduleTabSelected] =
		useState<boolean>(false)
	const [editUserDetailsTabSelected, setEditUserDetailsTabSelected] =
		useState<boolean>(false)

	const [userFirstName, setUserFirstName] = useState<string>()
	const [userLastName, setUserLastName] = useState<string>()
	const [userProgram, setUserProgram] = useState<string>()

	const [screenWidth, setScreenWidth] = useState<number>()

	useEffect(() => {
		const getData = async () => {
			const data = await getUserData()
			setUserFirstName(data[0]['first_name'])
			setUserLastName(data[0]['last_name'])
			setUserProgram(data[0]['program'])
		}
		setScreenWidth(window.screen.width)
		getData()
	}, [])

	const handleProfileTabClick = () => {
		setProfileTabSelected(true)
		setMyScheduleTabSelected(false)
		setEditUserDetailsTabSelected(false)
	}

	const handleMyScheduleTabClick = () => {
		setProfileTabSelected(false)
		setMyScheduleTabSelected(true)
		setEditUserDetailsTabSelected(false)
	}

	const handleEditUserDetailsTabSelected = () => {
		setMyScheduleTabSelected(false)
		setEditUserDetailsTabSelected(true)
		setProfileTabSelected(false)
	}

	return (
		<>
			<div className="flex min-w-full flex-col bg-[url('/banner-sm-light.jpg')] p-4 dark:bg-[url('/banner-sm.jpg')] md:flex-row md:justify-center md:bg-[url('/banner-md-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] lg:bg-[url('/banner-light.jpg')] lg:dark:bg-[url('/banner.jpg')]">
				<div className='w-f flex max-w-6xl flex-1 flex-row justify-between pt-20'>
					<div className='flex flex-1 flex-col pl-4'>
						<h1 className='mb-2 text-2xl font-bold text-white md:text-5xl'>
							Welcome <span className='text-purple-200'>{userFirstName}</span>{' '}
							<span className='text-yellow-200'>{userLastName}</span>
						</h1>
						<h4 className='mb-2 text-lg font-bold italic text-white'>
							{userProgram}
						</h4>
					</div>
				</div>
			</div>
			<ul
				style={{
					width: '50vw'
				}}
				className='mb-5 mt-5 flex justify-center rounded-lg text-center text-base text-gray-500 shadow'
			>
				<li className='w-full focus-within:z-10'>
					<a
						onClick={handleProfileTabClick}
						className={`inline-block h-full w-full p-4 ${profileTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} active rounded-l-lg border-r border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-300`}
					>
						My Profile
					</a>
				</li>
				<li className='w-full focus-within:z-10'>
					<a
						onClick={handleMyScheduleTabClick}
						className={`inline-block h-full w-full p-4 ${myScheduleTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} border-r border-gray-200  hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300`}
					>
						My Schedule
					</a>
				</li>
				<li className='w-full focus-within:z-10'>
					<a
						onClick={handleEditUserDetailsTabSelected}
						className={`inline-block h-full w-full p-4 ${editUserDetailsTabSelected ? `bg-gray-300 dark:bg-gray-700 dark:text-white` : `bg-white dark:bg-gray-100 dark:text-black`} rounded-r-lg border-s-0  border-gray-200 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300`}
					>
						User Details
					</a>
				</li>
			</ul>

			{profileTabSelected ? userReviews : null}
			{myScheduleTabSelected ? <Schedule /> : null}
			{editUserDetailsTabSelected ? (
				<UserDetails
					getUserDetailsFunction={getUserData}
					email={user.email!}
					updateUserFirstName={updateUserFirstName}
					updateUserLastName={updateUserLastName}
					updateUserProgram={updateUserProgram}
					deleteUserAccount={deleteUserAccount}
				/>
			) : null}
		</>
	)
}

export default PageContent
