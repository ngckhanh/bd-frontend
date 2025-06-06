import { CircleAlert } from "lucide-react";
import Image from "next/image";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const TokenDialogContent = ({ userId }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hướng dẫn nạp token vào tài khoản</DialogTitle>
      </DialogHeader>
      <div className="w-full flex">
        <div className="grow">
          <div className="mb-3">
            <p className="text-sm">
              <span className="font-semibold">Bước 1:</span> Quét mã QR bên phải hoặc tạo giao dịch với{" "}
              <b>STK 0904177537 BUI BAO HOANG</b> cùng nội dung:{" "}
              <span className="text-pink-600 font-semibold">BACHDUONG{userId}CASHIN</span>
            </p>
          </div>
          <div className="mb-3">
            <p className="text-sm">
              <span className="font-semibold">Bước 2:</span> Nhập số tiền muốn nạp. Mỗi token có giá trị là{" "}
              <b>5.000đ</b>. Đảm bảo số tiền chuyển phải là <b>bội số của 5.000</b>
            </p>
          </div>
          <div className="mb-3">
            <p className="text-sm">
              <span className="font-semibold">Bước 3:</span> Sau khi giao dịch hoàn tất, số token bạn đã nạp sẽ
              được tự động chuyển vào tài khoản. Nếu có vấn đề phát sinh vui lòng liên hệ với bộ phận hỗ trợ của
              chúng mình.
            </p>
          </div>
        </div>

        <div className="flex-none max-w-[200px] w-full sm:w-[180px] md:w-[200px] mx-auto">
          <Skeleton>
            <Image
              src={`https://img.vietqr.io/image/970422-0904177537-print.png?addInfo=BACHDUONG${userId}CASHIN&accountName=BUI BAO HOANG`}
              alt="QR code"
              width={200}
              height={200}
              className="w-full h-auto"
            />
          </Skeleton>
        </div>

      </div>
      <div className="w-full bg-sky-100 text-sky-600 font-semibold p-3 rounded-md text-sm">
        <p className="flex items-center space-x-1 mb-2">
          <CircleAlert />
          <span>Một số lưu ý: </span>
        </p>
        <p>- Ghi đúng nội dung giao dịch.</p>
        <p>
          - Nếu số tiền chuyển không chia hết cho 5000. Lượng token sẽ bằng giá trị gần nhất chia hết cho 5000
          so với giá trị giao dịch, số tiền dư sẽ không được hoàn.
        </p>
        <p>- Chúng mình sẽ không nhận xử lý trường hợp ghi sai nội dung giao dịch.</p>
        <p>- Không chuyển bằng Ví Điện tử như MoMo, ZaloPay</p>
      </div>
    </DialogContent>
  );
};

export default TokenDialogContent;