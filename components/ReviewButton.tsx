'use client'

import { User } from "@supabase/supabase-js"
import { useState } from "react";
import LoginPopup from "./LoginPopup";
import SignUpPopup from "./SignUpPopup";
import { useManageBodyScroll, usePopupManager } from "./Header";
import AddReview from "@/app/course/AddReview";
import AddReviewPopup from "./AddReviewPopup";

export default function ReviewButton({
    user
}: {
    user: User | null
}) {
    const [showAddReviewPopup, setShowAddReviewPopup] = useState<boolean>(false);

    const {
        showLoginPopup,
        toggleLoginPopup,
        showSignUpPopup,
        toggleSignUpPopup,
    } = usePopupManager();

    useManageBodyScroll(showLoginPopup || showSignUpPopup || showAddReviewPopup);

    const toggleAddReviewPopup = () => {
        setShowAddReviewPopup(!showAddReviewPopup);
    };

    return (user ? (
        (user.confirmed_at ? (
            <>
                <button onClick={toggleAddReviewPopup} type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent dark:bg-primary bg-amber-400 dark:text-white hover:bg-amber-700 hover:dark:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    Add your review
                </button>
                {showAddReviewPopup ? (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <AddReviewPopup onClose={toggleAddReviewPopup} />
                    </div>
                ) : (
                    null
                )}
            </>
        ) : (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500" role="alert">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="flex-shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <div className="ms-4">
                        <h3 className="text-sm font-semibold">
                            Email not authenticated
                        </h3>
                        <div className="mt-1 text-sm text-yellow-700">
                            We need to confirm you're a Laurier student! Check your mylaurier inbox for a confirmation link so we can be sure, then you can access all features of the site
                        </div>
                    </div>
                </div>
            </div>
        )
        )
    ) : (
        <>
            <button onClick={toggleLoginPopup} type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent dark:bg-primary bg-amber-400 dark:text-white hover:bg-amber-700 hover:dark:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                Add your review
            </button>
            {showLoginPopup && !showSignUpPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <LoginPopup
                        searchParams={{ message: '' }}
                        onClose={toggleLoginPopup}
                        toggleSignUp={toggleSignUpPopup}
                    />
                </div>
            )}
            {showSignUpPopup && !showLoginPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <SignUpPopup
                        searchParams={{ message: '' }}
                        onClose={toggleSignUpPopup}
                        toggleLogIn={toggleLoginPopup}
                    />
                </div>
            )}
        </>
    )
    )

}