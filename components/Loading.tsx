export default function Loading() {
	return (
		<div className='flex w-full animate-pulse'>
			<div className='flex-shrink-0'>
				<span className='size-12 block rounded-full bg-gray-200 dark:bg-gray-700'></span>
			</div>

			<div className='ms-4 mt-2 w-full'>
				<h3 className='h-4 rounded-full bg-gray-200 dark:bg-gray-700'></h3>

				<ul className='mt-5 space-y-3'>
					<li className='h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700'></li>
					<li className='h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700'></li>
					<li className='h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700'></li>
					<li className='h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700'></li>
				</ul>
			</div>
		</div>
	)
}
