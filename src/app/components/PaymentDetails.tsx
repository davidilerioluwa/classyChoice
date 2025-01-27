import Link from 'next/link'
import React, { useState ,Dispatch, SetStateAction} from 'react'
import { toast } from 'sonner'

const PaymentDetails = ({setShowPaymentDetails,postToProducts}:{setShowPaymentDetails: Dispatch<SetStateAction<boolean>>,postToProducts:(file?:FileList | null)=>void}) => {
    const [file,setFile]= useState <FileList | null>()
    const [disableButton,setDisableButton]=useState(false)
    const [url,setUrl]=useState("")
    const addFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
         
            {e.target.files && setFile(e.target.files)}  
            let File
            if(e.target){
                File =Array.from(e.target.files as FileList)  //conver event.target to filelist
            }
            let url=""
           if(File){
            url= URL.createObjectURL(File[0]) // createUrl for the image
            setUrl(url)
           }
    }
  return (
     <div className='w-screen fixed flex items-center px-4 py-4 justify-center bg-opacity-30 overflow-hidden  h-screen bg-black top-0 left-0 fixed z-30'>
        <div className=' bg-white relative p-6 rounded-md max-h-[calc(100vh-20px)] overflow-scroll'>
            <form onSubmit={(e)=>{
                e.preventDefault()
                if(file){
                setDisableButton(true)
                toast("Loading...")
                postToProducts(file)
                }else{
                    toast.error("Please Choose An Image to Complete Your Order")
                }
            }}
            className='flex flex-col gap-4 items-center justify-center'
            >
                <span onClick={()=>setShowPaymentDetails(false)} className='absolute top-2 right-2 px-3  pb-1 rounded-md cursor-pointer text-xl  text-purple-800 border border-purple-800 '>x</span>
                <div className='flex flex-col gap-2 w-full h-fit'>
                    <h1 className='text-purple-900 font-bold'>Payment Steps</h1>
                    <div className='p-4 bg-purple-900 flex flex-col  text-white rounded-md'>
                        <p>1. Make Payment To the Account Below</p>
                        <p>2. Upload Payment Proof</p>
                        <p>3. Click the confirm Order button</p>
                        <p>4. Track Your Orders in the orders page at <Link href={"/account/orders"} className='font-bold underline'>Orders</Link></p>
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
                <div className='w-full'>
                    <label className='text-purple-900 font-bold mb-2'>Upload Payment Proof:</label>
                    <input className='w-full bg-purple-800 w-6 h-32 bg-opacity-10 cursor-pointer hidden' id='file-input'  type='file' accept='image/*' onChange={(e)=>addFile(e)}/>
                    <label htmlFor="file-input" className=' mt-2 cursor-pointer block w-full bg-purple-900 px-4 py-2 text-center text-white rounded-md'>Choose File</label>
                </div>
            {file &&  <div className='relative border border-purple-800 rounded-md'>
                            <span onClick={()=>
                                setFile(null)
                            } className='absolute right-2 top-2 px-3 py-1 cursor-pointer bg-purple-800 text-white rounded-md'>x</span>
                            <img src={url} className='object-cover w-60 h-60 rounded-md'/>
                </div>}
                <button type='submit' disabled={disableButton} className='bg-purple-900 text-white px-4 py-2 rounded-md w-full'>Confirm Order</button>
            </form>
        </div>
        </div>
  )
}

export default PaymentDetails