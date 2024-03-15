// LoginPopup.jsx
import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { signIn, fetchUser } from '@/utils/supabase/authActions'
import { useRef, useEffect, useState } from 'react';
import SignUpPopup from './SignUpPopup';
import { User } from '@supabase/supabase-js';

export default function LoginPopup({
  searchParams,
  onClose,
  toggleSignUp
}: {
  searchParams: { message: string };
  onClose: () => void;
  toggleSignUp: () => void;
}): React.ReactElement {
  const [loginError, setLoginError] = useState<string>('');

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

  const handleSignUpClick = () => {
    toggleSignUp();
    onClose();
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = await signIn(formData);

    if (result.success) {
      onClose();
    } else {
      setLoginError(result.message);
    }
  };

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
        className="flex flex-col gap-4 text-black"
        onSubmit={handleLogin}
      >
        <label className="text-5xl font-bold mb-5">Login</label>
        {loginError &&
          <p className="p-2 bg-red-500 text-white text-center">{loginError}</p>
        }
        <input
          className="rounded-md px-4 py-2 bg-inherit border"
          name="email"
          placeholder="Laurier Email"
          required
        />

        <input
          className="rounded-md px-4 py-2 bg-inherit border"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground">
          Log In
        </button>
        <div
          onClick={handleSignUpClick}
          className="mb-5 flex justify-center text-blue-500 cursor-pointer"
        >
          New to Laurier Flow? Sign Up.
        </div>
        {searchParams?.message && (
          <p className="p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}

