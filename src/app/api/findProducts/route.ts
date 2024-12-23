import dbConnect from "@/app/lib/DBconnect";
import Product from "@/app/lib/models/Product";
import mongoose from "mongoose";

export async function POST(req:Request,res:Response) {
    await dbConnect();
    try{
        const x={
            f:{$gte:38}
        }
        const request= await new Response(req.body).json()
        type filterInterface={
            title?:string
            price?:mongoose.Condition<number>,
            category?:string
        }
        const filter:filterInterface={}
        if(request.searchQuery){
            filter.title=request.searchQuery
        }
        if(request.minAmount & request.maxAmount){
            filter.price={$gte:request.minAmount,$lte:request.maxAmount}
        }else if(request.maxAmount){
            filter.price={$lte:request.maxAmount}
        }else if(request.minAmount){
            filter.price={$gte:request.minAmount}
        }
        if(request.category){
            filter.category=request.category
        }
        console.log(filter);
        
        const products= await Product.find(filter)  
        console.log(products);
          
       return Response.json(products)
      
    }catch(err:any){
       return Response.json({error: err.message})
    }
}