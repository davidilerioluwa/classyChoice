import React, { useState } from 'react'
import { BsCaretDown } from 'react-icons/bs';
import { toast } from 'sonner';
import { getUserSession } from '../lib/session';
import { useSnapshot } from 'valtio';
import { state } from '@/store/state';

const UpdateProfileForm = ({setShowUpdateProfile}:{setShowUpdateProfile:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const statesInNigeria = [
        "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State", "Bayelsa State", "Benue State",
        "Borno State", "Cross River State", "Delta State", "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "Gombe State",
        "Imo State", "Jigawa State", "Kaduna State", "Kano State", "Katsina State", "Kebbi State", "Kogi State", "Kwara State",
        "Lagos State", "Nasarawa State", "Niger State", "Ogun State", "Ondo State", "Osun State", "Oyo State", "Plateau State",
        "Rivers State", "Sokoto State", "Taraba State", "Yobe State", "Zamfara State", "Federal Capital Territory (Abuja)"
      ];
      const snap=useSnapshot(state)
      const [address,setAddress]= useState(snap.user?.address)
      const [city,setCity]=useState(snap.user?.city)
      const [State,setState]=useState(snap.user?.state)
      const [phoneNumber,setPhoneNumber]=useState(snap.user?.phoneNumber)
      const [name,setName]=useState(snap.user?.name)
      console.log(State);
      
     
      const updateProfile= async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
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
         setShowUpdateProfile(false)
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
  return (
    <div className='w-screen h-screen bg-black top-0 left-0 fixed z-30'>
         <section className={`text-purple-800 w-full bg-lgray flex flex-col gap-1 w-[300px] absolute  left-[-100px] z-50 `}>
                <div className={`fixed flex items-center justify-center h-screen w-screen bg-black top-0 left-0 z-40 p-4`}
              style={{ backgroundColor: 'rgba(128, 128, 128, 0.7)' }}
              >
                
                <div className="relative bg-white   p-8 m-auto w-full md:w-3/5 xl:w-2/5 rounded-lg  overflow-y-auto">
                  <div onClick={()=>setShowUpdateProfile(false)} className="absolute top-2 right-2 rounded-md w-8 h-8 bg-purple-800 flex items-center justify-center cursor-pointer" >
                    <span className=" text-xl text-white pb-1">x</span>
                  </div>
                  <h1 className="w-full pb-2 text-center">Address Details</h1>
                  <form className="flex flex-col gap-2 text-sm">
                    <div className="flex flex-col gap-1 w-full">
                        <label>Name</label>
                        <input required={true} value={name} onChange={(e)=>setName(e.target.value)} type="text" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Adress"/>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label>Phone Number</label>
                        <input required={true} value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} type="text" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Adress"/>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label>Address</label>
                        <input required={true} value={address} onChange={(e)=>setAddress(e.target.value)} type="text" className="border border-purple-800 rounded-md p-2 outline-none" placeholder="Adress"/>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ">
                        <div className="flex flex-col gap-1">
                          <label>City/Town</label>
                          <input required={true} value={city} type="text" onChange={(e)=>setCity(e.target.value)} className="border border-purple-800 rounded-md p-2 outline-none" placeholder="City/Town"/>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label>State</label>
                          <div className="flex relative rounded-md justify-between">
                            <select required={true} value={State} onChange={(e)=>setState(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 rounded-md text-sm">
                              {statesInNigeria.map((State)=><option key={State} value={State}>{State} </option>)}
                            </select>
                            <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                          </div>
                        </div>
                    </div>
                    <button className="bg-purple-800 text-white rounded-md py-2 mt-2" type={"submit"} onClick={(e)=>updateProfile(e)}>Save</button>
                  </form>
                </div>
              </div>
            </section>
    </div>
  )
}

export default UpdateProfileForm