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
        <div ref={popupRef} className="border-2 border-slate-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur rounded-md p-8 max-w-5xl w-11/12">
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-white"
            >
                <label className="text-5xl font-bold mb-5">
                    Add Review
                </label>
            </form>
        </div>
    );
}
