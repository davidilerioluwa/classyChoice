"use client"
import React, { useEffect, useState } from 'react'
import { iCart } from '@/app/lib/models/Cart';
import CartItem from '@/app/components/CartItem';
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { toast } from 'sonner';
import UpdateProfileForm from '@/app/components/UpdateProfileForm';
import PaymentDetails from '@/app/components/PaymentDetails';


export interface iCheckoutDetails {
        cartId:string,
        price:number
      
}
const Page = () => {
    const [isLoading,setIsLoading]= useState(true)
    const [cart,setCart]=useState<Array<iCart>>([])
    const [totalAmount,setTotalAmount]= useState<number>(0)
    const [checkoutDetails,setCheckoutDetails]= useState<Array<iCheckoutDetails>>([])
    const [showPaystackButton,setPaystackButton]=useState(true)
    const [showPaymentDetails,setShowPaymentDetails]=useState(false)
    const [addressType,setAddressType]=useState("default")
    const [alternativeAddress,setAlternativeAddress]=useState("")
    const [showUpdateProfile,setShowUpdateProfile]= useState(false)
    const [note,setNote]=useState("")
    const snap=useSnapshot(state)
    const postToProducts=async (file?:FileList)=>{
        console.log(file);
        const formData=new FormData()
        
        const date= new Date ()
        const items=await Promise.all(cart.map(async (cartItem)=>{
                
                const getProduct = async (): Promise<{title:string,price:number}>=>{
                const filter= {_id: cartItem.productId}
                    const response= await fetch(`/api/filterProducts`,
                        {
                            method:"POST",
                            headers: { 'Content-Type': 'application/json' },
                            body:JSON.stringify(filter)
                        }
                    )
                    const products=await response.json()
                    const  title= products[0].title
                    const price= products[0].price
                    return({title:title,price:price})
            }
            const product=await getProduct()
            return({
                productId:cartItem.productId,
                quantity: cartItem.quantity,
                title:product.title,
                price:product.price,
               
                
            })
        }))
        formData.append("paymentProof",file?file[0]:"")
        formData.append("items",JSON.stringify(items))
        formData.append("time",JSON.stringify(date))
        formData.append("userId",JSON.stringify(snap.user?snap.user._id:"nil"))
        formData.append("status","Awaiting Confirmation")
        formData.append("amount",String(totalAmount))
        formData.append("note",note)
        formData.append("alternativeAddress",alternativeAddress)
        
        const response= await fetch("/api/orders",{
            method:"PUT",
            body:formData
        })
        const res=await response.json()
        if(res.message=="sucessful"){
            toast.success("Order Sucessfully Placed Please wait for confirmation")
            location.reload()
            getCart()
        }else{
            toast.error("Something Went Wrong")
            getCart()
        }
        console.log(res);
        
    }
    const getCart= async ()=>{
      try{
        setIsLoading(true)
        const response= await fetch("/api/cart")
        const cart: Array<iCart>= await response.json()
        setIsLoading(false)
         const totalQuantity = cart.reduce((total, item) => total + Number(item.quantity), 0);
        state.cartNumber=(totalQuantity)
        if(cart.length){
            setCart(cart)
            
        }else{
            setCart([])
        }    
      } catch(error){
            console.error(error)
      } 
    }
     const AddToTotalAmount=({newItem,removeItem}:{newItem?:iCheckoutDetails,removeItem?:iCheckoutDetails})=>{
        let newAmount= checkoutDetails
        if(newItem){
            // checks if it previously exists on the checkoutDetails arrayBuffer, if it doesnt, it gets added
            {!newAmount.find((item)=>item.cartId==newItem.cartId) && newAmount.push(newItem)}
            // checking if it previously exists on the checkoutDetails array, if it does exist previously it gets updated
            const previousItem= newAmount.find((item)=>item.cartId==newItem.cartId) 
            if(previousItem){
                const indexOfPrevious= newAmount.indexOf(previousItem)
                newAmount[indexOfPrevious]=newItem
                
            }
        }else if(removeItem){
            newAmount= newAmount.filter((item)=>item.cartId!==removeItem.cartId)
            
        }
        setCheckoutDetails(newAmount)
        console.log(newAmount);
        
        let totalAmount=0
        checkoutDetails.forEach((item)=>totalAmount=item.price+totalAmount)
        console.log(newAmount.length);
        setTotalAmount(totalAmount);
        if(newAmount.length==0){setTotalAmount(0)}
       
     }
    useEffect(()=>{
         getCart()
    },[])
  return (
    <>
    {isLoading?
    <div className='flex h-screen w-screen items-center justify-center'>
        <PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))' />
    </div> 
    :
        <div className='lg:h-screen h-full p-2 pt-24 lg:p-8 lg:pt-24 bg-white'>
            {showUpdateProfile && <UpdateProfileForm setShowUpdateProfile={setShowUpdateProfile}/>}
            {showPaymentDetails && <PaymentDetails postToProducts={postToProducts} setShowPaymentDetails={setShowPaymentDetails}/>}
            <h1 className='font-bold p-2 text-lg text-purple-900 mb-2'>Shopping Cart ({cart.length})</h1>
            <div className='w-full flex flex-col md:flex-row items-center md:items-start  gap-4 h-full pb-12'>
                <section className='  bg-white border border-purple-100  drop-shadow-md rounded-md p-2 lg:p-4 text-purple-900 w-full overflow-x-auto'>
                    {cart.length?<div className='gap-2 flex flex-col gap-2  md:w-full'>
                        <div className='font-bold  hidden md:grid grid-cols-12  justify-between  p-3 px-6 hidden md:'>
                            <span className='col-span-6'>Product</span>
                            <span className='col-span-3 text-center'>Quantity</span>
                            <span className='col-span-2 text-center'>Price</span>
                        </div>
                        <div className='flex flex-col gap-2 mb-4 overflow-y-auto'>
                            {cart.map((cartItem )=>(
                                <CartItem key={cartItem.id} cartItem={cartItem} setPaystackButton={setPaystackButton} getCart={getCart} AddToTotalAmount={AddToTotalAmount}/>
                            ))}
                        </div>
                        <div className='flex justify-between px-6 mt-4 w-5/6'>
                            <div className='font-bold'>Total:  </div>
                            <div className='text-center  border'></div>
                            <div className='font-bold text-right '> {totalAmount}</div>
                        </div>
                    </div>:"No Items Added To Cart"}
                </section>
                            {/* checkout */}
                <form onSubmit={(e)=>{
                    e.preventDefault()
                    console.log("h")}
            
            } className='w-full md:w-80 lg:w-96 bg-white border border-purple-100 flex flex-col items-center drop-shadow-md h-fit rounded-md px-6 py-6'>
                <div className='w-full my-4'>
                    <div className='flex justify-between'>
                        <span className='text-sm text-purple-900 w-32'>Subtotal:</span>
                        <span className='text-purple-900 text-sm font-bold'>₦{totalAmount}</span>
                    </div>
                    <div  className='flex-col text-purple-900 '>
                        <span className='text-sm'>Shipping:</span>
                        {(snap.user?.address && snap.user?.phoneNumber && snap.user?.city && snap.user?.state)?
                    <div className='flex flex-col gap-2'>
                       <div className='flex gap-2'>
                           <input type='radio' checked={addressType=="default"} onChange={()=>setAddressType("default")} required={true} name='address' id='default' value={addressType}/>
                           <span>Ship to default Address:</span>
                       </div>
                       <label>
                           <div className='bg-purple-900 text-white text-sm drop-shadow-md  rounded-md w-full p-2 backdrop-blur-md bg-opacity-90'>
                               {snap.user?.address+", "+ snap.user?.city+","+ snap.user?.state}
                           </div>
                       </label>
                   </div>
                    :""    
                    }
                     

                        <div className='flex flex-col gap-2 mt-4'>
                            <div className='flex gap-2'>
                                <input type='radio' required={true} checked={addressType=="different"} onChange={()=>setAddressType("different")} name='address' id='different' value={"different"}/>
                                <span>Ship to a different Address:</span>
                            </div>
                            {addressType=="different" &&
                            <label>
                                <textarea value={alternativeAddress} onChange={(e)=>setAlternativeAddress(e.target.value)} required placeholder='enter new address' className='w-full h-20 px-2 flex py-2 text-purple-900 outline outline-[1px] outline-purple-900 rounded-md'/>
                            </label>
                            }
                        </div>
                    </div>
                    <div  className='flex justify-between mt-2'>
                        <span className='font-bold text-purple-900'>Total:</span>
                        <span className='text-purple-900 font-bold'>₦{totalAmount}</span>
                    </div>
                    <div>
                        <label className='font-bold text-purple-900 text-sm'>Enter note to pass on to the Seller: </label>
                        <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder='Note for the seller' className='w-full px-2 flex mt-2 text-purple-900 h-20 outline outline-[1px] outline-purple-900 rounded-md'/>
                    </div>
                    </div>
                    {(snap.user?.address && snap.user?.phoneNumber && snap.user?.city && snap.user?.state)?
                   <button disabled={!showPaystackButton} onClick={()=>setShowPaymentDetails(true)} type='submit' className='bg-purple-900 text-white px-4 py-2 rounded-md w-full'>Proceed To Checkout</button>
                    :
                    <button onClick={()=>setShowUpdateProfile(true)} className='bg-purple-900 text-white px-4 py-2 rounded-md w-full'>Update Profile to proceed to Payment</button>
                    }
                    
                </form>

            
            </div>
        </div>
    }
    </>
  )
}

export default Page
