"use client";
import { verifyOtp } from "@/app/lib/verifyOtp";
import React from "react";
import { toast } from "sonner";

const page = ({ params }: { params: { verificationToken: string } }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    verifyOtp(params.verificationToken, otp).then((result) => {
      if (result.success) {
        toast.success("OTP verified successfully!");
        // You can redirect the user to the login page or dashboard here
      } else {
        toast.error(
          result.error || "OTP verification failed. Please try again.",
        );
      }
    });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="space-y-4 bg-white p-8 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold mb text-center text-purple-800">
          Verify OTP
        </h1>
        <input
          name="otp"
          type="text"
          placeholder="Enter OTP"
          required
          className="w-full px-4 py-2 border rounded-lg ring-1 focus:ring-2 ring-purple-300 focus:ring-purple-500 outline-none bg-white"
        />
        <button className="w-full py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default page;
