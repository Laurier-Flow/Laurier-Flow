import React from 'react'
import Link from 'next/link'

const Footer = () => {
    return (
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className='container flex max-w-screen-2xl items-center'>
          <p className="text-xs text-primary-foreground">© 2024 LaurierFlow. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="/about">
              About
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    )
  }
  export default Footer;
