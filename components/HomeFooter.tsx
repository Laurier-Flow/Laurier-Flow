import React from 'react'
import Link from 'next/link'

const HomeFooter = () => {
	return (
		<footer className='site-footer'>
			<div className='site-footer-inner'>
				<p className='site-footer-copy'>
					© 2026 LaurierFlow.{' '}
					<span className='site-footer-hide-sm'>All rights reserved.</span>
				</p>
				<nav className='site-footer-nav'>
					<Link href='/about'>About</Link>
					<Link href='/privacy'>Privacy</Link>
				</nav>
			</div>
		</footer>
	)
}
export default HomeFooter
