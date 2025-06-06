"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-black">
      <div className="lg:w-1/3 md:w-1/2 w-11/12 p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-500 rounded-lg p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
              />
            </svg>
          </div>
          <div className="">
            <p className="p-0 m-0 leading-5 font-semibold">
              Bạch Dương <span className="text-blue-500">App</span>
            </p>
            <p className="text-slate-500 text-sm font-semibold">Giám khảo AI</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 p-3 text-black border-gray-300 bg-white hover:bg-gray-200 rounded-lg transition-all"
          onClick={() => window.location.href = "/auth/google"}
        >
          <FcGoogle className="w-5 h-5" /> Đăng nhập bằng Google
        </Button>
      </div>
    </div>
  );
}
