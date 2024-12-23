"use client"
import React,{useEffect, useState} from 'react'
import Image from 'next/image';
import { BsSliders, BsBriefcase,BsCaretDown } from "react-icons/bs";
import { state } from '@/store/state';
import { useSnapshot } from 'valtio';
import { headers } from 'next/headers';
import { iUser } from '@/app/lib/models/User';
import { toast } from 'sonner';
import { getUserSession } from '@/app/lib/session';
import { add } from 'date-fns';

const Page = () => {
  // Note: profile was updated through valtio state using the navbar
  const snap=useSnapshot(state)
  const userId=(snap.userId);
  const [showEditAccount,setShowEditAccount]= useState<boolean>(false)
  const [showEditAddress,setShowEditAddress]= useState<boolean>(false)
  const [user,setUser]=useState<iUser>()
 const [name,setName]=useState(snap.user?.name?snap.user.name:"")
 const [phoneNumber,setPhoneNumber]=useState(snap.user?.phoneNumber?snap.user.phoneNumber:"")
 const [address,setAddress]=useState(snap.user?snap.user.address:"")
 const [city,setCity]=useState(snap.user?snap.user.city:"")
 const [State,setState]=useState(snap.user?snap.user.state:"")
  const updateAccountDetails=async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault()
    toast("updating Profile")
    try{
      const response= await fetch("/api/profile",{
          method:"PATCH",
          body:JSON.stringify({
            userId:snap.user?snap.user._id:"nil",
            profile:{
              name:name,
              address:address,
              city:city,
              state:State,
              phoneNumber:phoneNumber
            }
          })
      })
      const res=await response.json()
      setShowEditAccount(false)
      setShowEditAddress(false)
      if(res.statusCode==200){
        
        (async function name() {
          toast.success("Your Profile has been sucessfully updated")
              const userSession= await getUserSession()
              const response = await fetch(`/api/profile/`,{headers:{
                id: userSession.id
              }})
              
              const res = await response.json()
                   state.user=res.user
                   console.log(res);
                   state.userId=(res.user.id); 
             
            })()
      }else{
        toast.error("something went Wrong Please Try Again")
        console.log(res);
        
      }
      
    }catch{
      toast.error("something went wrong")
    }
 }
 useEffect(()=>{
  setName(snap.user?.name?snap.user.name:"")
  setAddress(snap.user?.address?snap.user.address:"")
  setCity(snap.user?.city?snap.user.city:"")
  setState(snap.user?.state?snap.user.state:"")
  setPhoneNumber(snap.user?.phoneNumber?snap.user.phoneNumber:"")
 },[snap.user])
    
  return (
    
        <div className='w-full text-purple-800 gap-4 h-full pb-12 mt-20 p-4 min-h-screen '>
          <EditAccountDetails phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} name={name}  setName={setName} updateAccountDetails={updateAccountDetails} setShowEditAccount={setShowEditAccount} showEditAccount={showEditAccount}/>
          <EditAddressDetails address={address} city={city} state={State}  updateAccountDetails={updateAccountDetails} setAddress={setAddress} setCity={setCity} setState={setState} setShowEditAddress={setShowEditAddress} showEditAddress={showEditAddress}/>  
            <h1 className='font-bold p-2 text-lg text-purple-800 mb-2'>Account Profile</h1>
            <section className='flex flex-col md:flex-row items-center gap-4 p-4'>
               <div className='drop-shadow-md h-80 w-60 border border-purple-100 text-purple-800 p-4  rounded-md flex flex-col gap-2 justify-center items-center'>
                <p className='font-bold'>Account Details</p>
                <p className='text-sm'>{snap.user?.name?snap.user.name:"click EDIT to update name"}</p>
                <p className='text-sm'>{snap.user?.email?snap.user.email:"No Email Entered"}</p>
                <p className='text-sm'>{snap.user?.phoneNumber?snap.user.phoneNumber:"No Phone Number Entered"}</p>
                <button className='bg-purple-800 rounded-md px-6 py-1 text-white' onClick={()=>setShowEditAccount(true)}>Edit</button>
               </div>
               <div className='drop-shadow-md h-80 w-60 border border-purple-100 text-purple-800 p-4 rounded-md flex flex-col gap-2 justify-center items-center'>
                <p className='font-bold'>Address</p>
                <p className='text-sm'>{snap.user?.address?snap.user.address:"No address entered"}</p>
                <p className='text-sm'>{snap.user?.city?snap.user.city+",":""}{snap.user?.state?snap.user.state:""}</p>
                <button className='bg-purple-800 rounded-md px-6 py-1 text-white' onClick={()=> setShowEditAddress(true)}>Edit</button>
               </div>
            </section>
        </div>
  )
}
const EditAccountDetails = ({setShowEditAccount,showEditAccount,name,setName,phoneNumber,setPhoneNumber,updateAccountDetails}:{setShowEditAccount: React.Dispatch<React.SetStateAction<boolean>>,showEditAccount:boolean,name:string,setName:React.Dispatch<React.SetStateAction<string>>,updateAccountDetails:Function,phoneNumber:string,setPhoneNumber:React.Dispatch<React.SetStateAction<string>>})=>{
 
  return(
      <section className={`text-purple-800 w-full bg-lgray p-4 flex flex-col gap-1 absolute  left-[-100px] z-50 ${showEditAccount?"flex":"hidden"}`}>
        <div className={`fixed flex items-center justify-center h-screen w-screen bg-black top-0 left-0 z-40 p-4`}
      style={{ backgroundColor: 'rgba(128, 128, 128, 0.7)' }}
      >
        
        <div className="relative bg-white   p-8 m-auto w-80 md:w-[400px] rounded-lg  overflow-y-auto">
          <div onClick={()=>setShowEditAccount(false)} className="absolute top-2 right-2 rounded-md w-8 h-8 bg-purple-800 flex items-center justify-center cursor-pointer" >
            <span className=" text-xl text-white pb-1">x</span>
          </div>
          <h1 className="w-full pb-2 text-center">Account Details</h1>
          <form className="flex flex-col gap-2 text-sm">
              <div className="flex flex-col gap-1">
                <label>Email Address</label>
                <input disabled value="davidilerioluwa1998@gmail.com" type="text" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Email Address"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Account Name</label>
                <input value={name} type="text" onChange={(e)=>setName(e.target.value)} className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Account Name"/>
              </div>
              <div className="flex flex-col gap-1">
                <label>Phone Number</label>
                <input value={phoneNumber} type="text" onChange={(e)=>setPhoneNumber(e.target.value)} className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Phone Number"/>
              </div>
              <button className="bg-purple-800 text-white rounded-md py-2 mt-2" onClick={(e)=>updateAccountDetails(e)}>Save</button>
          </form>
        </div>
      </div>
    </section>
    )
}
const EditAddressDetails = ({setShowEditAddress,showEditAddress,address,city,state,setAddress,setCity,setState,updateAccountDetails}:{setShowEditAddress: React.Dispatch<React.SetStateAction<boolean>>,showEditAddress:boolean,address:string,city:string,state:string,setCity:React.Dispatch<React.SetStateAction<string>>,setAddress:React.Dispatch<React.SetStateAction<string>>,setState:React.Dispatch<React.SetStateAction<string>>,updateAccountDetails:Function})=>{
 
  const statesInNigeria = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory (Abuja)"
  ];

  return(
      <section className={`text-purple-800 w-full bg-lgray flex flex-col gap-1 w-[300px] absolute  left-[-100px] z-50 ${showEditAddress?"flex":"hidden"}`}>
        <div className={`fixed flex items-center justify-center h-screen w-screen bg-black top-0 left-0 z-40 p-4`}
      style={{ backgroundColor: 'rgba(128, 128, 128, 0.7)' }}
      >
        
        <div className="relative bg-white   p-8 m-auto w-full md:w-3/5 xl:w-2/5 rounded-lg  overflow-y-auto">
          <div onClick={()=>setShowEditAddress(false)} className="absolute top-2 right-2 rounded-md w-8 h-8 bg-purple-800 flex items-center justify-center cursor-pointer" >
            <span className=" text-xl text-white pb-1">x</span>
          </div>
          <h1 className="w-full pb-2 text-center">Address Details</h1>
          <form className="flex flex-col gap-2 text-sm">
              <div className="flex flex-col gap-1 w-full">
                <label>Address</label>
                <input value={address} onChange={(e)=>setAddress(e.target.value)} type="text" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Adress"/>
              </div>
              <div className="grid grid-cols-2 gap-2 ">
                <div className="flex flex-col gap-1">
                  <label>City/Town</label>
                  <input value={city} type="text" onChange={(e)=>setCity(e.target.value)} className="border border-purple-800 rounded-md p-2 outline-none" placeholder="City/Town"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label>State</label>
                  <div className="flex relative rounded-md justify-between">
                    <select value={state} onChange={(e)=>setState(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 rounded-md text-sm">
                      {statesInNigeria.map((state)=><option key={state} value={state}>{state}</option>)}
                    </select>
                    <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                  </div>
                </div>
              </div>
              <button className="bg-purple-800 text-white rounded-md py-2 mt-2" onClick={(e)=>updateAccountDetails(e)}>Save</button>
          </form>
        </div>
      </div>
    </section>
    )
}
export default Page
