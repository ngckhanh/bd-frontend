"use client";

import { useState, useEffect } from "react";
import useUserStore from "@/app/(store)/userStore";
import instance from "@/axiosInstance/instance";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Tooltip as Tip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, InfoIcon, List } from "lucide-react";
import { GrScorecard } from "react-icons/gr";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import AnalyticsTable from "@/components/analytics-table";

export default function Analytics() {
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const userStore = useUserStore();
  const router = useRouter();

  if (userStore.user.premium === false) {
    return <div>Chức năng chỉ dành cho Premium</div>;
  }

  const formatDate = (dateString) => {
    try {
      // Create a Date object from the input string
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      // Get month abbreviation (first 3 letters of month name)
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[date.getMonth()];

      // Get day of month with leading zero if needed
      const day = date.getDate().toString().padStart(2, "0");

      // Return formatted date
      return `${month} ${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const filterLargest = (data) => {
    const dataMap = new Map();
    data.forEach((item) => {
      const currentMax = dataMap.get(item.created_at) || 0;
      if (item.total_mark > currentMax) {
        dataMap.set(item.created_at, item.total_mark);
      }
    });

    const finished = Array.from(dataMap)
      .map(([key, value]) => ({
        created_at: formatDate(key),
        total_score: value,
      }))
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    console.log(finished);
    return finished;
  };

  const filterLargestScore = (data) => {
    // Filter the largest score of the entire data
    let largest = 0;
    data.forEach((item) => {
      if (item.total_mark > largest) {
        largest = item.total_mark;
      }
    });
    return largest;
  };

  const filterLowestScore = (data) => {
    // Filter the lowest score of the entire data
    let lowest = 10;
    data.forEach((item) => {
      if (item.total_mark < lowest) {
        lowest = item.total_mark;
      }
    });
    return lowest;
  }

  useEffect(() => {
    if (analyticsLoaded) return;
    const fetchAnalytics = async () => {
      // fetch data
      instance
        .get("/speaking/personal/get-general-stats", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setAnalyticsData(res.data);
          setAnalyticsLoaded(true);
        })
        .catch((err) => {
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
          router.push("/speaking");
        });
    };
    fetchAnalytics();
  }, []);
  return (
    <TooltipProvider className="w-full h-full">
      <div className="md:mt-25 mt-20 w-full md:py-5 py-3 md:px-10 px-3">
        <div className="w-full">
          <p className="rounded-full py-1 px-3 bg-cyan-600/20 text-cyan-600 text-sm inline-flex items-center space-x-2 border border-1 border-cyan-600 mb-3 font-semibold">
            Chức năng thử nghiệm
          </p>
          <p className="text-3xl font-semibold">
            Xin chào, {userStore.user.fullname}
          </p>
          <p className="text-slate-500">
            Dữ liệu dưới đây được lấy trong 30 ngày vừa qua tính từ hiện tại
          </p>
        </div>
        <div className="w-full mt-5">
          <div className="w-full grid md:grid-cols-2 grid-cols-1 flex-grow gap-2">
            {analyticsLoaded && analyticsData.part_one.length > 0 ? (
              <div className="w-full rounded-lg p-5 border border-1">
                <div className="mb-3">
                  <p className="text-xl font-semibold tracking-tight">Tiến độ điểm số Part 1</p>
                  <p className="text-slate-500">
                    Bảng dưới đây chỉ tính điểm cao nhất của các ngày
                  </p>
                </div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mb-5 md:w-fit w-full">
                  <div className="bg-white rounded-lg border border-1 p-3 w-full">
                    <p className="font-semibold flex items-center space-x-2">
                      <GrScorecard /> <span>Điểm cao nhất</span>
                    </p>
                    <p className="text-slate-500 text-sm">
                      Band{" "}
                      <span className="text-green-600 text-xl font-semibold">
                        {filterLargestScore(analyticsData.part_one)}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border border-1 p-3 w-full">
                    <p className="font-semibold flex items-center space-x-2">
                      <List /> <span>Điểm thấp nhất</span>
                    </p>
                    <p className="text-slate-500 text-sm">
                      Band{" "}
                      <span className="text-red-600 text-xl font-semibold">
                        {filterLowestScore(analyticsData.part_one)}
                      </span>
                    </p>
                  </div>
                </div>
                <ChartContainer
                  className="w-full h-fit md:h-[300px] h-[250px]"
                  config={{ analytics: { label: "Analytics" } }}
                >
                  <LineChart
                    accessibilityLayer
                    data={filterLargest(analyticsData.part_one)}
                  >
                    <CartesianGrid vertical={false}  />
                    <XAxis
                      dataKey="created_at"
                      tickLine={true}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={9} tickCount={9} domain={[1, 9]} />
                    <ChartTooltip
                      cursor={false}
                      labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
                      formatter={(value) => [`${value}`, "Điểm cao nhất"]}
                    />
                    <Line
                      dataKey="total_score"
                      type="natural"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--primary)",
                      }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line>
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div>Không có dữ liệu</div>
            )}
            <div className="w-full flex items-center space-x-3 flex-grow">
              {analyticsLoaded && analyticsData.part_one.length > 0 ? (
                <div className="w-full rounded-lg md:p-5 p-3 border border-1">
                  <div className="mb-3">
                    <p className="text-xl font-semibold tracking-tight">Tiến độ điểm số Part 2 & 3</p>
                    <p className="text-slate-500">
                      Bảng dưới đây chỉ tính điểm cao nhất của các ngày
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-2 mb-5 md:w-fit w-full">
                    <div className="bg-white rounded-lg border border-1 p-3 w-full">
                      <p className="font-semibold flex items-center space-x-2">
                        <GrScorecard /> <span>Điểm cao nhất</span>
                      </p>
                      <p className="text-slate-500 text-sm">
                        Band{" "}
                        <span className="text-green-600 text-xl font-semibold">
                          {filterLargestScore(analyticsData.part_two)}
                        </span>
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border border-1 p-3 w-full">
                      <p className="font-semibold flex items-center space-x-2">
                        <List /> <span>Điểm thấp nhất</span>
                      </p>
                      <p className="text-slate-500 text-sm">
                        Band{" "}
                        <span className="text-red-600 text-xl font-semibold">
                          {filterLowestScore(analyticsData.part_one)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ChartContainer
                    className="w-full md:h-[300px] h-[250px]"
                    config={{
                      desktop: { label: "Analytics" },
                      mobile: { label: "Analytics" },
                    }}
                  >
                    <LineChart
                      accessibilityLayer
                      data={filterLargest(analyticsData.part_two)}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="created_at"
                        tickLine={true}
                        axisLine={false}
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={9} tickCount={9} domain={[1, 9]} />
                      <ChartTooltip
                        cursor={false}
                        labelFormatter={(label) => `Ngày: ${formatDate(label)}`}
                        formatter={(value) => [`${value}`, "Điểm cao nhất"]}
                        className="rounded-lg"
                      />
                      <Line
                        dataKey="total_score"
                        type="natural"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={{
                          fill: "var(--primary)",
                        }}
                      >
                        <LabelList
                          position="top"
                          offset={12}
                          className="fill-foreground"
                          fontSize={12}
                        />
                      </Line>
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div>Không có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:px-10 px-3">
        <AnalyticsTable analyticsData={analyticsData}/>
      </div>
    </TooltipProvider>
  );
}
