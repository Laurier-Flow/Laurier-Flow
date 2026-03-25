'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useManageBodyScroll } from '@/components/Header'
import { ProgramDropdownUserDetails } from '@/components/Combobox'
import { useRef } from 'react'

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
	const [newProgram, setNewProgram] = React.useState('')

	const [isVisible, setIsVisible] = useState<boolean>(false)

	const [originalFirstName, setOriginalFirstName] = useState<string>()
	const [originalLastName, setOriginalLastName] = useState<string>()
	const [originalProgram, setOriginalProgram] = useState<string>()

	const [errorMsg, setErrorMsg] = useState<string>('Error! ')
	const [error, setError] = useState<boolean>(false)
	const [update, setUpdate] = useState<boolean>(false)

	const [showDeleteProfilePopup, setShowDeleteProfilePopup] =
		useState<boolean>(false)

	const popupRef = useRef<HTMLDivElement | null>(null)

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

	const handleClickOutside = (event: MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
			setShowDeleteProfilePopup(false)
			document.body.classList.remove('overflow-hidden')
		}
	}

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			handleClickOutside(event)
		}

		document.addEventListener('mousedown', handleOutsideClick)

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [handleClickOutside])

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

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
		<div>
			{update ? (
				error ? (
					<div className='pf-alert-error'>
						<strong>An error occurred in changing your information.</strong>{' '}
						{errorMsg}
					</div>
				) : (
					<div className='pf-alert-success'>
						<strong>Success!</strong> Your information has been updated.
					</div>
				)
			) : null}

			<div className='pf-form-card'>
				<form onSubmit={handleFormSubmit}>
					<label className='pf-form-label'>Email</label>
					<input
						type='email'
						className='pf-form-input'
						value={email}
						disabled
						style={{ opacity: 0.5, cursor: 'not-allowed' }}
					/>

					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
						<div>
							<label className='pf-form-label'>First Name</label>
							<input
								onChange={handleFirstNameChange}
								type='text'
								className='pf-form-input'
								value={newFirstName}
							/>
						</div>
						<div>
							<label className='pf-form-label'>Last Name</label>
							<input
								onChange={handleLastNameChange}
								type='text'
								className='pf-form-input'
								value={newLastName}
							/>
						</div>
					</div>

					<label className='pf-form-label'>Program</label>
					<ProgramDropdownUserDetails
						value={newProgram}
						setValue={setNewProgram}
					/>

					<button type='submit' className='pf-form-submit' style={{ marginTop: 4 }}>
						Save Changes
					</button>
				</form>

				<hr className='pf-form-divider' />

				<div style={{ textAlign: 'center' }}>
					<button
						type='button'
						onClick={(e) => {
							e.preventDefault()
							toggleDeleteReviewPopup()
						}}
						className='pf-delete-link'
					>
						Delete your account
					</button>
				</div>
			</div>

			{showDeleteProfilePopup ? (
				<div className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60'>
					<div ref={popupRef} className='pf-delete-popup'>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
							<h2 className='pf-delete-popup-title'>Delete Account</h2>
							<button
								type='button'
								onClick={toggleDeleteReviewPopup}
								style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8AAA', padding: 4 }}
							>
								<X size={20} />
							</button>
						</div>
						<p className='pf-delete-popup-text'>
							Are you sure you want to delete your account? This action cannot
							be undone and will remove all your reviews and user data.
						</p>
						<div className='pf-delete-popup-actions'>
							<button
								type='button'
								onClick={(e) => {
									e.preventDefault()
									handleAccountDeletion()
								}}
								className='pf-popup-btn pf-popup-btn-confirm'
							>
								Yes, Delete
							</button>
							<button
								type='button'
								onClick={(e) => {
									e.preventDefault()
									toggleDeleteReviewPopup()
								}}
								className='pf-popup-btn pf-popup-btn-cancel'
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}

export default UserDetails
