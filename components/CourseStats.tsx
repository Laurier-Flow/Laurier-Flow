import { courseInfoDBResponse } from '@/app/course/CourseInfo'
import '../app/course/CourseStatAnimation.css'

function CourseStats({
	courseData,
	courseDescription
}: {
	courseData: courseInfoDBResponse[]
	courseDescription: string
}) {
	const totalReviews = courseData[0].total_reviews
	const likedPct = totalReviews !== 0
		? Math.round((courseData[0].liked / totalReviews) * 100)
		: 0
	const easyPct = totalReviews !== 0
		? Math.round((courseData[0].easy / totalReviews) * 20)
		: 0
	const usefulPct = totalReviews !== 0
		? Math.round((courseData[0].useful / totalReviews) * 20)
		: 0

	const metrics = [
		{ label: 'Liked', value: likedPct },
		{ label: 'Easy', value: easyPct },
		{ label: 'Useful', value: usefulPct },
	]

	return (
		<div className='cp-stats'>
			<div className='cp-stats-metrics'>
				{metrics.map((m) => (
					<div key={m.label} className='cp-metric'>
						<div className='cp-metric-top'>
							<span className='cp-metric-value'>{m.value}%</span>
							<span className='cp-metric-label'>{m.label}</span>
						</div>
						<div className='cp-metric-track'>
							<div
								className='cp-metric-fill progress-animation'
								style={{ width: `${m.value}%` }}
							/>
						</div>
					</div>
				))}
			</div>
			<span className='cp-stats-count'>
				Based on {totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'}
			</span>
		</div>
	)
}

export default CourseStats
