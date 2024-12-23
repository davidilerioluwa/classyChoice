"use client"
import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/ProductsCard'
import { iProduct } from '../lib/models/Product'
import { FaFilter } from 'react-icons/fa6'
import { useSnapshot } from 'valtio'
import { state } from '@/store/state'
import PacmanLoader from "react-spinners/PacmanLoader"
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Search from '../components/Search'

const Page = () => {
    const [products,setProducts]=useState<Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    const [showSearch,setShowSearch]=useState(false)
    const snap=useSnapshot(state)
    useEffect(()=>{
        (async  function getProducts(){
          const filter= snap.filter
          console.log(filter);
          
              try{
                  const response= await fetch("/api/findProducts",{
                    body:JSON.stringify(filter),
                    method:"POST"
                  })
                  const products=await response.json()
                  setIsLoading(false)
                  // checks to see if the products have a length, and if it doesnt it does set the products state
                  if(products.length){
                    setProducts(products)
                  }else{
                    setProducts([])
                    
                  }
                  
              }catch{
                  setProducts([])
              }
          })()
      },[snap.filter])
  return (
    <div className='pt-24 px-4 lg:px-6 py-4'>
        {showSearch?<Search setShowSearch={setShowSearch}/>:""}
        <div className='w-full flex gap-2 mb-4 '>
                        <input type='text' className='w-full px-2 text-purple-900 outline outline-[1px] outline-purple-900 rounded-md'/>
                        <button className='bg-purple-900 px-4 py-2 rounded-md text-white text-3xl' onClick={()=>setShowSearch(true)}><HiAdjustmentsHorizontal/></button>
                        <button className='bg-purple-900 px-4 py-2 rounded-md text-white'>Search</button>
        </div>
        <div className=' bg-white drop-shadow-lg w-full rounded-md p-4'>
            <span className='font-bold text-sm py-2 mb-4'>{products.length?products.length+" results":""}</span>
                <div >
                    {isLoading?<PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>:<div className='flex flex-wrap items-center justify-center gap-2 md:gap-4'>{products.length?products.map((product)=><ProductsCard product={product} key={product.id}/>):"No Items Found, Please Try a new search"}</div>}
                </div>
        </div>
    </div>
  )
}

export default Page