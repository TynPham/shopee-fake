import React from 'react'
import IMG from 'src/assets/Frame 38.png'
import { AiOutlineInstagram, AiFillLinkedin } from 'react-icons/ai'
import { BsFacebook } from 'react-icons/bs'

export default function FooterTest() {
  return (
    <footer className='bg-zinc-900 text-white'>
      <div className='grid grid-cols-1 gap-12 px-16 py-10 md:grid-cols-2'>
        <div className='order-1 m-auto text-center md:order-none md:m-0 md:text-left'>
          <img src={IMG} alt='GDSC' className='m-auto w-48 md:m-0' />
          <p className='mt-6 max-w-xs text-base'>
            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatu
          </p>
        </div>
        <div className='flex justify-center gap-40 md:justify-start'>
          <ul className='flex flex-col gap-4'>
            <li>Home</li>
            <li>Department</li>
            <li>Events</li>
            <li>Products</li>
            <li>Activities</li>
          </ul>
          <ul className='flex flex-col gap-4'>
            <li>Home</li>
            <li>Department</li>
            <li>Events</li>
            <li>Products</li>
            <li>Activities</li>
          </ul>
        </div>
      </div>
      <div className='flex flex-col items-center justify-between gap-8 border-t px-16 py-6 md:flex-row'>
        <span className='order-1 md:order-none'>Powered by GDSC-DUT</span>
        <div className='flex gap-8'>
          <button className='rounded-full border p-2'>
            <AiFillLinkedin />
          </button>
          <button className='rounded-full border p-2'>
            <BsFacebook />
          </button>
          <button className='rounded-full border p-2'>
            <AiOutlineInstagram />
          </button>
        </div>
        <span className='-order-1 md:order-none'>gdsc.dut@gmail.com</span>
      </div>
    </footer>
  )
}
