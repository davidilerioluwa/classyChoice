import Link from 'next/link'
import React, { useState ,Dispatch, SetStateAction} from 'react'

const PaymentDetails = ({setShowPaymentDetails}:{setShowPaymentDetails: Dispatch<SetStateAction<boolean>>}) => {
    const [file,setFile]= useState <FileList>()
    const addFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
            if(e.target.files){
                setFile(e.target.files)
            }
    }
    console.log(file);
    
  return (
     <div className='w-screen fixed flex items-center justify-center bg-opacity-30  h-screen bg-black top-0 left-0 fixed z-30'>
        <form className={`flex flex-col gap-4 relative items-center justify-center bg-white  p-6 rounded-md`}>
        <span onClick={()=>setShowPaymentDetails(false)} className='absolute top-2 right-2 px-3  pb-1 rounded-md cursor-pointer text-xl  text-purple-800 border border-purple-800 '>x</span>
            <div className='flex flex-col gap-2 w-full'>
                <h1 className='text-purple-900 font-bold'>Payment Steps</h1>
                <div className='p-4 bg-purple-900 flex flex-col  text-white rounded-md'>
                    <p>1. Make Payment To the Account Below</p>
                    <p>2. Upload Payment Proof</p>
                    <p>3. Click the confirm Order button</p>
                    <p>4. Track Your Orders in the orders page at <Link href={"account/orders"} className='font-bold underline'>Orders</Link></p>
                </div>
            </div>
            <div className='flex flex-col gap-2 w-full'>
                <h1  className='text-purple-900 font-bold'>Account Details</h1>
                <div className='p-4 bg-purple-900 flex flex-col w-full  text-white rounded-md'>
                    <p>Account Number: 7017487497</p>
                    <p>Account Name: David Godswill</p>
                    <p>Bank Name: Palmpay</p>
                </div>
            </div>
            <div>
                <label>Upload Payment Proof</label>
                <input className='w-full bg-purple-800 w-6 h-32 bg-opacity-10 cursor-pointer' type='file' accept='image/*' onChange={(e)=>addFile(e)}/>
            </div>
            <button className='bg-purple-900 text-white px-4 py-2 rounded-md w-full'>Confirm Order</button>
        </form>
        </div>
  )
}

export default PaymentDetails