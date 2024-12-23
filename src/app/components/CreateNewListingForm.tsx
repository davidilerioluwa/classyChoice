import React, { ChangeEvent, Dispatch, SetStateAction,useEffect,useState } from 'react'
import { categories } from '@/store/constants'
import { BsCaretDown } from 'react-icons/bs'
import { toast } from 'sonner'

const CreateNewListingForm = ({setShowListingForm,getProducts}:{setShowListingForm:Dispatch<SetStateAction<boolean>>,getProducts:Function}) => {
  const [files,setFiles]= useState<Array<File>>([])
  const [title,setTitle]= useState("")
  const [description,setDescription]=useState("")
  const [price,setPrice]= useState<string>("")
  const [category,setCategory] = useState<string>("other")

  const [urls,setUrls]= useState<Array<string>>([])
 
console.log(category);

 
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
  const CreateNewListing = async (e:ChangeEvent<HTMLInputElement>)=>{
    const formData = new FormData();
    e.preventDefault()
    files.forEach(file => {
        formData.append("files",file)
    });
    formData.append("title",title)
    formData.append("description",description)
    formData.append("category",category)
    formData.append("price",price)
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
  
    return (

    <div className='bg-black z-50 top-0 left-0 bg-opacity-50 fixed flex justify-center items-center h-screen w-screen p-20'>
        <div className='bg-white rounded-md p-4 w-96 h-full md:h-screen  relative overflow-y-auto'>
            <span onClick={()=>setShowListingForm(false)} className='absolute top-2 right-2 px-3  pb-1 rounded-md cursor-pointer text-xl  text-red-800 border border-red-800 '>x</span>
            <h1 className='text-lg text-center mt-2 font-bold text-purple-800 w-full '>Create New Listing</h1>
            <form className='text-purple-800 flex flex-col gap-2' onSubmit={(e:any)=>CreateNewListing(e)}>
                <div className='flex flex-col gap-2'>
                    <label>Title</label>
                    <input onChange={(e)=>setTitle(e.target.value)} type='text' className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Description</label>
                    <textarea onChange={(e)=>setDescription(e.target.value)}  className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Price</label>
                    <input onChange={(e)=>setPrice(e.target.value)} type='number' className='px-2 py-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md'/>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Category</label>
                    <div className="flex relative rounded-md justify-between">
                        <select onChange={(e)=>setCategory(e.target.value)} className="appearance-none  outline-none w-full  border border-purple-800 p-2 py-3 rounded-md text-sm">
                        {categories.map((Category)=><option value={Category}>{Category}</option>)}
                        </select>
                        <span className="absolute right-2 flex items-center top-2 rounded-md bg-purple-800 p-1 text-white"><BsCaretDown/></span>
                    </div>
                </div>
                <div>
                    <div className='mb-2'>Pictures</div>
                    <div className='flex items-center justify-center flex-wrap gap-2 mb-20'>
                    {urls.map((url)=><div className='relative border border-purple-800 rounded-md'>
                            <span className='absolute right-2 top-2 px-3 py-1 cursor-pointer bg-purple-800 text-white rounded-md'>x</span>
                            <img src={url} className='object-cover w-32 h-32 rounded-md'/>
                    </div>)}
                    <div className='relative w-32 h-32 cursor-pointer'>
                        <input className='w-full bg-purple-800 w-6 h-32 bg-opacity-10 cursor-pointer' type='file' accept='image/*' multiple onChange={(e:ChangeEvent<HTMLInputElement>)=>addNewFile(e)}/>
                        <div className='w-32 h-32 absolute top-0 right-0 text-white bg-purple-800 flex z-[-10] justify-center items-center text-5xl'><span>+</span></div>
                    </div>
                    </div>
                </div>
                <button type='submit' className='w-full rounded-md border border-purple-800 py-2'>Create Listing</button>
            </form>
        </div>
    </div>
  )
}

export default CreateNewListingForm