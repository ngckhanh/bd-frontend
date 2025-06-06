"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Cog,
  Facebook,
  LucideUploadCloud,
  PenSquare,
  Speech,
  TagIcon,
  User,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { FaFacebook, FaTiktok } from "react-icons/fa";
import Image from "next/image";
import { SiZalo } from "react-icons/si";
import { motion } from "motion/react";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div
        className={`fixed z-100 w-full transition-colors duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto rounded-md p-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <p className="text-lg font-semibold">bachduong.app</p>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <p className="text-slate-600 px-3 py-2 hover:bg-slate-100 transition ease-in-out duration-200 rounded font-medium">
                Trang chủ
              </p>
            </Link>
            <Link href="/#usecases">
              <p className="text-slate-600 px-3 py-2 hover:bg-slate-100 transition ease-in-out duration-200 rounded font-medium">
                Tính năng
              </p>
            </Link>
            <Link href="/#pricing">
              <p className="text-slate-600 px-3 py-2 hover:bg-slate-100 transition ease-in-out duration-200 rounded font-medium">
                Bảng giá
              </p>
            </Link>
            <Link href="/#contact">
              <p className="text-slate-600 px-3 py-2 hover:bg-slate-100 transition ease-in-out duration-200 rounded font-medium">
                Liên hệ
              </p>
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button onClick={() => router.push("/speaking")}>
              Bắt đầu sử dụng
            </Button>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <section
        className="w-full flex items-center justify-center pb-2 border border-b-1"
        style={{
          background:
            "linear-gradient(180deg, rgba(37, 99, 235,0.2) 0%, rgba(255,255,255,1) 40%)",
        }}
      >
        <motion.div
          className="md:w-[80%] w-full h-full flex flex-col px-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-[150px] flex-none"></div>
          <div className="grow">
            <div className="bg-primary/20 text-primary font-semibold py-2 px-3 rounded-lg w-fit m-auto mb-10 text-center">
              🎉 Bạch Dương Writing đã ra mắt. Trải nghiệm ngay!
            </div>
            <Image
              src="/logo.png"
              height="100"
              width="100"
              alt="logo"
              className="m-auto border border-1 rounded-full shadow-md mb-5"
            />
            <p className="text-4xl md:text-7xl font-semibold text-center md:leading-20 mb-5">
              <span className="text-primary">Luyện IELTS</span> dễ dàng
              <br />
              Cải thiện sử dụng AI
            </p>
            <p className="text-slate-500 font-semibold text-center w-fit m-auto md:text-lg text-sm mb-10">
              Luyện IELTS Speaking và Writing hiệu quả với Bạch Dương
              <br />
              Phân tích chi tiết cùng đội ngũ hỗ trợ luôn sẵn sàng cùng bạn cải
              thiện.
            </p>
            <div className="flex flex-col md:flex-row items-center w-fit m-auto space-x-0 md:space-x-3 mb-10">
              <Button
                onClick={() => {
                  router.push("/speaking");
                }}
                className="md:text-lg md:p-7 flex items-center hover:shadow-md hover:shadow-primary/50 transition ease-in-out duration-200 mb-3 md:mb-0"
              >
                Trải nghiệm ngay <ArrowUpRight />
              </Button>
              <Button
                onClick={() => {
                  router.push("/#contact");
                }}
                className="md:text-lg md:p-7 flex items-center hover:shadow-md transition ease-in-out duration-200"
                variant="outline"
              >
                Liên hệ <ArrowUpRight />
              </Button>
            </div>
          </div>
          <div className="flex-none md:h-[500px] h-fit md:overflow-hidden">
            <div className="w-full h-full rounded-lg bg-slate-100 md:p-3 p-2 border border-1 relative">
              <div className="w-full h-full bg-gradient-to-t from-white to-[#00000000] relative">
                <p className="font-semibold text-center mb-3">
                  Xem cách bạn có thể sử dụng Bạch Dương để cải thiện IELTS dưới
                  đây nha
                </p>
                <Image
                  src="/sample1.png"
                  alt="sample-1"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg border border-1"
                />
              </div>
              <div className="bg-gradient-to-t from-white to-[#00000000] bottom-0 absolute z-10 w-full h-[200px]"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section
        id="usecases"
        className="w-full bg-slate-50 flex items-center justify-center py-20"
      >
        <div className="w-full m-auto">
          <p className="w-fit m-auto text-lg font-semibold text-primary text-center px-3 py-1 bg-white rounded-lg border border-1 flex items-center space-x-2 mb-10">
            <span>TÍNH NĂNG</span>
            <TagIcon className="rotate-90" size="20" />
          </p>
          <p className="md:text-5xl text-2xl font-bold text-center md:leading-15 mb-5 md:w-[50%] w-[90%] m-auto">
            Kiểm tra kỹ năng IELTS trong dưới{" "}
            <span className="text-primary">4 phút</span>
          </p>
          <p className="text-slate-500 md:w-[50%] m-auto w-[90%] md:text-lg text-center font-semibold mb-5">
            Chỉ cần đưa bài làm và đề bài cho Bạch Dương và bạn sẽ được trả lại
            kết quả đánh giá như giám khảo IELTS thật
          </p>
          <div className="grid md:flex md:items-center grid-cols-1 gap-3 md:gap-0 space-x-3 m-auto w-fit">
            <div className="bg-white rounded-lg border shadow-sm py-2 px-3 w-fit">
              <div className="items-center space-x-3 flex w-[200px]">
                <div className="rounded-lg h-[40px] w-[40px] flex items-center justify-center bg-primary text-white">
                  <Speech size={25} />
                </div>
                <p className="text-primary font-semibold">Đánh giá Speaking</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border shadow-sm py-2 px-3 w-fit">
              <div className="items-center space-x-3 flex w-[200px]">
                <div className="rounded-lg h-[40px] w-[40px] flex items-center justify-center bg-green-600 text-white">
                  <PenSquare size={25} />
                </div>
                <p className="text-green-600 font-semibold">Đánh giá Writing</p>
              </div>
            </div>
            <div className="w-fit flex items-center justify-center text-center m-auto">
              <p className="font-semibold text-center md:text-start w-full">
                và còn nhiều nữa...
              </p>
            </div>
          </div>
          {/* <div className="md:w-[80%] w-full m-auto mt-10 grid md:grid-cols-2 grid-cols-1">
            <div className="w-full md:p-0 px-5">
              <div className="mb-10">
                <p className="font-semibold">IELTS Speaking</p>
                <p>
                  Bạch Dương có thể tương tác như một giám khảo IELTS thực thụ
                </p>
              </div>
              <div className="">
                <p className="font-semibold mb-3">
                  Flow tương tác của Bạch Dương
                </p>
                <div className="rounded-lg border border-1 bg-white md:p-5 p-3 flex items-center space-x-3 mb-3">
                  <div className="flex-none w-fit font-bold bg-green-600/20 text-green-600 rounded-md p-3">
                    <LucideUploadCloud size={25} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Cung cấp thông tin</p>
                    <p>
                      Người dùng gửi nội dung như đề bài, bài làm &#40;audio,
                      docx, ...&#41;
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-1 bg-white md:p-5 p-3 flex items-center space-x-3 mb-3">
                  <div className="flex-none w-fit font-bold bg-red-600/20 text-red-600 rounded-md p-3">
                    <Cog size={25} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Xử lý</p>
                    <p>
                      Bạch Dương sẽ đưa thông tin cho trợ lý AI để xử lý và phân
                      loại thông tin như xếp câu trả lời vào đúng câu hỏi.
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-1 bg-white md:p-5 p-3 flex items-center space-x-3 mb-3">
                  <div className="flex-none w-fit font-bold bg-amber-600/20 text-amber-600 rounded-md p-3">
                    <User size={25} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Trả về</p>
                    <p>
                      Bạch Dương sẽ trả về cho người dùng thông tin hữu ích như
                      lời phê, phiên bản tốt hơn và sẽ gạch dòng những phần cần
                      cải thiện.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-5">
              <div className="w-fit h-fit p-3 m-auto rounded rounded-md border border-1 bg-white shadow-md">
                <Image
                  src="/sample2.png"
                  height="1530"
                  width="1156"
                  className="w-full h-auto"
                  alt="sample 2"
                />
              </div>
            </div>
          </div> */}
          <div className="md:w-[80%] w-full m-auto mt-10 grid md:grid-cols-1 grid-cols-1">
            <div className="w-full md:p-0 px-5">
              <div className="mb-10 text-center">
                <p className="font-semibold text-xl">
                  IELTS Speaking & Writing
                </p>
                <p className="text-gray-700">
                  Bạch Dương có thể tương tác như một giám khảo IELTS thực thụ
                </p>
              </div>
              <div>
                <p className="font-semibold mb-3 text-lg">
                  Flow tương tác của Bạch Dương
                </p>
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="rounded-lg border bg-white md:p-5 p-4 flex items-start space-x-3 mb-4 shadow-md w-full md:w-1/3">
                    <div className="flex-none w-fit font-bold bg-green-600/20 text-green-600 rounded-md p-3">
                      <LucideUploadCloud size={25} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        Cung cấp thông tin
                      </p>
                      <p className="text-gray-600">
                        Người dùng gửi nội dung như đề bài, bài làm &#40;audio,
                        docx, ...&#41;
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white md:p-5 p-4 flex items-start space-x-3 mb-4 shadow-md w-full md:w-1/3">
                    <div className="flex-none w-fit font-bold bg-red-600/20 text-red-600 rounded-md p-3">
                      <Cog size={25} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Xử lý</p>
                      <p className="text-gray-600">
                        Bạch Dương sẽ đưa thông tin cho trợ lý AI để xử lý và
                        phân loại thông tin như xếp câu trả lời vào đúng câu
                        hỏi.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white md:p-5 p-4 flex items-start space-x-3 mb-4 shadow-md w-full md:w-1/3">
                    <div className="flex-none w-fit font-bold bg-amber-600/20 text-amber-600 rounded-md p-3">
                      <User size={25} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Trả về</p>
                      <p className="text-gray-600">
                        Bạch Dương sẽ trả về cho người dùng thông tin hữu ích
                        như lời phê, phiên bản tốt hơn và sẽ gạch dòng những
                        phần cần cải thiện.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="w-full flex items-center justify-center py-20"
      >
        <div className="w-full m-auto">
          <p className="w-fit m-auto text-lg font-semibold text-primary text-center px-3 py-1 bg-white rounded-lg border border-1 flex items-center space-x-2 mb-10">
            <span>BẢNG GIÁ</span>
            <TagIcon className="rotate-90" size="20" />
          </p>
          <p className="md:text-5xl text-2xl font-bold text-center md:leading-15 mb-5 md:w-[50%] w-[90%] m-auto">
            Giá cả học sinh. Luyện hoài không hết.
          </p>
          <p className="text-slate-500 md:w-[50%] m-auto w-[90%] md:text-lg text-center font-semibold mb-10">
            Một lần kiểm tra trên Bạch Dương bằng 1 ổ bánh mì. Mà các tài khoản
            mới còn được nhận 10 token miễn phí nữa!
          </p>
          <div className="md:w-[70%] lg:w-[50%] w-[90%] grid md:grid-cols-2 grid-cols-1 m-auto gap-2">
            <div className="p-5 md:py-12 md:px-8 rounded-xl m-auto w-full">
              <p className="text-2xl font-bold mb-10">Dùng nhiêu trả đó</p>
              <div className="mb-20">
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Mỗi lần chấm là 5.000đ ~ 1 token</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Đội ngũ hỗ trợ nhiệt tình</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Không phải trả theo tháng</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <X size={20} className="text-red-600 flex-none w-[20px]" />
                  <span>Làm cho bạn một bữa sáng ngon lành</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Đánh bại IELTS</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <p className="text-4xl font-bold">5.000đ</p>
                <p className="text-slate-500">/ token</p>
              </div>
              <div className="w-full px-3 py-2 bg-blue-600/20 text-blue-600 text-center rounded-lg">
                Mặc định
              </div>
            </div>
            <div
              className="p-5 md:py-12 md:px-8 rounded-xl m-auto border border-1 border-amber-500 w-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(251,192,119,0.2) 0%, rgba(255,255,255,1) 40%)",
              }}
            >
              <p className="text-2xl font-bold mb-10">Premium</p>
              <div className="mb-20">
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Token vô hạn</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <TrendingUp
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Thống kê học tập</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <X size={20} className="text-red-600 flex-none w-[20px]" />
                  <span>Tìm cho bạn tình yêu đích thực</span>
                </p>
                <p className="mb-2 flex items-center space-x-2">
                  <Check
                    size={20}
                    className="text-green-600 flex-none w-[20px]"
                  />
                  <span>Đánh bại IELTS</span>
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <p className="text-4xl font-bold">85.000đ</p>
                <p className="text-slate-500">/ tháng</p>
              </div>
              <div className="w-full px-3 py-2 bg-amber-600/20 text-amber-600 text-center rounded-lg">
                Liên hệ hỗ trợ để được tư vấn
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="w-full flex items-center justify-center py-20 sm:py-10 bg-slate-50"
      >
        <div className="max-w-3xl w-full px-4">
          <p className="text-center text-4xl sm:text-3xl font-bold mb-2">
            Liên hệ với chúng mình
          </p>
          <p className="text-lg sm:text-base font-semibold text-slate-500 mb-5 text-center">
            Bạn muốn hợp tác hay chỉ đơn giản là cần trợ giúp? Liên hệ với chúng
            mình nha
          </p>
          <div className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg border border-1 w-fit m-auto mb-5 font-semibold">
            xinchao@bachduong.app
          </div>
          <p className="text-lg sm:text-base font-semibold text-slate-500 mb-5 text-center">
            Hoặc kết nối với chúng mình qua
          </p>

          <div className="flex items-center justify-center space-x-6 m-auto w-fit">
            {/* Facebook Icon */}
            <FaFacebook
              size={30}
              onClick={() =>
                (window.location.href = "https://fb.me/bachduongapp")
              }
              className="text-blue-600 cursor-pointer hover:scale-110 transition-transform"
            />

            {/* Divider */}
            <div className="w-0.5 h-8 bg-gray-300"></div>

            {/* Zalo Icon */}
            <SiZalo
              size={30}
              onClick={() =>
                (window.location.href = "https://zalo.me/0904177537")
              }
              className="text-sky-600 cursor-pointer hover:scale-110 transition-transform"
            />

            {/* Divider */}
            <div className="w-0.5 h-8 bg-gray-300"></div>

            <FaTiktok
              size={30}
              onClick={() =>
                (window.location.href = "https://tiktok.com/@bachduongapp")
              }
              className="text-pink-600 cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
