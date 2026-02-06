import { v2 as cloudinary } from "cloudinary";
import Product from "@/app/lib/models/Product";
import dbConnect from "@/app/lib/DBconnect";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";
import { log } from "console";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
interface Url {
  url?: string;
  assetId?: string;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const title = formData.get("title");

  try {
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const subCategory = formData.get("subCategory");
    const quantityType = formData.get("quantityType");
    const unitsAvailable = formData.get("unitsAvailable");
    const files = formData.getAll("files") as Array<Blob | null>;
    const setDiscount = formData.get("setDiscount");
    const discount = formData.get("discount");
    const variations = JSON.parse(String(formData.get("variations")));

    // Convert the file uploads into promises
    const uploadPromises = files.map(async (file) => {
      if (!file) return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;
      return new Promise<Url>((resolve, reject) => {
        // Use cloudinary.uploader.upload instead of upload_stream
        cloudinary.uploader.upload(
          base64String,
          { folder: "JENS" },
          (err, res) => {
            if (err) {
              reject(err);
              console.log("Cloudinary upload error:", err);
            } else {
              console.log("Cloudinary upload response:", res);
              const newUrl = {
                url: res?.url,
                assetId: res?.public_id,
              };
              resolve(newUrl);
            }
          },
        );
      });
    });

    // Wait for all uploads to finish and filter out null results
    const uploadedImages = await Promise.all(uploadPromises);
    const validImages = uploadedImages.filter(
      (image): image is Url => image !== null,
    );

    // Save the product only after all uploads are complete
    const newListing = new Product({
      title,
      description,
      category,
      subCategory,
      quantityType,
      price: Number(price),
      images: validImages,
      unitsAvailable,
      setDiscount,
      discount,
      variations: variations,
    });
    console.log(newListing);

    await newListing.save();

    console.log("final images:", validImages);

    return Response.json({
      message: "Successfully created",
    });
  } catch (error: unknown) {
    console.error("Error in POST handler:", error);
    return Response.json({
      message: "Something went wrong, please try again",
      error,
    });
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const searchParams = req.nextUrl.searchParams;
    // const request = await new Response(req.body).json();

    interface SearchParams {
      searchTerm?: string; // Optional search term
      minPrice?: number; // Optional minimum price
      maxPrice?: number; // Optional maximum price
      category?: string; // Optional category filter
      subcategory?: string; // Optional subcategory filter
    }
    // build search query function that takes in the search params and builds a search query for mongoose, it should return a filter query that can be used in the mongoose find method
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

    const params: SearchParams = {
      searchTerm: searchParams.get("query") || "",
      minPrice: Number(searchParams.get("minAmount")) || 0,
      maxPrice: Number(searchParams.get("maxAmount")) || 10000000,
      category: searchParams.get("category") || "",
      subcategory: searchParams.get("subCategory") || "",
    };
    const products = await Product.find(buildSearchQuery(params)).sort({
      _id: -1,
    });
    return Response.json(products);
  } catch (err: unknown) {
    return Response.json({ error: err });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  try {
    const productId = await new Response(req.body).json();
    console.log(productId);
    const product = await Product.findOne({ _id: productId });
    type imageType = {
      url: string;
      assetId: string;
    };
    if (product.images.length) {
      product.images.forEach(async (image: imageType) => {
        const deleted = await cloudinary.uploader.destroy(image.assetId);
        console.log(deleted);

        if (deleted.result == "ok") {
          const deletedProduct = await Product.deleteOne({ _id: productId });
          if (deletedProduct) {
          }
        }
      });
    } else {
      const deletedProduct = await Product.deleteOne({ _id: productId });
      if (deletedProduct) {
      }
    }

    return Response.json({
      message: "sucessfully deleted",
    });
  } catch (err) {
    return Response.json({ error: err });
  }
}
export async function PATCH(req: Request) {
  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title");
  try {
    const id = formData.get("id");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const oldImages = formData.getAll("oldUrls");
    const oldImagesParsed = oldImages.map((img) => JSON.parse(String(img)));
    const deletedUrls = formData.getAll("deletedUrls");
    const subCategory = formData.get("subCategory");
    const quantityType = formData.get("quantityType");
    const unitsAvailable = formData.get("unitsAvailable");
    const setDiscount = formData.get("setDiscount");
    console.log("variations", formData.get("variations"));

    const variations = JSON.parse(String(formData.get("variations")));
    const discount = formData.get("discount");
    const imageUrls: Array<Url> = [];

    imageUrls.push(...oldImagesParsed);

    const files = formData.getAll("files") as Array<Blob> | Array<null>;

    // Convert the file uploads into promises
    const uploadPromises = files.map(async (file) => {
      if (!file) return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      console.log(buffer);

      const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;
      return new Promise<Url>((resolve, reject) => {
        // Use cloudinary.uploader.upload instead of upload_stream
        cloudinary.uploader.upload(
          base64String,
          { folder: "JENS" },
          (err, res) => {
            if (err) {
              reject(err);
              console.log("Cloudinary upload error:", err);
            } else {
              console.log("Cloudinary upload response:", res);
              const newUrl = {
                url: res?.url,
                assetId: res?.public_id,
              };
              resolve(newUrl);
            }
          },
        );
      });
    });

    // Wait for all uploads to finish and filter out null results
    const uploadedImages = await Promise.all(uploadPromises);
    const validImages = uploadedImages.filter(
      (image): image is Url => image !== null,
    );
    const totalImages = imageUrls.concat(validImages);
    deletedUrls.forEach(async (assetId) => {
      const deleted = await cloudinary.uploader.destroy(String(assetId));
      console.log("deleted", deleted);
    });
    const newListing = {
      title: title,
      description: description,
      category: category,
      subCategory: subCategory,
      quantityType: quantityType,
      price: Number(price),
      images: totalImages,
      unitsAvailable: unitsAvailable,
      setDiscount,
      discount,
      variations: variations,
    };
    console.log(variations);
    console.log(newListing);

    const updatedListing = await Product.findOneAndUpdate(
      { _id: id },
      { ...newListing },
    );
    if (updatedListing) {
    }

    console.log("final:", imageUrls);
    return Response.json({ message: "sucessfully Updated" });
  } catch {
    return Response.json({ message: "failed" });
  }
}
