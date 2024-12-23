"use client"
import React, { useEffect, useState } from 'react'
import { PaystackButton } from 'react-paystack';
import Image from 'next/image';
import { iCart } from '@/app/lib/models/Cart';
import CartItem from '@/app/components/CartItem';
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';
import PacmanLoader from "react-spinners/PacmanLoader"


const page = () => {
    const [isLoading,setIsLoading]= useState(true)
    const [cart,setCart]=useState<Array<iCart>>([])
    const [totalAmount,setTotalAmount]= useState<number>(0)
    const [checkoutDetails,setCheckoutDetails]= useState<Array<any>>([])
    const [showPaystackButton,setPaystackButton]=useState(true)
    const snap=useSnapshot(state)
    const email=snap.user?snap.user.email:"no email"
    const publicKey= String(process.env.paystack_publicKey)
    const postToProducts=async (x:any)=>{
        console.log(x);
        
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
                    console.log(products[0]);
                    const  title= products[0].title
                    const price= products[0].price
                    return({title:title,price:price})
            }
            const product=await getProduct()
            return({
                productId:cartItem.productId,
                quantity: cartItem.quantity,
                title:product.title,
                price:product.price
            })
        }))
        const order = {
            items:items,
            time: date,
            status:"Paid",
            userId:snap.user?snap.user._id:"nil",
            amount:totalAmount
        }
        
        const response= await fetch("/api/orders",{
            method:"PUT",
            body:JSON.stringify(order)
        })
        const res=await response.json()
        console.log(res);
        
    }
    const getCart= async ()=>{
        setIsLoading(true)
        const response= await fetch("/api/cart")
        const cart: Array<iCart>= await response.json()
        setIsLoading(false)
        if(cart.length){
            setCart(cart)
        }else{
            setCart([])
        }       
     }
     const AddToTotalAmount=(newItem:any)=>{
        const newAmount= checkoutDetails
        {!newAmount.find((item)=>item.cartId==newItem.cartId) && newAmount.push(newItem)}
        // checking if it previously exists on the checkoutDetails array
       const previousItem= newAmount.find((item)=>item.cartId==newItem.cartId) 
       if(previousItem){
        const indexOfPrevious= newAmount.indexOf(previousItem)
        newAmount[indexOfPrevious]=newItem
        
       }
        setCheckoutDetails(newAmount)
        let totalAmount=0
        checkoutDetails.forEach((item)=>totalAmount=item.price+totalAmount)
        setTotalAmount(totalAmount);
     }
    useEffect(()=>{
         getCart()
    },[])
  return (
    <>
    {isLoading?
    <div className='flex h-screen w-screen items-center justify-center'>
        <PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>
    </div>
    :
        <div className='lg:h-screen h-full p-2 pt-24 lg:p-8 lg:pt-24 bg-white'>
                
            <h1 className='font-bold p-2 text-lg text-purple-900 mb-2'>Shopping Cart ({cart.length})</h1>
            <div className='w-full flex flex-col md:flex-row items-center md:items-start  gap-4 h-full pb-12'>
                <section className='  bg-white border border-purple-100  drop-shadow-md rounded-md p-2 lg:p-4 text-purple-900 w-full overflow-x-auto'>
                    {cart.length?<div className='gap-2 flex flex-col gap-2 w-[620px] md:w-full'>
                        <div className='font-bold  grid grid-cols-12  justify-between  p-3 px-6 '>
                            <span className='col-span-6'>Product</span>
                            <span className='col-span-3 text-center'>Quantity</span>
                            <span className='col-span-2 text-center'>Price</span>
                        </div>
                        <div className='flex flex-col gap-2 mb-4 overflow-y-auto'>
                            {cart.map((cartItem )=>(
                                <CartItem cartItem={cartItem} setPaystackButton={setPaystackButton} getCart={getCart} AddToTotalAmount={AddToTotalAmount}/>
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
                <section className='w-full md:w-80 bg-white border border-purple-100 flex flex-col items-center drop-shadow-md h-fit rounded-md px-10 py-6'>
                <div className='w-full my-4'>
                    <div className='flex justify-between'>
                        <span className='text-sm text-purple-900 w-32'>Subtotal:</span>
                        <span className='text-purple-900 text-sm font-bold'>₦{totalAmount}</span>
                    </div>
                    <div  className='flex justify-between'>
                        <span className='text-sm text-purple-900'>Shipping:</span>
                        <span className='text-purple-900 font-bold text-sm'>Free</span>
                    </div>
                    <div  className='flex justify-between'>
                        <span className='font-bold text-purple-900'>Total:</span>
                        <span className='text-purple-900 font-bold'>₦{totalAmount}</span>
                    </div>
                    </div>
                    <PaystackButton
                    className='bg-purple-900 text-white px-4 py-2 rounded-md w-fit' 
                    text='Proceed To Checkout' 
                    email={String(email)} 
                    publicKey={publicKey} 
                    amount={totalAmount*100} 
                    onSuccess={(x)=>postToProducts(x)}
                    disabled={!showPaystackButton}
                    />
                </section>

            
            </div>
        </div>
    }
    </>
  )
}

export default page
