'use client'

import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactFragment, ReactPortal, SetStateAction, useEffect, useState } from "react";
import DaysDisplay from "./DaysDisplay";

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

function CourseSchedule({
    nextTerm,
    currentTerm,
    previousTerm,
    nextTermSections,
    currentTermSections,
    previousTermSections
}: {
    nextTerm: any;
    currentTerm: any;
    previousTerm: any;
    nextTermSections: any[];
    currentTermSections: any[];
    previousTermSections: any[];
}) {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl">Course Schedule</h1>

            <nav suppressHydrationWarning className="flex space-x-2 pt-4" aria-label="Tabs" role="tablist">
                <button suppressHydrationWarning onClick={() => handleTabClick(1)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center text-gray-500 hover:text-blue-600 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 1 ? 'active' : ''}`} id="equal-width-elements-item-1" data-hs-tab="#equal-width-elements-1" aria-controls="equal-width-elements-1" role="tab">
                    {nextTerm}
                </button>
                <button suppressHydrationWarning onClick={() => handleTabClick(2)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center text-gray-500 hover:text-blue-600 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 2 ? 'active' : ''}`} data-hs-tab="#equal-width-elements-2" aria-controls="equal-width-elements-2" role="tab">
                    {currentTerm}
                </button>
                <button suppressHydrationWarning onClick={() => handleTabClick(3)} type="button" className={`hs-tab-active:bg-blue-600 hs-tab-active:text-white hs-tab-active:hover:text-white hs-tab-active:dark:text-white py-3 px-4 text-center basis-0 grow inline-flex justify-center items-center gap-x-2 bg-transparent text-sm font-medium text-center text-gray-500 hover:text-blue-600 rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:text-gray-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ${activeTab === 3 ? 'active' : ''}`} data-hs-tab="#equal-width-elements-3" aria-controls="equal-width-elements-3" role="tab">
                    {previousTerm}
                </button>
            </nav>

            <div className="mt-3 pl-4 pr-4">
                <div id="equal-width-elements-1" className={activeTab === 1 ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-1">
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">CRN</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Type</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Section</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Campus</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Time</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Location</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {nextTermSections.length ? (nextTermSections.map((item: { crn: string; type: string; section: string; campus: string; enrollment: string; enrollementMax: string; beginTime: string; endTime: string; days: any }) => (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.crn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.section}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.campus}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.enrollment + '/' + item.enrollementMax}</td>
                                                    {item.beginTime ? (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{convertTo12HourFormat(item.beginTime) + ' - ' + convertTo12HourFormat(item.endTime)}</td>
                                                    ) : (<></>)}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"><DaysDisplay days={item.days} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">No Sections Found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div id="equal-width-elements-2" className={activeTab === 2 ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-2">
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
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
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {currentTermSections.length ? (currentTermSections.map((item: { crn: string; type: string; section: string; campus: string; enrollment: string; enrollementMax: string; beginTime: string; endTime: string; days: any }) => (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.crn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.section}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.campus}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.enrollment + '/' + item.enrollementMax}</td>
                                                    {item.beginTime ? (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{convertTo12HourFormat(item.beginTime) + ' - ' + convertTo12HourFormat(item.endTime)}</td>
                                                    ) : (<></>)}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"><DaysDisplay days={item.days} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">No Sections Found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div id="equal-width-elements-3" className={activeTab === 3 ? '' : 'hidden'} role="tabpanel" aria-labelledby="equal-width-elements-item-3">
                    <div className="flex flex-col">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">CRN</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Type</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Section</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Campus</th>
                                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Time</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Location</th>
                                                <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Instructor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {previousTermSections.length ? (previousTermSections.map((item: { crn: string; type: string; section: string; campus: string; enrollment: string; enrollementMax: string; beginTime: string; endTime: string; days: any }) => (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.crn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.section}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.campus}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.enrollment + '/' + item.enrollementMax}</td>
                                                    {item.beginTime ? (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{convertTo12HourFormat(item.beginTime) + ' - ' + convertTo12HourFormat(item.endTime)}</td>
                                                    ) : (<></>)}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"><DaysDisplay days={item.days} /></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200"></td>
                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">No Sections Found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseSchedule;