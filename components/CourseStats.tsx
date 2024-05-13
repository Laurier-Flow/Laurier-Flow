import { courseInfoDBResponse } from '@/app/course/CourseInfo'
import '../app/course/CourseStatAnimation.css'

function CourseStats({
	courseData,
	courseDescription
}: {
	courseData: courseInfoDBResponse[]
	courseDescription: string
}) {
	const likedPercentage =
		courseData[0].total_reviews !== 0
			? 100 - (courseData[0].liked / courseData[0].total_reviews) * 100
			: 100

	const easyPercentage =
		courseData[0].total_reviews !== 0
			? (courseData[0].easy / courseData[0].total_reviews) * 20
			: 0

	const usefulPercentage =
		courseData[0].total_reviews !== 0
			? (courseData[0].useful / courseData[0].total_reviews) * 20
			: 0

	return (
		<div className='flex flex-col rounded-bl-full p-4 md:rounded-tl-full md:bg-white md:shadow md:dark:bg-slate-950 md:dark:shadow-slate-600'>
			<div className='flex flex-row'>
				<div className='relative h-40 w-40'>
					<svg
						className='h-full w-full'
						width='36'
						height='36'
						viewBox='0 0 36 36'
						xmlns='http://www.w3.org/2000/svg'
					>
						<circle
							cx='18'
							cy='18'
							r='16'
							fill='none'
							className='stroke-current text-gray-200 dark:text-gray-800'
							strokeWidth='2'
						></circle>
						<g className='origin-center -rotate-90 transform'>
							<circle
								cx='18'
								cy='18'
								r='16'
								fill='none'
								className='circle-animation stroke-current text-secondary'
								strokeWidth='2'
								strokeDasharray='100'
								strokeDashoffset='100'
								style={{
									animationName: 'growStroke',
									animationTimingFunction: 'ease-out',
									animationDuration: '2s',
									animationFillMode: 'forwards',
									strokeDashoffset: likedPercentage
								}}
							></circle>
						</g>
					</svg>
					<div className='absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
						<div className='flex flex-col items-center'>
							<span className='text-center text-2xl font-bold text-gray-800 dark:text-white'>
								{courseData[0].total_reviews !== 0
									? Math.round(
											(courseData[0].liked / courseData[0].total_reviews) * 100
										)
									: 0}
								%
							</span>
							<span className='text-sm font-semibold text-gray-800 dark:text-white'>
								Liked
							</span>
						</div>
					</div>
				</div>

				<div className='flex flex-1 flex-col justify-evenly p-4'>
					<div>
						<div className='mb-2 flex items-center justify-between'>
							<h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
								Easy
							</h3>
							<span className='text-sm text-gray-800 dark:text-white'>
								{courseData[0].total_reviews !== 0
									? Math.round(
											(courseData[0].easy / courseData[0].total_reviews) * 20
										) + '%'
									: '0%'}
							</span>
						</div>
						<div
							className='flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800'
							role='progressbar'
							aria-valuenow={25}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className='progress-animation flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-secondary text-center text-xs text-white transition duration-500'
								style={{ width: `${easyPercentage}%` }}
							></div>
						</div>
					</div>

					<div>
						<div className='mb-2 flex items-center justify-between'>
							<h3 className='pt-6 text-sm font-semibold text-gray-800 dark:text-white'>
								Useful
							</h3>
							<span className='pt-6 text-sm text-gray-800 dark:text-white'>
								{courseData[0].total_reviews !== 0
									? Math.round(
											(courseData[0].useful / courseData[0].total_reviews) * 20
										) + '%'
									: '0%'}
							</span>
						</div>
						<div
							className='flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800'
							role='progressbar'
							aria-valuenow={25}
							aria-valuemin={0}
							aria-valuemax={100}
						>
							<div
								className='progress-animation flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-secondary text-center text-xs text-white transition duration-500'
								style={{ width: `${usefulPercentage}%` }}
							></div>
						</div>
					</div>

					<p className='pt-4'>{courseData[0].total_reviews} ratings</p>
				</div>
			</div>
			<h3 className='pt-4 md:hidden'>{courseDescription}</h3>
		</div>
	)
}

export default CourseStats
