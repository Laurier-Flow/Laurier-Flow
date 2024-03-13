"use client";

import "@/app/globals.css";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CirclesWithBar } from "react-loader-spinner";
import { User } from '@supabase/supabase-js';
import LoadingSpinner from "@/components/LoadingSpinner";
import LoginPopup from "@/components/LoginPopup";
import SignUpPopup from "@/components/SignUpPopup";
import { fetchUser, signOut } from '@/utils/supabase/authActions';

// export const metadata = {
//   title: "Laurier Flow",
//   description: "The best way to plan your Laurier schedule",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setLoading(false);
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
      <body className={`bg-background text-foreground w-full h-full flex flex-col ${
        showLoginPopup ? 'overflow-hidden' : ''
      }`}>
        {loading ? (
          <LoadingSpinner loading={loading} />
        ) : (
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header toggleLoginPopup={toggleLoginPopup} currentUser={currentUser} handleSignOut={handleSignOut} />
            <main className="justify-center flex w-full flex-grow">
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
        )}
      </body>
    </html>
  );
}
