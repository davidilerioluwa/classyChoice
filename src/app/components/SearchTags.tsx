import { categories } from '@/store/constants';
import { state } from '@/store/state';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from "react-icons/ai";
import { useSnapshot } from 'valtio';

const SearchTags = ({redirectUrl}:{redirectUrl:string}) => {
  const snap=useSnapshot(state)
  const [showCategoriesDropdown,setShowCategoriesDropdown]=useState(false)
  // const [showSubCategories,setShowSubCategories]=useState(false)
  const [showPriceDropdown,setShowPriceDropdown]=useState(false)
  const [minAmount,setMinAmount]=useState(snap.filter.minAmount)
  const [maxAmount,setMaxAmount]=useState(snap.filter.maxAmount)
  const router=useRouter()
  useEffect(()=>{
    setMinAmount(snap.filter.minAmount)
    setMaxAmount(snap.filter.maxAmount)
  },[state.filter])
  return (
    <div className='flex flex-wrap w-full text-purple-900 gap-2 '> 
                    {snap.filter.category && 
                    <div onMouseLeave={()=>setShowCategoriesDropdown(false)}  className='border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1 relative'>
                      <span className='cursor-pointer' onClick={()=>setShowCategoriesDropdown(true)} >{snap.filter.category}</span>
                      <span className='text-lg cursor-pointer' onClick={()=>{
                        state.filter={
                          ...snap.filter,
                          category:"",
                          subCategory:''
                        }
                      }}>
                        <AiOutlineClose/>
                      </span>
                      {showCategoriesDropdown &&
                      <div className='absolute bg-white drop-shadow-lg p-3 rounded-md top-8 flex flex-col z-30'>
                        {categories.map((category)=><span onClick={()=>{
                          state.filter={
                            ...snap.filter,
                            category:category.mainCategory,
                            subCategory:""
                          }
                          router.push(redirectUrl)
                          setShowCategoriesDropdown(false)
                        }} key={category.mainCategory} className='cursor-pointer bg-white p-2 rounded-md hover:drop-shadow-lg w-full text-nowrap'>{category.mainCategory}</span>)}
                      </div>
                      }
                    </div>}
                    {!(snap.filter.minAmount==0 && snap.filter.maxAmount==10000000) && 
                    <div onMouseLeave={()=>setShowPriceDropdown(false)}  className='relative border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1'>
                    <span onClick={()=>setShowPriceDropdown(true)} className='cursor-pointer'>{snap.filter.minAmount}-{snap.filter.maxAmount} </span>
                    <span className='text-lg cursor-pointer' onClick={()=>{
                         state.filter={
                          ...snap.filter,
                          maxAmount:10000000,
                          minAmount:0
                        }
                    }}><AiOutlineClose/></span>
                    {showPriceDropdown &&
                      <div className='absolute bg-white drop-shadow-lg p-3 rounded-md flex flex-col gap-2 top-8 z-30'>
                        <p className='font-bold'>Price(N)</p>
                       <div className=' flex gap-3 items-center'>
                        <input value={minAmount} onChange={(e)=>setMinAmount(Number(e.target.value))} type='number' className='outline outline-[1px] outline-purple-800 rounded-md p-2'/>
                        <span className='font-bold text-lg'>-</span>
                        <input value={maxAmount} onChange={(e)=>setMaxAmount(Number(e.target.value))} type='number' className='outline outline-[1px] outline-purple-800 rounded-md p-2'/>
                       </div>
                       <button className='bg-purple-900 text-white py-2 rounded-md'  onClick={()=>{
                          state.filter={
                            ...snap.filter,
                            minAmount:minAmount,
                            maxAmount:maxAmount
                          }
                          router.push(redirectUrl)
                          setShowPriceDropdown(false)
                        }}>Save</button>
                      </div>
                      }
                  </div>

                    }
                    {snap.filter.subCategory &&
                     <div  className='border border-purple-900 px-4 py-1.5 rounded-md flex items-center gap-1'>
                      <span className='cursor-pointer'>{snap.filter.subCategory}</span>
                      <span className='text-lg cursor-pointer' onClick={()=>{
                           state.filter={
                            ...snap.filter,
                            subCategory:''
                          }
                      }}><AiOutlineClose/></span>
                    </div>}
    </div>
  )
}

export default SearchTags