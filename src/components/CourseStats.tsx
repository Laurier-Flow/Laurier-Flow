import { courseInfoDBResponse } from "@/app/course/CourseInfo"
import '../app/course/CourseStatAnimation.css'

function CourseStats(
    { courseData,
        courseDescription
    }: {
        courseData: courseInfoDBResponse[],
        courseDescription: string
    }) {

    const likedPercentage = courseData[0].total_reviews !== 0
        ? (100 - (courseData[0].liked / courseData[0].total_reviews) * 100)
        : (100)

    const easyPercentage = courseData[0].total_reviews !== 0
        ? ((courseData[0].easy / courseData[0].total_reviews) * 20)
        : (0)

    const usefulPercentage = courseData[0].total_reviews !== 0
        ? ((courseData[0].useful / courseData[0].total_reviews) * 20)
        : (0)

    return (
        <div className='flex flex-col p-4 md:dark:bg-slate-950 md:bg-white md:rounded-tl-full rounded-bl-full md:shadow md:dark:shadow-slate-600'>
            <div className='flex flex-row'>
                <div className="relative h-40 w-40">
                    <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-800" strokeWidth="2"></circle>
                        <g className="origin-center -rotate-90 transform">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-secondary circle-animation" strokeWidth="2" strokeDasharray="100" strokeDashoffset="100" style={{ animationName: 'growStroke', animationTimingFunction: 'ease-out', animationDuration: '2s', animationFillMode: 'forwards', strokeDashoffset: likedPercentage }}></circle>
                        </g>
                    </svg>
                    <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <div className='flex flex-col items-center'>
                            <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{courseData[0].total_reviews !== 0 ? Math.round((courseData[0].liked / courseData[0].total_reviews) * 100) : 0}%</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">Liked</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 justify-evenly p-4">
                    <div>
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Easy</h3>
                            <span className="text-sm text-gray-800 dark:text-white">
                                {courseData[0].total_reviews !== 0 ? Math.round((courseData[0].easy / courseData[0].total_reviews) * 20) + '%' : '0%'}
                            </span>
                        </div>
                        <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                            <div className="flex flex-col justify-center rounded-full overflow-hidden bg-secondary text-xs text-white text-center whitespace-nowrap transition duration-500 progress-animation" style={{ width: `${easyPercentage}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-white pt-6">Useful</h3>
                            <span className="text-sm text-gray-800 dark:text-white pt-6">
                                {courseData[0].total_reviews !== 0 ? Math.round((courseData[0].useful / courseData[0].total_reviews) * 20) + '%' : '0%'}
                            </span>
                        </div>
                        <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-800" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                            <div className="flex flex-col justify-center rounded-full overflow-hidden bg-secondary text-xs text-white text-center whitespace-nowrap transition duration-500 progress-animation" style={{ width: `${usefulPercentage}%` }}></div>
                        </div>
                    </div>


                    <p className='pt-4'>{courseData[0].total_reviews} ratings</p>
                </div>
            </div>
            <h3 className='md:hidden pt-4'>{courseDescription}</h3>
        </div>
    )
}

export default CourseStats