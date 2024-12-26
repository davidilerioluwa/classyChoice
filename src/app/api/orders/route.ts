import Cart from "@/app/lib/models/Cart";
import Order from "@/app/lib/models/Orders"
export async function PUT (req:Request){
    // async function generateUniqueRandomNumber() {
    //     const MIN = 1;
    //     const MAX = 10000000;
      
    //     while (true) {
    //       // Generate a random number and pad it to 7 digits
    //       const randomNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    //             // Check if the number already exists in the database
    //       const exists = await Order.find({ randomNumber });
      
    //       if (!exists) {
    //         // If it doesn't exist, return the number
    //         return randomNumber;
    //       }
    //     }
    //   }

    try{
        
        const order= await new Response(req.body).json()
        const newOrder= new Order(order)
        newOrder.save()
        const deletedCart= await Cart.deleteMany({userId:order.userId})
        if(deletedCart){}
        console.log("cart cleared");
        
        return  Response.json({
            message:"sucessful",
            statusCode:201
        })
        
    }catch{
        return Response.json("error")
    }
}
export async function POST (req:Request){
    

    try{
        const userId= await new Response(req.body).json()
      const orders= await Order.find({userId:userId})
        return  Response.json(orders)
        
    }catch{
        return Response.json("error")
    }
}
export async function GET (){
    

    try{
       
      const orders= await Order.find()
      console.log(orders);
      
        return  Response.json(orders)
        
    }catch{
        return Response.json("error")
    }
}