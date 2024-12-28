import {v2 as cloudinary} from "cloudinary"
import Product from "@/app/lib/models/Product";
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
  export async function POST(req: Request) {
      try {
          const formData = await req.formData();
          const title = formData.get("title");
          const description = formData.get("description");
          const category = formData.get("category");
          const price = formData.get("price");
          const subCategory = formData.get("subCategory");
          const quantityType = formData.get("quantityType");
          const unitsAvailable = formData.get("unitsAvailable");
  
          // Retrieve files
          const files = formData.getAll("files") as Array<Blob | null>;
  
          // Upload files to Cloudinary
          const uploadPromises = files.map(async (file) => {
              if (!file) return null;
  
              const buffer = Buffer.from(await file.arrayBuffer());
              return new Promise<{ url: string; assetId: string }>((resolve, reject) => {
                  const stream = cloudinary.uploader.upload_stream(
                      { folder: "JENS" },
                      (err, res) => {
                          if (err) return reject(err);
                          if (res) {
                              resolve({
                                  url: res.url,
                                  assetId: res.public_id,
                              });
                          }
                      }
                  );
                  stream.write(buffer);
                  stream.end();
              });
          });
  
          // Wait for all uploads to complete
          const imageUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
  
          // Create and save the new product
          const newProductItem = new Product({
              title,
              description,
              category,
              subCategory,
              quantityType,
              unitsAvailable,
              price: Number(price),
              images: imageUrls,
          });
  
          await newProductItem.save();
  
          return new Response(
              JSON.stringify({ message: "New Item has been successfully created", title:title,newPorduct:newProductItem }),
              { status: 200 }
          );
      } catch (error: unknown) {
          return new Response(
              JSON.stringify({
                  message: "Something Went Wrong Please Try Again",
                  error:error,
              }),
          );
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
export async function PATCH(req:Request) {
    await dbConnect();
    const formData=await req.formData()
    const title=formData.get("title")
    try{
        const id= formData.get("id")
        const description= formData.get("description")
        const category= formData.get("category")
        const price= formData.get("price")
        const oldImages= formData.getAll("oldUrls")
        const oldImagesParsed= oldImages.map((img)=>JSON.parse(String(img)))
        const deletedUrls= formData.getAll("deletedUrls")
        const subCategory= formData.get("subCategory")
        const quantityType=formData.get("quantityType")
        const unitsAvailable=formData.get("unitsAvailable")
        const imageUrls: Array<Url>=[]
        
        imageUrls.push(...oldImagesParsed)
        
        const files= formData.getAll("files") as Array<Blob> | Array<null>
        const uploadPromises = files.map(async (file) => {
            if (!file) return;
        
            const buffer = Buffer.from(await file.arrayBuffer());
        
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "JENS" },
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            const newUrl = {
                                url: res?.url,
                                assetId: res?.public_id,
                            };
                            imageUrls.push(newUrl);
                            resolve(newUrl);
                        }
                    }
                );
        
                stream.write(buffer);
                stream.end();
            });
        });
        
        (async () => {
            try {
                await Promise.all(uploadPromises);
                console.log(deletedUrls);
                
                deletedUrls.forEach(async (assetId)=>{
                    const deleted=await cloudinary.uploader.destroy(String(assetId))  
                    console.log("deleted",deleted)
                })
                const newListing={
                    title:title,
                    description:description,
                    category:category,
                    subCategory:subCategory,
                    quantityType:quantityType,
                    price:Number(price),
                    images: imageUrls,
                    unitsAvailable:unitsAvailable
                    }
                    
                const updatedListing=await Product.findOneAndUpdate({_id:id},{...newListing})
                if(updatedListing){}
                
            } catch (err) {
                console.error("Upload failed:", err);
            }
        })();
        console.log("final:",imageUrls);
        return Response.json({message:"sucessfully Updated"})
    }catch{
        return Response.json({message:"failed"})
    }
}