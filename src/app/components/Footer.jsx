import Link from 'next/link'
import React from 'react'
import { FaFacebook,FaWhatsapp,FaPhone } from 'react-icons/fa6'

const Footer = () => {
  return (
    <div  className=' drop-shadow-lg bg-purple-100 text-purple-900 p-4 '>
        <div className='flex w-full items-center h-20'>
          <div className='w-1/3 bg-purple-900 h-0.5'></div>
          <div className='w-1/3 text-xl text-center font-bold'>Classy Choice Varieties Store</div>
          <div className='w-1/3 bg-purple-900 h-0.5'></div>
        </div>
        <div className='grid grid-cols-3  justify-center gap-4 md:gap-8 md:gap-32 items-center p-4 w-full'>
          <div className='flex flex-col items-center justify-center text-sm font-bold gap-2'>
            <span className='cursor-pointer'>08024013533</span>
            <span className='cursor-pointer text-center'>Goshen house, Ijere-wasinmi, Pakuro, Lotto bus-stop, Lagos-Ibadan Expressway, Ogun State.</span>
          
          </div>
          <div className='flex gap-4 md:gap-16 text-xl md:text-3xl'>
            <span className='cursor-pointer'><FaFacebook/></span>
            <span className='cursor-pointer'><FaWhatsapp/></span>
            <span className='cursor-pointer'><FaPhone/></span>
          </div>
          <div className='flex flex-col items-center justify-center text-sm font-bold gap-2'>
            <Link href={"/search"}  className='cursor-pointer' >Categories</Link>
            <Link href={"/account/orders"} className='cursor-pointer'>Orders</Link>
            <Link href={"/account/cart"} className='cursor-pointer'>Cart</Link>
            <Link href={"/account/profile"} className='cursor-pointer'>Profile</Link>
          </div>
        </div>
    </div>
  )
}

export default Footer