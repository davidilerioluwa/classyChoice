import mongoose,{Schema, Document } from "mongoose";
export interface variation{
variation: string,
variants: Array<string>
}
export interface iProduct extends Document {
    title: string,
    description: string,
    price: number,
    category:string,
    subCategory:string
    quantityType:string
    unitsAvailable:number
    images:Array<{url:string,assetId:string}>,
    setDiscount: boolean
    discount:number,
    variations: Array<variation>
}

const productSchema: Schema= new mongoose.Schema({
    title :{
        type: String,
        required: false
    },
    description :{
        type: String,
        required: false
    },
    price:{
        type: Number,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    subCategory:{
        type:String,
        required:false
    },
    quantityType:{
        type:String,
        required:true
    },
    unitsAvailable:{
        type:Number,
        required:true
    },
    images: {
        type: Array,
        required: true,
    },
    setDiscount:{
        type:Boolean,
        required:true
    },
    discount:{
        type:Number,
        required:false
    },
    variations:{
        type:Array,
        required:false
    }


})

const Product =mongoose.models.product || mongoose.model<iProduct>("product",productSchema)

export default Product