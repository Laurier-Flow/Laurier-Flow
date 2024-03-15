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

    return (
        <div ref={popupRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-8 max-w-md w-full">
            <div
                className="absolute right-4 top-4 py-2 px-4 rounded-md no-underline text-foreground text-black bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
                onClick={onClose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>{' '}
            </div>

            <form
                className="flex-1 flex flex-col w-full justify-center gap-2 text-black"
            >
                <label className="text-5xl font-bold mb-5">
                    Add Review
                </label>
            </form>
        </div>
    );
}
