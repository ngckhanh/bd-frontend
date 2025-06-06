"use client";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import instance from "@/axiosInstance/instance";
import toast from "react-hot-toast";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Statistics() {
    const [dailyData, setDailyData] = useState();
    const dataLoaded = useRef(false);

    useEffect(() => {
        if (dataLoaded.current) return;
        const token = localStorage.getItem('token');
        const getDailyData = (token) => {
            instance.get(
                "/speaking/personal/statistics",
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            .then((res) => {
                setDailyData({
                    "partOne": res.data.part_one,
                    "partTwo": res.data.part_two,
                });
                dataLoaded.current = true;
                return;
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    toast.error("Bạn chưa có dữ liệu thống kê nào");
                    return;
                }
                toast.error("Đã có lỗi khi tải dữ liệu. Vui lòng thử lại sau");
            })
        }
        getDailyData(token)
    }, []);
    return (
        <div className="w-full h-full overflow-y-auto md:p-10 p-5">
            <p className="text-3xl font-semibold mb-3">Thống kê</p>
            <div className="w-full">
                <div className="w-full p-5 rounded-lg bg-white shadow-md mb-3">
                    <p className="w-full text-center text-slate-600 font-semibold text-sm">Tổng quan điểm cao nhất tính theo ngày</p>
                    {dataLoaded.current && (
                        <Tabs defaultValue="part1" className="w-full">
                            <TabsList className="w-fit">
                                <TabsTrigger value="part1">Part 1</TabsTrigger>
                                <TabsTrigger value="part2">Part 2 & 3</TabsTrigger>
                            </TabsList>
                            <TabsContent value="part1">
                                <Line
                                    className="w-full h-full"
                                    data={{
                                        labels: dailyData.partOne.map((item) => item.date),
                                        datasets: [
                                            {
                                                label: "Điểm cao nhất",
                                                data: dailyData.partOne.map((item) => item.total_mark),
                                                backgroundColor: '#2563eb',
                                                borderColor: '#2563eb'
                                            }
                                        ]
                                    }}
                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                min: 0,
                                                max: 9
                                            }
                                        }
                                    }}
                                />
                            </TabsContent>
                            <TabsContent value="part2">
                                <Line
                                    className="w-full h-full"
                                    data={{
                                        labels: dailyData.partTwo.map((item) => item.date),
                                        datasets: [
                                            {
                                                label: "Điểm cao nhất",
                                                data: dailyData.partTwo.map((item) => item.total_mark),
                                                backgroundColor: '#f59e0b',
                                                borderColor: '#f59e0b'
                                            }
                                        ]
                                    }}
                                    options={{
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                min: 0,
                                                max: 9
                                            }
                                        }
                                    }}
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}