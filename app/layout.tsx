"use client"

import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { User } from '@supabase/supabase-js';
import LoginPopup from "@/components/LoginPopup";
import SignUpPopup from "@/components/SignUpPopup";
import { fetchUser, signOut } from '@/utils/supabase/authActions';
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [currentUser, setcurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser();
      if (user) {
        setcurrentUser(user);
      }
      else {
      }
    };

    getUser();
  }, []);

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const toggleSignUpPopup = () => {
    setShowSignUpPopup(!showSignUpPopup);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      setcurrentUser(null);
    } else {
      console.error(result.message);
    }
  };

  return (
    <html lang="en">
      <body className={`bg-background text-foreground h-screen flex flex-col ${showLoginPopup ? 'overflow-hidden' : ''
        }`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header toggleLoginPopup={toggleLoginPopup} currentUser={currentUser} handleSignOut={handleSignOut} />
          <main className="flex grow justify-start items-center flex-col">
            {children}
          </main>
          <Footer />
          {showLoginPopup && !showSignUpPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <LoginPopup
                searchParams={{ message: '' }}
                onClose={toggleLoginPopup}
                toggleSignUp={toggleSignUpPopup}
                currentUser={currentUser}
                setCurrentUser={setcurrentUser}
              />
            </div>
          )}
          {showSignUpPopup && !showLoginPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <SignUpPopup
                searchParams={{ message: '' }}
                onClose={toggleSignUpPopup}
                toggleLogIn={toggleLoginPopup}
              />
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
