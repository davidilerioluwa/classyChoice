import React,{Dispatch, SetStateAction, useEffect, useState} from 'react'
import { iCart } from '../lib/models/Cart'
import { iProduct } from '../lib/models/Product'
import { toast} from 'sonner'
import { iCheckoutDetails } from '../account/cart/page'


const CartItem = ({cartItem,getCart,AddToTotalAmount,setPaystackButton}:{cartItem:iCart,getCart:()=>void,AddToTotalAmount:(params:iCheckoutDetails)=>void,setPaystackButton:Dispatch<SetStateAction<boolean>>}) => {
    
    const [product,setProduct]= useState<iProduct>()
    const imageUrl=(product?(product.images?product.images[0].url:"loading"):"");
    const [isLoading,setIsLoading]=useState(false)
  
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
            setIsLoading(true)
            const filter= {_id: cartItem.productId}
            const response= await fetch(`/api/filterProducts`,
              {
                  method:"POST",
                  headers: { 'Content-Type': 'application/json' },
                  body:JSON.stringify(filter)
              }
            )
                    const products=await response.json()
                    setIsLoading(false)
                    const checkoutDetails={
                        cartId:String(cartItem._id),
                        price:products[0].price*Number(cartItem.quantity)
                        }
                        if((product?.quantityType=="UnLimited Quantity") || Number(product?.unitsAvailable)>0 ){
                            AddToTotalAmount(checkoutDetails)
                        }
                        
                        setProduct(products[0])
                        
            
        }catch{

        }
    }
    useEffect(()=>{
        getProducts()
      },[cartItem])
    
  return (
    <div  key={cartItem.id} className='px-2 py-2 pr-4 w-fit min-w-full md:w-full flex md:grid grid-cols-12 gap-2 justify-between items-center border border-purple-100 rounded-md text-sm hover:bg-purple-900 hover:text-white cursor-pointer'>
                                <div className='h-full col-span-6'>
                                    <div className='flex gap-2 items-center h-full w-20 sm:w-fit'>
                                        <img style={{ width: '80px', height: '80px' }}  src={(!isLoading && (product==undefined))?"outOfStock.jpeg":imageUrl} alt={(!isLoading && product==undefined)?"outOfStock.jpeg":"Item"}className='w-20 h-20 rounded-md border-2'/>
                                        <span className=' hidden sm:flex font-bold'>{product?product.title:"loading"}</span>
                                    </div>
                                </div>
                               <div className='w-full sm:w-fit ml-2 md:ml-0  flex flex-col sm:flex-row sm:items-center  gap-2 sm:gap-20 col-span-5 sm:gap-0 justify-between items-start'>
                                    <span className='text-sm font-bold sm:hidden'>{product?product.title:"loading"}</span>
                                    <div className='col-span-5 flex flex-col  gap-2 md:w-full  md:grid grid-cols-5'>
                                    {product?.quantityType=="Limited Quantity"?<div className=' md:hidden'>{product?.unitsAvailable} Units left</div>:""}
                                        <div className=' h-full col-span-3' > 
                                            {((product?.quantityType=="UnLimited Quantity") || Number(product?.unitsAvailable)>0 )?
                                            <div className='flex relative items-center justify-center gap-4 h-full'>
                                                    {product?.quantityType=="Limited Quantity" ?<div className='hidden md:flex md:absolute top-[-25px]'>{product?.unitsAvailable} Units left</div>:""} 
                                                    <div className='flex justify-center items-center bg-purple-100 text-purple-900 text-lg font-bold h-6 w-6 cursor-pointer rounded-sm ' onClick={()=>reduceQuantity()}> <span>-</span> </div>
                                                    <div className='flex justify-center items-center  h-4 w-4'> <span>{product?.unitsAvailable?cartItem.quantity:""}</span> </div>
                                                    <div className='flex justify-center items-center bg-purple-100 text-purple-900 text-lg font-bold h-6 w-6 cursor-pointer rounded-sm ' onClick={()=>increaseQuantity()}> <button disabled={(product?.quantityType=="Limited Quantity" && product?.unitsAvailable<=Number(cartItem.quantity))}>+</button> </div> 
                                            </div>:!isLoading?<span className='text-red-600'>Out of Stock</span>:""}
                                        </div>
                                        <div className='col-span-2 text-left md:text-center'>{product?"₦"+product.price:""}</div>
                                    </div>
                               </div>
                                <div className='col-span-1 text-right ' onClick={()=>removeFromCart()}>remove</div>
    </div>
  )
}

export default CartItem