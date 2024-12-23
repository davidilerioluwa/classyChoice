import dbConnect from "@/app/lib/DBconnect";
import Product from "@/app/lib/models/Product";
export async function POST(req:Request,res:Response) {
    await dbConnect();
    try{
        const filter= await new Response(req.body).json()
        
        
        
        const products= await Product.find(filter)  
          
       return Response.json(products)
        
    //     const products= await Product.find()  
      
    }catch(err:any){
       return Response.json({error: err.message})
    }
}