import React,{Dispatch, SetStateAction, useEffect, useState} from 'react'
import Image from 'next/image'
import { iCart } from '../lib/models/Cart'
import { iProduct } from '../lib/models/Product'
import { toast,Toaster } from 'sonner'


const CartItem = ({cartItem,getCart,AddToTotalAmount,setPaystackButton}:{cartItem:iCart,getCart:any,AddToTotalAmount:Function,setPaystackButton:Dispatch<SetStateAction<boolean>>}) => {
    
    const [product,setProduct]= useState<iProduct>()
    const imageUrl=(product?(product.images?product.images[0].url:"loading"):"");

    const reduceQuantity=async ()=>{
    toast("updating your cart")
    // disable payment button 
    setPaystackButton(false)
        if(Number(cartItem.quantity)!==1){
            try{
                const response= await fetch(`/api/cart`,
                  {
                      method:"PATCH",
                      headers: { 'Content-Type': 'application/json' },
                      body:JSON.stringify({
                        quantity:Number(cartItem.quantity)-1,
                        cartId:cartItem._id
                    })
                  }
                )
                const res=await response.json()
                
                if(res.message=="cart has been sucessfully updated"){
                    toast.success(res.message)
                    getCart()
                    getProducts()
                    // enable the payment button
                    setTimeout(()=>{
                        setPaystackButton(true)
                    },1000)
                }
                
            }catch{
    
            }
        }else{
            removeFromCart()
        }
    }
    const increaseQuantity=async ()=>{
        toast("updating your cart")
        setPaystackButton(false)
        try{
            const response= await fetch(`/api/cart`,
              {
                  method:"PATCH",
                  headers: { 'Content-Type': 'application/json' },
                  body:JSON.stringify({
                    quantity:Number(cartItem.quantity)+1,
                    cartId:cartItem._id
                })
              }
            )
            const res=await response.json()
            
            if(res.message=="cart has been sucessfully updated"){
                toast.success(res.message)
                getCart()
                getProducts()
                setTimeout(()=>{
                    setPaystackButton(true)
                },1000)
            }
            
        }catch{

        }
    }
    const removeFromCart=async ()=>{
        toast("loading")
        try{
            const response= await fetch(`/api/cart`,
              {
                  method:"DELETE",
                  headers: { 'Content-Type': 'application/json' },
                  body:JSON.stringify({cartId:cartItem._id})
              }
            )
            const res=await response.json()
            console.log(res);
            
            if(res.message=="sucessfully deleted from cart"){
                toast.success(res.message)
                console.log(res.message);
                getCart()
                
                
            }
            
        }catch{

        }
    }
    async  function getProducts(){
        try{
            const filter= {_id: cartItem.productId}
            const response= await fetch(`/api/filterProducts`,
              {
                  method:"POST",
                  headers: { 'Content-Type': 'application/json' },
                  body:JSON.stringify(filter)
              }
            )
            const products=await response.json()
            const checkoutDetails={
              cartId:cartItem._id,
              price:products[0].price*Number(cartItem.quantity)
            }
            console.log(checkoutDetails);
            
            AddToTotalAmount(checkoutDetails)
            setProduct(products[0])
        }catch{

        }
    }
    useEffect(()=>{
        getProducts()
      },[cartItem])
    
  return (
    <div  key={cartItem.id} className='px-2 py-2 pr-4 w-fit min-w-full md:w-full grid grid-cols-12 gap-2 justify-between items-center border border-purple-100 rounded-md text-sm hover:bg-purple-900 hover:text-white cursor-pointer'>
                                <div className='h-full col-span-6'>
                                    <div className='flex gap-2 items-center h-full'>
                                        <img  src={imageUrl} alt="My Image Description" className='w-20 h-20 rounded-md border-2' width={20} height={20}/>
                                        <span className='text-sm'>{product?product.title:"loading"}</span>
                                    </div>
                                </div>
                                <div className=' h-full col-span-3' > 
                                <div className='flex items-center justify-center gap-4 h-full'>
                                        <div className='flex justify-center items-center bg-purple-100 text-purple-900 text-lg font-bold h-6 w-6 cursor-pointer rounded-sm ' onClick={()=>reduceQuantity()}> <span>-</span> </div>
                                        <div className='flex justify-center items-center  h-4 w-4'> <span>{cartItem.quantity}</span> </div>
                                        <div className='flex justify-center items-center bg-purple-100 text-purple-900 text-lg font-bold h-6 w-6 cursor-pointer rounded-sm ' onClick={()=>increaseQuantity()}> <span>+</span> </div> 
                                </div>
                                </div>
                                <div className='col-span-2 text-center'>{product?product.price:""}</div>
                                <div className='col-span-1 text-right' onClick={()=>removeFromCart()}>remove</div>
    </div>
  )
}

export default CartItem