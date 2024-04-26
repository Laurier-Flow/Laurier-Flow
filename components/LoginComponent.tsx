'use client'

import { signIn, signUp } from "@/utils/supabase/authActions";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { programOptions } from "./SignUpPopup";

export default function LoginComponent({ user }: { user: User | null }) {
    const [signup, setSignup] = useState(false)
    const [signUpError, setSignUpError] = useState<string>('')
    const [loginError, setLoginError] = useState<string>('')
    const [confirmMessage, setConfirmMessage] = useState(false)
    const [selectedProgram, setSelectedProgram] = useState('');

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = await signIn(formData);

        if (result.success) {
            location.reload()
        } else {
            setLoginError(result.message)
        }
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = await signUp(formData);

        if (result.success) {
            setConfirmMessage(true)
        } else {
            setSignUpError(result.message);
        }
    };

    const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgram(event.target.value);
    };

    return (!signup ? (
        <div className={`hidden ${user ? (null) : ('md:flex')} md:flex-col bg-background p-8 border-slate-800 border backdrop-blur rounded-md max-h-full overflow-auto w-1/2 lg:w-1/3`}>
            <form
                className="flex flex-col gap-4 text-foreground bg-background"
                onSubmit={handleLogin}
                onChange={() => setLoginError('')}
            >
                <label className="text-3xl font-bold mb-5 text-foreground">Log In</label>
                {loginError &&
                    <div className="my-2 bg-red-500 text-md text-white rounded-lg p-4" role="alert">
                        {loginError}
                    </div>
                }
                <input
                    className="rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                    name="email"
                    placeholder="Laurier Email"
                    required
                />

                <input
                    className="rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <div className="flex justify-end text-foreground cursor-pointer">
                    Forgot password?
                </div>
                <button className="bg-secondary rounded-md px-4 py-2 dark:text-foreground">
                    Log In
                </button>
                <div className="flex justify-center text-gray-500 text-sm mb-4">
                    <h1>Read our <Link href="/privacy" className='underline underline-offset-2'>Privacy Policy</Link></h1>
                </div>

                <hr className="mb-6 border-gray-300 dark:border-gray-800"></hr>

                <div className="flex justify-center text-foreground">
                    <h1>New to Laurier Flow? <span onClick={() => { setSignup(true); setLoginError('') }} className="cursor-pointer underline underline-offset-2 decoration-1">Sign Up</span></h1>
                </div>
            </form>
        </div>
    ) : (
        <div className={`hidden ${user ? (null) : ('md:flex')} md:flex-col bg-stone-100 dark:bg-background p-8 border-slate-800 border backdrop-blur rounded-md max-h-full overflow-auto w-1/2 lg:w-1/3`}>
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                onSubmit={handleSignUp}
                onChange={() => { setSignUpError(''); setConfirmMessage(false) }}
            >
                <label className="text-3xl font-bold mb-5 text-foreground">
                    Sign Up
                </label>
                {signUpError &&
                    <p className="rounded-md p-2 mb-2 bg-red-500 text-white text-center">{signUpError}</p>
                }
                {confirmMessage &&
                    <div className="my-2 bg-teal-500 text-md text-white rounded-lg p-4" role="alert">
                        <span className="font-bold">Success!</span> Check your inbox for a verification link then <span onClick={() => { setSignup(false); setSignUpError(''); setConfirmMessage(false) }} className="cursor-pointer underline underline-offset-2 decoration-1">login</span>
                    </div>
                }
                <div className="flex flex-row gap-4 mb-2">
                    <input
                        className="w-1/2 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
                        name="first name"
                        placeholder="First Name"
                        required
                    />
                    <input
                        className="w-1/2 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
                        name="last name"
                        placeholder="Last Name"
                        required
                    />
                </div>
                <select
                    className="mb-2 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 text-stone-600 dark:text-gray-400 placeholder-stone-400 dark:placeholder-gray-400"
                    name="program"
                    value={selectedProgram}
                    onChange={handleProgramChange}
                    required
                >
                    <option value="" disabled>
                        Select your program
                    </option>
                    {programOptions.map((program) => (
                        <option className="" key={program} value={program}>
                            {program}
                        </option>
                    ))}
                </select>
                <input
                    className="mb-2 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
                    name="email"
                    placeholder="Email"
                    required
                />

                <input
                    className="mb-4 rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <button
                    formAction={signUp}
                    className="mb-2 bg-secondary rounded-md px-4 py-2 text-foreground"
                >
                    Sign Up
                </button>

                <div className="flex justify-center text-gray-500 text-sm mb-4">
                    <h1>Read our <Link href="/privacy" className='underline underline-offset-2'>Privacy Policy</Link></h1>
                </div>

                <hr className="mb-6 border-gray-300 dark:border-gray-800"></hr>

                <div
                    onClick={() => setSignup(false)}
                    className="flex justify-center text-foreground"
                >
                    <h1>Already have an account? <span onClick={() => { setSignup(false); setSignUpError(''); setConfirmMessage(false) }} className="cursor-pointer underline underline-offset-2 decoration-1">Log In</span></h1>
                </div>
            </form>
        </div>
    )
    )
}

function setSelectedProgram(value: string) {
    throw new Error("Function not implemented.");
}
