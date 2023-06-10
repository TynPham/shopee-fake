import React, { useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'

export default function HeaderTest() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpenNav = () => {
    setIsOpen(true)
  }

  const handleCloseNav = () => {
    setIsOpen(false)
  }

  return (
    <header className='mx-auto flex w-9/10 items-center justify-between rounded-b-xl bg-white px-7 py-6'>
      <h3 className='text-xl lg:text-2xl'>GDSC-DUT</h3>
      <nav className='hidden lg:block'>
        <ul className='flex gap-6 text-2xl'>
          <li>Home</li>
          <li>Department</li>
          <li>Events</li>
          <li>Products</li>
          <li>Activities</li>
        </ul>
      </nav>
      <BiMenuAltRight className='text-3xl lg:hidden' onClick={handleOpenNav} />
      <nav
        className={`fixed ${
          isOpen ? 'right-0' : '-right-1/2'
        } top-0 z-10 h-screen w-1/2 bg-white text-black transition-all lg:hidden`}
      >
        <ul className='flex flex-col gap-4 p-8'>
          <li>Home</li>
          <li>Department</li>
          <li>Events</li>
          <li>Products</li>
          <li>Activities</li>
        </ul>
      </nav>
      {/* overlay when click open menu on mobile */}
      {isOpen && <button className='fixed left-0 top-0 h-full w-full bg-overlay' onClick={handleCloseNav}></button>}
    </header>
  )
}
