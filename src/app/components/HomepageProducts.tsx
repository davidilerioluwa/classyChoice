"use client"
import React,{useState,useEffect} from 'react'
import ProductsCard from './ProductsCard'
import { iProduct } from '../lib/models/Product'
import { categories } from '@/store/constants'
import PacmanLoader from "react-spinners/PacmanLoader"



const HomepageProducts = () => {
    const [active,setActive]=useState(categories[0])
    const [products,setProducts]=useState<Array<iProduct>>([])
    const [isLoading,setIsLoading]= useState(true)
    useEffect(()=>{
      (async  function getProducts(){
        const filter= {category:active}
        setIsLoading(true)
        
            try{
                const response= await fetch("/api/filterProducts",{
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
    },[active])
  return (
    <section className='w-screen '>
        <div className='flex flex-col items-center justify-center '>
          <div className='flex flex-wrap justify-center items-center gap-6 text-sm  py-2 px-2 rounded-md mt-4 mx-4 bg-gray-200 rounded-md'>
             {categories.map((category)=><button className={`cursor-pointer text-purple-900 p-1  ${active===category?" font-bold drop-shadow-md bg-white rounded-md":""}`} onClick={()=>setActive(category)}>{category}</button>)}
          </div>
          <div className='flex gap-2 py-4'>
              {categories.map((category)=><span className={`cursor-pointer h-4 w-4 rounded-full ${active===category?"bg-purple-800":"border border-purple-800"}`} key={category} onClick={()=>setActive(category)}></span>)}
          </div>
        </div>
        {isLoading?<div className='flex justify-center'><PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/></div>:
        <div className='flex flex-wrap md:gap-4 justify-center p-1 md:p-4 bg-gray-100'>
            {products.length?products.map((product)=><ProductsCard product={product} key={product.id}/>):"No Items Found"}
        </div>}
      </section>
  )
}

export default HomepageProducts