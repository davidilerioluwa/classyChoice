"use client"
import React, { useEffect } from 'react'
import HomepageProducts from './components/HomepageProducts'
import Link from 'next/link'

export default  function page () {
  
return (
  <div className=''>
    <section className='w-screen h-fit md:h-screen mt-16 relative grid grid-cols-12 justify-between bg-purple-800'>
      <div className=' p-8 py-24 md:p-20 z-10 flex flex-col col-span-7 gap-2 md:gap-4 justify-center items-start text-white'>
          <div className='absolute w-1/4 left-0 rounded-md  bg-purple-900 z-[-1] h-72 md:h-1/2'></div>
          <p>Shop Smart, Live Better</p>
          <p className='text-lg md:text-3xl font-bold text-white'> Discover Endless Deals And Unbeatable Quality-Everything You Need.</p>
          <Link href={"/search"} className=' border border-white text-white px-4 py-2 rounded-md '>SHOP NOW</Link>
      </div>
      <img src="clothes.jpeg" className='object-cover w-full h-full md:h-screen col-span-5' alt="" />
    </section>
    <HomepageProducts/>
  </div>
)
}