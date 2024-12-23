import mongoose,{Schema, Document } from "mongoose";

export interface iCart extends Document {
    productId?: string,
    quantity?: string,
    userId?:string
}

const cartSchema: Schema= new mongoose.Schema({
    productId :{
        type: String,
        required: false
    },
    quantity :{
        type: String,
        required: false
    },
    userId:{
        type:String,
        required:false
    }

})

const Cart =mongoose.models.cart || mongoose.model<iCart>("cart",cartSchema)

export default Cart