import { handleResetPassword } from '@/utils/supabase/authActions';
import { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';


export default function PasswordPopup({
    searchParams,
    onClose,
    toggleLogIn,
  }: {
    searchParams: { message: string };
    onClose: () => void;
    toggleLogIn: () => void;
  }): React.ReactElement {
        const [resetError, setResetError] = useState<String>('')
        const [successMessage, setSuccessMessage] = useState<String>('')
  
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
  
  
    const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const result = await handleResetPassword(window.location.origin, formData);

        if (result.success) {
            setResetError('');
            setSuccessMessage(result.message);
        } else {
            setSuccessMessage('');
            setResetError(result.message);
        }
    };

    const handleLogInClick = () => {
        toggleLogIn();
        onClose();
    }
  
      return (
        <div ref={popupRef} className="overflow-y-auto max-h-[90vh] border-2 dark:border-secondary fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-md p-8 w-11/12">
          <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                onSubmit={handleReset}
                onChange={() => setResetError('')}
              >
                  <label className="flex flex-row justify-between items-center text-3xl font-bold mb-5 text-foreground">
                        <h1>Reset Password</h1>
                        <X className='cursor-pointer' onClick={() => onClose()} />
                  </label>
                  {resetError && 
                      <p className="rounded-md p-2 mb-2 bg-red-500 text-white text-center">{resetError}</p>
                  }
                  {successMessage && 
                      <p className="rounded-md p-2 mb-2 bg-green-500 text-white text-center">{successMessage}</p>
                  }
                  <input
                      className="rounded-md px-4 py-2 bg-stone-200 dark:bg-gray-900 border-neutral-300 dark:border-slate-800 focus:border-2 focus:border-secondary focus:outline-none focus:ring-0 placeholder-gray-400"
                      name="email"
                      placeholder="Email"
                      required
                    />

                  <button 
                    type="submit"
                    className="mb-2 bg-secondary rounded-md px-4 py-2 text-foreground"
                  >
                    Reset Password
                  </button>

                  <hr className="mb-6 border-gray-300 dark:border-gray-800"></hr>
                  
                  <div className="flex justify-center text-foreground">
                    <h1>Back to <span onClick={handleLogInClick} className="cursor-pointer underline underline-offset-2 decoration-1">Log In</span></h1>
                  </div>
              </form>
          </div>
      )
  }
  
  