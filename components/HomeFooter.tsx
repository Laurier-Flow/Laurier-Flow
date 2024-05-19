import React from 'react'
import Link from 'next/link'

const HomeFooter = () => {
	return (
		<footer className='z-40 flex w-full items-center justify-center bg-transparent py-6 text-white'>
			<div className='flex flex-1 justify-between px-8'>
				<p className='text-sm'>
					© 2024 LaurierFlow.{' '}
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
export default HomeFooter
