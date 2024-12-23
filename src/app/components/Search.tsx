"use client"
import { categories } from "@/store/constants";
import { state } from "@/store/state";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import {BsCaretDown } from "react-icons/bs";
import { useSnapshot } from "valtio";

interface ChildProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}
const  Search: React.FC<ChildProps> =({setShowSearch})  =>{
  const router=useRouter()
  const [searchQuery,setSearchQuery]=useState("")
  const [startingAmount,setStartingAmount]=useState(0)
  const [highestAmount,setHighestAmount]=useState(10000000)
  const [category,setCategory]=useState("")

const search=async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
  e.preventDefault()
  
   state.filter={
      searchQuery:searchQuery,
      minAmount:startingAmount,
      maxAmount:highestAmount,
      category:category
    }
    
 router.push("/search")
  setShowSearch(false)
}
  
  return (
    <section className="w-full bg-lgray flex flex-col gap-1 absolute  left-[-100px] z-50">
        <div className={`fixed flex items-center justify-center h-screen w-screen bg-black top-0 left-0 z-40 p-4`}
      style={{ backgroundColor: 'rgba(128, 128, 128, 0.7)' }}
      >
        
        <div className="relative bg-white   p-8 m-auto w-full md:w-4/5 xl:w-2/5 rounded-lg  overflow-y-auto">
          <div onClick={()=>setShowSearch(false)} className="absolute top-2 right-2 rounded-md w-8 h-8 bg-purple-800 flex items-center justify-center cursor-pointer" >
            <span className=" text-xl text-white pb-1">x</span>
          </div>
          <h1 className="w-full pb-2 text-center">Products Search</h1>
          <form className="flex flex-col gap-2 text-sm">
              <div className="flex flex-col gap-1 w-full">
                <label>Search Query</label>
                <input type="text" onChange={(e)=>setSearchQuery(e.target.value)} className="border border-purple-800 rounded-md p-2 outline-none w-full" placeholder="Enter search query"/>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <label>Starting Amount</label>
                  <input onChange={(e)=>setStartingAmount(Number(e.target.value))} type="number" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Enter "/>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label>Highest Amount</label>
                  <input onChange={(e)=>setHighestAmount(Number(e.target.value))} type="number" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Enter "/>
                </div>
              </div>
              <div className="flex gap-2 ">
                <div className="flex flex-col gap-1 w-1/2">
                  <label>Category</label>
                  <div className="flex relative rounded-md justify-between">
                    <select onChange={(e)=>setCategory(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 rounded-md text-sm">
                    <option className="hover:bg-purple-800 hover:text-white" value={""} >All</option>
                      {categories.map((category)=><option className="hover:bg-purple-800 hover:text-white" value={category} key={category}>{category}</option>)}
                    </select>
                    <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                  </div>
                </div>
              </div>
              <button className="bg-purple-800 text-white rounded-md py-2 mt-2" onClick={(e)=>search(e)}>Search</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Search;
