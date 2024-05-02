'use client'

import { User } from "@supabase/supabase-js"
import { UserNav } from "./UserProfileNav"
import { Button } from "@/components/ui/button"
import { useManageBodyScroll, usePopupManager } from "./Header"
import LoginPopup from "./LoginPopup"
import SignUpPopup from "./SignUpPopup"

export default function HomeHeader({ user }: { user: User | null }) {
    const {
        showLoginPopup,
        toggleLoginPopup,
        showSignUpPopup,
        toggleSignUpPopup,
    } = usePopupManager()

    useManageBodyScroll(showLoginPopup || showSignUpPopup)

    return (
        <>
            <div className='flex flex-row justify-between md:hidden p-6 z-[100]'>
                <span className="font-bold z-[100]">
                    Laurier Flow
                </span>
                {user ? (<UserNav user={user} />) : (<Button
                    onClick={toggleLoginPopup}
                    variant='outline'
                    className="z-[150]"
                >
                    Login
                </Button>)}
            </div>
            {showLoginPopup && !showSignUpPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[200] md:hidden">
                    <LoginPopup
                        searchParams={{ message: '' }}
                        onClose={toggleLoginPopup}
                        toggleSignUp={toggleSignUpPopup}
                    />
                </div>
            )}
            {showSignUpPopup && !showLoginPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[200] md:hidden">
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