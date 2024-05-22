'use client'

import Spinner from '@/components/Spinner'
import { Suspense } from 'react'
import Body from './body'
import HomeFooter from '@/components/HomeFooter'

export default function ConfirmSignup() {
	return (
		<>
			<Suspense
				fallback={
					<div className='h-full w-full'>
						<Spinner />
					</div>
				}
			>
				<Body />
			</Suspense>
		</>
	)
}
