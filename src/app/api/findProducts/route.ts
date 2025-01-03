import dbConnect from "@/app/lib/DBconnect";
import Product from "@/app/lib/models/Product";
import { FilterQuery } from "mongoose";

export async function POST(req:Request) {
    await dbConnect();
    try{
     
        const request= await new Response(req.body).json()

        

interface SearchParams {
  searchTerm?: string;    // Optional search term
  minPrice?: number;      // Optional minimum price
  maxPrice?: number;      // Optional maximum price
  category?: string;      // Optional category filter
  subcategory?: string;   // Optional subcategory filter
}

const buildSearchQuery = ({
  searchTerm,
  minPrice,
  maxPrice,
  category,
  subcategory,
}: SearchParams): FilterQuery<SearchParams> => {
  const query: FilterQuery<SearchParams> = {};

  // Add search conditions if searchTerm is provided
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { subcategory: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Add price filter if minPrice or maxPrice is provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) {
      query.price.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      query.price.$lte = maxPrice;
    }
  }

  // Add category filter if provided
  if (category) {
    query.category = category;
  }

  // Add subcategory filter if provided
  if (subcategory) {
    query.subcategory = subcategory;
  }

  return query;
};
        // type filterInterface={
        //     title?:string
        //     price?:mongoose.Condition<number>,
        //     category?:string
        // }
        // const filter:filterInterface={}
        // if (request.searchQuery) {
        //     filter.$or = [
        //       { title: { $regex: request.searchQuery, $options: "i" } },
        //       { category: { $regex: request.searchQuery, $options: "i" } },
        //       { subcategory: { $regex: request.searchQuery, $options: "i" } },
        //     ];
        //   }
        // if(request.searchQuery){
        //     filter.title=request.searchQuery
        // }
        // if(request.minAmount & request.maxAmount){
        //     filter.price={$gte:request.minAmount,$lte:request.maxAmount}
        // }else if(request.maxAmount){
        //     filter.price={$lte:request.maxAmount}
        // }else if(request.minAmount){
        //     filter.price={$gte:request.minAmount}
        // }
        // if(request.category){
        //     filter.category=request.category
        // }
        // console.log(filter);
        const searchParams: SearchParams={
            searchTerm: request.searchQuery,
            minPrice: request.minAmount,
            maxPrice:request.maxAmount,
            category: request.category,
            subcategory:request.subcategory
        }
        console.log(buildSearchQuery(searchParams));
        
        
        const products= await Product.find(buildSearchQuery(searchParams) ).sort({_id:-1})  
        // console.log(products);
          
       return Response.json(products)
      
    }catch(err:unknown){
       return Response.json({error: err})
    }
}