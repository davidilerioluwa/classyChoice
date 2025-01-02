import React, { useEffect, useState } from 'react'
import { iOrder } from '../lib/models/Orders';
import OrderItem from './OrderItem';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import OrderDetails from './OrderDetails';

const DashboardOrders = ({order}:{order:iOrder}) => {
    const date= (new Date(String(order.time))).toLocaleString()
    const [name,setName]=useState("loading")
    const [email,setEmail]=useState("loading")
    const [phoneNumber,setPhoneNumber]=useState("loading..")
    const [state,setState]=useState("")
    const [city,setCity]=useState("")
    const [address,setAddress]=useState("")
    const [showOrders,setShowOrders]=useState(true)
    const [showDetailsPopup,setShowDetailsPopup]=useState(false)
    console.log(email);
    
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
        setPhoneNumber(String(res.user.phoneNumber))
        setCity(String(res.user.city))
        setAddress(String(res.user.address))
        setState(String(res.user.state))
        

      })()
   },[])
    return(
        showDetailsPopup? <OrderDetails paymentProof={order.paymentProof} note={order.note} state={state} city={city} address={address} name={name} email={email} phoneNumber={phoneNumber} setShowDetailsPopup={setShowDetailsPopup}/>:
    <section key={order.orderId} className='bg-white text-xs md:text-sm  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full'>
        
        <div className='gap-2 flex flex-col gap-2 '>
        <div className='flex flex-col gap-2'>
           
            <div className='w-full relative justify-between flex flex-col gap-2  items-center px-4 py-8  rounded-md border bg-purple-800 text-white'>    
                    <div className='flex justify-between w-full items-center'>
                        <button className=' top-2 right-2 border border-white rounded-md p-1 px-4 text-sm' onClick={()=>setShowDetailsPopup(true)}>View Details</button>
                        <button className=' top-2 right-2 border border-white rounded-md p-1 text-xl' onClick={()=>setShowOrders(!showOrders)}>{showOrders?<FaAngleUp/>:<FaAngleDown/>}</button>
                    </div>
                    <div className=' flex w-full gap-4 justify-between items-center'>
                            <div className='w-20 md:w-fit break-words'>Order Id: {order.orderId}</div>
                            <div>{phoneNumber}</div>
                            <div className='w-20 md:w-fit break-words'>{name}</div>
                    </div>
                    <div className='justify-between flex w-full'>
                        <button className='text-white bg-green-800 rounded-md px-4 py-1.5 w-fit'>{order.status}</button>
                        <span className='w-20 md:w-fit'>{date}</span>
                        <div className='flex gap-1 flex-col md:flex-row'>
                            <span className='font-bold'>Total Amount:</span>
                            <span>{order.amount}</span>
                        </div>  
                    </div> 
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  {showOrders?order.items.map((item)=><OrderItem key={item.productId} item={item}/>):""}
                </div>
            </div>
        </div>
    </section>
    )
}

export default DashboardOrders