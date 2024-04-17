// SignUpPopup.tsx
import React, { useRef, useEffect, useState } from 'react';
import { signUp } from '@/utils/supabase/authActions'

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
    } else {
      setSignUpError(result.message);
    }
};

  const handleLogInClick = () => {
    toggleLogIn();
    onClose();
  }

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
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-black"
        onSubmit={handleSignUp}
      >
        <label className="text-5xl font-bold mb-5">
            Sign Up
        </label>
        {signUpError && 
            <p className="p-2 bg-red-500 text-white text-center">{signUpError}</p>
        }
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="first name"
          placeholder="First Name"
          required
        />
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="last name"
          placeholder="Last Name"
          required
        />
        <select
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="program"
          value={selectedProgram}
          onChange={handleProgramChange}
          required
        >
          <option value="" disabled>
            Select your program
          </option>
          {programOptions.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="Email"
          required
        />

        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button
          formAction={signUp}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground"
        >
          Sign Up
        </button>
        <div
            onClick={handleLogInClick}
            className="mb-5 flex justify-center text-blue-500 cursor-pointer"
            >
            Already a Laurier Flow user? Log In.
        </div>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
