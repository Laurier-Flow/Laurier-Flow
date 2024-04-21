// LoginPopup.jsx
import Link from 'next/link';
import { signIn, fetchUser } from '@/utils/supabase/authActions'
import { useRef, useEffect, useState } from 'react';

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
      location.reload()
    } else {
      setLoginError(result.message);
    }
  };

  return (
    <div ref={popupRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border-secondary border-2 rounded-md p-8 max-w-md w-full">
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
        className="flex flex-col gap-4 text-foreground bg-background"
        onSubmit={handleLogin}
        onChange={() => setLoginError('')}
      >
        <label className="text-3xl font-bold mb-5 text-foreground">Log In</label>
        {loginError &&
          <p className="rounded-md p-2 mb-2 bg-red-500 text-white text-center">{loginError}</p>
        }
        <input
          className="rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
          name="email"
          placeholder="Laurier Email"
          required
        />

        <input
          className="rounded-md px-4 py-2 bg-stone-200 dark:bg-inherit border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
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

        <div
          onClick={handleSignUpClick}
          className="flex justify-center text-foreground"
        >
          <h1>New to Laurier Flow? <span onClick={() => { handleSignUpClick }} className="cursor-pointer underline underline-offset-2 decoration-1">Sign Up</span></h1>
        </div>
      </form>
    </div>
  )
}

