"use client";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { state } from "@/store/state";
import { toast } from "sonner";
import { iOrder } from "@/app/lib/models/Orders";
import PacmanLoader from "react-spinners/PacmanLoader";
import OrderItem from "@/app/components/OrderItem";
const Page = () => {
  const snap = useSnapshot(state);
  const [orders, setOrders] = useState<Array<iOrder>>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(orders);
  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(snap.user ? snap.user._id : "nil"),
      });
      const res = await response.json();
      setIsLoading(false);
      console.log(res);
      setOrders(res);
    } catch {
      toast.error("something went wrong");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProducts();
  }, [snap.user?._id]);
  return (
    <div className="w-full gap-4 h-full min-h-screen pb-12 mt-20 p-4">
      <h1 className="font-bold p-2 text-lg text-purple-800 mb-2">Orders</h1>
      <div className="w-full flex gap-2 mb-4 px-4">
        <input
          type="text"
          className="w-full px-2 text-purple-800 outline outline-[1px] outline-purple-800 rounded-md"
        />
        <button className="bg-purple-800 px-4 py-2 rounded-md text-white">
          Search
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="px-4">
            <PacmanLoader color="rgb(88 28 135 / var(--tw-text-opacity, 1))" />
          </div>
        )}
        {orders.map((order) => {
          const date = new Date(String(order.time)).toLocaleString();
          return (
            <section
              key={order._id}
              className="bg-white text-xs  border border-purple-100 drop-shadow-md rounded-md p-4 text-purple-800 w-full"
            >
              <div className="gap-2 flex flex-col gap-2 ">
                <div className="flex flex-col gap-2 overflow-y-auto ">
                  <div className="w-full  flex flex-col gap-2  items-center p-4  rounded-md border bg-purple-800 text-white">
                    <span className="w-full text-left font-bold">
                      Order Id: {order.orderId}
                    </span>
                    <div className="flex gap-2 justify-between w-full">
                      <button className="text-white bg-green-800 rounded-md px-4 py-1.5">
                        {order.status}
                      </button>
                      <span className="w-20 md:w-fit">{date}</span>

                      <div className="flex gap-1 flex-col md:flex-row">
                        <span className="font-bold">Total Amount:</span>
                        <span>{order.amount}</span>
                      </div>
                    </div>
                  </div>
                  {order.items.map((item) => (
                    <OrderItem key={item.productId} item={item} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
