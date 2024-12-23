"use client"
import React, { useEffect,useState } from 'react'
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';
import { toast } from 'sonner';
import { iOrder } from '@/app/lib/models/Orders';
import DashboardOrders from '@/app/components/DashboardOrders';
const Page = () => {
    const snap=useSnapshot(state)
    const [orders,setOrders]=useState<Array<iOrder>>([])
    const getProducts=async ()=>{
       try{
        const response= await fetch("/api/orders")
        const res=await response.json()
        setOrders(res);
       }catch{
        toast.error("something went wrong")
       }
        
    }
    useEffect(()=>{
        getProducts()
    },[snap.user])
  return (
    
        <div className='w-full gap-4 h-full pb-12 mt-20 p-4'>
            <h1 className='font-bold p-2 text-lg text-purple-800 mb-2'>Orders</h1>
            <div className='w-full flex gap-2 mb-4 px-4'>
                        <input type='text' className='w-full px-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
                        <button className='bg-purple-800 px-4 py-2 rounded-md text-white'>Search</button>
            </div>
           <div className='flex flex-col gap-2'>
           {orders.map((order)=><DashboardOrders key={order.id} order={order}/> )}
           </div>
        </div>
  )
}

export default Page
