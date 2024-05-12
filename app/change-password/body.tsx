'use client'

import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { redirect, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { handleChangePassword, authenticateWithTokens } from "./ChangeAuthAction";
import { useEffect, useState } from "react";
import { useManageBodyScroll, usePopupManager } from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Body() {
    const searchParams = useSearchParams()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        setAccessToken(hashParams.get("access_token") || "");
    }, []);

    useEffect(() => {
        if (accessToken && refreshToken) {
            authenticateWithTokens(accessToken, refreshToken);
        }
    }, [accessToken, refreshToken]);

    useManageBodyScroll(showErrorPopup);

    const handleChangeClick = async () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setShowErrorPopup(true);
            return;
        }

        const error = await handleChangePassword(password)
        setErrorMessage(error)
        setShowErrorPopup(true)
    }

    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            {showErrorPopup ? (
                <div className="overflow-y-auto max-h-[90vh] border-2 dark:border-gray-600 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-md p-8 w-11/12 z-[100]">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-xl font-bold">{errorMessage}</h1>
                        <button onClick={() => router.push('/')} type="button" className="flex flex-row items-center justify-center gap-2 w-full mt-8 py-4 px-6 text-md font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white">
                            <h1>Signup again or login</h1>
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-6'>
                    <h1>{errorMessage}</h1>
                    <h1 className="text-3xl md:text-4xl font-bold text-background dark:text-foreground">
                        Change Password
                    </h1>
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        <input
                            className="rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            className="rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button onClick={handleChangeClick} type="button" className="w-full py-2 px-6 text-base font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white transition-all duration-1000 ease-in-out">
                            <h1>Confirm</h1>
                        </button>
                    </div>
                </div >
            )
            }
        </BackgroundGradientAnimation >
    )

}