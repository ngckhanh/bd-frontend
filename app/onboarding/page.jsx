"use client";

import instance from "@/axiosInstance/instance";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Onboarding () {
    const submitData = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        instance.post(
            '/me/onboarding',
            {
                band_target: formData.get('band_target').toString(),
                expectations: formData.get('expectations'),
            },
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }
        )
        .then((res) => {
            toast.success("Hồ sơ đã hoàn thiện. Đang điều hướng");
            window.location.href = "/speaking"
        })
        .catch((err) => {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại sau");
        })
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="md:w-[500px] w-[100%] p-5">
                <p className="text-2xl font-bold text-center">Cảm ơn bạn đã chọn Bạch Dương App</p>
                <p className="text-slate-600 text-center mb-5">Để đảm bảo trải nghiệm của bạn tốt nhất. Hãy trả lời một số câu hỏi dưới đây</p>
                <form onSubmit={submitData}>
                    <div className="mb-3">
                        <Label htmlFor="band_target"><p className="mb-1">Bạn muốn đạt IELTS band bao nhiêu?</p></Label>
                        <Input type="text" name="band_target" placeholder="7.5" required/>
                    </div>
                    <div className="mb-3">
                        <Label htmlFor="band_target"><p className="mb-1">Bạn muốn Bạch Dương giúp bạn cải thiện như thế nào?</p></Label>
                        <Textarea type="text" name="expectations" placeholder="Tôi muốn có một vốn từ vựng tốt hơn" required/>
                    </div>
                    <Button type="submit" className="w-full">Gửi</Button>
                </form>
            </div>
        </div>
    )
}