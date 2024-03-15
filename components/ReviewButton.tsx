'use client'

import { User } from "@supabase/supabase-js"
import { useState } from "react";
import LoginPopup from "./LoginPopup";
import SignUpPopup from "./SignUpPopup";
import { useManageBodyScroll, usePopupManager } from "./Header";

export default function ReviewButton({
    user
}: {
    user: User | null
}) {
    const [currentUser, setcurrentUser] = useState<User | null>(user);
    const [showAddReviewPopup, setShowAddReviewPopup] = useState<boolean>(false);

    const {
        showLoginPopup,
        toggleLoginPopup,
        showSignUpPopup,
        toggleSignUpPopup,
    } = usePopupManager();

    useManageBodyScroll(showLoginPopup || showSignUpPopup);

    const toggleAddReviewPopup = () => {
        setShowAddReviewPopup(!showAddReviewPopup);
    };

    return (user ? (
        <>
            <button onClick={toggleAddReviewPopup} type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent dark:bg-primary bg-amber-400 dark:text-white hover:bg-amber-700 hover:dark:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                Add your review
            </button>
            {showAddReviewPopup ? (
                <>ADD A REVIEW</>
            ) : (
                null
            )}
        </>
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
                        currentUser={currentUser}
                        setCurrentUser={setcurrentUser}
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