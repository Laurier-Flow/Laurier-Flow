'use client'

import { redirect } from 'next/navigation'
import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Body() {
	const searchParams = useSearchParams()
	const token_hash = searchParams.get('token_hash')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	if (!token_hash) {
		redirect('/')
	}

	const handleResetClick = async () => {
		setLoading(true)
		router.push(`/auth/confirm?token_hash=${token_hash}&type=recovery&next=/change-password`)
	}

	return (
		<div className='pw-root'>
			<div className='pw-bg-layer'>
				<div className='pw-orb pw-orb-1' />
				<div className='pw-orb pw-orb-2' />
			</div>

			<div className='pw-card'>
				<div className='pw-card-header'>
					<h1 className='pw-title'>Reset your password</h1>
					<p className='pw-subtitle'>Click below to continue and choose a new password.</p>
				</div>

				<div className='pw-form'>
					<button
						onClick={handleResetClick}
						disabled={loading}
						type='button'
						className='auth-btn pw-submit-btn'
					>
						<KeyRound size={18} style={{ marginRight: 8 }} />
						{loading ? 'Redirecting…' : 'Continue to reset'}
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
