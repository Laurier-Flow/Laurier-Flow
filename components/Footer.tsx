import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="flex w-full py-6 items-center justify-center border-t border-gray-300 dark:border-gray-800 z-50">
        <div className='flex flex-1 justify-between px-8'>
          <p className="text-sm">© 2024 LaurierFlow. <span className='hidden sm:inline'>All rights reserved.</span></p>
          <nav className="flex">
            <Link className="text-sm hover:underline underline-offset-2" href="/about">
              About
            </Link>
            <Link className="ml-4 text-sm hover:underline underline-offset-2" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
    </footer>
  )
}
export default Footer;
