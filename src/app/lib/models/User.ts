import mongoose,{Schema, Document } from "mongoose";

export interface iUser extends Document {
    email: string,
    name: string,
    phoneNumber:string,
    address: string,
    city: string,
    state:string,
    accountType:String
}

const userSchema: Schema= new mongoose.Schema({
    email :{
        type: String,
        required: true
    },
    name :{
        type: String,
        required: true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false,
    },
    accountType:{
        type: String,
        required: false
    }

})

const User =mongoose.models.User || mongoose.model<iUser>("User",userSchema)

export default User