'use client'

import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { handleVerifyEmail } from './ConfirmAuthAction'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Body() {
	const searchParams = useSearchParams()
	const token_hash = searchParams.get('token_hash')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	if (!token_hash) {
		redirect('/')
	}

	const handleVerifyClick = async () => {
		setLoading(true)
		setErrorMessage(null)
		const error = await handleVerifyEmail(token_hash)
		if (error) {
			setErrorMessage(error)
			setLoading(false)
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
					<h1 className='pw-title'>Confirm your account</h1>
					<p className='pw-subtitle'>Click below to verify your Laurier email and complete registration.</p>
				</div>

				<div className='pw-form'>
					{errorMessage && (
						<div className='auth-alert auth-alert--error'>{errorMessage}</div>
					)}

					<button
						onClick={handleVerifyClick}
						disabled={loading}
						type='button'
						className='auth-btn'
					>
						<ShieldCheck size={18} />
						{loading ? 'Verifying…' : 'Verify email'}
					</button>

					<hr className='auth-divider' />

					<p className='auth-switch'>
						<Link href='/'>Back to home</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
