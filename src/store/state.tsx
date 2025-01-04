import { proxy } from "valtio";
import { iUser } from "@/app/lib/models/User";

type state = {
    userId:string
    user?: iUser
    filter:{
        searchQuery:string,
        minAmount:number,
        maxAmount:number,
        category:string,
        subCategory:string
    },
    cartNumber:number,
    refreshNavbarCart:boolean
}
export const state = proxy<state>({
    userId: "",
    filter:{
        searchQuery:"",
        minAmount:0,
        maxAmount:10000000,
        category:"",
        subCategory:""
    },
    cartNumber:0,
    refreshNavbarCart:true
})