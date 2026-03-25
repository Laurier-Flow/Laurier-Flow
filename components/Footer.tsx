import React from 'react'
import Link from 'next/link'

const Footer = () => {
	return (
		<footer className='z-40 flex w-full items-center justify-center bg-transparent py-6 text-[#8C7A68] dark:text-[#3F3F5A]' style={{ fontFamily: "'DM Sans', sans-serif" }}>
			<div className='flex flex-1 justify-between px-8'>
				<p className='text-sm'>
					© 2026 LaurierFlow.{' '}
					<span className='hidden sm:inline'>All rights reserved.</span>
				</p>
				<nav className='flex'>
					<Link
						className='text-sm underline-offset-2 hover:underline'
						href='/about'
					>
						About
					</Link>
					<Link
						className='ml-4 text-sm underline-offset-2 hover:underline'
						href='/privacy'
					>
						Privacy
					</Link>
				</nav>
			</div>
		</footer>
	)
}
export default Footer
