import React from 'react'

const OrderDetails = ({setShowDetailsPopup}:{setShowDetailsPopup:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className='fixed flex justify-center items-center top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50'>
        
        <div className='bg-white  relative   w-80  rounded-md p-4 '>
        <span className='absolute top-2 right-2 px-4 py-2 text-white bg-purple-900' onClick={()=>setShowDetailsPopup(false)}>x</span>
                   <p>Name</p>
                    <p>Phone Number</p>
                    <p>Email Address</p>
                    <p>Home Address</p>
        </div>
    </div>
  )
}

export default OrderDetails