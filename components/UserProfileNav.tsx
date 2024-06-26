import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/utils/supabase/authActions'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'

export function UserNav({ user }: { user: User }) {
	const handleSignOut = async () => {
		const result = await signOut()
	}

	return (
		<div className='z-[200]'>
			<DropdownMenu modal={false}>
				{' '}
				{/* Add modal=false to the DropdownMenu component to keep scrolling enabled */}
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
						<Avatar className='h-8 w-8'>
							<AvatarFallback>
								{user.user_metadata.first_name?.charAt(0)}
								{user.user_metadata.last_name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='z-[200] w-56' align='end' forceMount>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>
								{user.user_metadata.first_name} {user.user_metadata.last_name}
							</p>
							<p className='text-xs leading-none text-muted-foreground'>
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<Link href={'/profile'} className='z-[200]'>
						<DropdownMenuGroup className='z-[200]'>
							<DropdownMenuItem className='z-[200] cursor-pointer hover:bg-accent'>
								Profile
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</Link>

					<DropdownMenuSeparator />
					<Link href={'/change-password'} className='z-[200]'>
						<DropdownMenuGroup className='z-[200]'>
							<DropdownMenuItem className='z-[200] cursor-pointer hover:bg-accent'>
								Change Password
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</Link>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={handleSignOut}
						className='z-[200] cursor-pointer hover:bg-destructive'
					>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
