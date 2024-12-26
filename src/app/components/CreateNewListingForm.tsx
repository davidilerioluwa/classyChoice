import React, { ChangeEvent, Dispatch, SetStateAction,useEffect,useState } from 'react'
import { categories } from '@/store/constants'
import { BsCaretDown } from 'react-icons/bs'
import { toast } from 'sonner'
import { iProduct } from '../lib/models/Product'
import PacmanLoader from 'react-spinners/PacmanLoader'

const CreateNewListingForm = ({setShowListingForm,EditListingId}:{setShowListingForm:Dispatch<SetStateAction<boolean>>,EditListingId?:string}) => {
  const [files,setFiles]= useState<Array<File>>([])
  const [title,setTitle]= useState("")
  const [description,setDescription]=useState("")
  const [price,setPrice]= useState<string>("")
  const [category,setCategory] = useState<string>("Others")
  const [subCategories,setSubCategories]=useState <Array<string>> ([])
  const [subCategory,setSubCategory]=useState <string>("")
  const [isLoading,setIsLoading]= useState(false)
  const [urls,setUrls]= useState<Array<string>>([])
  const [oldUrls,setOldUrls]=useState <Array<{url:string,assetId:string}>>([])
  const [deletedUrls,setDeletedUrls]=useState<Array<string>>([])
  const [QuantityType,setQuantityType]=useState("Limited Quantity")
  const [unitsAvailable,setUnitsAvailable]=useState(0)
  const  addNewFile= (e:ChangeEvent<HTMLInputElement>)=>{
    const formData= new FormData()
    const newFilesArray=files
    const newFiles =Array.from(e.target.files as FileList)
    newFiles.forEach((file)=>{
        newFilesArray.push(file)
    })
    setFiles(newFilesArray);
    console.log(files);
    const urlList=[]
    for(const file of newFilesArray){
        formData.append("files",file)
        const url=URL.createObjectURL(file)
        urlList.push(url)
    }
    setUrls(urlList);
    
    
  }
  const CreateNewListing = async (e:React.FormEvent<HTMLFormElement>)=>{
    const formData = new FormData();
    e.preventDefault()
    files.forEach(file => {
        formData.append("files",file)
    });
    formData.append("title",title)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("price",price)
    formData.append("subCategory",subCategory)
    formData.append("quantityType",QuantityType)
    formData.append("unitsAvailable",String(unitsAvailable))
    console.log(files);
    
    console.log(formData.getAll("files"));
    
    
    toast("uploading")
    try {
        const response = await fetch('/api/products', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to send data');
        }
  
        const data = await response.json();
        if(data){
          toast.success(data.message)
          location.reload()
          
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("something went wrong please try again")
        console.log();
        
      }
  }
  const updateListing= async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const formData = new FormData();
    files.forEach(file => {
        formData.append("files",file)
    });
    formData.append("id",String(EditListingId))
    formData.append("title",title)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("price",price)
    formData.append("subCategory",subCategory)
    formData.append("quantityType",QuantityType)
    formData.append("unitsAvailable",String(unitsAvailable))
    formData
   oldUrls.map((oldImg)=> formData.append("oldUrls",JSON.stringify({url:oldImg.url,assetId:oldImg.assetId})))
   deletedUrls.map((assetId)=> formData.append("deletedUrls",assetId))

    console.log(files);
    
    console.log(formData.getAll("files"));
    console.log(formData.getAll("oldUrls"));
    console.log(formData.getAll("deletedUrls"));
    
    
    toast("uploading")
    try {
        const response = await fetch('/api/products', {
          method: 'PATCH',
          body: formData,
        });
  
        const data = await response.json();
        if(data){
          toast.success(data.message)
          location.reload()
          
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("something went wrong please try again")
        console.log();
        
      }
  }
  const deleteUrl=(index:number)=>{
   const filtered= files.filter((Url,Index)=>Index!==index)
   const filteredUrls= urls.filter((Url,Index)=>Index!==index)
  setFiles(filtered);
  setUrls(filteredUrls)
  console.log(files);
  }
  const deleteOldUrl=(assetId:string)=>{
    const filtered= oldUrls.filter((Url)=>Url.assetId!==assetId)
    setOldUrls(filtered)
    const newDeleted= deletedUrls
    newDeleted.push(assetId)
    console.log(newDeleted);
    if(false){setDeletedUrls([])}
    
  }
  const getListingDetails=async()=>{

     try{
          const response= await fetch("/api/filterProducts",{
            body:JSON.stringify({
              _id:EditListingId,
            }),
            method:"POST"
          })
          const res=await response.json()
          
          setIsLoading(false)
          if(res.length){
            const products:iProduct = res[0]
            setTitle(products.title)
            setCategory(products.category)
            setSubCategory(products.subCategory)
            setDescription(products.description)
            setQuantityType(products.quantityType)
            setUnitsAvailable(products.unitsAvailable)
            setPrice(String(products.price))
            setOldUrls(products.images)
          }
          
          
      }catch{
    
      }
  }
  useEffect(()=>{
    if(EditListingId){
      setIsLoading(true)
      console.log(EditListingId);
      
      getListingDetails()
    }
  },[])
  useEffect(()=>{
   setSubCategories(categories.find((Category)=>Category.mainCategory==category)?.subCategories as string[])
  },[category])
  useEffect(()=>{
    {subCategories?.length?setSubCategory(subCategories[0]):setSubCategory("")}
  },[subCategories])
    return (

    <div className='bg-black z-50 top-0 left-0 bg-opacity-50 fixed flex justify-center items-center h-screen w-screen md:py-40 p-10 md:p-20'>
        <div className='bg-white rounded-md p-4 w-96 h-full md:h-screen  relative overflow-y-auto'>
            <span onClick={()=>setShowListingForm(false)} className='absolute top-2 right-2 px-3  pb-1 rounded-md cursor-pointer text-xl  text-red-800 border border-red-800 '>x</span>
            <h1 className='text-lg text-center mt-2 font-bold text-purple-800 w-full '>Create New Listing</h1>
            {isLoading?<div className='w-full h-full flex items-center justify-center '><PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/></div>:
            <form className='text-purple-800 flex flex-col gap-2' onSubmit={(e:React.FormEvent<HTMLFormElement>)=>{EditListingId?updateListing(e):CreateNewListing(e)}}>
            <div className='flex flex-col gap-2'>
                <label>Title</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} type='text' className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label>Description</label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)}  className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label>Price</label>
                <input value={price} onChange={(e)=>setPrice(e.target.value)} type='number' className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
            </div>
            <div className='flex flex-col gap-2'>
                <label>Category</label>
                <div className="flex relative rounded-md justify-between">
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 py-3 rounded-md text-sm">
                    {categories.map((Category,index)=><option key={index} value={Category.mainCategory}>{Category.mainCategory}</option>)}
                    </select>
                    <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                </div>
            </div>
            {subCategories?.length?
            <div className='flex flex-col gap-2'>
                <label>Sub-Category</label>
                <div className="flex relative rounded-md justify-between">
                    <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 py-3 rounded-md text-sm">
                    {subCategories.map((Category,index)=><option key={index} value={Category}>{Category}</option>)}
                    </select>
                    <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                </div>
            </div>:""}
            <div className='flex flex-col gap-2'>
                <label>Quantity Type</label>
                <div className="flex relative rounded-md justify-between">
                    <select value={QuantityType} onChange={(e)=>setQuantityType(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 py-3 rounded-md text-sm">
                    <option value={"UnLimited Quantity"}>UnLimited Quantity</option>
                      <option value={"Limited Quantity"}>Limited Quantity</option>
                    </select>
                    <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                </div>
            </div>
            {QuantityType=="Limited Quantity"?
            <div className='flex flex-col gap-2'>
              <label>Units Available</label>
              <input value={unitsAvailable} onChange={(e)=>setUnitsAvailable(Number(e.target.value))} type='number' className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
            </div>
              :""
            }
            <div>
                <div className='mb-2'>Pictures</div>
                <div className='flex items-center justify-center flex-wrap gap-2 mb-20'>
                {oldUrls.map((url,index)=><div key={url.url} className='relative border border-purple-800 rounded-md'>
                        <span onClick={()=>deleteOldUrl(url.assetId)} key={index} className='absolute right-2 top-2 px-3 py-1 cursor-pointer bg-purple-800 text-white rounded-md'>x</span>
                        <img src={url.url} className='object-cover w-32 h-32 rounded-md'/>
                </div>)}
                {urls.map((url,index)=><div key={index} className='relative border border-purple-800 rounded-md'>
                        <span onClick={()=>deleteUrl(index)} className='absolute right-2 top-2 px-3 py-1 cursor-pointer bg-purple-800 text-white rounded-md'>x</span>
                        <img src={url} className='object-cover w-32 h-32 rounded-md'/>
                </div>)}
                
                <div className='relative w-32 h-32 cursor-pointer'>
                    <input className='w-full bg-purple-800 w-6 h-32 bg-opacity-10 cursor-pointer' type='file' accept='image/*' multiple onChange={(e:ChangeEvent<HTMLInputElement>)=>addNewFile(e)}/>
                    <div className='w-32 h-32 absolute top-0 right-0 text-white bg-purple-800 flex z-[-10] justify-center items-center text-5xl'><span>+</span></div>
                </div>
                </div>
            </div>
            <button type='submit' className='w-full rounded-md border border-purple-800 py-2'>{EditListingId?"Update Listing":"Create Listing"}</button>
        </form>
            }
        </div>
    </div>
  )
}

export default CreateNewListingForm