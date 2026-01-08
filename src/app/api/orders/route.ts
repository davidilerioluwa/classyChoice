import sendOrderSucessfulEmail from "./orderSucessfulEmail";
import dbConnect from "@/app/lib/DBconnect";
import Cart from "@/app/lib/models/Cart";
import Order from "@/app/lib/models/Orders";
import { v2 as cloudinary } from "cloudinary";
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
export async function PUT(req: Request) {
  async function generateUniqueRandomNumber() {
    const MIN = 1;
    const MAX = 9999999;

    while (true) {
      // Generate a random number and pad it to 7 digits
      const randomNumber = (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN)
        .toString()
        .padStart(7, "0");
      // Check if the number already exists in the database
      const exists = await Order.findOne({ orderId: randomNumber });
      if (!exists) {
        // If it doesn't exist, return the number
        return randomNumber;
      }
    }
  }
  const randomNumber = await generateUniqueRandomNumber();
  try {
    const formData = await req.formData();

    // const newOrder= new Order(order)
    // newOrder.orderId=randomNumber
    const file = formData.get("paymentProof") as Blob | null;
    const items = JSON.parse(String(formData.get("items")));
    const time = JSON.parse(String(formData.get("time")));
    const userId = JSON.parse(String(formData.get("userId")));
    const amount = formData.get("amount");
    const note = formData.get("note");
    const status = formData.get("status");
    const alternativeAddress = formData.get("alternativeAddress");
    const email = formData.get("email");
    const uploadImage = async () => {
      if (!file) return null;

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64String = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;
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
          }
        );
      });
    };

    const newImage = await uploadImage();
    const newOrder = new Order({
      items: items,
      time: time,
      userId: userId,
      paymentProof: newImage,
      orderId: randomNumber,
      note: note,
      status: status,
      amount: amount,
      alternativeAddress: alternativeAddress,
    });
    await newOrder.save();
    const deletedCart = await Cart.deleteMany({ userId: userId });
    if (deletedCart) {
      sendOrderSucessfulEmail({ email: email as string });
      return Response.json({
        message: "sucessful",
        statusCode: 201,
      });
    } else {
      return Response.json({
        message: "error while deleting cart",
        statusCode: 201,
      });
    }
  } catch {
    return Response.json("error");
  }
}
export async function POST(req: Request) {
  // orders for users
  await dbConnect();
  try {
    const userId = await new Response(req.body).json();
    const orders = await Order.find({ userId: userId }).sort({ _id: -1 });
    return Response.json(orders);
  } catch {
    return Response.json("error");
  }
}
export async function GET() {
  // all OrderDetails for admin
  try {
    const orders = await Order.find().sort({ time: -1 });
    console.log(orders);

    return Response.json(orders);
  } catch {
    return Response.json("error");
  }
}
