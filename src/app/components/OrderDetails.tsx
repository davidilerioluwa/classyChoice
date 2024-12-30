import React from 'react'

const OrderDetails = ({setShowDetailsPopup,state,city,address,name,phoneNumber,email,note}:{setShowDetailsPopup:React.Dispatch<React.SetStateAction<boolean>>,state:string,city:string,address:string,name:string,phoneNumber:string,email:string,note:string}) => {
  return (
    <div className='fixed flex justify-center items-center top-0 left-0 p-4  w-screen h-screen bg-white backdrop-blur-sm bg-opacity-50 z-50'>
        
        <div className='bg-white  relative w-full text-purple-950  md: w-fit   rounded-md p-8 bg-opacity-80 drop-shadow-lg backdrop-blur-lg'>
                    <span className='absolute top-2 right-2 px-3  cursor-pointer py-1 pb-2  rounded-md text-white bg-purple-900' onClick={()=>setShowDetailsPopup(false)}>x</span>
                   <p>Name: {name}</p>
                    <p>Phone Number: {phoneNumber}</p>
                    <p>Email Address: {email}</p>
                    <p>Delivery Address: {address}, {city}, {state}. </p>
                    <p>Note from Buyer: {note}</p>
        </div>
    </div>
  )
}

export default OrderDetails