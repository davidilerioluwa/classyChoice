import dbConnect from "@/app/lib/DBconnect";
import Cart from "@/app/lib/models/Cart";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    await dbConnect();
     try{
        const response= await new Response(req.body).json()
       const userId=response.userId
       const productId=response.productId
       console.log(response);
       
        const cart=await Cart.find({userId:userId,productId:productId})
        console.log(cart);
        
        if(cart.length>0){
         return Response.json({
            message: "This Item has already been added to cart"
         })
        }
        else{
         return Response.json({
            message:"This Item has not been added to cart"
         })
        }
       
     }catch(err:any){
        return NextResponse.json({error: err.message})
     }
 
 }