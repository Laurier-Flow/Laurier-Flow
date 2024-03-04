"use client";
import React from "react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header(): React.ReactElement {
  return (
    <header className="self-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:max-w-6xl">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Laurier Flow
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/explore">Explore</Link>
            <Link href="/course/BU283">Courses</Link>
            <Link href="/instructor">Instructor</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeToggleButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center rounded-full">
                <Button variant="outline" className="relative">
                  pfp
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>My Account</DropdownMenuItem>
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              <DropdownMenuItem className="bg-destructive text-destructive-foreground">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
