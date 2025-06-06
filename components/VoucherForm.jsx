"use client";

import useUserStore from "@/app/(store)/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import instance from "@/axiosInstance/instance";
import Image from "next/image";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"; 
import {
  Wallet,
  CirclePlus,
  LineChartIcon as ChartLine,
  Menu,
  CircleAlert,
  User2,
  X as Exit,
  Zap,
  Plus,
  ChevronDown,
  Text,
  LifeBuoy,
  Ticket,
} from "lucide-react";

const VoucherForm = () => {
  const userStore = useUserStore();
  const [voucherCode, setVoucherCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const applyVoucherHandler = useCallback(async () => {
    if (isLoading) return;

    const userId = userStore?.user?.user_id;

    if (!voucherCode.trim()) {
      toast.error("Bạn cần nhập mã voucher.");
      return;
    }

    if (!userId) {
      toast.error("Bạn cần đăng nhập để áp dụng mã voucher.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await instance.get(`/voucher/claim/${voucherCode}/${userId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (res.status === 200) {
        toast.success("Đã sử dụng voucher thành công.");
        setVoucherCode("");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Đã xảy ra lỗi.";
      const status = err.response?.status;

      if (status === 400) {
        toast.error("Voucher đã được sử dụng hết hoặc đã hết hạn.", { duration: 5000 });
      } else if (status === 404) {
        toast.error(
          message === "Người dùng không tồn tại"
            ? "Người dùng không tồn tại."
            : message === "Voucher không tồn tại"
            ? "Voucher không tồn tại."
            : "Lỗi không xác định.",
          { duration: 5000 }
        );
      } else {
        toast.error(message, { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  }, [voucherCode, userStore, isLoading]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyVoucherHandler();
      }}
      className="flex flex-col space-y-4 p-4"
    >
      <input
        type="text"
        value={voucherCode}
        onChange={(e) => setVoucherCode(e.target.value)}
        placeholder="Nhập mã voucher"
        className="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className={`relative bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-semibold shadow-md transition-transform duration-200 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-100"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          "Áp dụng voucher"
        )}
      </button>
    </form>
  );
};

export default VoucherForm;