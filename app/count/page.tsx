'use client'
import Spinner from '@/components/Spinner'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Metadata } from 'next'
import Footer from '@/components/Footer'
import { countNumberUsers, getUser } from './count-function'
import { User } from '@supabase/supabase-js'

const CountPage = () => {
	const [numberUsers, setNumberUsers] = useState('---')
	const [user, setUser] = useState<User | null>()
	const [curDate, setCurDate] = useState<string>()
	const [fetched, setFetched] = useState<boolean>(false)
	useEffect(() => {
		const getData = async () => {
			const curUser = await getUser()
			if (curUser) {
				setUser(curUser)
			} else {
				setUser(null)
			}
			const data = await countNumberUsers()
			if (data) {
				setNumberUsers(data.length)
				var currentDate = new Date()
				setCurDate(
					currentDate.getDay() +
						'/' +
						currentDate.getMonth() +
						'/' +
						currentDate.getFullYear() +
						' @ ' +
						currentDate.getHours() +
						':' +
						currentDate.getMinutes() +
						(currentDate.getHours() > 12 ? ' PM' : ' AM')
				)
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
				<div style={{ minHeight: '90vh' }} className='place-content-center'>
					<div
						style={{ borderRadius: 20 }}
						className='bg-primary pb-5 pl-5 pr-5 pt-5 text-white dark:bg-secondary'
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
								<h3 className='text-center'>As of {curDate}</h3>{' '}
							</div>
						) : (
							<Spinner />
						)}
					</div>
				</div>
			</Suspense>
			<Footer />
		</>
	)
}
export default CountPage
