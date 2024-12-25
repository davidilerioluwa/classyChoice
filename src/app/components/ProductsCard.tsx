import React, { useEffect, useState } from 'react'
import { iProduct } from '../lib/models/Product'
import { state } from '@/store/state';
import { useSnapshot } from 'valtio';
import { toast } from 'sonner';

const ProductsCard = ({product,setEditListingId,setShowListingForm,setDeleteListingId,setShowAreYouSure}:{product:iProduct,setEditListingId:React.Dispatch<React.SetStateAction<string>>,setShowListingForm:React.Dispatch<React.SetStateAction<boolean>>,setDeleteListingId:React.Dispatch<React.SetStateAction<string>>,setShowAreYouSure:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const snap=useSnapshot(state)
  const [disableAdd,setDisableAdd]=useState(true)
  const [showEditMenu,setShowEditMenu]=useState(false)
  const [hideCard,setHideCard]=useState(false)

  
  const AddProductToCart=async ()=>{
    setDisableAdd(true)
    const productId=product._id
    try{
      const response= await fetch("/api/cart",{
        body:JSON.stringify({
          productId:productId,
          quantity:"1",
          userId:snap.user?._id
        }),
        method:"POST"
      })
      const products=await response.json()
      if(products){
        toast.success("Item has been sucessfully added to cart")
      }
      
      
  }catch{

  }
  }
  const CheckIfProductAlreadyInCart=async ()=>{
    const response= await fetch("/api/checkIfProductAlreadyInCart",{
      method:"POST",
      body:JSON.stringify({
        productId:product._id,
          userId:snap.user?._id
      })
    })
    const res=await response.json()
    
    if(res.message == "This Item has not been added to cart"){
      setDisableAdd(false)
    }
  }
  
  

  useEffect(()=>{
    CheckIfProductAlreadyInCart()
  },[])
  
  return (
    <div className={`bg-white drop-shadow-md p-3 rounded-md  flex flex-col gap-0.5 cursor-pointer ${hideCard?"hidden":""}`}>
        <img src={product.images?product.images[0].url:""} className='w-32 md:w-60 h-32 md:h-60 bg-white drop-shadow-lg m-0 rounded-md object-cover'/>
        <p className='font-bold text-purple-800 mt-2 hover:text-purple-800 '>{product.title}</p>
        <p className='text-purple-800 mb-2'>₦{product.price}</p>
        {snap.user?.accountType=="admin"?
          <div className='relative' 
           onClick={()=>setShowEditMenu(!showEditMenu)}
           onMouseLeave={()=>setShowEditMenu(false)}
          >
            <button className='bg-purple-900 hover:bg-purple-950  text-white w-full rounded-md px-4 py-2 text-sm'
              
            >Edit</button>
            {showEditMenu?
            <div className='absolute text-purple-900 w-full bg-white drop-shadow-lg rounded-md p-2 flex flex-col gap-1 top-[-65px]'>
                <button className='bg-white p-1 rounded-md hover:drop-shadow-lg' onClick={()=>{
                  if(setEditListingId && setShowListingForm){
                    setEditListingId(String(product._id))
                    setShowListingForm(true)
                  }
                }}>Edit</button>
                <button className='bg-white rounded-md p-1 hover:drop-shadow-lg' onClick={()=>{
                  setShowAreYouSure(true)
                  setDeleteListingId(String(product._id))
                }}>Delete</button>
            </div>
            :""}
          </div>
        :
          <button disabled={disableAdd} className='bg-purple-900 hover:bg-purple-950  text-white w-full rounded-md px-4 py-2 text-sm' onClick={(()=> AddProductToCart())}>{disableAdd?"Added To Cart":"Add to Cart"}</button>
        }
    </div>
  )
}

export default ProductsCard