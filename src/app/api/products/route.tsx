import {v2 as cloudinary} from "cloudinary"
import Product from "@/app/lib/models/Product";
import dbConnect from "@/app/lib/DBconnect";
cloudinary.config({
    cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: String(process.env.CLOUDINARY_API_KEY),
    api_secret: String(process.env.CLOUDINARY_API_SECRET),
    secure:true
  });
  interface Url{
    url?: string,
    assetId?:string
  }
  
  export async function POST(req: Request) {
      const formData = await req.formData();
      const title = formData.get("title");
  
      try {
          const description = formData.get("description");
          const category = formData.get("category");
          const price = formData.get("price");
          const subCategory = formData.get("subCategory");
          const quantityType = formData.get("quantityType");
          const unitsAvailable = formData.get("unitsAvailable");
          const files = formData.getAll("files") as Array<Blob | null>;
  
          // Add a delay if needed
          await new Promise(resolve => setTimeout(resolve, 2000));
  
          // Convert the file uploads into promises
          const uploadPromises = files.map(async (file) => {
              if (!file) return null;
  
              const buffer = Buffer.from(await file.arrayBuffer());
              const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;
              return new Promise<Url>((resolve, reject) => {
                  // Use cloudinary.uploader.upload instead of upload_stream
                  cloudinary.uploader.upload(
                      base64String,
                      { folder: "JENS" },
                      (err, res) => {
                          if (err) {
                              reject(err);
                              console.log("Cloudinary upload error:", err);
                          } else {
                              console.log("Cloudinary upload response:", res);
                              const newUrl = {
                                  url: res?.url,
                                  assetId: res?.public_id,
                              };
                              resolve(newUrl);
                          }
                      }
                  );
              });
          });
  
          // Wait for all uploads to finish and filter out null results
          const uploadedImages = await Promise.all(uploadPromises);
          const validImages = uploadedImages.filter((image): image is Url => image !== null);
  
          // Save the product only after all uploads are complete
          const newListing = new Product({
              title,
              description,
              category,
              subCategory,
              quantityType,
              price: Number(price),
              images: validImages,
              unitsAvailable,
          });
          await newListing.save();
  
          console.log("final images:", validImages);
  
          return Response.json({
              message: "Successfully created",
          });
      } catch (error: unknown) {
          console.error("Error in POST handler:", error);
          return Response.json({
              message: "Something went wrong, please try again",
              error,
          });
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