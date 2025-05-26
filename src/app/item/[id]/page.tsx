"use client"
import CreateNewListingForm from "@/app/components/CreateNewListingForm";
import { iCart } from "@/app/lib/models/Cart";
import { iProduct } from "@/app/lib/models/Product";
import { state } from "@/store/state";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSnapshot } from "valtio";

export default function Page({ params }:{params:Params}) {
    const { id } = params;
    const router=useRouter()
    const [product,setProduct]=useState<iProduct>()
        const [showListingForm,setShowListingForm]= useState(false)
        const [showAreYouSure, setShowAreYouSure] = useState (false); 
        const [disableAdd,setDisableAdd]=useState(true)
        const [showEditMenu,setShowEditMenu]=useState(false)
              
    const snap=useSnapshot(state)
    const images=product?.images
    const [activeImage,setActiveImage]=useState(0)
    const deleteProduct=async ()=>{
      toast("loading")
      const response= await fetch("/api/products",{
        method:"PUT",
        body:JSON.stringify(id)
      })
      const res=await response.json()
      router.push("/dashboard/products")
      if(res.message=="sucessfully deleted"){
        toast.success("Item has been sucessfully deleted")
      }
    }
    const AddProductToCart=async ()=>{
      setDisableAdd(true)
      try{
        const response= await fetch("/api/cart",{
          body:JSON.stringify({
            productId:id,
            quantity:"1",
            userId:snap.user?._id,
            title: product?.title
          }),
          method:"POST"
        })
        const products: iProduct=await response.json()
        if(products){
         const getCart= async ()=>{
               try{
                const response= await fetch("/api/cart")
                const cart: Array<iCart>= await response.json()
                console.log(cart);
                  const totalQuantity = cart.reduce((total, item) => total + Number(item.quantity), 0);
                  state.cartNumber=(totalQuantity)
               }catch(error){
                console.error("cart is empty")
               }
            }
           getCart()
          
          toast.success("Item has been sucessfully added to cart")
          
        }
        
        
    }catch{
  
    }
    }
    const CheckIfProductAlreadyInCart=async ()=>{
      const response= await fetch("/api/checkIfProductAlreadyInCart",{
        method:"POST",
        body:JSON.stringify({
          productId:id,
            userId:snap.user?._id
        })
      })
      const res=await response.json()
      console.log("is item in cart: " + res.message);
      
      if(res.message == "This Item has not been added to cart"){
        setDisableAdd(false)
      }
    }
    useEffect(()=>{
      const getProduct= async()=>{
        const response= await fetch("/api/filterProducts",{
          method:"POST",
          body:JSON.stringify({
            _id:id
          })
        })
        const product= await response.json()
        setProduct(product[0])
      }
      getProduct()
      CheckIfProductAlreadyInCart()
    
    
    },[])
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
    return (
     <div className="flex justify-center text-purple-900">
        {showAreYouSure && <AreYouSure setShowAreYouSure={setShowAreYouSure}/> }
        {showListingForm?<CreateNewListingForm setShowListingForm={setShowListingForm} EditListingId={id}/>:""}
       <div className="mt-16 max-w-[1200px] flex flex-col lg:grid grid-cols-4 p-4 gap-4 ">
        <div className="col-span-2 bg-white  rounded-md p-4 drop-shadow-lg ">
          <div className="w-[calc(100vw-64px)] h-[calc(100vw-8)] md:h-96 md:w-96">
            <img  src={images?images[activeImage].url:""} className="w-full h-80 w-80 md:h-96 object-contain rounded-md"/>
          </div>
          <div className="flex py-4 flex-wrap gap-2">
            {
              images&& images.map((image,index)=> <img  src={image.url} key={image.assetId} onClick={()=>setActiveImage(index)} className={`object-cover w-14 h-14 rounded-md cursor-pointer ${activeImage==index?"border-2 border-purple-600":""} `}/>)
            }
          </div>
          <div className="font-bold text-lg md:text-2xl">
            {product?.title}
          </div>
          <p className="font-bold text-lg md:text-2xl">₦{product?.price}</p>
          {/* add to cart button */}
          {snap.user?.accountType=="admin"?
          // this part will show for admin users
            <div className='relative flex flex-col justify-end' 
            onClick={()=>setShowEditMenu(!showEditMenu)}
            onMouseLeave={()=>setShowEditMenu(false)}
            >
              <button className='bg-purple-900 hover:bg-purple-950  text-white w-full rounded-md px-4 py-2 text-sm'>Edit</button>
              {showEditMenu &&
                <div className='absolute text-purple-900 w-full bg-white drop-shadow-lg rounded-md p-2 flex flex-col gap-1 top-[-65px]'>
                    <button className='bg-white p-1 rounded-md hover:drop-shadow-lg' onClick={()=>{
                      // if(setEditListingId && setShowListingForm){
                        // setEditListingId(String(id))
                        setShowListingForm(true)
                      // }
                    }}>Edit</button>
                    <button className='bg-white rounded-md p-1 hover:drop-shadow-lg' onClick={()=>{
                      setShowAreYouSure(true)
                    }}>Delete</button>
                </div>
              }
            </div>
            // this will only show for non-admin (regular users)
            :
              <button disabled={disableAdd} className='bg-purple-900 hover:bg-purple-950  text-white w-full rounded-md px-4 py-2 text-sm' onClick={(()=> AddProductToCart())}>{disableAdd && snap.userId?"Added To Cart":"Add to Cart"}</button>
            }
        </div>
        <div className="col-span-2 bg-white rounded-md p-4 drop-shadow-lg">
            <h1 className="text-lg font-bold">Product Description</h1>
            <p>{(product?.description)?product.description:"No description for this Item"}</p>
        </div>
      </div>
     </div>
    );
  }