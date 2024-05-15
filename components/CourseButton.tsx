import Link from 'next/link'

export default function CourseButton() {
	return (
		<Link
			className='hover:bg-btn-background-hover flex rounded-md border px-3 py-2 no-underline'
			href='/course'
		>
			COURSE PAGE BETA
		</Link>
	)
}
