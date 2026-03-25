'use client'

import { handleChangePassword } from './ChangeAuthAction'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function Body() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrorMessage(null)
		if (password !== confirmPassword) {
			setErrorMessage('Passwords do not match.')
			return
		}
		const result = await handleChangePassword(password)
		if (result) {
			setErrorMessage(result.message)
		}
	}

	return (
		<div className='pw-root'>
			<div className='pw-bg-layer'>
				<div className='pw-orb pw-orb-1' />
				<div className='pw-orb pw-orb-2' />
			</div>

			<div className='pw-card'>
				<div className='pw-card-header'>
					<h1 className='pw-title'>New password</h1>
					<p className='pw-subtitle'>Choose something strong and unique</p>
				</div>

				<form className='pw-form' onSubmit={handleSubmit}>
					{errorMessage && (
						<div className='auth-alert auth-alert--error'>{errorMessage}</div>
					)}

					<div className='auth-field'>
						<input
							className='auth-input auth-input--has-toggle'
							type={showPassword ? 'text' : 'password'}
							placeholder=' '
							value={password}
							onChange={e => { setPassword(e.target.value); setErrorMessage(null) }}
							required
						/>
						<label className='auth-label'>New Password</label>
						<button
							type='button'
							className='auth-eye'
							onClick={() => setShowPassword(v => !v)}
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					<div className='auth-field'>
						<input
							className='auth-input auth-input--has-toggle'
							type={showConfirm ? 'text' : 'password'}
							placeholder=' '
							value={confirmPassword}
							onChange={e => { setConfirmPassword(e.target.value); setErrorMessage(null) }}
							required
						/>
						<label className='auth-label'>Confirm Password</label>
						<button
							type='button'
							className='auth-eye'
							onClick={() => setShowConfirm(v => !v)}
						>
							{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>

					<button type='submit' className='auth-btn pw-submit-btn'>
						Update password
					</button>

					<hr className='auth-divider' />

					<p className='auth-switch'>
						<Link href='/'>Back to home</Link>
					</p>
				</form>
			</div>
		</div>
	)
}
