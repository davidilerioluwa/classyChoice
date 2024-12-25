"use client"
import React, { useEffect, useState } from 'react'
import ProductsCard from '@/app/components/ProductsCard';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import CreateNewListingForm from '@/app/components/CreateNewListingForm';
import  { iProduct } from '@/app/lib/models/Product';
import PacmanLoader from "react-spinners/PacmanLoader"
import { toast } from 'sonner';
import Search from '@/app/components/Search';
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';

const Page = () => {
    // const products=[1,2,3,4,5,6,7,8,9]
    const [showListingForm,setShowListingForm]= useState(false)
    const [products,setProducts] = useState <Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    const [EditListingId,setEditListingId]=useState("")
    const [deleteListingId,setDeleteListingId]=useState("")
    const [showSearch,setShowSearch]=useState(false)
      const [showAreYouSure, setShowAreYouSure] = useState (false);
        const snap=useSnapshot(state)
    console.log(products);
    async function  getProducts(){
        try{
            const response= await fetch("/api/products")
            const products=await response.json()
            {products.length?setProducts(products):setProducts([])}
            setIsLoading(false)
        }catch(error){
            console.log(error);
            
        }
    }
    const deleteProduct=async ()=>{
        toast("loading")
        const response= await fetch("/api/products",{
          method:"PUT",
          body:JSON.stringify(deleteListingId)
        })
        const res=await response.json()
        location.reload()
        if(res.message=="sucessfully deleted"){
          toast.success("Item has been sucessfully deleted")
        }
      }
    const AreYouSure=({setShowAreYouSure}:{setShowAreYouSure:React.Dispatch<React.SetStateAction<boolean>>})=>{
        return(
        <div className={`fixed top-0 w-screen h-screen flex items-center justify-center bg-opacity-50 bg-black z-50 left-0`}>
          <div className='w-fit text-sm sm:text-md p-4 sm:p-8 bg-white rounded-md flex flex-col gap-4 justify-center items-center'>
            <p>Are You Sure You Want To Delete This Listing</p>
            <div className='flex w-full  justify-between'>
                <button onClick={()=>deleteProduct()} className=' px-12 py-1.5  bg-green-800 rounded-md text-white'>Yes</button>
                <button onClick={()=>setShowAreYouSure(false)} className=' px-12 py-1.5  bg-red-600 rounded-md text-white'>No</button>
            </div>
          </div>
        </div>)
      }
   useEffect(()=>{
          (async  function getProducts(){
            const filter= snap.filter
            console.log(filter);
            
                try{
                    const response= await fetch("/api/findProducts",{
                      body:JSON.stringify(filter),
                      method:"POST"
                    })
                    const products=await response.json()
                    setIsLoading(false)
                    // checks to see if the products have a length, and if it doesnt it does set the products state
                    if(products.length){
                      setProducts(products)
                    }else{
                      setProducts([])
                      
                    }
                    
                }catch{
                    setProducts([])
                }
            })()
        },[snap.filter])
    
  return (
    
        <div className='w-full gap-4 h-full pb-12 mt-20 p-4'>
            {showAreYouSure && <AreYouSure setShowAreYouSure={setShowAreYouSure}/> }
            {showListingForm?<CreateNewListingForm EditListingId={EditListingId} setShowListingForm={setShowListingForm}/>:""}
            {showSearch?<Search setShowSearch={setShowSearch}/>:""}
            <h1 className='font-bold p-2 text-lg text-purple-800 mb-2'>Products</h1>
            <div className='w-full flex gap-2 mb-4 '>
                                    <input type='text' className='w-full px-2 text-purple-900 outline outline-[1px] outline-purple-900 rounded-md'/>
                                    <button className='bg-purple-900 px-2 py-1.5 rounded-md text-white text-lg md:text-3xl' onClick={()=>setShowSearch(true)}><HiAdjustmentsHorizontal/></button>
                                    <button className='bg-purple-900 px-2 py-1.5 rounded-md text-white'>Search</button>
            </div>
            <p className='border border-purple-800  px-4 my-2 py-2 w-fit rounded-md text-purple-800 hover:underline cursor-pointer '  onClick={()=>setShowListingForm(true)}>Create New Listing</p>
            <section className='bg-white  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full'>
                {isLoading?<PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>:""}
                <div className='gap-2 flex flex-wrap justify-center gap-2 '>
                    {products.map((product)=><ProductsCard setShowAreYouSure={setShowAreYouSure} setDeleteListingId={setDeleteListingId} setShowListingForm={setShowListingForm} setEditListingId={setEditListingId} product={product} key={product.id} />)}
                </div>
            </section>
        </div>
  )
}

export default Page
