import React, { useEffect, useState } from 'react'
import { iOrder } from '../lib/models/Orders';
import OrderItem from './OrderItem';
import { iUser } from '../lib/models/User';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const DashboardOrders = ({order}:{order:iOrder}) => {
    const date= (new Date(String(order.time))).toLocaleString()
    const [name,setName]=useState("loading")
    const [email,setEmail]=useState("loading")
    const [showOrders,setShowOrders]=useState(true)
    const userId=order.userId
   useEffect(()=>{
    (async function name() {
        const response = await fetch(`/api/profile/`,{headers:
          {
          id: String(userId)
        }})
        
        const res = await response.json()
        setName(String(res.user.name)) 
        setEmail(String(res.user.email))

      })()
   },[])
    return(<section key={order._id} className='bg-white text-xs md:text-sm  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full'>
        <div className='gap-2 flex flex-col gap-2 '>
        <div className='flex flex-col gap-2 lg:h-64 xl:h-80 overflow-y-auto '>
            <div className='w-full relative justify-between flex flex-col gap-2  items-center px-4 py-8  rounded-md border bg-purple-800 text-white'>    
                    <button className='absolute top-2 right-2 border border-white rounded-md p-1 text-xl' onClick={()=>setShowOrders(!showOrders)}>{showOrders?<FaAngleUp/>:<FaAngleDown/>}</button>
                    <div className=' flex w-full gap-4 justify-between items-center'>
                            <div className='w-20 md:w-fit break-words'>{email}</div>
                            <div>07017487497</div>
                            <div className='w-20 md:w-fit break-words'>{name}</div>
                    </div>
                    <div className='justify-between flex w-full'>
                        <button className='text-white bg-green-800 rounded-md px-4 py-1.5 w-20'>{order.status}</button>
                        <span className='w-20 md:w-fit'>{date}</span>
                        <div className='flex gap-1 flex-col md:flex-row'>
                            <span className='font-bold'>Total Amount:</span>
                            <span>{order.amount}</span>
                        </div>  
                    </div> 
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  {showOrders?order.items.map((item)=><OrderItem item={item}/>):""}
                </div>
            </div>
        </div>
    </section>)
}

export default DashboardOrders