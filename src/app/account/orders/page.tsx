"use client"
import React, { useEffect,useState } from 'react'
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';
import { toast } from 'sonner';
import { iOrder } from '@/app/lib/models/Orders';
import OrderItem from '@/app/components/OrderItem';
const Page = () => {
    const snap=useSnapshot(state)
    const [orders,setOrders]=useState<Array<iOrder>>([])
    
    const getProducts=async ()=>{
       try{
        const response= await fetch("/api/orders",{
            method:"POST",
            body:JSON.stringify(snap.user?snap.user._id:"nil")
        })
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
           {orders.map((order)=>{
            const date= (new Date(String(order.time))).toLocaleString()
            return(<section key={order._id} className='bg-white text-xs  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full'>
                <div className='gap-2 flex flex-col gap-2 '>
                <div className='flex flex-col gap-2 lg:h-64 xl:h-80 overflow-y-auto '>
                        <div className='w-full justify-between flex gap-2  items-center p-4  rounded-md border bg-purple-800 text-white'>    
                            <button className='text-white bg-green-800 rounded-md px-4 py-1.5'>{order.status}</button>
                            <span className='w-20 md:w-fit'>{date}</span>
                           
                            <div className='flex gap-1 flex-col md:flex-row'>
                                <span className='font-bold'>Total Amount:</span>
                                <span>{order.amount}</span>
                            </div>   
                        </div>
                        {order.items.map((item)=><OrderItem key={item.productId} item={item}/>)}
                    </div>
                </div>
            </section>)
           } )}
           </div>
        </div>
  )
}

export default Page
