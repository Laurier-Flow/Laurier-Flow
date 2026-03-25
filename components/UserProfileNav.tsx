import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/utils/supabase/authActions'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'

export function UserNav({ user }: { user: User }) {
	const handleSignOut = async () => {
		const result = await signOut()
	}

	const initials =
		(user.user_metadata.first_name?.charAt(0) || '') +
		(user.user_metadata.last_name?.charAt(0) || '')

	return (
		<div className='z-[200]'>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<button className='un-avatar-btn'>
						<span className='un-avatar'>
							{initials}
						</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className='un-dropdown'
					align='end'
					sideOffset={8}
					forceMount
				>
					<div className='un-header'>
						<p className='un-header-name'>
							{user.user_metadata.first_name} {user.user_metadata.last_name}
						</p>
						<p className='un-header-email'>
							{user.email}
						</p>
					</div>
					<div className='un-divider' />
					<Link href='/profile'>
						<DropdownMenuItem className='un-item'>
							Profile
						</DropdownMenuItem>
					</Link>
					<Link href='/change-password'>
						<DropdownMenuItem className='un-item'>
							Change Password
						</DropdownMenuItem>
					</Link>
					<div className='un-divider' />
					<DropdownMenuItem
						onClick={handleSignOut}
						className='un-item'
					>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
