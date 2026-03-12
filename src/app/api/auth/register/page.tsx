"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { registerUser } from "@/app/lib/registerUser";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    registerUser(formData)
      .then((result) => {
        if (result.success) {
          // Redirect to OTP verification page
          router.push("/api/auth/verifyOtp/" + result.verificationToken);
        } else if (result.error) {
          alert(result.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Registration error:", err);
        setLoading(false);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-purple-800">
          Sign Up
        </h1>
        {/* 2. SOCIAL PROVIDERS */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 transition"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          {/* You can add more providers here (GitHub, Apple, etc.) */}
        </div>
        <div className="relative flex items-center justify-center py-4">
          <span className="absolute px-3 bg-white text-gray-500 text-sm">
            OR
          </span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* 1. CREDENTIALS FORM */}
        <form action={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg ring-1 focus:ring-2 ring-purple-300  focus:ring-purple-500 outline-none bg-white"
          />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-lg ring-1 focus:ring-2 ring-purple-300  focus:ring-purple-500 outline-none bg-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={8}
            pattern=".*[0-9].*"
            title="Must contain at least 8 characters and one number"
            className="w-full px-4 py-2 border rounded-lg ring-1 focus:ring-2 ring-purple-300 focus:ring-purple-500 outline-none bg-white"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition"
          >
            Create Account
          </button>
        </form>

        {/* 3. REGISTER LINK */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/api/auth/signin"
            className="text-purple-800 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
