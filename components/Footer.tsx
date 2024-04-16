import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="flex w-full py-6 items-center justify-center border-t border-gray-300 dark:border-gray-800">
        <div className='flex flex-1 max-w-6xl justify-between px-8'>
          <p className="text-xs">© 2024 LaurierFlow. All rights reserved.</p>
          <nav className="flex">
            <Link className="text-xs hover:underline underline-offset-4" href="/about">
              About
            </Link>
            <Link className="ml-4 text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
    </footer>
  )
}
export default Footer;
