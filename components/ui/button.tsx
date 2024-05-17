import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/lib/cn'

const buttonVariants = cva(
	 'inline-flex mb-2 bg-stone-200 dark:bg-gray-900 font-thin border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-evxents-none disabled:opacity-50',
	{
		variants: {
			variant: {
				// default:
					// 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
				// destructive:
				// 	'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'',
				// secondary:
				// 	'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				// ghost: 'hover:bg-accent hover:text-accent-foreground',
				// link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				// sm: 'h-8 rounded-md px-3 text-xs',
				// lg: 'h-10 rounded-md px-8',
				// icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'outline',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				// style={{
				// 	borderWidth: "1px",
				// 	borderColor: "#d4d4d4",
				// }}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
