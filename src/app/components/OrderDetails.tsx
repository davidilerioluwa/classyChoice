import Image from 'next/image'
import React from 'react'

const OrderDetails = ({setShowDetailsPopup,state,city,address,name,phoneNumber,email,note,paymentProof,alternativeAddress}:{setShowDetailsPopup:React.Dispatch<React.SetStateAction<boolean>>,state:string,city:string,address:string,name:string,phoneNumber:string,email:string,note:string,paymentProof:{url:string,assetId:string},alternativeAddress:string}) => {
  console.log(paymentProof);
  
  return (
    <div className='fixed flex justify-center items-center top-0 left-0 p-8  w-screen h-screen bg-white backdrop-blur-sm bg-opacity-50 z-50'>
        
        <div className='bg-white  relative w-full text-purple-950  md:w-fit  max-h-screen overflow-y-auto  rounded-md p-8 bg-opacity-80 drop-shadow-lg backdrop-blur-lg'>
                    <span className='absolute top-2 right-2 px-3  cursor-pointer py-1 pb-2  rounded-md text-white bg-purple-900' onClick={()=>setShowDetailsPopup(false)}>x</span>
                   <p>Name: {name}</p>
                    <p>Phone Number: {phoneNumber}</p>
                    <p>Email Address: {email}</p>
                    {alternativeAddress?<p>Delivery Address: {address}, {city}, {state}. </p>:<p></p>}
                    <p>Note from Buyer: {note?note:"no note from buyer"}</p>
                    <Image width={400} height={400} className='w-full h-full ' alt='Payment Proof' src={paymentProof?String(paymentProof.url):""}/>
        </div>
        
    </div>
  )
}

export default OrderDetails