"use client"
import React from 'react'
import HomepageProducts from './components/HomepageProducts'
import Link from 'next/link'
import { homepageSections } from '@/store/constants'
import HompageSection from './components/Section'

export default  function page () {
  
return (
  <div className=''>
    <section className='w-screen h-fit md:h-screen mt-14 relative md:grid grid-cols-12 justify-between bg-purple-800'>
      <div className='w-full h-full md:hidden  h-[60]'>
        <img src="clothes.jpeg" className='object-cover w-full h-full md:hidden  h-[60] col-span-5' alt="" />
      </div>
      <div className=' p-8 py-24 md:p-20 z-10 hidden md:flex flex-col col-span-7 gap-2 md:gap-4 justify-center items-start text-white'>
          <div className='absolute w-1/4 left-0 rounded-md   bg-purple-900 z-[-1] h-72 md:h-1/2'></div>
          <p>Shop Smart, Live Better</p>
          <p className='text-2xl md:text-4xl lg:text-5xl font-bold text-white'> Discover Endless Deals And Unbeatable Quality-Everything You Need.</p>
          <Link href={"/search"} className=' text-purple-900 bg-white  px-4 py-2 rounded-sm text-lg font-bold'>SHOP NOW</Link>
      </div>
      <div className='absolute top-32 bg-purple-800/70 backdrop-blur-md mx-8 md:hidden rounded-lg shadow-lg drop-shadow-md border border-white/20 p-8 py-18 z-10 flex flex-col col-span-7 gap-2 md:gap-4 justify-center items-start text-white'>
          <div className='absolute md:w-1/4 left-0 rounded-md  md:bg-purple-900 z-[-1] h-72 md:h-1/2'></div>
          <p>Shop Smart, Live Better</p>
          <p className='text-2xl md:text-4xl font-bold text-white'> Discover Endless Deals And Unbeatable Quality-Everything You Need.</p>
          <Link href={"/search"} className=' text-purple-900 bg-white px-6 py-2 rounded-sm font-bold text-lg'>SHOP NOW</Link>
      </div>
      <img src="clothes.jpeg" className='object-cover w-full h-full hidden md:flex md:h-screen col-span-5' alt="" />
    </section>
    <HomepageProducts/>
    {homepageSections.map((homepageSection)=><HompageSection sectionName={homepageSection.sectionName} key={homepageSection.sectionName} productIds={homepageSection.productIds}/>)}
  </div>
)
}