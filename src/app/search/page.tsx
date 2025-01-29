"use client"
import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/ProductsCard'
import { iProduct } from '../lib/models/Product'
import { useSnapshot } from 'valtio'
import { state } from '@/store/state'
import PacmanLoader from "react-spinners/PacmanLoader"
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Search from '../components/Search'
import CreateNewListingForm from '../components/CreateNewListingForm'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import SearchTags from '../components/SearchTags'


const Page = () => {
  const snap=useSnapshot(state)
  const router=useRouter()
    const [products,setProducts]=useState<Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    const [showSearch,setShowSearch]=useState(false)
    const [showListingForm, setShowListingForm]=useState(false) 
    const [EditListingId,setEditListingId]=useState("")
    const [deleteListingId,setDeleteListingId]=useState("")
    const [showAreYouSure, setShowAreYouSure] = useState (false);
    const [searchQuery,setSearchQuery]=useState(snap.filter.searchQuery)
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
    const search=async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
      e.preventDefault()
      
       state.filter.searchQuery=searchQuery
     router.push("/search")
      setShowSearch(false)
    }
    useEffect(()=>{
        (async  function getProducts(){
          setIsLoading(true)
          console.log(isLoading);
          
          const filter= snap.filter
          setSearchQuery(snap.filter.searchQuery)
          
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
    <div className='pt-24 px-4 lg:px-6 py-4 h-full min-h-screen'>
       {showAreYouSure && <AreYouSure setShowAreYouSure={setShowAreYouSure}/> }
      {showListingForm?<CreateNewListingForm setShowListingForm={setShowListingForm} EditListingId={EditListingId}/>:""}
        {showSearch?<Search setShowSearch={setShowSearch}/>:""}
        <div className='w-full flex gap-2 mb-4 '>
                        <input type='text'  value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}  className='w-full px-2 text-purple-900 outline outline-[1px] outline-purple-900 rounded-md'/>
                        <button className='bg-purple-900 px-4 py-2 rounded-md text-white text-3xl' onClick={()=>setShowSearch(true)}><HiAdjustmentsHorizontal/></button>
                        <button className='bg-purple-900 px-4 py-2 rounded-md text-white' onClick={(e)=>search(e)}>Search</button>
        </div>
        <SearchTags/> 
        <div className=' bg-white h-full drop-shadow-lg w-full rounded-md p-4'>     
            {!isLoading && <span className='font-bold text-sm py-2 mb-4 text-purple-900'>{products.length?products.length+" results":""}</span>}
                <div >
                    {isLoading?<PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>:<div className='flex flex-wrap items-center justify-center gap-2 md:gap-4'>{products.length?products.map((product)=><ProductsCard setShowAreYouSure={setShowAreYouSure} setDeleteListingId={setDeleteListingId} setEditListingId={setEditListingId} setShowListingForm={setShowListingForm} product={product} key={product.id}/>):"No Items Found, Please Try a new search"}</div>}
                </div>
        </div>
    </div>
  )
}

export default Page