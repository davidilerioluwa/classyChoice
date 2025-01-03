import mongoose from "mongoose"

const connection: {isConnected? : number} = {}

async function dbConnect (){
    // console.log("trying to connect");
    
    if(connection.isConnected){
        // console.log("connected");
        
        return true;
    }
    const db= await mongoose.connect(String(process.env.MONGODB_URI))
    connection.isConnected = db.connections[0].readyState

}

export default dbConnect