// SignUpPopup.tsx
import React, { useRef, useEffect, useState } from 'react';
import { signUp } from '@/utils/supabase/authActions'

const programOptions = [
    'Computer Science',
    'Engineering',
    'Business Administration',
];

export default function AddReviewPopup({
    onClose,
}: {
    onClose: () => void;
}): React.ReactElement {
    const popupRef = useRef<HTMLDivElement | null>(null);

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

    const [easyHover, setEasyHover] = useState(1);
    const [usefulHover, setUsefulHover] = useState(1);
    const [easy, setEasy] = useState(1);
    const [useful, setUseful] = useState(1);
    const [liked, setLiked] = useState(1);
    const [text, setText] = useState('');

    const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        const newText = event.target.value
        if (newText.length <= 1000) {
            setText(newText);
        }
    }

    return (
        <div ref={popupRef} className="border-2 border-slate-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-md max-w-xl w-11/12">
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center text-white"
            >
                <div className='p-2 flex justify-between'>
                    <label className="text-xl font-bold pl-2 mt-1">
                        Add Review
                    </label>
                    <button onClick={onClose} type="button" className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-400 dark:hover:text-primary dark:hover:border-primary dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Close
                    </button>
                </div>
                <hr className="md:inline border-gray-300 dark:border-gray-800"></hr>
                <div className='p-4 flex flex-col justify-between'>
                    <div className="flex flex-col flex-1 text-xl font-medium">
                        <label htmlFor="hs-select-label" className="block text-sm font-medium mb-2 dark:text-white">Instructor</label>
                        <select id="hs-select-label" className="py-2 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
                            <option selected>Open this select menu</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                        </select>

                        <div className='flex flex-col justify-around md:flex-row mt-8 p-4 rounded-lg border dark:border-gray-700 dark:bg-slate-900'>
                            <div className='pb-4 md:pb-0'>
                                <label className='text-sm'>Easy</label>
                                <div className="flex items-center py-2">
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(1)} onClick={() => setEasy(1)} type="button" className={`${easy > 0 ? 'text-yellow-400' : 'text-gray-300'} ${(easy > 0) || (easyHover > 0) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(2)} onClick={() => setEasy(2)} type="button" className={`${easy > 1 ? 'text-yellow-400' : 'text-gray-300'} ${(easy > 1) || (easyHover > 1) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(3)} onClick={() => setEasy(3)} type="button" className={`${easy > 2 ? 'text-yellow-400' : 'text-gray-300'} ${(easy > 2) || (easyHover > 2) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(4)} onClick={() => setEasy(4)} type="button" className={`${easy > 3 ? 'text-yellow-400' : 'text-gray-300'} ${(easy > 3) || (easyHover > 3) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setEasyHover(easy)} onMouseOver={() => setEasyHover(5)} onClick={() => setEasy(5)} type="button" className={`${(easy > 4) || (easyHover > 4) ? 'text-yellow-400' : 'text-gray-300'} ${(easy > 4) || (easyHover > 4) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5 " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className='py-4 md:py-0 md:px-8 border-y md:border-x md:border-y-0 dark:border-gray-700'>
                                <label className='text-sm'>Useful</label>
                                <div className="flex items-center pt-2 py-2">
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(1)} onClick={() => setUseful(1)} type="button" className={`${useful > 0 ? 'text-yellow-400' : 'text-gray-300'} ${(useful > 0) || (usefulHover > 0) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(2)} onClick={() => setUseful(2)} type="button" className={`${useful > 1 ? 'text-yellow-400' : 'text-gray-300'} ${(useful > 1) || (usefulHover > 1) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(3)} onClick={() => setUseful(3)} type="button" className={`${useful > 2 ? 'text-yellow-400' : 'text-gray-300'} ${(useful > 2) || (usefulHover > 2) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(4)} onClick={() => setUseful(4)} type="button" className={`${useful > 3 ? 'text-yellow-400' : 'text-gray-300'} ${(useful > 3) || (usefulHover > 3) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                    <button onMouseLeave={() => setUsefulHover(useful)} onMouseOver={() => setUsefulHover(5)} onClick={() => setUseful(5)} type="button" className={`${(useful > 4) || (usefulHover > 4) ? 'text-yellow-400' : 'text-gray-300'} ${(useful > 4) || (usefulHover > 4) ? 'dark:text-yellow-600' : 'dark:text-gray-600'} size-5 inline-flex justify-center items-center text-2xl rounded-full text-gray-300 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-600 dark:hover:text-yellow-500`}>
                                        <svg className="w-6 h-6 flex-shrink-0 size-5 " xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="inline-flex rounded-lg shadow-sm pt-4 md:pb-0">
                                <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                </button>
                                <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
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
                        <textarea onChange={handleTextChange} value={text} id="hs-textarea-with-corner-hint" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600" rows={3} placeholder="Say something..."></textarea>
                    </div>
                </div>
                <div className='p-4 flex flex-row-reverse'>
                    <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
