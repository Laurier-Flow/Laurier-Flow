'use client'

import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { handleChangePassword } from "./ChangeAuthAction";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface ToggleVisibilityButtonProps {
    
    visible: boolean;
    toggleVisibility: () => void;
    className?: string;
    }

    const ToggleVisibilityButton: React.FC<ToggleVisibilityButtonProps> = ({
    visible,
    toggleVisibility,
    className,
    }) => {
    return (
        <button onClick={toggleVisibility} className={`focus:outline-none ${className}`}>
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
    );
};

export default function Body() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showTopPassword, setShowTopPassword] = useState<boolean>(false);
    const [showBottomPassword, setShowBottomPassword] = useState<boolean>(false);

    const handleChangeClick = async () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const result = await handleChangePassword(password);

        if (result) {
            setErrorMessage(result.message);
        }
    }

    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            {
            <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-6'>
                <h1 className="text-3xl md:text-4xl font-bold text-background dark:text-foreground">
                    Change Password
                </h1>
                <div className="flex flex-col gap-4 w-full max-w-md">
                    {errorMessage &&
                        <p className="rounded-md p-2 mb-2 bg-red-500 text-white text-center">{errorMessage}</p>
                    }
                    <div className="relative flex">
                        <input
                            className="flex-1 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                            type={showTopPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: '2rem' }}
                            required
                        />
                        <ToggleVisibilityButton
                            visible={showTopPassword}
                            toggleVisibility={() => setShowTopPassword(!showTopPassword)}
                            className="absolute right-0 inset-y-0 flex items-center pr-3"
                        />
                    </div>
                    <div className="relative flex">
                        <input
                            className="flex-1 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                            type={showBottomPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <ToggleVisibilityButton
                            visible={showBottomPassword}
                            toggleVisibility={() => setShowBottomPassword(!showBottomPassword)}
                            className="absolute right-0 inset-y-0 flex items-center pr-3"
                        />
                    </div>
                    <button onClick={handleChangeClick} type="button" className="w-full py-2 px-6 text-base font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white transition-all duration-1000 ease-in-out">
                        <h1>Confirm</h1>
                    </button>
                </div>
            </div >
            }
        </BackgroundGradientAnimation >
    )

}