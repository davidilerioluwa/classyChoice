"use client"
import React,{useState,useEffect} from 'react'
import ProductsCard from './ProductsCard'
import { iProduct } from '../lib/models/Product'
import PacmanLoader from "react-spinners/PacmanLoader"
import { toast } from 'sonner'
import CreateNewListingForm from './CreateNewListingForm'
import Link from 'next/link'
import {  BsArrowRight } from 'react-icons/bs'



const HompageSection = ({sectionName,productIds}:{sectionName:string,productIds:string []}) => {
    // const [active,setActive]=useState(categories[0].mainCategory)
    const [products,setProducts]=useState<Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    const [showListingForm,setShowListingForm]= useState(false)
    const [EditListingId,setEditListingId]=useState("")
    const [deleteListingId,setDeleteListingId]=useState("")
          const [showAreYouSure, setShowAreYouSure] = useState (false); 
          
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
        setIsLoading(true)
        
            try{
                const response= await fetch("/api/filterProducts",{
                  body:JSON.stringify({_id:{$in:productIds}}),
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
    },[])
  return (
    <section className='w-screen '>
       {showAreYouSure && <AreYouSure setShowAreYouSure={setShowAreYouSure}/> }
       {showListingForm?<CreateNewListingForm EditListingId={EditListingId} setShowListingForm={setShowListingForm}/>:""}
        <div className='flex px-6 md:px-16 lg:px-24 py-4 items-center justify-between w-full text-purple-900 font-bold bg-white drop-shadow-lg'>
          <div>{sectionName}</div>
          <Link href={"/search"} className='flex gap-2 items-center'><span>View All</span> <span className='text-xl font-bolder'><BsArrowRight /></span></Link>
        </div>
        {isLoading?<div className='flex justify-center'><PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/></div>:
        <div className='flex flex-wrap gap-6 md:gap-4 justify-center p-2 md:p-4 bg-gray-100 pb-8 md:pb-16'>
            {products.length?products.slice(0,10).map((product)=><ProductsCard setDeleteListingId={setDeleteListingId} setEditListingId={setEditListingId} setShowAreYouSure={setShowAreYouSure} setShowListingForm={setShowListingForm} product={product} key={product.id}/>):"No Items Found"}
        </div>}
      </section>
  )
}

export default HompageSection