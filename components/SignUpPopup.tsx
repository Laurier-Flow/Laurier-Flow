// SignUpPopup.tsx
import React, { useRef, useEffect, useState } from 'react';
import { signUp } from '@/utils/supabase/authActions'
import Link from 'next/link';

export const programOptions = [
  'Computer Science',
  'Engineering',
  'Business Administration',
];

export default function SignUpPopup({
  searchParams,
  onClose,
  toggleLogIn,
}: {
  searchParams: { message: string };
  onClose: () => void;
  toggleLogIn: () => void;
}): React.ReactElement {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [signUpError, setSignUpError] = useState<string>('');

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

  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgram(event.target.value);
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = await signUp(formData);

    if (result.success) {
      onClose()
      location.reload()
    } else {
      setSignUpError(result.message);
    }
  };

  const handleLogInClick = () => {
    toggleLogIn();
    onClose();
  }

  return (
    <div ref={popupRef} className="overflow-y-auto max-h-[90vh] border-2 border-slate-600 dark:border-slate-800 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-xl p-8 w-11/12">
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
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={handleSignUp}
        onChange={() => setSignUpError('')}
      >
        <label className="text-3xl font-bold mb-5 text-foreground">
          Sign Up
        </label>
        {signUpError &&
          <p className="rounded-md p-2 mb-2 bg-red-500 text-white text-center">{signUpError}</p>
        }
        <div className="flex flex-row gap-4 mb-2">
          <input
            className="w-1/2 rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
            name="first name"
            placeholder="First Name"
            required
          />
          <input
            className="w-1/2 rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
            name="last name"
            placeholder="Last Name"
            required
          />
        </div>
        <select
          className="mb-2 rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 text-stone-600 dark:text-gray-400 placeholder-stone-400 dark:placeholder-gray-400"
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
          className="mb-2 rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
          name="email"
          placeholder="Email"
          required
        />

        <input
          className="mb-4 rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-stone-400 dark:placeholder-gray-400"
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
          onClick={handleLogInClick}
          className="flex justify-center text-foreground"
        >
          <h1>Already have an account? <span onClick={handleLogInClick} className="cursor-pointer underline underline-offset-2 decoration-1">Log In</span></h1>
        </div>
      </form>
    </div>
  );
}
