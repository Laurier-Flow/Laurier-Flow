import { instructorInfoDBResponse } from '@/app/instructor/InstructorInfo'
import React from 'react'
import '../app/course/CourseStatAnimation.css'

function InstructorStats({
	instructorData,
	currentCourses
}: {
	instructorData: instructorInfoDBResponse[]
	currentCourses: Set<string>
}) {
	const totalReviews = instructorData[0].total_reviews
	const likedPct = totalReviews !== 0
		? Math.round((instructorData[0].liked / totalReviews) * 100)
		: 0
	const clearPct = totalReviews !== 0
		? Math.round((instructorData[0].clear / totalReviews) * 20)
		: 0
	const engagingPct = totalReviews !== 0
		? Math.round((instructorData[0].engaging / totalReviews) * 20)
		: 0

	const metrics = [
		{ label: 'Liked', value: likedPct },
		{ label: 'Clear', value: clearPct },
		{ label: 'Engaging', value: engagingPct },
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

export default InstructorStats
