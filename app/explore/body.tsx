'use client'

import Spinner from "@/components/Spinner";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { courseInfoDBResponse } from "../course/CourseInfo";
import { cookies } from "next/headers";
import Link from "next/link";

export default function Body({ currentTerm, nextTerm, initialCourses }: { currentTerm: string, nextTerm: string, initialCourses: courseInfoDBResponse[] }) {
    const searchParams = useSearchParams()
    const subject = searchParams.get('subject') || 'all'
    const [courses, setCourses] = useState(initialCourses)
    const [page, setPage] = useState(0)
    const loaderRef = useRef(null)

    const fetchMoreCourses = async () => {
        const response = await fetch(`/explore/api?page=${page + 1}`)
        if (response.ok) {
            const newCourses = await response.json()
            setCourses([...courses, ...newCourses.data])
            setPage(page + 1)
        } else {
            console.error('Failed to fetch more courses')
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const firstEntry = entries[0]
            if (firstEntry.isIntersecting) {
                fetchMoreCourses()
            }
        }, { threshold: 1.0 })

        const currentLoader = loaderRef.current
        if (currentLoader) {
            observer.observe(currentLoader)
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader)
            }
        }
    }, [fetchMoreCourses, page])

    return (
        <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
                <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
                    <div className="flex flex-1 flex-col justify-end pl-4">
                        <h1 className='mb-2 text-2xl font-bold text-3xl md:text-4xl'>{`Showing ${subject} courses and professors`}</h1>
                    </div>
                </div>
            </div>

            <div className="exploreCard">
                <div className="flex flex-col p-6">
                    <h1 className="text-2xl font-semibold">Filter your results</h1>
                    <h1 className="pt-8">Course Code</h1>
                    <div className="pt-2 flex flex-row">
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-600 text-white dark:bg-primary">1XX</span>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-600 text-white dark:bg-primary ml-4">2XX</span>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-600 text-white dark:bg-primary ml-4">3XX</span>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-600 text-white dark:bg-primary ml-4">4XX</span>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium bg-blue-600 text-white dark:bg-primary ml-4">5XX+</span>
                    </div>
                    <div className="pt-8 flex flex-row justify-between">
                        <h1>Min # of ratings</h1>
                        <h1>≥ x ratings</h1>
                    </div>
                    <input type="range" className="pt-4 w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
[&::-webkit-slider-thumb]:w-2.5
[&::-webkit-slider-thumb]:h-2.5
[&::-webkit-slider-thumb]:-mt-0.5
[&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:bg-white
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
[&::-webkit-slider-thumb]:rounded-full
[&::-webkit-slider-thumb]:transition-all
[&::-webkit-slider-thumb]:duration-150
[&::-webkit-slider-thumb]:ease-in-out
[&::-webkit-slider-thumb]:dark:bg-slate-700

[&::-moz-range-thumb]:w-2.5
[&::-moz-range-thumb]:h-2.5
[&::-moz-range-thumb]:appearance-none
[&::-moz-range-thumb]:bg-white
[&::-moz-range-thumb]:border-4
[&::-moz-range-thumb]:border-blue-600
[&::-moz-range-thumb]:rounded-full
[&::-moz-range-thumb]:transition-all
[&::-moz-range-thumb]:duration-150
[&::-moz-range-thumb]:ease-in-out

[&::-webkit-slider-runnable-track]:w-full
[&::-webkit-slider-runnable-track]:h-2
[&::-webkit-slider-runnable-track]:bg-gray-100
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:dark:bg-gray-700

[&::-moz-range-track]:w-full
[&::-moz-range-track]:h-2
[&::-moz-range-track]:bg-gray-100
[&::-moz-range-track]:rounded-full" id="steps-range-slider-usage" min="0" max="9" step="1" value="0"></input>

                    <h1 className="pt-8">Offered in</h1>
                    <div className="pt-4 ml-1 flex flex-row">
                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">This term ({currentTerm})</h1>
                        </div>

                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 ml-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">Next term ({nextTerm})</h1>
                        </div>
                    </div>

                    <button type="button" className="mt-12 py-3 px-4 gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        {courses.length}
                    </button>
                </div>
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>

                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course Code</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course Name</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Ratings</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Useful</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Easy</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Liked</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr className="odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    <Link href={`/course/${course.course_code.replace(/\s+/g, '')}`}>
                                                        {course.course_code}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.course_title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.total_reviews}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.useful ? (course.useful) : ('N/A')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.easy ? (course.easy) : ('N/A')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.liked ? (course.liked) : ('N/A')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div ref={loaderRef} style={{ height: '20px', margin: '10px 0' }}>Loading more courses...</div>
                </div>
            </div>
        </Suspense>
    );
}