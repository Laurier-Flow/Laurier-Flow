'use client'

import { Suspense } from 'react'
import Body from './body'

export default function ConfirmSignup() {
	return (
		<Suspense fallback={<div className='pw-root' />}>
			<Body />
		</Suspense>
	)
}
