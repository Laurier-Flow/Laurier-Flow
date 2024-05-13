'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { programOptions } from '@/components/SignUpPopup'
import { useManageBodyScroll } from '@/components/Header'

interface UserDetailsProps {
	getUserDetailsFunction: () => Promise<any>
	email: string
	updateUserFirstName: (new_first_name: string) => Promise<any>
	updateUserLastName: (new_last_name: string) => Promise<any>
	updateUserProgram: (new_program: string) => Promise<any>
	deleteUserAccount: () => Promise<any>
}

const UserDetails: React.FC<UserDetailsProps> = ({
	getUserDetailsFunction,
	email,
	updateUserFirstName,
	updateUserLastName,
	updateUserProgram,
	deleteUserAccount
}) => {
	const [newFirstName, setNewFirstName] = useState<string>()
	const [newLastName, setNewLastName] = useState<string>()

	const [newProgram, setNewProgram] = useState<string>()

	const [isVisible, setIsVisible] = useState<boolean>(false)

	const [originalFirstName, setOriginalFirstName] = useState<string>()
	const [originalLastName, setOriginalLastName] = useState<string>()
	const [originalProgram, setOriginalProgram] = useState<string>()

	const [errorMsg, setErrorMsg] = useState<string>('Error! ')
	const [error, setError] = useState<boolean>(false)

	const [update, setUpdate] = useState<boolean>(false)

	const [sizeOfInputFields, setSizeOfInputFields] = useState<number>(50)

	const [showDeleteProfilePopup, setShowDeleteProfilePopup] =
		useState<boolean>(false)

	useManageBodyScroll(showDeleteProfilePopup)

	const toggleDeleteReviewPopup = () => {
		setShowDeleteProfilePopup(!showDeleteProfilePopup)
		setIsVisible(!isVisible)
	}

	useEffect(() => {
		const getUserData = async () => {
			const data = await getUserDetailsFunction()

			const fName: string = data[0]['first_name']
			const lName: string = data[0]['last_name']
			const program: string = data[0]['program']

			setNewFirstName(fName)
			setNewLastName(lName)
			setNewProgram(program)
			setOriginalFirstName(fName)
			setOriginalLastName(lName)
			setOriginalProgram(program)
			var max: number = fName.length

			if (max < lName.length) {
				max = lName.length
			}
			if (max < program.length) {
				max = program.length
			}
			if (max < email.length) {
				max = email.length
			}

			max *= 1.5
			setSizeOfInputFields(max)
		}
		getUserData()
	}, [update])

	const handleFirstNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewFirstName(event.target.value)
	}

	const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewLastName(event.target.value)
	}

	const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setNewProgram(event.target.value)
	}

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		// Determine what changed and update it accordingly
		if (
			originalFirstName !== newFirstName &&
			newFirstName !== undefined &&
			newFirstName?.length > 0
		) {
			updateUserFirstName(newFirstName)
				.catch(() => {
					setErrorMsg(
						(errorMsg) =>
							errorMsg +
							'An unexpected error has occured when attempting to update your first name.\n'
					)
					setError(true)
				})
				.then(() => {
					setError(false)
					setUpdate(true)
				})
		}
		if (
			originalLastName !== newLastName &&
			newLastName !== undefined &&
			newLastName?.length > 0
		) {
			updateUserLastName(newLastName)
				.catch(() => {
					setErrorMsg(
						(errorMsg) =>
							errorMsg +
							'An unexpected error has occured when attempting to update your last name.\n'
					)
					setError(true)
				})
				.then(() => {
					setError(false)
					setUpdate(true)
				})
		}
		if (
			originalProgram !== newProgram &&
			newProgram !== undefined &&
			newProgram?.length > 0
		) {
			updateUserProgram(newProgram)
				.catch(() => {
					setErrorMsg(
						(errorMsg) =>
							errorMsg +
							'An unexpected error has occured when attempting to update your program.\n'
					)
					setError(true)
				})
				.then(() => {
					setError(false)
					setUpdate(true)
				})
		}
	}

	const handleAccountDeletion = async () => {
		await deleteUserAccount()
			.catch((err) => {
				setError(true)
				setErrorMsg('Error in user account deletion!')
				console.log(err)
			})
			.then((data) => {
				console.log(data)
				window.location.reload()
			})
	}

	return (
		<div className='card'>
			<div>
				{update ? (
					error ? (
						<div
							className='mt-8 rounded-lg bg-red-500 p-4 text-sm text-white dark:bg-red-800'
							role='alert'
						>
							<span className='font-bold'>
								An error occurred in changing your information
							</span>{' '}
							{errorMsg}
						</div>
					) : (
						<div
							className='mt-8 rounded-lg bg-teal-500 p-4 text-sm text-white'
							role='alert'
						>
							<span className='font-bold'>Success!</span> Your information has
							been updated
						</div>
					)
				) : null}

				<form onSubmit={handleFormSubmit}>
					<div className='mt-4 p-4'>
						<label className='text-lg font-medium dark:text-white'>Email</label>
						<input
							type='text'
							className='text-md mt-2 block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-100 dark:border-neutral-700 dark:bg-gray-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
							placeholder={email}
							disabled={true}
						/>
						<h1 className='mt-8 text-lg font-medium dark:text-white'>
							First Name
						</h1>
						<input
							onChange={handleFirstNameChange}
							type='text'
							className='text-md mt-4 block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
							value={newFirstName}
						/>
						<h1 className='mb-2 mt-8 block text-lg font-medium dark:text-white'>
							Last Name
						</h1>
						<input
							onChange={handleLastNameChange}
							type='text'
							className='text-md mt-2 block w-full rounded-lg border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-gray-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
							value={newLastName}
						/>
						<h1 className='mb-2 mt-8 block text-lg font-medium dark:text-white'>
							Program
						</h1>
						<select
							className='mb-2 w-full rounded-md border-neutral-300 px-4 py-2 text-stone-600 placeholder-stone-400 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 dark:border-slate-800 dark:bg-gray-900 dark:text-gray-400 dark:placeholder-gray-400'
							name='program'
							value={newProgram}
							onChange={handleProgramChange}
							required
						>
							<option value='' disabled>
								Select your program
							</option>
							{programOptions.map((program) => (
								<option className='' key={program} value={program}>
									{program}
								</option>
							))}
						</select>
					</div>

					<div className='p-4'>
						<button
							type='submit'
							className='mt-6 inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-secondary px-4 py-3 text-sm font-semibold text-black disabled:pointer-events-none disabled:opacity-50 dark:text-white'
						>
							Save Changes
						</button>
					</div>
				</form>

				<hr className='mb-8 mt-8 border-gray-300 dark:border-gray-800'></hr>

				<div className='p-4'>
					<button
						type='submit'
						onClick={(e) => {
							e.preventDefault()
							toggleDeleteReviewPopup()
						}}
						className='text-md mb-5 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white dark:bg-red-800 dark:text-white'
					>
						<h1>Delete Account</h1>
					</button>
				</div>
			</div>

			{showDeleteProfilePopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<div
						className={`transform transition-all duration-500 ${isVisible ? '-translate-y-1/2 opacity-100' : '-translate-y-2/3 opacity-0'} fixed left-1/2 top-1/2 max-h-[90vh] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-md border-2 bg-white p-8 backdrop-blur dark:border-red-800 dark:bg-background/80`}
					>
						<form className='flex flex-col gap-4 text-foreground'>
							<label className='mb-2 flex flex-row items-center justify-between text-3xl font-bold text-foreground'>
								<h1>Delete Account</h1>
								<X
									className='cursor-pointer'
									onClick={() => {
										toggleDeleteReviewPopup()
									}}
								/>
							</label>
							<h2 className='text-md'>
								Are you sure you want to delete your account? This action cannot
								be undone and will remove all reviews and user data.
							</h2>
							<hr className='mb-2 mt-4 border-gray-300 dark:border-gray-800'></hr>
							<div className='flex flex-row gap-6'>
								<button
									type='submit'
									onClick={(e) => {
										e.preventDefault()
										handleAccountDeletion()
									}}
									className='text-md mb-5 mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white dark:bg-red-800 dark:text-white'
								>
									<h1>Yes</h1>
								</button>

								<button
									type='submit'
									onClick={(e) => {
										e.preventDefault()
										toggleDeleteReviewPopup()
									}}
									className='text-md mb-5 mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white dark:bg-gray-600 dark:text-white'
								>
									<h1>No</h1>
								</button>
							</div>
						</form>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default UserDetails
