'use client'

import { useEffect, useState } from 'react'
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
	const [activeTab, setActiveTab] = useState<number>(0)

	const [userFirstName, setUserFirstName] = useState<string>()
	const [userLastName, setUserLastName] = useState<string>()
	const [userProgram, setUserProgram] = useState<string>()

	useEffect(() => {
		const getData = async () => {
			const data = await getUserData()
			setUserFirstName(data[0]['first_name'])
			setUserLastName(data[0]['last_name'])
			setUserProgram(data[0]['program'])
		}
		getData()
	}, [])

	const tabs = [
		{ label: 'My Reviews' },
		{ label: 'My Schedule' },
		{ label: 'Update Profile' }
	]

	return (
		<>
			<div className='pf-hero'>
				<p className='pf-hero-greeting'>Your Profile</p>
				<h1 className='pf-hero-name'>
					{userFirstName || '...'} {userLastName || ''}
				</h1>
				{userProgram && <p className='pf-hero-program'>{userProgram}</p>}
				<p className='pf-hero-email'>{user.email}</p>
			</div>

			<div className='pf-tabs'>
				{tabs.map((tab, i) => (
					<button
						key={i}
						type='button'
						onClick={() => setActiveTab(i)}
						className={`pf-tab ${activeTab === i ? 'pf-tab-active' : ''}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className='pf-section'>
				{activeTab === 0 && userReviews}
				{activeTab === 1 && <Schedule />}
				{activeTab === 2 && (
					<UserDetails
						getUserDetailsFunction={getUserData}
						email={user.email!}
						updateUserFirstName={updateUserFirstName}
						updateUserLastName={updateUserLastName}
						updateUserProgram={updateUserProgram}
						deleteUserAccount={deleteUserAccount}
					/>
				)}
			</div>
		</>
	)
}

export default PageContent
