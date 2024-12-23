"use client"
import React, { useEffect, useState } from 'react'
import ProductsCard from '@/app/components/ProductsCard';
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import CreateNewListingForm from '@/app/components/CreateNewListingForm';
import  { iProduct } from '@/app/lib/models/Product';
import PacmanLoader from "react-spinners/PacmanLoader"

const Page = () => {
    // const products=[1,2,3,4,5,6,7,8,9]
    const [showListingForm,setShowListingForm]= useState(false)
    const [products,setProducts] = useState <Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    console.log(products);
    async function  getProducts(){
        try{
            const response= await fetch("/api/products")
            const products=await response.json()
            setProducts(products)
            setIsLoading(false)
        }catch(error){
            console.log(error);
            
        }
    }
    useEffect(()=>{
        getProducts()
    },[])
    
  return (
    
        <div className='w-full gap-4 h-full pb-12 mt-20 p-4'>
            {showListingForm?<CreateNewListingForm setShowListingForm={setShowListingForm}/>:""}
            <h1 className='font-bold p-2 text-lg text-purple-800 mb-2'>Products</h1>
            <div className='w-full flex gap-2 mb-4'>
                        <input type='text' className='w-full px-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
                        <span className='bg-purple-800 text-white rounded-md px-2 md:px-4 cursor-pointer flex justify-center items-center text-xl md:text-3xl'><HiAdjustmentsHorizontal/></span>
                        <button className='border border-purple-800 text-sm px-4 py-2 rounded-md text-purple-800'>Search</button>
            </div>
            <p className='border border-purple-800  px-4 my-2 py-2 w-fit rounded-md text-purple-800 hover:underline cursor-pointer '  onClick={()=>setShowListingForm(true)}>Create New Listing</p>
            <section className='bg-white  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full'>
                {isLoading?<PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>:""}
                <div className='gap-2 flex flex-wrap justify-center gap-2 '>
                    {products.map((product)=><ProductsCard product={product} key={product.id} />)}
                </div>
            </section>
        </div>
  )
}

export default Page
