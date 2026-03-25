import { Suspense } from 'react'
import Body from './body'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Change Password',
	description: 'Change your password for your account on Laurier Flow'
}

export default function ChangePassword() {
	return (
		<Suspense fallback={<div className='pw-root' />}>
			<Body />
		</Suspense>
	)
}
