import dbConnect from "@/app/lib/DBconnect";
import User from "@/app/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
   await dbConnect();
    try{
        const id= req.headers.get("id")
        
        const user= await User.findById(id)    
       return Response.json({
         user:user,
         statusCode:200
       })
      
    }catch(err:any){
       return NextResponse.json({error: err.message})
    }

}
export async function PATCH(req: NextRequest){
   await dbConnect();
    try{
      const request= await new Response(req.body).json()
      console.log(request);
      
      const userId= request.userId
      console.log(userId);
      
        const updated= await User.updateOne({_id:userId},{...request.profile})  
      const user=await User.findOne({_id:userId})
        console.log(user);
          
       return Response.json({
         statusCode:200,
         user:user
       })
      
    }catch(err:any){
       return NextResponse.json({error: err.message})
    }

}