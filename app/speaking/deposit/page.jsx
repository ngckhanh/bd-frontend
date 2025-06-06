"use client";

import useUserStore from "@/app/(store)/userStore";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CreditCard, LandmarkIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DepositPage() {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const userStore = useUserStore();

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[600px] w-full lg:flex-none h-full lg:p-10 p-5 lg:pt-30 pt-20">
        <Image
          src="/logo.png"
          height="100"
          width="100"
          className="rounded-full shadow-md mb-10 border border-1"
          alt="logo"
        />
        <h1 className="text-3xl font-semibold mb-5">Nạp tiền vào tài khoản</h1>
        <div className="w-fit m-auto bg-sky-100 text-sky-600 font-semibold tracking-tight rounded-lg p-3 mb-3">
          🎉 Ưu đãi tới hết 30/6, mọi lần nạp sẽ được gấp đôi! Nếu bạn nạp 10.000đ sẽ được gấp đôi lên 20.000đ!
        </div>
        <p className="text-slate-500 font-semibold mb-10">
          Bạch Dương sử dụng hệ thống token để tượng trưng cho mỗi giao dịch
          trên nền tảng. <br />
          Số tiền bạn nạp vào nền tảng sẽ được đổi sang token.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="lg:p-5 p-3 bg-white rounded-md border border-1 shadow-sm">
            <div className="bg-sky-600/20 text-sky-600 p-2 rounded-md w-fit mb-5">
              <LandmarkIcon size="20" />
            </div>
            <h2 className="text-lg font-semibold">Chuyển khoản ngân hàng</h2>
            <p className="text-slate-500">
              Sử dụng mã QR được cung cấp, chuyển số tiền bạn cần. Được xác thực
              ngay sau khi giao dịch thành công.
            </p>
          </div>
          <div className="lg:p-5 p-3 bg-white rounded-md border border-1 shadow-sm">
            <div className="bg-green-600/20 text-green-600 p-2 rounded-md w-fit mb-5">
              <CreditCard size="20" />
            </div>
            <p className="text-green-600">Đang phát triển</p>
            <h2 className="text-lg font-semibold">
              Thẻ quốc tế &#40;Visa/Mastercard&#41;
            </h2>
            <p className="text-slate-500">
              Sử dụng thẻ Visa/Mastercard của bạn thông qua polar.sh.
            </p>
          </div>
        </div>
      </div>
      <div className="grow flex items-center justify-center mt-5 lg:mt-0 pb-5">
        <div className="h-fit w-fit">
          <div className="w-[300px] relative rounded-md mb-5 m-auto">
            <Skeleton className="absolute h-[300px] w-[300px]" />
            <Image
              src={`https://api.vietqr.io/image/970422-0904177537-knBJNXy.jpg?accountName=BUI%20BAO%20HOANG&amount=0&addInfo=BACHDUONG${userStore.user.user_id}CASHIN`}
              height="300"
              width="300"
              alt="QR code"
              className="relative m-auto"
            />
          </div>
          <div className="w-[500px] bg-sky-600/20 text-sky-600 p-3 rounded-md">
            <p className="mb-3 font-semibold flex items-center space-x-2">
              <AlertCircle /> <span>Một số lưu ý trước khi chuyển</span>
            </p>
            <ul className="list-disc list-inside pl-5">
              <li>Kiểm tra đúng nội dung chuyển khoản theo <b>BACHDUONG{userStore.user.user_id}CASHIN</b></li>
              <li><b>Mỗi token có giá 5.000đ.</b> Số tiền chuyển phải là <b>bội số của 5.000</b>. <b>Khoản tiền dư sẽ không được hoàn lại</b>. VD: Chuyển 10.000đ sẽ được 2 token vì 10.000 / 5.000 = 2</li>
              <li>Chúng mình không xử lý trường hợp chuyển sai nội dung giao dịch.</li>
              <li>Không chuyển khoản sử dụng ví điện tử như MoMo, ZaloPay.</li>
              <li>Hãy cho hệ thống 5-10p để duyệt giao dịch của bạn trước khi tạo yêu cầu hỗ trợ nha.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}