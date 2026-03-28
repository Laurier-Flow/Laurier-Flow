'use client'

import Link from 'next/link'

export default function Error() {
	return (
		<div className='cp-root'>
			<div className='cp-bg-layer'>
				<div className='cp-orb cp-orb-1' />
				<div className='cp-orb cp-orb-2' />
				<div className='cp-noise' />
			</div>

			<div className='err-wrap'>
				<p className='err-code'>500</p>
				<h1 className='err-title'>Something went wrong</h1>
				<p className='err-desc'>
					This usually happens when you're trying to access a course that hasn't been offered recently or is no longer available at Laurier.
					Laurier Flow only has data for courses offered in or after <strong>Winter 2024</strong> — as more courses are offered, our database will keep growing.
				</p>
				<p className='err-desc'>
					If that's not the reason, please report it using the feedback button so we can investigate.
				</p>
				<Link href='/' className='err-btn'>
					Return Home
				</Link>
			</div>
		</div>
	)
}
