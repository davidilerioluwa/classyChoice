import mongoose,{Schema, Document } from "mongoose";
export interface product {
    productId: string,
    quantity: string,
    title:string,
    price: number
}
export interface iOrder extends Document {
    items: Array<product>
    time?: Date,
    userId?:string
    _id: string,
    status:string,
    amount: number,
    orderId:string,
    note:string,
    paymentProof: {url:string,assetId:string},
    alternativeAddress:string
}

const orderSchema: Schema= new mongoose.Schema({
    items :{
        type: Array<product>,
        required: true
    },
    time:{
        type:Date,
        required:true
    },
    userId:{
        type: String,
        required: true
    },
    status:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    orderId:{
        type: String,
        required: true
    },
    
    note:{
        type:String,
        required:false
    },
    paymentProof:{
        type: {url:String,assetId:String},
        required:true
    },
    alternativeAddress:{
        type:String,
        required:false

    }

})

const Order =mongoose.models.order || mongoose.model<iOrder>("order",orderSchema)

export default Order
