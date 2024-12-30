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
        <div className='flex  justify-center gap-8 md:gap-32 items-center p-4 w-full'>
          {/* <div className='flex flex-col items-center justify-center text-sm font-bold gap-2'>
            <span className='cursor-pointer'>Lip Oil</span>
            <span className='cursor-pointer'>Lip Gloss</span>
            <span className='cursor-pointer'>Lip Mask</span>
            <span className='cursor-pointer'>Lip Liner</span>
          </div> */}
          <div className='flex gap-4 md:gap-16 text-xl md:text-3xl'>
            <span className='cursor-pointer'><FaFacebook/></span>
            <span className='cursor-pointer'><FaWhatsapp/></span>
            <span className='cursor-pointer'><FaPhone/></span>
          </div>
          <div className='flex flex-col items-center justify-center text-sm font-bold gap-2'>
            <span className='cursor-pointer'>Categories</span>
            <span className='cursor-pointer'>Orders</span>
            <span className='cursor-pointer'>Cart</span>
            <span className='cursor-pointer'>Profile</span>
          </div>
        </div>
    </div>
  )
}

export default Footer