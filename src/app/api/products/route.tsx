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

export async function POST(req: Request): Promise<Response> {
    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const price = formData.get("price") as string;
        const subCategory = formData.get("subCategory") as string;
        const quantityType = formData.get("quantityType") as string;
        const unitsAvailable = formData.get("unitsAvailable") as string;

        // Retrieve files
        const files = formData.getAll("files") as Array<Blob | null>;

        // Function to upload a single file to Cloudinary
        const uploadFile = (file: Blob): Promise<Url> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Await the arrayBuffer result
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const stream = cloudinary.uploader.upload_stream(
                { folder: "JENS" },
                (err, res) => {
                    if (err) {
                        console.error("Cloudinary upload error:", err);
                        return reject(err);
                    }
                    if (res) {
                        console.log("Cloudinary response:", res);
                        resolve({
                            url: res.url,
                            assetId: res.public_id,
                        });
                    } else {
                        reject(new Error("Unexpected Cloudinary response: null or undefined"));
                    }
                }
            );
            stream.write(buffer);
            stream.end();
        } catch (error) {
            reject(error);
        }
    });
};


        // Upload all files
        const imageUrls: Url[] = await Promise.all(
            files.map((file) => (file ? uploadFile(file) : Promise.resolve(null)))
        ).then((results) => results.filter((url): url is Url => url !== null));

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
            JSON.stringify({
                message: "New Item has been successfully created",
                title,
                newProduct: newProductItem,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error: unknown) {
        console.error("Error in API handler:", error);

        return new Response(
            JSON.stringify({
                message: "Something Went Wrong Please Try Again",
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
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