import Image from 'next/image'
import React from 'react'

const OrderDetails = ({setShowDetailsPopup,state,city,address,name,phoneNumber,email,note,paymentProof}:{setShowDetailsPopup:React.Dispatch<React.SetStateAction<boolean>>,state:string,city:string,address:string,name:string,phoneNumber:string,email:string,note:string,paymentProof:{url:String,assetId:String}}) => {
  console.log(paymentProof);
  
  return (
    <div className='fixed flex justify-center items-center top-0 left-0 p-8  w-screen h-screen bg-white backdrop-blur-sm bg-opacity-50 z-50'>
        
        <div className='bg-white  relative w-full text-purple-950  md:w-fit   rounded-md p-8 bg-opacity-80 drop-shadow-lg backdrop-blur-lg'>
                    <span className='absolute top-2 right-2 px-3  cursor-pointer py-1 pb-2  rounded-md text-white bg-purple-900' onClick={()=>setShowDetailsPopup(false)}>x</span>
                   <p>Name: {name}</p>
                    <p>Phone Number: {phoneNumber}</p>
                    <p>Email Address: {email}</p>
                    <p>Delivery Address: {address}, {city}, {state}. </p>
                    <p>Note from Buyer: {note?note:"no note from buyer"}</p>
                    <Image width={600} height={600} className='w-full' alt='Payment Proof' src={paymentProof?String(paymentProof.url):""}/>
        </div>
        
    </div>
  )
}

export default OrderDetails