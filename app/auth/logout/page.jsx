"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; 
import useUserStore from "@/app/(store)/userStore";
import Link from "next/link";

export default function Logout() {
    const userStore = useUserStore();
    const router = useRouter();
    const loggedOut = useRef(false);

    useEffect(() => {
        if (loggedOut.current) return;
        loggedOut.current = true;
        userStore.setUser({});
        localStorage.removeItem('token');
        router.replace("/");
    })

    return (
        <div>
            <p>Đang đăng xuất...</p>
        </div>

        // <div>
        //     {loggedOut.current && (
        //         <p>Đã đăng xuất. Ấn vào <Link href="/" className="text-primary underline underline-offset-4">đây</Link> để trở về trang chủ</p>
        //     )}
        //     {!loggedOut.current && (
        //         <p>Đang đăng xuất...</p>
        //     )}
        // </div>
    )
}