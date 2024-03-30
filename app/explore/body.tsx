'use client'

import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { courseInfoDBResponseExplore } from "./page";
import Link from "next/link";
import { instructorInfoDBResponse } from "../instructor/InstructorInfo";

type SortableCourseFields = keyof courseInfoDBResponseExplore;
type SortableInstructorFields = keyof instructorInfoDBResponse;

export default function Body({ currentTerm, nextTerm, courses, instructors }: { currentTerm: string, nextTerm: string, courses: courseInfoDBResponseExplore[], instructors: instructorInfoDBResponse[] }) {
    const searchParams = useSearchParams()
    const subject = searchParams.get('subject') || 'all'

    const itemsPerPage = 50
    const [visibleCount, setVisibleCount] = useState(itemsPerPage)
    const loaderRef = useRef(null)

    /////////////////////////////////////////////////////////////////////////////// COURSE HOOKS AND VARS
    const [filteredCourses, setFilteredCourses] = useState(courses)
    const [sortedCourses, setSortedCourses] = useState(courses)

    const [courseOrder, setCourseOrder] = useState('none')
    const [courseSortField, setCourseSortField] = useState<SortableCourseFields>('course_code')

    const [courseFilters, setCourseFilters] = useState({
        firstYear: true,
        secondYear: true,
        thirdYear: true,
        fourthYear: true,
        seniorYear: true,
        minRatings: 0,
        thisTerm: false,
        afterTerm: false
    });
    /////////////////////////////////////////////////////////////////////////////// INSTRUCTOR HOOKS AND VARS
    const [filteredInstructors, setFilteredInstructors] = useState(instructors)
    const [sortedInstructors, setSortedInstructors] = useState(instructors)

    const [instructorOrder, setInstructorOrder] = useState('none')
    const [instructorSortField, setInstructorSortField] = useState<SortableInstructorFields>("instructor_name")

    const [instructorFilters, setInstructorFilters] = useState({
        minRatings: 0
    });

    function sortCoursesArray(sortField: SortableCourseFields, order: string, filtered: courseInfoDBResponseExplore[] = filteredCourses) {
        const sorted = [...filtered].sort((a, b) => {
            if (a[sortField] === null) return 1;
            if (b[sortField] === null) return -1;

            if (order === 'asc') {
                return a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
            } else {
                return a[sortField] > b[sortField] ? -1 : a[sortField] < b[sortField] ? 1 : 0;
            }
        })

        setSortedCourses(sorted)
    }

    function sortInstructorsArray(sortField: SortableInstructorFields, order: string, filtered: instructorInfoDBResponse[] = filteredInstructors) {
        const sorted = [...filtered].sort((a, b) => {
            if (a[sortField] === null) return 1;
            if (b[sortField] === null) return -1;

            if (order === 'asc') {
                return a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
            } else {
                return a[sortField] > b[sortField] ? -1 : a[sortField] < b[sortField] ? 1 : 0;
            }
        })

        setSortedInstructors(sorted)
    }

    const handleCourseResort = (sortField: SortableCourseFields, filtered: courseInfoDBResponseExplore[] = filteredCourses) => {
        if (courseOrder === 'none') {
            setSortedCourses(filtered)
        } else if (courseOrder === 'desc') {
            sortCoursesArray(sortField, 'desc', filtered)
        } else {
            sortCoursesArray(sortField, 'asc', filtered)
        }
    }

    const handleInstructorResort = (sortField: SortableInstructorFields, filtered: instructorInfoDBResponse[] = filteredInstructors) => {
        if (instructorOrder === 'none') {
            setSortedInstructors(filtered)
        } else if (instructorOrder === 'desc') {
            sortInstructorsArray(sortField, 'desc', filtered)
        } else {
            sortInstructorsArray(sortField, 'asc', filtered)
        }
    }

    const handleCourseSort = (sortField: SortableCourseFields) => {
        setCourseSortField(sortField)
        if (courseOrder === 'none') {
            setCourseOrder('desc')
            sortCoursesArray(sortField, 'desc')
        } else if (courseOrder === 'desc') {
            setCourseOrder('asc')
            sortCoursesArray(sortField, 'asc')
        } else {
            setCourseOrder('none')
            setSortedCourses(filteredCourses)
        }
    }

    const handleInstructorSort = (sortField: SortableInstructorFields) => {
        setInstructorSortField(sortField)
        if (instructorOrder === 'none') {
            setInstructorOrder('desc')
            sortInstructorsArray(sortField, 'desc')
        } else if (instructorOrder === 'desc') {
            setInstructorOrder('asc')
            sortInstructorsArray(sortField, 'asc')
        } else {
            setInstructorOrder('none')
            setSortedInstructors(filteredInstructors)
        }
    }

    const [slider, setSlider] = useState(0)

    const [activeTab, setActiveTab] = useState(1)

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting) {
                if (activeTab === 1) {
                    setVisibleCount((prevCount) => Math.min(filteredCourses.length, prevCount + itemsPerPage));
                } else {
                    setVisibleCount((prevCount) => Math.min(filteredInstructors.length, prevCount + itemsPerPage));
                }
            }
        }, { threshold: 0.1, rootMargin: "200px" });

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => observer.disconnect();
    }, [filteredCourses.length, filteredInstructors.length]);

    const handleSliderChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        const val = e.target.value
        setSlider(Number(val))
        const setFilters = (activeTab === 1 ? (setCourseFilters) : (setInstructorFilters))

        switch (val) {
            case '0':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 0
                }));
                break;
            case '1':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 1
                }));
                break;
            case '2':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 5
                }));
                break;
            case '3':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 10
                }));
                break;
            case '4':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 20
                }));
                break;
            case '5':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 50
                }));
                break;
            case '6':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 75
                }));
                break;
            case '7':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 100
                }));
                break;
            case '8':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 200
                }));
                break;
            case '9':
                setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    minRatings: 500
                }));
                break;
        }
    }

    const resetFilter = () => {
        if (activeTab === 1) {
            setCourseFilters(({
                firstYear: true,
                secondYear: true,
                thirdYear: true,
                fourthYear: true,
                seniorYear: true,
                minRatings: 0,
                thisTerm: false,
                afterTerm: false,
            }));
        } else {
            setInstructorFilters(({
                minRatings: 0
            }));
        }

        setSlider(0)
    };

    useEffect(() => {
        const filtered = courses.filter((course) => {
            if (course.total_reviews < courseFilters.minRatings) return false
            if (!course.isOfferedThisTerm && courseFilters.thisTerm) return false
            if (!course.isOfferedNextTerm && courseFilters.afterTerm) return false

            let firstSpaceIndex = course.course_code.indexOf(' ')
            let charAfterSpace = course.course_code[firstSpaceIndex + 1]

            if (!courseFilters.firstYear && charAfterSpace === '1') return false
            if (!courseFilters.secondYear && charAfterSpace === '2') return false
            if (!courseFilters.thirdYear && charAfterSpace === '3') return false
            if (!courseFilters.fourthYear && charAfterSpace === '4') return false
            if (!courseFilters.seniorYear && charAfterSpace >= '5') return false

            if (courseFilters.thisTerm && !course.isOfferedThisTerm) return false
            if (courseFilters.afterTerm && !course.isOfferedNextTerm) return false

            return true
        })

        setFilteredCourses(filtered)
        handleCourseResort(courseSortField, filtered)

    }, [courseFilters])

    useEffect(() => {
        const filtered = instructors.filter((instructor) => {
            if (instructor.total_reviews < instructorFilters.minRatings) return false

            return true
        })

        setFilteredInstructors(filtered)
        handleInstructorResort(instructorSortField, filtered)

    }, [instructorFilters])

    const handleCurrentTermChange = () => {
        setCourseFilters(prevFilters => ({
            ...prevFilters,
            thisTerm: !prevFilters.thisTerm
        }));
    }

    const handleNextTermChange = () => {
        setCourseFilters(prevFilters => ({
            ...prevFilters,
            afterTerm: !prevFilters.afterTerm
        }));
    }

    return (
        <>
            <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
                <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
                    <div className="flex flex-1 flex-col justify-end pl-4">
                        <h1 className='mb-2 text-2xl font-bold text-3xl md:text-4xl'>{`Showing ${subject} courses and professors`}</h1>
                    </div>
                </div>
            </div>

            <div className="exploreCard">
                <div className={`flex flex-col p-6 ${activeTab === 1 ? '' : 'hidden'}`}>
                    <h1 className="text-2xl font-semibold">Filter your results</h1>
                    <h1 className="pt-8">Course Code</h1>
                    <div className="pt-2 flex flex-row">
                        <button onClick={() => setCourseFilters(prevFilters => ({
                            ...prevFilters,
                            firstYear: !courseFilters.firstYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${courseFilters.firstYear ? ('dark:bg-primary') : (null)}`}>1XX</button>
                        <button onClick={() => setCourseFilters(prevFilters => ({
                            ...prevFilters,
                            secondYear: !courseFilters.secondYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${courseFilters.secondYear ? ('dark:bg-primary') : (null)} ml-4`}>2XX</button>
                        <button onClick={() => setCourseFilters(prevFilters => ({
                            ...prevFilters,
                            thirdYear: !courseFilters.thirdYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${courseFilters.thirdYear ? ('dark:bg-primary') : (null)} ml-4`}>3XX</button>
                        <button onClick={() => setCourseFilters(prevFilters => ({
                            ...prevFilters,
                            fourthYear: !courseFilters.fourthYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${courseFilters.fourthYear ? ('dark:bg-primary') : (null)} ml-4`}>4XX</button>
                        <button onClick={() => setCourseFilters(prevFilters => ({
                            ...prevFilters,
                            seniorYear: !courseFilters.seniorYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${courseFilters.seniorYear ? ('dark:bg-primary') : (null)} ml-4`}>5XX+</button>
                    </div>
                    <div className="pt-8 flex flex-row justify-between">
                        <h1>Min # of ratings</h1>
                        <h1>≥ {courseFilters.minRatings} ratings</h1>
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
[&::-moz-range-thumb]:border-primary
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
[&::-moz-range-track]:rounded-full" id="steps-range-slider-usage" min="0" max="9" step="1" value={slider} onChange={handleSliderChange}></input>

                    <h1 className="pt-8">Offered in</h1>
                    <div className="pt-4 ml-1 flex flex-row">
                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={() => setCourseFilters(prevFilters => ({
                                ...prevFilters,
                                thisTerm: false,
                                afterTerm: false
                            }))} checked={(!courseFilters.thisTerm && !courseFilters.afterTerm)} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">All terms</h1>
                        </div>

                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 ml-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={handleCurrentTermChange} checked={courseFilters.thisTerm} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">This term ({currentTerm})</h1>
                        </div>

                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 ml-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={handleNextTermChange} checked={courseFilters.afterTerm} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">Next term ({nextTerm})</h1>
                        </div>
                    </div>

                    <button onClick={resetFilter} type="button" className="mt-12 py-3 px-4 gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Reset Filter
                    </button>
                </div>






                <div className={`flex flex-col p-6 ${activeTab === 2 ? '' : 'hidden'}`}>
                    <h1 className="text-2xl font-semibold">Filter your results</h1>
                    <div className="pt-8 flex flex-row justify-between">
                        <h1>Min # of ratings</h1>
                        <h1>≥ {courseFilters.minRatings} ratings</h1>
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
[&::-moz-range-thumb]:border-primary
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
[&::-moz-range-track]:rounded-full" id="steps-range-slider-usage" min="0" max="9" step="1" value={slider} onChange={handleSliderChange}></input>
                    <button onClick={resetFilter} type="button" className="mt-12 py-3 px-4 gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Reset Filter
                    </button>
                </div>
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>

                <nav suppressHydrationWarning className="flex space-x-2" aria-label="Tabs" role="tablist">
                    <button suppressHydrationWarning onClick={() => { resetFilter(); setActiveTab(1); setVisibleCount(50) }} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center ${activeTab === 1 ? 'text-slate-900' : 'text-gray-200'} hover:text-slate-800 rounded-lg disabled:opacity-50 disabled:pointer-events-none ${activeTab === 1 ? 'dark:text-white' : 'text-gray-400'} dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`} id="equal-width-elements-item-1" data-hs-tab="#equal-width-elements-1" aria-controls="equal-width-elements-1" role="tab">
                        Courses ({sortedCourses.length})
                    </button>
                    <button suppressHydrationWarning onClick={() => { resetFilter(); setActiveTab(2); setVisibleCount(50) }} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center ${activeTab === 2 ? 'text-slate-900' : 'text-gray-200'} hover:text-slate-800 rounded-lg disabled:opacity-50 disabled:pointer-events-none ${activeTab === 2 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`} data-hs-tab="#equal-width-elements-2" aria-controls="equal-width-elements-2" role="tab">
                        Instructors ({sortedInstructors.length})
                    </button>
                </nav>

                <div id="equal-width-elements-1" className={activeTab === 1 ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-1">
                    <div className="flex flex-col pt-6">
                        <div className="overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th onClick={() => { handleCourseSort('course_code') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course Code {(courseSortField === 'course_code' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'course_code' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleCourseSort('course_title') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course Name {(courseSortField === 'course_title' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'course_title' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleCourseSort('total_reviews') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Ratings {(courseSortField === 'total_reviews' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'total_reviews' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleCourseSort('useful') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Useful {(courseSortField === 'useful' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'useful' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleCourseSort('easy') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Easy {(courseSortField === 'easy' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'easy' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleCourseSort('liked') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Liked {(courseSortField === 'liked' && courseOrder === 'desc') ? ('˅') : (null)} {(courseSortField === 'liked' && courseOrder === 'asc') ? ('˄') : (null)}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedCourses.slice(0, visibleCount).map((course, index) => (
                                                <tr key={index} className="odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 underline">
                                                        <Link href={`/course/${course.course_code.replace(/\s+/g, '')}`}>
                                                            {course.course_code}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.course_title}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.total_reviews}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.useful || course.useful === 0 ? (course.useful) : ('N/A')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.easy || course.easy === 0 ? (course.easy) : ('N/A')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{course.liked || course.liked === 0 ? (course.liked) : ('N/A')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div ref={loaderRef} style={{ height: "20px" }}></div>
                                </div>
                            </div>
                        </div>
                        <h1 className={`p-6 flex-1 ${filteredCourses.length !== 0 ? ('hidden') : (null)}`}>No courses found matching your criteria. Try adjusting your courseFilters to broaden your search. Consider using less specific terms.</h1>
                    </div>
                </div>

                <div id="equal-width-elements-1" className={activeTab === 2 ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-1">
                    <div className="flex flex-col pt-6">
                        <div className="overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th onClick={() => { handleInstructorSort('instructor_name') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Instructor Name {(instructorSortField === 'instructor_name' && instructorOrder === 'desc') ? ('˅') : (null)} {(instructorSortField === 'instructor_name' && instructorOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleInstructorSort('total_reviews') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Ratings {(instructorSortField === 'total_reviews' && instructorOrder === 'desc') ? ('˅') : (null)} {(instructorSortField === 'total_reviews' && instructorOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleInstructorSort('clear') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Clear {(instructorSortField === 'clear' && instructorOrder === 'desc') ? ('˅') : (null)} {(instructorSortField === 'clear' && instructorOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleInstructorSort('engaging') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Engaging {(instructorSortField === 'engaging' && instructorOrder === 'desc') ? ('˅') : (null)} {(instructorSortField === 'engaging' && instructorOrder === 'asc') ? ('˄') : (null)}</th>
                                                <th onClick={() => { handleInstructorSort('liked') }} scope="col" className="hover:cursor-pointer underline px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Liked {(instructorSortField === 'liked' && instructorOrder === 'desc') ? ('˅') : (null)} {(instructorSortField === 'liked' && instructorOrder === 'asc') ? ('˄') : (null)}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedInstructors.slice(0, visibleCount).map((instructor, index) => (
                                                <tr key={index} className="odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 underline">
                                                        <Link href={`/instructor/${instructor.instructor_name.replace(/\s+/g, '%20')}`}>
                                                            {instructor.instructor_name}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{instructor.total_reviews}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{instructor.clear || instructor.clear === 0 ? (instructor.clear) : ('N/A')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{instructor.engaging || instructor.engaging === 0 ? (instructor.engaging) : ('N/A')}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{instructor.liked || instructor.liked === 0 ? (instructor.liked) : ('N/A')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div ref={loaderRef} style={{ height: "20px" }}></div>
                                </div>
                            </div>
                        </div>
                        <h1 className={`p-6 flex-1 ${filteredCourses.length !== 0 ? ('hidden') : (null)}`}>No courses found matching your criteria. Try adjusting your courseFilters to broaden your search. Consider using less specific terms.</h1>
                    </div>
                </div>
            </div>
        </>
    );
}