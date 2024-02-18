import React from 'react'
import { ThemeToggleButton } from './ThemeToggleButton'

export default function Header(): React.ReactElement {
	return (
		<header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-14 max-w-screen-2xl items-center'>
				<ThemeToggleButton />
			</div>
		</header>
	)
}
