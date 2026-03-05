import { signIn } from "../[...nextauth]/options";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Sign In
        </h1>

        {/* 1. CREDENTIALS FORM */}
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Login with Email
          </button>
        </form>

        <div className="relative flex items-center justify-center py-4">
          <span className="absolute px-3 bg-white text-gray-500 text-sm">
            OR
          </span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* 2. SOCIAL PROVIDERS */}
        <div className="space-y-3">
          {/* Google Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          {/* You can add more providers here (GitHub, Apple, etc.) */}
        </div>

        {/* 3. REGISTER LINK */}
        <p className="text-center text-sm text-gray-600">
          New here?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
