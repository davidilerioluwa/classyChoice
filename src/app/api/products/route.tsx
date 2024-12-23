import {v2 as cloudinary} from "cloudinary"
import Product from "@/app/lib/models/Product";
import { Interval } from "date-fns";
import dbConnect from "@/app/lib/DBconnect";
cloudinary.config({
    cloud_name: String(process.env.cloud_name),
    api_key: String(process.env.api_key),
    api_secret: String(process.env.api_secret),
  });
  interface Url{
    url?: string,
    assetId?:string
  }
 export  async function POST(req:Request){
    try{
        const formData=await req.formData()
        const title=formData.get("title")
        const description= formData.get("description")
        const category= formData.get("category")
        const price= formData.get("price")
        const imageUrls: Array<Url>=[]
        const files= formData.getAll("files") as Array<Blob> | Array<null>
        
        console.log("image:",imageUrls);
        
        files.forEach(async (file)=>{

            const buffer=file? Buffer.from(await file.arrayBuffer()):null
            const stream = cloudinary.uploader.upload_stream({folder:"JENS"},(err,res)=>{
            imageUrls.push({
                url:res?.url,
                assetId:res?.public_id,
            })
            imageUrls
        })
            stream.write(buffer)
            stream.end()
            
        })
    
    const interval= setInterval(()=>{
            if(imageUrls.length==files.length){
                console.log(imageUrls);
                
                        const newProductItem=new Product({
                        title:title,
                        description:description,
                        category:category,
                        price:Number(price),
                        images: imageUrls
                        })
                        newProductItem.save()
                        console.log(newProductItem);
                        clearTimeout(interval)
            }
        },100)
        return Response.json({message:"New Item has been sucessfully created"})
    }catch(error:unknown){
        return({
            message:"Something Went Wrong Please Try Again"
        })
    }
}

export async function GET() {
    await dbConnect();
    try{
        const products= await Product.find()    
       return Response.json(products)
      
    }catch(err){
       return Response.json({error: err})
    }
}

export async function PUT(req:Request) {
    
    await dbConnect();
    try{
        const productId= await new Response(req.body).json()
        console.log(productId);
        const product = await Product.findOne({_id:productId})
        type imageType={
            url:string,
            assetId:string
        }
        product.images.forEach(async (image:imageType)=>{
            const deleted=await cloudinary.uploader.destroy(image.assetId)  
            console.log(deleted);
            
            if(deleted.result=="ok"){
                const deletedProduct= await Product.deleteOne({_id:productId}) 
                if(deletedProduct){}
            }
            
        })

        
        
           
       return Response.json({
        message:"sucessfully deleted"
       })
      
    }catch(err){
       return Response.json({error: err})
    }
}