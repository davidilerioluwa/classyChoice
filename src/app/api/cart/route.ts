import dbConnect from "@/app/lib/DBconnect";
import { NextRequest, NextResponse } from "next/server";
import Cart from "@/app/lib/models/Cart";
import { getUserSession } from "@/app/lib/session";
export async function POST(req: NextRequest){
    const response= await new Response(req.body).json()
    const productId= response.productId
    const quantity= response.quantity
    // const userSession= await getUserSession()
    const userId= response.userId
    await dbConnect();
     try{

       const newCart= new Cart({
        productId:productId,
        quantity: quantity,
        userId:userId
       })
          newCart.save()
          console.log(newCart);
          
        return Response.json("sucessfully added to cart")
       
     }catch(err:unknown){
      return NextResponse.json({error: err})
   }
 
 }

 export async function PATCH(req: NextRequest){
    const response= await new Response(req.body).json()
    // const productId= response.productId
    const quantity= response.quantity
    const cartId= response.cartId
    
    
    await dbConnect();
     try{
          const updatedItem=await Cart.findByIdAndUpdate({_id:cartId},{quantity:quantity})
          if(updatedItem){}
        return Response.json({
         message:"cart has been sucessfully updated"
        })
       
     }catch(err:unknown){
      return NextResponse.json({error: err})
   }
 
 }
 export async function GET(){
    await dbConnect();
     try{
        
        
        const userSession= await getUserSession()
        const userId= userSession.id
        const cart=await Cart.find({userId:userId})
        return Response.json(cart)
       
     }catch(err:unknown){
      return NextResponse.json({error: err})
   }
 
 }

 export async function DELETE(req: NextRequest){
   const response= await new Response(req.body).json()
   const cartId= response.cartId
   await dbConnect();
    try{
         const updatedItem=await Cart.findByIdAndDelete({_id:cartId})
         if(updatedItem){}
       return Response.json({
         message:"sucessfully deleted from cart"
       })
      
    }catch(err:unknown){
       return NextResponse.json({error: err})
    }

}
 