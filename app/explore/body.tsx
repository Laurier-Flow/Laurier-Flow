'use client'

import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { SetStateAction, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { courseInfoDBResponseExplore } from "./page";
import Link from "next/link";

export default function Body({ currentTerm, nextTerm, courses }: { currentTerm: string, nextTerm: string, courses: courseInfoDBResponseExplore[] }) {
    const searchParams = useSearchParams()
    const subject = searchParams.get('subject') || 'all'
    const [filteredCourses, setFilteredCourses] = useState(courses)
    const [page, setPage] = useState(0)
    const loaderRef = useRef(null)

    //Filters
    const [filters, setFilters] = useState({
        firstYear: true,
        secondYear: true,
        thirdYear: true,
        fourthYear: true,
        seniorYear: true,
        minRatings: 0,
        thisTerm: false,
        afterTerm: false
    });

    const [slider, setSlider] = useState(0)
    const [ignoreNextFetch, setIgnoreNextFetch] = useState(false)

    /*
    const fetchMoreCourses = useCallback(async () => {
        if (!ignoreNextFetch || page === 0) {
            const queryString = Object.entries(filters)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');

            const url = `/explore/api?${queryString}&subject=${subject}&nextTerm=${nextTermServer}&currentTerm=${currentTermServer}`;

            const response = await fetch(url);
            if (response.ok) {
                const newCourses = await response.json();
                setCourses(c => [...c, ...newCourses.data]);
                setCourseTotal(newCourses.totalCount)
                setPage(p => p + 1);
            } else {
                console.error('Failed to fetch more courses');
            }
        }
        setIgnoreNextFetch(false)
    }, [page, ignoreNextFetch]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting) {
                fetchMoreCourses();
            }
        }, { threshold: 0.1, rootMargin: "200px" });

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => observer.disconnect();
    }, [page, fetchMoreCourses]);
    */

    const handleSliderChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        const val = e.target.value
        setSlider(Number(val))

        switch (val) {
            case '0':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 0
                }));
                break;
            case '1':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 1
                }));
                break;
            case '2':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 5
                }));
                break;
            case '3':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 10
                }));
                break;
            case '4':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 20
                }));
                break;
            case '5':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 50
                }));
                break;
            case '6':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 75
                }));
                break;
            case '7':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 100
                }));
                break;
            case '8':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 200
                }));
                break;
            case '9':
                setFilters(prevFilters => ({
                    ...prevFilters,
                    minRatings: 500
                }));
                break;
        }
    }

    const resetFilter = () => {
        setFilters(({
            firstYear: true,
            secondYear: true,
            thirdYear: true,
            fourthYear: true,
            seniorYear: true,
            minRatings: 0,
            thisTerm: false,
            afterTerm: false,
        }));
    };

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
                <div className="flex flex-col p-6">
                    <h1 className="text-2xl font-semibold">Filter your results</h1>
                    <h1 className="pt-8">Course Code</h1>
                    <div className="pt-2 flex flex-row">
                        <button onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            firstYear: !filters.firstYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${filters.firstYear ? ('dark:bg-primary') : (null)}`}>1XX</button>
                        <button onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            secondYear: !filters.secondYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${filters.secondYear ? ('dark:bg-primary') : (null)} ml-4`}>2XX</button>
                        <button onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            thirdYear: !filters.thirdYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${filters.thirdYear ? ('dark:bg-primary') : (null)} ml-4`}>3XX</button>
                        <button onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            fourthYear: !filters.fourthYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${filters.fourthYear ? ('dark:bg-primary') : (null)} ml-4`}>4XX</button>
                        <button onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            seniorYear: !filters.seniorYear
                        }))} className={`inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-md font-medium text-white border-2 border-primary ${filters.seniorYear ? ('dark:bg-primary') : (null)} ml-4`}>5XX+</button>
                    </div>
                    <div className="pt-8 flex flex-row justify-between">
                        <h1>Min # of ratings</h1>
                        <h1>≥ {filters.minRatings} ratings</h1>
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
                            <input type="checkbox" className="scale-150 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={() => setFilters(prevFilters => ({
                                ...prevFilters,
                                thisTerm: false,
                                afterTerm: false
                            }))} checked={(!filters.thisTerm && !filters.afterTerm)} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">All terms</h1>
                        </div>

                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 ml-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={() => setFilters(prevFilters => ({
                                ...prevFilters,
                                thisTerm: !filters.thisTerm
                            }))} checked={filters.thisTerm} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">This term ({currentTerm})</h1>
                        </div>

                        <div className="flex flex-row items-center">
                            <input type="checkbox" className="scale-150 ml-8 shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-default-checkbox" onChange={() => setFilters(prevFilters => ({
                                ...prevFilters,
                                afterTerm: !filters.afterTerm
                            }))} checked={filters.afterTerm} />
                            <h1 className="text-lg text-gray-500 ms-4 dark:text-gray-400">Next term ({nextTerm})</h1>
                        </div>
                    </div>

                    <button onClick={resetFilter} type="button" className="mt-12 py-3 px-4 gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Reset Filter
                    </button>
                </div>
                <hr className="mt-8 mb-8 border-gray-300 dark:border-gray-800"></hr>

                <div className="flex flex-col">
                    <div className="overflow-x-auto">
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
                                            <tr key={index} className="odd:bg-white even:bg-gray-100 dark:odd:bg-slate-950 dark:even:bg-slate-900">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
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
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className={`p-6 flex-1 ${filteredCourses.length !== 0 ? ('hidden') : (null)}`}>No courses found matching your criteria. Try adjusting your filters to broaden your search. Consider using less specific terms.</h1>
            </div>
        </>
    );
}