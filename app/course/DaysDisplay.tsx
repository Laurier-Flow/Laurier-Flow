import { days } from './CourseSchedule'

function DaysDisplay({ days }: { days: days | null }) {
	const dayList = [
		{ key: 'monday', label: 'M' },
		{ key: 'tuesday', label: 'T' },
		{ key: 'wednesday', label: 'W' },
		{ key: 'thursday', label: 'Th' },
		{ key: 'friday', label: 'F' },
		{ key: 'saturday', label: 'S' },
		{ key: 'sunday', label: 'Su' },
	] as const

	return (
		<div className='cp-days'>
			{dayList.map((d) => (
				<span
					key={d.key}
					className={days?.[d.key] ? 'cp-day-active' : 'cp-day'}
				>
					{d.label}
				</span>
			))}
		</div>
	)
}

export default DaysDisplay
