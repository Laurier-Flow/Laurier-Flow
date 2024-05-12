'use client'

import { useEffect, useState } from "react";
import { section } from "./CourseSchedule";
import DaysDisplay from "./DaysDisplay";
import React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { useManageBodyScroll, usePopupManager } from "@/components/Header";
import LoginPopup from "@/components/LoginPopup";
import SignUpPopup from "@/components/SignUpPopup";

function ScheduleTab({
    activeTab,
    tabNumber,
    termSections,
    professor,
    user
}: {
    activeTab: number,
    tabNumber: number,
    termSections: section[],
    professor: boolean,
    user: User | null
}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [termSectionsVisible, setTermSectionVisible] = useState(termSections.slice(0, 11))

    useEffect(() => {
        setTermSectionVisible(termSections.slice(((currentPage - 1) * 10), ((currentPage - 1) * 10) + 10))
    }, [currentPage])

    const {
        showLoginPopup,
        toggleLoginPopup,
        showSignUpPopup,
        toggleSignUpPopup,
        showPasswordPopup,
        togglePasswordPopup
    } = usePopupManager();

    useManageBodyScroll(showLoginPopup || showSignUpPopup || showPasswordPopup);

    const pages = Math.ceil(termSections.length / 10)
    const pageButtons = []

    for (let i = 1; i <= pages; i++) {
        pageButtons.push(<button type="button" onClick={() => setCurrentPage(i)} className={`min-w-[40px] flex justify-center items-center text-gray-800 ${currentPage !== i ? ('hover:bg-gray-100') : (null)} py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none dark:text-white ${currentPage !== i ? ('dark:hover:bg-white/10') : (null)} ${currentPage === i ? ('bg-secondary') : (null)}`}>{i}</button>)
    }

    const handlePreviousPageClick = () => {
        if (currentPage !== 1) {
            setCurrentPage(p => p - 1)
        }
    }

    const handleNextPageClick = () => {
        if (currentPage !== pages) {
            setCurrentPage(p => p + 1)
        }
    }

    return (
        <>
            <div id="equal-width-elements-1" className={activeTab === tabNumber ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-1">
                <div className="flex flex-col">
                    <div className="-m-1.5 overflow-x-auto">
                        <div className="p-1.5 min-w-full inline-block align-middle overflow-x-auto">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">CRN</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Section</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Campus</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Time</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Location</th>
                                            {professor ? (
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course</th>
                                            ) : (
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {professor && !user ? (<tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                            <button className="underline" onClick={toggleLoginPopup}>
                                                Login to View
                                            </button>
                                        </td></tr>) : (
                                            termSectionsVisible.length ? (termSectionsVisible.map((item: section, index) => (
                                                <tr key={index} >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.crn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.section}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.campus}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.enrollment + '/' + item.enrollmentMax}</td>
                                                    {item.beginTime ? (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{convertTo12HourFormat(item.beginTime) + ' - ' + convertTo12HourFormat(item.endTime)}</td>
                                                    ) : (<td></td>)}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"><DaysDisplay days={item.days} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{(index === 0 && !user) ? (
                                                        <button className="underline" onClick={toggleLoginPopup}>
                                                            Login to View
                                                        </button>
                                                    ) : (
                                                        <h1>
                                                            {item.location}
                                                        </h1>
                                                    )}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200 ${item.instructor ? ('underline') : (null)}`}>{(index === 0 && !user) ? (
                                                        <button className="underline" onClick={toggleLoginPopup}>
                                                            Login to View
                                                        </button>
                                                    ) : (
                                                        <Link href={`/${professor ? ('course') : ('instructor')}/${item.instructor?.replace(/\s+/g, '%20')}`}>{item.instructor}</Link>
                                                    )}</td>
                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">No Sections Found</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {(termSections.length && ((professor && user) || !professor)) ?
                        <div className="pt-4 px-4">
                            <nav className="flex items-center space-x-1">
                                <button onClick={handlePreviousPageClick} type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
                                    <span aria-hidden="true">«</span>
                                    <span className="sr-only">Previous</span>
                                </button>
                                {pageButtons}
                                <button onClick={handleNextPageClick} type="button" className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10">
                                    <span className="sr-only">Next</span>
                                    <span aria-hidden="true">»</span>
                                </button>
                            </nav>
                        </div> : null
                    }
                </div>
            </div>
            {showLoginPopup && !showSignUpPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <LoginPopup
                        searchParams={{ message: '' }}
                        onClose={toggleLoginPopup}
                        toggleSignUp={toggleSignUpPopup}
                        togglePasswordReset={togglePasswordPopup}
                    />
                </div>
            )}
            {showSignUpPopup && !showLoginPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <SignUpPopup
                        searchParams={{ message: '' }}
                        onClose={toggleSignUpPopup}
                        toggleLogIn={toggleLoginPopup}
                    />
                </div>
            )}
        </>
    )
}

function convertTo12HourFormat(timeString: string | null | undefined) {
    if (!timeString) {
        return null;
    }
    const hours = timeString.slice(0, 2);
    const minutes = timeString.slice(2, 4)
    const parsedHours = parseInt(hours, 10);

    if (parsedHours >= 0 && parsedHours < 12) {
        return `${parsedHours === 0 ? 12 : parsedHours}:${minutes} AM`;
    } else if (parsedHours === 12) {
        return `12:${minutes} PM`;
    } else {
        return `${parsedHours - 12}:${minutes} PM`;
    }
}

export default function ScheduleTable({ nextTerm, currentTerm, previousTerm, nextTermSections, currentTermSections, previousTermSections, professor, user }: { nextTerm: string, currentTerm: string, previousTerm: string, nextTermSections: section[], currentTermSections: section[], previousTermSections: section[], professor: boolean, user: User | null }) {
    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }

    return (
        <>
            <nav suppressHydrationWarning className="flex space-x-2 pt-4" aria-label="Tabs" role="tablist">
                <button suppressHydrationWarning onClick={() => handleTabClick(1)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center ${activeTab === 1 ? 'text-slate-900' : 'text-gray-200'} hover:text-slate-800 rounded-lg disabled:opacity-50 disabled:pointer-events-none ${activeTab === 1 ? 'dark:text-white' : 'text-gray-400'} dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`} id="equal-width-elements-item-1" data-hs-tab="#equal-width-elements-1" aria-controls="equal-width-elements-1" role="tab">
                    {nextTerm}
                </button>
                <button suppressHydrationWarning onClick={() => handleTabClick(2)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center ${activeTab === 2 ? 'text-slate-900' : 'text-gray-200'} hover:text-slate-800 rounded-lg disabled:opacity-50 disabled:pointer-events-none ${activeTab === 2 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`} data-hs-tab="#equal-width-elements-2" aria-controls="equal-width-elements-2" role="tab">
                    {currentTerm}
                </button>
                <button suppressHydrationWarning onClick={() => handleTabClick(3)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center ${activeTab === 3 ? 'text-slate-900' : 'text-gray-200'} hover:text-slate-800 rounded-lg disabled:opacity-50 disabled:pointer-events-none ${activeTab === 3 ? 'dark:text-white' : 'text-gray-400'} dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 3 ? 'active' : ''}`} data-hs-tab="#equal-width-elements-3" aria-controls="equal-width-elements-3" role="tab">
                    {previousTerm}
                </button>
            </nav>

            <ScheduleTab termSections={nextTermSections} activeTab={activeTab} tabNumber={1} professor={professor} user={user} />
            <ScheduleTab termSections={currentTermSections} activeTab={activeTab} tabNumber={2} professor={professor} user={user} />
            <ScheduleTab termSections={previousTermSections} activeTab={activeTab} tabNumber={3} professor={professor} user={user} />
        </>
    )
}