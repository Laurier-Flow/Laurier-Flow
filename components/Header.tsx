"use client";

import React, { useEffect, useState } from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginPopup from "./LoginPopup";
import SignUpPopup from "./SignUpPopup";
import { fetchUser, signOut } from '@/utils/supabase/authActions';
import SearchBar from "@/app/search/SearchBar";
import { UserNav } from "./UserProfileNav";

export const useManageBodyScroll = (condition: boolean) => {
  useEffect(() => {
    if (condition) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [condition]);
};

export const usePopupManager = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const toggleSignUpPopup = () => {
    setShowSignUpPopup(!showSignUpPopup);
  };

  return {
    showLoginPopup,
    setShowLoginPopup,
    toggleLoginPopup,
    showSignUpPopup,
    setShowSignUpPopup,
    toggleSignUpPopup,
  };
};

export default function Header({ user }: { user: User | null }): React.ReactElement {
  const {
    showLoginPopup,
    toggleLoginPopup,
    showSignUpPopup,
    toggleSignUpPopup,
  } = usePopupManager();

  useManageBodyScroll(showLoginPopup || showSignUpPopup);

  const handleSignOut = async () => {
    const result = await signOut();
  };

  return (
    <>
      <header className="self-center sticky top-0 z-50 w-full border-b border-border/40 bg-white dark:bg-background/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 lg:max-w-6xl items-center">
          <div className="mr-4 flex flex-1">
            <Link href="/" className="hidden sm:flex mr-6 items-center space-x-2">
              <span className="font-bold">
                Laurier Flow
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm flex-1">
              <SearchBar />
              {!user && (
                <button
                  onClick={toggleLoginPopup}
                  className="text-sm text-foreground hover:underline cursor-pointer"
                >
                  Login
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <ThemeToggleButton />
            {user ? <UserNav user={user} /> : <button>bob</button>}
              
          </div>
        </div>
      </header>
      {showLoginPopup && !showSignUpPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoginPopup
            searchParams={{ message: '' }}
            onClose={toggleLoginPopup}
            toggleSignUp={toggleSignUpPopup}
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
    </>
  );
}
