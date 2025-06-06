"use client";
import { useEffect, useState } from "react";
import useUserStore from "../(store)/userStore";
import useHistoryStore from "../(store)/historyStore";
import { toast } from "react-hot-toast";
import instance from "@/axiosInstance/instance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Crown,
  Check,
  BadgeCheck,
  LucideSidebar,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import VoucherForm from "@/components/VoucherForm";
import Script from "next/script";

export default function MemberLayout({ children }) {
  const [pastHistory, setPastHistory] = useState([]);
  const userStore = useUserStore();
  const [userData, setUserData] = useState({});
  const historyStore = useHistoryStore();
  const router = useRouter();
  const pathname = usePathname();
  const [upgradeScreen, setUpgradeScreen] = useState("upgrade");
  const [depositAdOpened, setDepositAdOpened] = useState(false);

  const updateProfileHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    instance
      .post(
        "/me/update",
        {
          fullname: formData.get("fullname"),
          phone_number: formData.get("phoneNumber"),
          referral_code: formData.get("referralCode"),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        toast.success("Cập nhật thông tin thành công");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const deleteTask = (subId, taskNum) => {
    console.log(localStorage.getItem("token"));
    instance
      .post(
        `/speaking/personal/delete/${taskNum}/${subId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        historyStore.removeFromHistory(subId);
        router.push("/speaking");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    // Redirect user to auth page if user haven't logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    // Fetch user data
    const getUserData = async () => {
      try {
        const res = await instance.get("/me/get", {
          headers: { Authorization: token },
        });
        setUserData(res.data.user);
        userStore.setUser(res.data.user);
        if (res.data.user.onboarding_required) {
          router.push("/onboarding");
        }
      } catch (err) {
        userStore.logout();
        localStorage.removeItem("token");
        router.push("/auth");
      }
    };

    // Cache current history
    const getCurrentHistory = async () => {
      try {
        const res = await instance.get("/speaking/personal/history/present", {
          headers: { Authorization: token },
        });
        historyStore.addToHistory(res.data.data);
      } catch (err) {
        userStore.logout();
        localStorage.removeItem("token");
        router.push("/auth");
      }
    };

    // Get past history
    const getPastHistory = async () => {
      try {
        const res = await instance.get("/speaking/personal/history/past", {
          headers: { Authorization: token },
        });
        setPastHistory(res.data.data);
      } catch (err) {
        userStore.logout();
        localStorage.removeItem("token");
        router.push("/auth");
      }
    };

    if (localStorage.getItem("depositAdOpened") !== null) {
      setDepositAdOpened(
        localStorage.getItem("depositAdOpened") === true
      );
    } else {
      setDepositAdOpened(true);
    }

    // Execute all data fetching in parallel
    Promise.all([getUserData(), getCurrentHistory(), getPastHistory()]);

    // Set up a refresh interval for user data
    const refreshInterval = setInterval(() => {
      getUserData();
    }, 30000); // Refresh user data every minute

    return () => clearInterval(refreshInterval);
  }, [router]);

  //Checking token balance before announcing to user
  const [currentBalance, setCurrentBalance] = useState(userStore.user.balance);
  useEffect(() => {
    if (userStore.user.balance > currentBalance) {
      const addedTokens = userStore.user.balance - currentBalance;
      toast.success(`Bạn đã nạp thành công ${addedTokens} token!`, {
        duration: 5000,
        position: "top-center",
      });
    }
    setCurrentBalance(userStore.user.balance);
  }, [userStore.user.balance, currentBalance]);

  return (
    <SidebarProvider
      className="flex w-screen h-screen fixed"
    >
      <Dialog open={depositAdOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chào mừng bạn đến với Bạch Dương AI</DialogTitle>
            <DialogDescription>
              Chúng tôi rất vui khi bạn đã tham gia cùng chúng tôi. Hãy cùng
              khám phá những điều thú vị mà chúng tôi đã chuẩn bị cho bạn nhé!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setDepositAdOpened(false);
                localStorage.setItem("depositAdOpened", false);
              }} 
            >
              Bỏ qua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex-none flex-shrink-0">
        <Sidebar>
          <SidebarHeader className="w-full h-fit">
            <div className="w-full h-fit flex items-center space-x-2 p-3">
              <div className="flex-none flex items-center justify-center">
                <Image
                  src="/logo.png"
                  height="511"
                  width="511"
                  alt="logo"
                  className="flex-none w-[40px] h-auto m-auto rounded-full"
                />
              </div>
              <div className="grow flex items-center h-full w-full">
                <div className="leading-5">
                  <p className="font-semibold tracking-tight">Bạch Dương AI</p>
                  <p className="text-slate-500 text-xs font-semibold tracking-tight">
                    Giám khảo IELTS
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-lg"
              onClick={() => router.push("/speaking", { prefetch: true })}
            >
              <Plus />
              Tạo phòng
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Cá nhân</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userStore.user.premium === false && (
                    <SidebarMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <SidebarMenuButton className="text-amber-600 hover:text-amber-600 focus-visible:text-amber-600">
                            <Crown />
                            Nâng cấp tài khoản
                          </SidebarMenuButton>
                        </DialogTrigger>
                        <DialogContent
                          style={{
                            background:
                              "white linear-gradient(180deg, rgba(251,192,119,0.2) 0%, rgba(255,255,255,1) 60%)",
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                          </DialogHeader>
                          <div className="relative m-auto">
                            <Crown
                              className="m-auto text-amber-600"
                              size="40"
                            />
                            <Image
                              src="/logo.png"
                              height="100"
                              width="100"
                              alt="logo"
                              className="rounded-full shadow-lg border border-1 mb-3 m-auto"
                            />
                          </div>
                          <p className="text-xl font-semibold tracking-tight text-center">
                            Nâng cấp tài khoản
                          </p>
                          <p className="text-center text-slate-500 mb-5">
                            Luyện tập thả ga không lo về giá.
                          </p>
                          <div className="w-full p-3 rounded-lg border border-2 border-amber-600 mb-1 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold tracking-tight">
                                Tài khoản Premium
                              </p>
                            </div>
                            <p className="text-slate-400 font-semibold tracking-tight">
                              <span className="text-amber-600">85.000đ</span>{" "}
                              &#40;17 tokens&#41; / tháng
                            </p>
                          </div>
                          <Button
                            className="w-full bg-amber-600 text-white hover:bg-amber-700"
                            onClick={(e) => {
                              e.target.disabled = true;
                              e.target.innerText = "Đang nâng cấp";
                              instance
                                .get("/me/to-premium", {
                                  headers: {
                                    Authorization:
                                      localStorage.getItem("token"),
                                  },
                                })
                                .then((res) => {
                                  toast.success(
                                    "Nâng cấp tài khoản thành công!"
                                  );
                                  window.location.reload();
                                })
                                .catch((err) => {
                                  toast.error(err.response.data.message);
                                  e.target.disabled = false;
                                  e.target.innerText = "Nâng cấp ngay";
                                });
                            }}
                          >
                            Nâng cấp ngay
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push("/speaking/analytics")}
                      disabled={userData.premium}
                      className={`${userData.premium === false ? "cursor-not-allowed text-slate-500" : ""}`}
                    >
                      <ChartLine size={15} />
                      Thống kê
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="md:block hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <SidebarMenuButton>
                          <User2 size={15} />
                          Tài khoản
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Tài khoản của bạn</SheetTitle>
                          <SheetDescription>
                            Xem chi tiết tài khoản của bạn tại đây
                          </SheetDescription>
                        </SheetHeader>
                        <div className="px-3 md:px-5">
                          <Image
                            src={userStore.user.avatar || "/logo.png"}
                            height="100"
                            width="100"
                            alt="avatar"
                            className="rounded-full shadow-lg border border-1 mb-3"
                          />
                          {userStore.user.premium === false ? (
                            <p className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-600 font-semibold tracking-tight w-fit mb-3">
                              Tài khoản Free
                            </p>
                          ) : (
                            <p className="px-3 py-1.5 rounded-lg bg-yellow-600/20 text-amber-600 font-semibold tracking-tight w-fit mb-3">
                              Tài khoản Premium
                            </p>
                          )}
                          <p className="text-xl font-semibold tracking-tight">
                            {userStore.user.fullname || "Bach Duong App"}
                          </p>
                          <p className="text-slate-500 mb-5">
                            Là thành viên từ {userStore.user.created_at}
                          </p>
                          <div className="mb-10">
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Mục tiêu
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.band_target}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold tracking-tight">
                                Nguyên vọng
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.expectations}
                              </p>
                            </div>
                          </div>
                          <div className="mb-10">
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Email
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.email}
                              </p>
                            </div>
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Số điện thoại
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.phone_number === null
                                  ? "Chưa thêm"
                                  : userStore.user.phone_number}
                              </p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button>Thay đổi</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Thay đổi thông tin</DialogTitle>
                                  <DialogDescription>
                                    Thay đổi thông tin cá nhân của bạn
                                  </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={updateProfileHandler}>
                                  <div className="md:flex items-center mb-5">
                                    <div className="flex-none md:w-[30%]">
                                      <p className="font-semibold tracking-tight text-sm">
                                        Họ tên
                                      </p>
                                    </div>
                                    <div className="grow">
                                      <Input
                                        name="fullname"
                                        type="text"
                                        className="w-full"
                                        placeholder={userStore.user.fullname}
                                      />
                                    </div>
                                  </div>
                                  <div className="md:flex items-center mb-5">
                                    <div className="flex-none md:w-[30%]">
                                      <p className="font-semibold tracking-tight text-sm">
                                        Email
                                      </p>
                                    </div>
                                    <div className="grow">
                                      <Input
                                        name="email"
                                        type="email"
                                        className="w-full"
                                        value={userStore.user.email}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="md:flex items-center mb-5">
                                    <div className="flex-none md:w-[30%]">
                                      <p className="font-semibold tracking-tight text-sm">
                                        Số điện thoại
                                      </p>
                                    </div>
                                    <div className="grow">
                                      <Input
                                        name="phoneNumber"
                                        type="text"
                                        className="w-full"
                                        placeholder={
                                          userStore.user.phone_number === null
                                            ? ""
                                            : userStore.user.phone_number
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="md:flex items-center mb-5">
                                    <div className="flex-none md:w-[30%]">
                                      <p className="font-semibold tracking-tight text-sm">
                                        Mã giới thiệu
                                      </p>
                                    </div>
                                    <div className="grow">
                                      <Input
                                        name="referralCode"
                                        type="text"
                                        className="w-full"
                                        placeholder={
                                          userStore.user.referral_code
                                        }
                                      />
                                    </div>
                                  </div>
                                  <Button className="float-end" type="submit">
                                    Thay đổi
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => router.push("/auth/logout")}
                            className="w-full"
                          >
                            Đăng xuất
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="md:hidden block">
                    <Drawer className="w-screen overflow-auto px-2">
                      <DrawerTrigger asChild>
                        <SidebarMenuButton>
                          <User2 size={15} />
                          Tài khoản
                        </SidebarMenuButton>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Tài khoản</DrawerTitle>
                          <DrawerDescription>
                            Xem chi tiết tài khoản của bạn tại đây
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="px-5">
                          <Image
                            src={userStore.user.avatar || "/logo.png"}
                            height="100"
                            width="100"
                            alt="avatar"
                            className="rounded-full shadow-lg border border-1 mb-3"
                          />
                          {userStore.user.premium === false ? (
                            <p className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-600 font-semibold tracking-tight w-fit mb-3">
                              Tài khoản Free
                            </p>
                          ) : (
                            <p className="px-3 py-1.5 rounded-lg bg-yellow-600/20 text-amber-600 font-semibold tracking-tight w-fit mb-3">
                              Tài khoản Premium
                            </p>
                          )}
                          <p className="text-xl font-semibold tracking-tight">
                            {userStore.user.fullname || "Bach Duong App"}
                          </p>
                          <p className="text-slate-500 mb-5">
                            Là thành viên từ {userStore.user.created_at}
                          </p>
                          <div className="mb-10">
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Mục tiêu
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.band_target}
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold tracking-tight">
                                Nguyên vọng
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.expectations}
                              </p>
                            </div>
                          </div>
                          <div className="mb-10">
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Email
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.email}
                              </p>
                            </div>
                            <div className="mb-3">
                              <p className="font-semibold tracking-tight">
                                Số điện thoại
                              </p>
                              <p className="text-slate-500">
                                {userStore.user.phone_number === null
                                  ? "Chưa thêm"
                                  : userStore.user.phone_number}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Thay đổi</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Thay đổi thông tin
                                    </DialogTitle>
                                    <DialogDescription>
                                      Thay đổi thông tin cá nhân của bạn
                                    </DialogDescription>
                                  </DialogHeader>
                                  <form onSubmit={updateProfileHandler}>
                                    <div className="md:flex items-center mb-5">
                                      <div className="flex-none md:w-[30%]">
                                        <p className="font-semibold tracking-tight text-sm">
                                          Họ tên
                                        </p>
                                      </div>
                                      <div className="grow">
                                        <Input
                                          name="fullname"
                                          type="text"
                                          className="w-full"
                                          placeholder={userStore.user.fullname}
                                        />
                                      </div>
                                    </div>
                                    <div className="md:flex items-center mb-5">
                                      <div className="flex-none md:w-[30%]">
                                        <p className="font-semibold tracking-tight text-sm">
                                          Email
                                        </p>
                                      </div>
                                      <div className="grow">
                                        <Input
                                          name="email"
                                          type="email"
                                          className="w-full"
                                          value={userStore.user.email}
                                          disabled
                                        />
                                      </div>
                                    </div>
                                    <div className="md:flex items-center mb-5">
                                      <div className="flex-none md:w-[30%]">
                                        <p className="font-semibold tracking-tight text-sm">
                                          Số điện thoại
                                        </p>
                                      </div>
                                      <div className="grow">
                                        <Input
                                          name="phoneNumber"
                                          type="text"
                                          className="w-full"
                                          placeholder={
                                            userStore.user.phone_number === null
                                              ? ""
                                              : userStore.user.phone_number
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="md:flex items-center mb-5">
                                      <div className="flex-none md:w-[30%]">
                                        <p className="font-semibold tracking-tight text-sm">
                                          Mã giới thiệu
                                        </p>
                                      </div>
                                      <div className="grow">
                                        <Input
                                          name="referralCode"
                                          type="text"
                                          className="w-full"
                                          placeholder={
                                            userStore.user.referral_code
                                          }
                                        />
                                      </div>
                                    </div>
                                    <Button className="float-end" type="submit">
                                      Thay đổi
                                    </Button>
                                  </form>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                onClick={() => router.push("/auth/logout")}
                                className="w-fit"
                              >
                                Đăng xuất
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() =>
                        (window.location.href = "https://fb.me/bachduongapp")
                      }
                    >
                      <LifeBuoy size={15} />
                      Hỗ trợ
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {userStore.user.premium === false && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => router.push("/speaking/deposit")}
                      >
                        <Wallet size={15} />
                        Nạp token
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {userStore.user.premium === false && (
                    <>
                      {/* Voucher in desktop*/}
                      <SidebarMenuItem className="md:block hidden">
                        <Sheet>
                          <SheetTrigger asChild>
                            <SidebarMenuButton>
                              <Ticket size={15} />
                              Thêm voucher
                            </SidebarMenuButton>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Thêm voucher của bạn</SheetTitle>
                              <SheetDescription>
                                Nhập mã voucher của bạn để nhận ưu đãi.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="">
                              <VoucherForm />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </SidebarMenuItem>

                      {/* Voucher in mobile*/}
                      <SidebarMenuItem className="md:hidden block">
                        <Drawer className="w-screen overflow-auto px-2">
                          <DrawerTrigger asChild>
                            <SidebarMenuButton>
                              <Ticket size={15} />
                              Thêm voucher
                            </SidebarMenuButton>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Thêm voucher của bạn</DrawerTitle>
                              <DrawerDescription>
                                Nhập mã voucher của bạn để nhận ưu đãi.
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="">
                              <VoucherForm />
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </SidebarMenuItem>
                    </>
                  )}
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => router.push("/speaking/voucher")}
                    >
                      <Ticket size={15} />
                      Thêm voucher
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Hôm nay</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {historyStore.history.length > 0 ? (
                    <div className="w-full mb-5">
                      {historyStore.history.map((item) => (
                        <ContextMenu key={item.sub_id}>
                          <ContextMenuTrigger>
                            <div
                              className={`w-full px-2 py-1.5 hover:bg-slate-100 cursor-pointer rounded-lg ${pathname === `/speaking/view/task/${item.task}/id/${item.sub_id}` ? "bg-slate-100" : ""}`}
                              onClick={() => {
                                router.push(
                                  `/speaking/view/task/${item.task}/id/${item.sub_id}`
                                );
                              }}
                            >
                              {item.task === "1" ? (
                                <p className="text-sm truncate flex items-center space-x-2">
                                  <Text className="flex-none w-[15px]" />{" "}
                                  <span className="grow">{item.topic[0]}</span>
                                </p>
                              ) : (
                                <p className="text-sm truncate flex items-center space-x-2">
                                  <Text className="flex-none w-[15px]" />{" "}
                                  <span className="grow">
                                    {item.task_two_question}
                                  </span>
                                </p>
                              )}
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            <ContextMenuItem
                              className="text-red-600 hover:text-red-600"
                              onClick={() => {
                                deleteTask(item.sub_id, item.task);
                              }}
                            >
                              Xóa bài
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    Lịch sử
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  {userData.premium === true ? (
                    <SidebarGroupContent>
                      {pastHistory.length > 0 ? (
                        pastHistory.map((item) => {
                          return (
                            <ContextMenu key={item.sub_id}>
                              <ContextMenuTrigger>
                                <div
                                  className={`w-full px-2 py-1.5 hover:bg-slate-100 cursor-pointer rounded-lg transition ease-in-out duration-150 ${pathname === `/speaking/view/task/${item.task}/id/${item.sub_id}` ? "bg-slate-200" : ""}`}
                                  onClick={(e) => {
                                    router.push(
                                      `/speaking/view/task/${item.task}/id/${item.sub_id}`
                                    );
                                  }}
                                >
                                  {item.task === "1" ? (
                                    <p className="text-sm truncate flex items-center space-x-2">
                                      <Text
                                        size="15"
                                        className="flex-none w-[15px]"
                                      />{" "}
                                      <span className="grow">
                                        {item.topic[0]}
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="text-sm truncate flex items-center space-x-2">
                                      <Text
                                        size="15"
                                        className="flex-none w-[15px]"
                                      />{" "}
                                      <span className="grow">
                                        {item.task_two_question}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                <ContextMenuItem
                                  className="text-red-600 hover:text-red-600"
                                  onClick={() => {
                                    deleteTask(item.sub_id, item.task);
                                  }}
                                >
                                  Xóa bài
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </SidebarGroupContent>
                  ) : (
                    <SidebarGroupContent>
                      <p className="text-slate-500 text-center p-5">
                        Tính năng này chỉ dành cho tài khoản Premium
                      </p>
                    </SidebarGroupContent>
                  )}
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
          {/* Add Purchase Premium button */}
          {/* <SidebarFooter>
            
          </SidebarFooter> */}
          {/* {userData !== undefined && userData.premium === false && (
            <SidebarFooter className="h-[300px] w-full">
              <Script
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4624816506300999"
                crossOrigin="anonymous"
                strategy="afterInteractive"
              />
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-4624816506300999"
                data-ad-slot="3431842499"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </SidebarFooter>
          )} */}
        </Sidebar>
      </div>
      <div className="flex-grow overflow-auto h-full w-full flex flex-col relative">
        <div
          className={`flex-none h-fit top-0 p-3 flex justify-between w-full items-center space-x-2 z-2 ${
            pathname === "/speaking"
              ? "bg-[#fbc07733]"
              : "absolute bg-white border-b-1"
          }`}
        >
          <SidebarTrigger>
            Menu
          </SidebarTrigger>
          <div className="flex items-center space-x-2">
            <div className="rounded-full flex items-center py-2 px-3 bg-white border border-1 space-x-2">
              {userStore.user.premium === false ? (
                <>
                  <Wallet size={15}></Wallet>
                  <p className="text-sm">
                    Bạn còn{" "}
                    <span className="font-semibold tracking-tight text-primary">
                      {userStore.user.balance} token
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <Crown size={15} className="text-amber-600"></Crown>
                  <p className="text-sm">
                    Tài khoản{" "}
                    <span className="font-semibold tracking-tight text-amber-600">
                      Premium
                    </span>
                  </p>
                </>
              )}
            </div>

            {userStore.user.avatar !== "" ? (
              <Image
                src={userStore.user.avatar || "/logo.png"}
                height="50"
                width="50"
                alt="avatar"
                className="rounded-full"
              />
            ) : (
              <Skeleton className="rounded-full h-[50px] w-[50px]" />
            )}
          </div>
        </div>
        <div className="grow overflow-auto">{children}</div>
      </div>
      {/* Inline script to initialize this specific ad */}
      {/* <Script>
        (adsbygoogle = window.adsbygoogle || []).push({});
      </Script> */}
    </SidebarProvider>
  );
}
