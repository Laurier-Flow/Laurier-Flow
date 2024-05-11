import React from 'react'
import Link from 'next/link'

const HomeFooter = () => {
  return (
    <footer className="flex w-full py-6 items-center justify-center z-40 bg-footer text-white">
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
export default HomeFooter;