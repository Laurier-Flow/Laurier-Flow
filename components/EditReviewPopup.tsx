import React, { useRef, useEffect, useState } from 'react';
import { handleCourseReviewEdit, handleInstructorReviewEdit } from '@/app/profile/EditReviewActions';
import { X } from "lucide-react";

export default function EditReviewPopup({
    onClose,
    instructors,
    courseName,
    isInstructor,
    easyRating,
    usefulRating,
    likedRating,
    textBody,
    id,
    instructorSelected
}: {
    onClose: () => void,
    instructors: Set<string>,
    courseName: string,
    isInstructor: boolean,
    easyRating: number,
    usefulRating: number,
    likedRating: number,
    textBody: string,
    id: string,
    instructorSelected: string
}): React.ReactElement {
    const popupRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
            document.body.classList.remove('overflow-hidden')
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            handleClickOutside(event);
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleClickOutside]);

    const instructorArray = Array.from(instructors)
    const [easyHover, setEasyHover] = useState(easyRating);
    const [usefulHover, setUsefulHover] = useState(usefulRating);
    const [easy, setEasy] = useState(easyRating);
    const [useful, setUseful] = useState(usefulRating);
    const [liked, setLiked] = useState(likedRating);
    const [instructor, setInstructor] = useState(instructorSelected || 'Other')
    const [text, setText] = useState(textBody);

    const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        const newText = event.target.value
        if (newText.length <= 1000) {
            setText(newText);
        }
    }

    const submitEditReview = async (easy: number, useful: number, liked: number, instructor: string, text: string, courseName: string) => {
        if (isInstructor) {
            handleInstructorReviewEdit(easy, useful, liked, instructor === 'Other' ? null : instructor, text, id)
        } else {
            handleCourseReviewEdit(easy, useful, liked, instructor === 'Other' ? null : instructor, text, id)
        }
        onClose()
        window.location.href = window.location.href.split('?')[0] + '?upd=' + new Date().getTime();
    }

    return (
        <div ref={popupRef} className={`transform transition-all duration-500 ${isVisible ? 'opacity-100 -translate-y-1/2' : 'opacity-0 -translate-y-2/3'} overflow-y-auto max-h-[90vh] border-2 dark:border-secondary fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-xl w-11/12`}>
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center dark:text-white"
                action={() => submitEditReview(easy, useful, liked, instructor, text, courseName)}
            >
                <div className='p-2 flex justify-between'>
                    <label className="text-xl font-bold pl-2 mt-1">
                        Edit Review
                    </label>
                    <button onClick={onClose} type="button" className="py-2 px-4 inline-flex items-center">
                        <X />
                    </button>
                </div>
                <hr className="md:inline border-gray-300 dark:border-gray-800"></hr>
                <div className='p-4 flex flex-col justify-between'>
                    <div className="flex flex-col flex-1 text-xl font-medium">
                        <label htmlFor="hs-select-label" className="block text-sm font-medium mb-2 dark:text-white">Which {isInstructor ? ('course') : ('instructor')} did you have?</label>
                        <select value={instructor}
                            onChange={(e) => setInstructor(e.target.value)} id="hs-select-label" className="py-2 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-amber-300 focus:ring-amber-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                            {instructorArray.map((instructor, index) => (
                                instructor !== null && instructor !== "" && <option key={index}>{instructor}</option>
                            ))}
                            <option>Other</option>
                        </select>

                        <div className='flex flex-col justify-around sm:flex-row mt-8 p-4 rounded-lg border dark:border-gray-700 dark:bg-slate-900'>
                            <div className='pb-4 self-center sm:self-start sm:pb-0'>
                                <label className='text-sm'>{isInstructor ? ('Clear') : ('Easy')}</label>
                                <div className="flex items-center py-2">
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(1)} onClick={() => setEasy(1)} type="button" className={`${easy > 0 ? 'text-secondary' : 'text-gray-300'} ${(easy > 0) || (easyHover > 0) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(2)} onClick={() => setEasy(2)} type="button" className={`${easy > 1 ? 'text-secondary' : 'text-gray-300'} ${(easy > 1) || (easyHover > 1) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(3)} onClick={() => setEasy(3)} type="button" className={`${easy > 2 ? 'text-secondary' : 'text-gray-300'} ${(easy > 2) || (easyHover > 2) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(4)} onClick={() => setEasy(4)} type="button" className={`${easy > 3 ? 'text-secondary' : 'text-gray-300'} ${(easy > 3) || (easyHover > 3) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(5)} onClick={() => setEasy(5)} type="button" className={`${(easy > 4) || (easyHover > 4) ? 'text-secondary' : 'text-gray-300'} ${(easy > 4) || (easyHover > 4) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5 " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <hr className="sm:hidden border-gray-300 dark:border-gray-700"></hr>

                            <div className='self-center sm:self-start py-4 sm:py-0 sm:px-8 sm:border-x dark:border-gray-700'>
                                <label className='text-sm'>{isInstructor ? ('Engaging') : ('Useful')}</label>
                                <div className="flex items-center pt-2 py-2">
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(1)} onClick={() => setUseful(1)} type="button" className={`${useful > 0 ? 'text-secondary' : 'text-gray-300'} ${(useful > 0) || (usefulHover > 0) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(2)} onClick={() => setUseful(2)} type="button" className={`${useful > 1 ? 'text-secondary' : 'text-gray-300'} ${(useful > 1) || (usefulHover > 1) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(3)} onClick={() => setUseful(3)} type="button" className={`${useful > 2 ? 'text-secondary' : 'text-gray-300'} ${(useful > 2) || (usefulHover > 2) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(4)} onClick={() => setUseful(4)} type="button" className={`${useful > 3 ? 'text-secondary' : 'text-gray-300'} ${(useful > 3) || (usefulHover > 3) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(5)} onClick={() => setUseful(5)} type="button" className={`${(useful > 4) || (usefulHover > 4) ? 'text-secondary' : 'text-gray-300'} ${(useful > 4) || (usefulHover > 4) ? 'text-secondary dark:text-secondary' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-secondary disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-secondary`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5 " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <hr className="sm:hidden border-gray-300 dark:border-gray-700"></hr>

                            <div className="self-center sm:self-start inline-flex rounded-lg shadow-sm pt-4 sm:pb-0">
                                <button onClick={() => setLiked(1)} type="button" className={`py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${liked ? 'bg-white dark:bg-slate-600' : 'bg-neutral-300 dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                </button>
                                <button onClick={() => setLiked(0)} type="button" className={`py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 text-gray-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none ${!liked ? 'bg-white dark:bg-slate-600' : 'bg-neutral-300 dark:bg-slate-900'} dark:border-gray-700 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}>
                                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className='flex flex-1 flex-col pt-8'>
                        <div className="flex justify-between items-center">
                            <label htmlFor="hs-textarea-with-corner-hint" className="block text-sm font-medium mb-2 dark:text-white">Share your thoughts</label>
                            <span className="block text-sm text-gray-500 mb-2">{1000 - text.length} characters left</span>
                        </div>
                        <textarea onChange={handleTextChange} value={text} id="hs-textarea-with-corner-hint" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-md focus:border-amber-300 focus:ring-amber-400 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" rows={3} placeholder="Say something..."></textarea>
                    </div>
                </div>
                <div className='p-4 flex flex-row-reverse'>
                    <button type="submit" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-secondary dark:text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
