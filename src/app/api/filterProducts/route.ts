import dbConnect from "@/app/lib/DBconnect";
import Product from "@/app/lib/models/Product";
export async function POST(req:Request) {
    await dbConnect();
    try{
        const filter= await new Response(req.body).json()
        
        
        
        const products= await Product.find(filter).sort({_id:-1})
        if(!products) return  Response.json([])
          
       return Response.json(products)
        
    //     const products= await Product.find()  
      
    }catch(err:unknown){
       return Response.json({error: err})
    }
}