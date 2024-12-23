import Cart from "@/app/lib/models/Cart";
import Order from "@/app/lib/models/Orders"
export async function PUT (req:Request,res:Response){
    

    try{
        const order= await new Response(req.body).json()
        const newOrder= new Order(order)
        newOrder.save()
        console.log(newOrder.items);
        const deletedCart= await Cart.deleteMany({userId:order.userId})
        console.log("orders cleared");
        
        return  Response.json({
            message:"sucessful",
            statusCode:201
        })
        
    }catch{
        return Response.json("error")
    }
}
export async function POST (req:Request,res:Response){
    

    try{
        const userId= await new Response(req.body).json()
      const orders= await Order.find({userId:userId})
        return  Response.json(orders)
        
    }catch{
        return Response.json("error")
    }
}
export async function GET (req:Request,res:Response){
    

    try{
       
      const orders= await Order.find()
      console.log(orders);
      
        return  Response.json(orders)
        
    }catch{
        return Response.json("error")
    }
}