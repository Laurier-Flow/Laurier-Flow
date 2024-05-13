'use client'

import { useState } from 'react'

interface ChangePasswordFormProps {
	user: any
	resetUserPasswordFunction: (newPassword: string) => Promise<boolean>
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
	user,
	resetUserPasswordFunction
}) => {
	const [hidePasswords, setHidePasswords] = useState(true)
	const [newPassword, setNewPassword] = useState<string>('')
	const [confirmNewPassword, setConfirmNewPassword] = useState<string>()

	const [requestSent, setRequestSent] = useState<boolean>(false)
	const [success, setSuccess] = useState<boolean>(false)
	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)

	const handleNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewPassword(event.target.value)
	}
	const handleConfirmNewPassword = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmNewPassword(event.target.value)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (newPassword === confirmNewPassword && newPassword.length >= 8) {
			resetUserPasswordFunction(newPassword)
				.then((attempt: boolean) => {
					setSuccess(true)
				})
				.catch((err: any) => {
					console.log(err)
					setSuccess(false)
				})

			setTimeout(() => {
				setPasswordsMatch(true)
				setRequestSent(true)
			}, 3000)
		} else {
			setPasswordsMatch(false)
		}
	}

	return (
		<div>
			{requestSent ? (
				success ? (
					<div
						className='mt-2 rounded-lg bg-teal-500 p-4 text-sm text-white'
						role='alert'
					>
						<span className='font-bold'>Success!</span> Your password has
						successfully been changed!
					</div>
				) : (
					<div
						className='mt-2 rounded-lg bg-red-500 p-4 text-sm text-white'
						role='alert'
					>
						<span className='font-bold'>Error!</span> There was an error when
						attempting to change your password.
					</div>
				)
			) : null}
			{passwordsMatch ? null : (
				<div
					className='mt-2 rounded-lg bg-yellow-500 p-4 text-sm text-white'
					role='alert'
				>
					<span className='font-bold'>Error!</span> Please make sure your
					passwords match and that your new password is at least 8 characters!
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<label
					className='mb-2 mt-5 block text-lg font-medium dark:text-white'
					style={{ marginLeft: '5px' }}
				>
					Enter new password
				</label>
				<input
					type={hidePasswords ? 'password' : 'text'}
					className='block w-full rounded-lg border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
					required
					value={newPassword}
					onChange={handleNewPassword}
				/>

				<label
					className='mb-2 mt-5 block text-lg font-medium dark:text-white'
					style={{ marginLeft: '5px' }}
				>
					Confirm new password
				</label>
				<input
					type={hidePasswords ? 'password' : 'text'}
					className='block w-full rounded-lg border-gray-200 px-4 py-3 text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
					required
					value={confirmNewPassword}
					onChange={handleConfirmNewPassword}
				/>

				<button
					onClick={(e) => {
						e.preventDefault()
						setHidePasswords(!hidePasswords)
						console.log(user)
					}}
					className='font-small hover:bg-secondary-dark mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm text-black dark:text-white'
				>
					<h1>Show Passwords</h1>
				</button>

				<button
					type='submit'
					className='hover:bg-primary-dark mt-8 flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white dark:text-white'
				>
					<h1>Change Password</h1>
				</button>
			</form>
		</div>
	)
}

export default ChangePasswordForm
