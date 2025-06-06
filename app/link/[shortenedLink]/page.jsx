"use client";

import instance from "@/axiosInstance/instance";
import { use, useEffect } from "react";

export default function ShortenedLink({ params }) {
    const shortened_link = use(params).shortenedLink;
    useEffect(() => {
        instance.get(
            "/link/get/" + shortened_link
        )
        .then((res) => {
            destinationLink = res.data.original;
            window.location.href = destinationLink;
        })
        .catch((err) => {
            console.log(err);
            window.location.href = "/"
        });
    }, [])
    return "Đang điều hướng"
}