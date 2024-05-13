'use client'

import { User } from "@supabase/supabase-js"
import { UserNav } from "./UserProfileNav"
import { Button } from "@/components/ui/button"
import { useManageBodyScroll, usePopupManager } from "./Header"
import LoginPopup from "./LoginPopup"
import SignUpPopup from "./SignUpPopup"
import Image from "next/image"
import PasswordPopup from "./PasswordPopup"

export default function HomeHeader({ user }: { user: User | null }) {
	const {
		showLoginPopup,
		toggleLoginPopup,
		showSignUpPopup,
		toggleSignUpPopup,
		showPasswordPopup,
		togglePasswordPopup
	} = usePopupManager()

    useManageBodyScroll(showLoginPopup || showSignUpPopup || showPasswordPopup)

    return (
        <>
            <div className={`flex flex-row justify-between items-center md:max-w-6xl w-full mx-auto p-6 z-[100] ${user ? ('flex') : ('md:hidden')}`}>
                <Image className="mr-4 z-[100]" src="/icon.png" width={50} height={50} alt="Laurier Flow" />
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
                        togglePasswordReset={togglePasswordPopup}
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
            {showPasswordPopup && !showLoginPopup && !showLoginPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[200] md:hidden">
                    <PasswordPopup
                        searchParams={{ message: '' }}
                        onClose={togglePasswordPopup}
                        toggleLogIn={toggleLoginPopup}
                    />
                </div>
            )}
        </>
    )
}
