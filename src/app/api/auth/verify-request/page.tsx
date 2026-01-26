import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="text-center bg-purple-600 p-6 py-8 rounded-lg text-white flex flex-col gap-2 shadow-md">
        <p className="text-2xl md:text-3xl font-bold">
          A verification email has been sent to your inbox.
        </p>
        <p className="md:text-lg">
          Please check your email and follow the instructions to complete the
          sign-in process.
        </p>
      </div>
    </div>
  );
};

export default page;
