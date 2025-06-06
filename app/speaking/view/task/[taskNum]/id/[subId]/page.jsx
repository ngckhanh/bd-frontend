"use client";

import { use, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import instance from "@/axiosInstance/instance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TextHighlighter from "@/components/text-highlighter";
import {
  ArrowRight,
  ArrowUpRight,
  Blend,
  BookA,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Cog,
  Copy,
  EqualApproximately,
  Headphones,
  Info,
  Medal,
  MessageCircle,
  MessageCircleMore,
  Mic,
  Pencil,
  PenLineIcon,
  Share2,
  SparklesIcon,
  Speech,
  TrendingDown,
  TrendingUp,
  User2Icon,
} from "lucide-react";
import reactStringReplace from "react-string-replace";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useUserStore from "@/app/(store)/userStore";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import HorizontalAd from "@/components/horizontal-ad";

export default function ViewSubmission(props) {
  const taskData = use(props.params);
  const [testData, setTestData] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [partOne, setPartOne] = useState([]);
  const [partTwo, setPartTwo] = useState("");
  const [partThree, setPartThree] = useState([]);
  const [partOneEntirety, setPartOneEntirety] = useState("");
  const [partTwoAndThreeEntirety, setPartTwoAndThreeEntirety] = useState("");
  const router = useRouter();
  const userStore = useUserStore();
  const [adClosable, setAdClosable] = useState(false);

  const improve = useCallback((testData, toImprove) => {
    const improvements = [
      {
        type: "grammar",
        data: testData.review.grammar_improvements,
        className: "text-red-600 underline underline-1 underline-red-600",
      },
      {
        type: "vocab",
        data: testData.review.vocab_improvements,
        className: "text-yellow-600 underline underline-1 underline-yellow-600",
      },
    ];

    improvements.forEach(({ data, className }) => {
      data.forEach((v) => {
        toImprove = reactStringReplace(toImprove, v.to_improve, (match, i) => (
          <Popover key={`${i}-improve-${v.improvement}`}>
            <PopoverTrigger asChild>
              <span
                className={`w-fit ${className} font-semibold hover:bg-opacity-70 transition ease-in-out duration-150 focus-visible:bg-opacity-70`}
              >
                {match}
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <div className="mb-2">
                  <p>Thay vì dùng</p>
                  <p className="text-amber-500 italic font-semibold">{match}</p>
                </div>
                <div className="mb-2">
                  <p>Bạn có thể dùng</p>
                  <p className="text-green-500 italic font-semibold">
                    {v.improvement}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ));
      });
    });

    return toImprove;
  }, []);

  const improveFunc = (testData, toImprove) => {
    const improvements = [
      {
        type: "grammar",
        data: testData.review.grammar_improvements,
        className: "text-red-600 underline underline-1 underline-red-600",
      },
      {
        type: "vocab",
        data: testData.review.vocab_improvements,
        className: "text-yellow-600 underline underline-1 underline-yellow-600",
      },
    ];

    improvements.forEach(({ data, className }) => {
      data.forEach((v) => {
        toImprove = reactStringReplace(toImprove, v.to_improve, (match, i) => (
          <Popover key={`${i}-improve-${v.improvement}`}>
            <PopoverTrigger asChild>
              <span
                className={`w-fit ${className} font-semibold hover:bg-opacity-70 transition ease-in-out duration-150 focus-visible:bg-opacity-70`}
              >
                {match}
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <div className="mb-2">
                  <p>Thay vì dùng</p>
                  <p className="text-amber-500 italic font-semibold">{match}</p>
                </div>
                <div className="mb-2">
                  <p>Bạn có thể dùng</p>
                  <p className="text-green-500 italic font-semibold">
                    {v.improvement}
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ));
      });
    });

    return toImprove;
  };

  const fetchTestData = useCallback(async () => {
    try {
      let response;
      await instance
        .get(`/speaking/personal/get/${taskData.taskNum}/${taskData.subId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        })
        .then((res) => {
          response = res;
        })
        .catch((err) => {
          toast.error("Không tìm thấy bài làm của bạn");
          window.location.href = "/speaking";
        });

      setTestData((prevData) => {
        const newData = response.data.data;
        if (JSON.stringify(prevData) === JSON.stringify(newData)) {
          return prevData; // No change, return the previous state
        }

        if (newData.finished) {
          if (newData.task === "1") {
            setPartOne(
              newData.review.specific_feedback.map((v) => ({
                question: v.question,
                response: improve(newData, v.user_response),
                feedback: v.feedback,
                improved_version: v.improved_version,
              }))
            );
            setPartOneEntirety(improve(newData, newData.user_response_raw));
          } else {
            setPartTwo(
              newData.user_response_task_two === ""
                ? improve(newData, newData.user_response_raw)
                : improve(newData, newData.user_response_task_two)
            );
            setPartThree(
              JSON.stringify(newData.user_response_task_three) === "{}"
                ? []
                : newData.user_response_task_three.map((v) => ({
                    question: v.question,
                    response: improve(newData, v.response),
                    improved_version: v.improved_version,
                  }))
            );
          }
        }

        return newData;
      });
    } catch (err) {
      console.error(err);
      toast.error(
        "Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng tải lại trang để thử lại"
      );
    } finally {
      setIsInitialLoading(false);
    }
  }, [taskData.taskNum, taskData.subId, improve]);

  useEffect(() => {
    fetchTestData();
    const checkInterval = setInterval(() => {
      if (testData.finished) clearInterval(checkInterval);
      else fetchTestData();
    }, 3000);
    setTimeout(() => { setAdClosable(true) }, 10000) // Set a 10 second ad timer to make sure the ad is viewable first
    return () => clearInterval(checkInterval);
  }, [fetchTestData]);

  if (isInitialLoading) {
    return <LoadingSkeleton />;
  } else {
    if (testData.finished === false) {
      if (
        testData.error_occurred === false &&
        testData.uploaded_content === ""
      ) {
        return (
          <motion.div
            className="h-screen w-full flex items-center justify-center md:p-5 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full md:w-[70%]">
              <p className="text-center text-8xl mb-5">🥸</p>
              <p className="text-center text-3xl font-semibold">
                Có vẻ như bạn chưa nộp bài này
              </p>
              <p className="text-center text-slate-500 font-semibold mb-5">
                Hãy quay lại trang này sau khi bạn đã nộp bài nha. Bạn có thể
                quay lại phòng thi bằng nút bên dưới.
              </p>
              <div className="w-full flex items-center">
                <Button
                  onClick={() =>
                    router.push(
                      `/speaking/view/task/${testData.task}/id/${taskData.subId}/take`
                    )
                  }
                  className="m-auto"
                >
                  Đưa tôi quay lại phòng thi <ArrowUpRight />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      } else if (testData.error_occurred === true) {
        return (
          <motion.div
            className="h-screen w-full flex items-center justify-center md:p-5 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full md:min-w-[50%] md:max-w-[70%]">
              <p className="text-center text-8xl mb-5">😱</p>
              <p className="text-center text-3xl font-semibold">
                Bài của bạn đã gặp lỗi trong quá trình chấm bài
              </p>
              <p className="text-center text-slate-500 font-semibold mb-5">
                Liên lạc với chúng mình để được hoàn tiền nha. Chúng mình xin
                lỗi vì sự bất tiện này.
              </p>
              <div className="w-full flex items-center">
                <Button
                  onClick={() => router.push(`/speaking/support`)}
                  className="m-auto"
                  variant="destructive"
                >
                  Liên hệ hỗ trợ <ArrowUpRight />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      } else {
        return (
          <motion.div
            className="h-screen w-full flex items-center justify-center md:p-5 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full md:min-w-[50%] md:max-w-[70%]">
              <p className="text-center text-8xl mb-5">🥳</p>
              <p className="text-center text-3xl font-semibold">
                Bạn đã nộp bài thành công
              </p>
              <p className="text-center text-slate-500 font-semibold mb-5">
                Hãy giữ trang này mở nha. Đứng dậy uống nước trong khi chúng
                mình đang đánh giá bài của bạn một cách nhanh nhất!
              </p>
              <div className="w-full flex items-center">
                <Button
                  onClick={() => router.push(`/speaking/support`)}
                  className="m-auto"
                  variant="destructive"
                >
                  Liên hệ hỗ trợ <ArrowUpRight />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      }
    } else {
      return (
        <motion.div
          className="w-full h-screen overflow-auto pt-25 md:px-10 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} //Thay đổi với 100
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Kết quả bài thi
                </h1>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/10 text-primary px-3 py-1"
                >
                  {testData.task === "1" ? "Part 1" : "Part 2 & 3"}
                </Badge>
                <p></p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge
                  variant="secondary"
                  className="rounded-full flex items-center gap-1.5"
                >
                  <Calendar size={14} />
                  <span>{testData.created_at.split(" ")[0]}</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="rounded-full flex items-center gap-1.5"
                >
                  <Clock size={14} />
                  <span>{testData.created_at.split(" ")[1]}</span>
                </Badge>
                <Badge
                  variant={testData.finished ? "success" : "warning"}
                  className={`rounded-full flex items-center gap-1.5 ${
                    testData.finished
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}
                >
                  {testData.finished ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
                  <span>
                    {testData.finished ? "Chấm thành công" : "Đang chấm"}
                  </span>
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10"
                  >
                    <Share2 size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Chia sẻ kết quả</h4>
                      <p className="text-sm text-muted-foreground">
                        Sử dụng link dưới đây để chia sẻ bài làm của bạn
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        readOnly
                        value={`https://bachduong.app/view/task/${taskData.taskNum}/id/${taskData.subId}`}
                        className="h-9"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-3"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://bachduong.app/view/task/${taskData.taskNum}/id/${taskData.subId}`
                          );
                          toast.success("Đã copy link");
                        }}
                      >
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* <div className="w-full p-3 rounded-lg border border-1 mb-5">
            <p className="text-slate-500 text-sm flex items-center space-x-1 font-semibold tracking-tight">
              <Info size="12"/> 
              <span>Quảng cáo</span>
            </p>
            <HorizontalAd/>
          </div> */}
          <div className="w-full md:flex md:space-x-5 mb-10">
            <div className="grow md:grid hidden md:grid-cols-2 grid-cols-1 gap-2 md:mb-0 mb-5">
              <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                    <BookA />
                  </div>
                  <p className="text-slate-500">Lexical Resources</p>
                </div>
                <p className="text-2xl font-semibold mb-3">
                  Từ vựng -{" "}
                  <span className="text-primary">
                    {testData.lexical_resource.indexOf(".") !== -1
                      ? testData.lexical_resource
                      : testData.lexical_resource + ".0"}
                  </span>
                </p>
                {parseFloat(testData.lexical_resource_improvement) > 0 && (
                  <p className="text-green-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingUp size={20} />
                    <span>
                      Tăng {testData.lexical_resource_improvement} band so với
                      bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.lexical_resource_improvement) < 0 && (
                  <p className="text-red-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingDown size={20} />
                    <span>
                      Giảm{" "}
                      {parseFloat(testData.lexical_resource_improvement) * -1}{" "}
                      band so với bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.lexical_resource_improvement) === 0 && (
                  <p className="text-amber-600 mb-3 flex items-center space-x-2">
                    <EqualApproximately size={20} />
                    <span>Band không đổi</span>
                  </p>
                )}
                <Progress
                  value={
                    (Number.parseFloat(testData.lexical_resource) / 9) * 100
                  }
                  className="mb-3"
                />
                <p className="text-slate-500 text-sm font-semibold">
                  {0.0 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) <= 4.0 &&
                    "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                  {4.5 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) <= 6.5 &&
                    "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                  {7.0 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) <= 8.0 &&
                    "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                  {Number.parseFloat(testData.lexical_resource) > 8.0 &&
                    "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                </p>
              </div>
              <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                    <Medal />
                  </div>
                  <p className="text-slate-500">Grammatical Range</p>
                </div>
                <p className="text-2xl font-semibold mb-3">
                  Ngữ pháp -{" "}
                  <span className="text-primary">
                    {testData.grammatical_range.indexOf(".") !== -1
                      ? testData.grammatical_range
                      : testData.grammatical_range + ".0"}
                  </span>
                </p>
                {parseFloat(testData.grammatical_range_improvement) > 0 && (
                  <p className="text-green-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingUp size={20} />
                    <span>
                      Tăng {testData.grammatical_range_improvement} so với bài
                      trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.grammatical_range_improvement) < 0 && (
                  <p className="text-red-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingDown size={20} />
                    <span>
                      Giảm{" "}
                      {parseFloat(testData.grammatical_range_improvement) * -1}{" "}
                      band so với bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.grammatical_range_improvement) === 0 && (
                  <p className="text-amber-600 mb-3 flex items-center space-x-2">
                    <EqualApproximately size={20} />
                    <span>Band không đổi</span>
                  </p>
                )}
                <Progress
                  value={
                    (Number.parseFloat(testData.grammatical_range) / 9) * 100
                  }
                  className="mb-3"
                  indicatorColor="bg-primary"
                />
                <p className="text-slate-500 text-sm font-semibold">
                  {0.0 <= Number.parseFloat(testData.grammatical_range) &&
                    Number.parseFloat(testData.grammatical_range) <= 4.0 &&
                    "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                  {4.5 <= Number.parseFloat(testData.grammatical_range) &&
                    Number.parseFloat(testData.grammatical_range) < 6.5 &&
                    "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                  {7.0 <= Number.parseFloat(testData.grammatical_range) &&
                    Number.parseFloat(testData.grammatical_range) <= 8.0 &&
                    "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                  {Number.parseFloat(testData.grammatical_range) > 8.0 &&
                    "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                </p>
              </div>
              <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                    <Blend />
                  </div>
                  <p className="text-slate-500">Fluency and Coherence</p>
                </div>
                <p className="text-2xl font-semibold mb-3">
                  Trôi chảy -{" "}
                  <span className="text-primary">
                    {testData.fluency_coherence.indexOf(".") !== -1
                      ? testData.fluency_coherence
                      : testData.fluency_coherence + ".0"}
                  </span>
                </p>
                {parseFloat(testData.fluency_coherence_improvement) > 0 && (
                  <p className="text-green-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingUp size={20} />
                    <span>
                      Tăng {testData.fluency_coherence_improvement} band so với
                      bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.fluency_coherence_improvement) < 0 && (
                  <p className="text-red-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingDown size={20} />
                    <span>
                      Giảm{" "}
                      {parseFloat(testData.fluency_coherence_improvement) * -1}{" "}
                      band so với bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.fluency_coherence_improvement) === 0 && (
                  <p className="text-amber-600 mb-3 flex items-center space-x-2">
                    <EqualApproximately size={20} />
                    <span>Band không đổi</span>
                  </p>
                )}
                <Progress
                  value={
                    (Number.parseFloat(testData.fluency_coherence) / 9) * 100
                  }
                  className="mb-3"
                  indicatorColor="bg-primary"
                />
                <p className="text-slate-500 text-sm font-semibold">
                  {0.0 <= Number.parseFloat(testData.fluency_coherence) &&
                    Number.parseFloat(testData.fluency_coherence) <= 4.0 &&
                    "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                  {4.5 <= Number.parseFloat(testData.fluency_coherence) &&
                    Number.parseFloat(testData.fluency_coherence) < 6.5 &&
                    "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                  {7.0 <= Number.parseFloat(testData.fluency_coherence) &&
                    Number.parseFloat(testData.fluency_coherence) <= 8.0 &&
                    "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                  {Number.parseFloat(testData.fluency_coherence) > 8.0 &&
                    "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                </p>
              </div>
              <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                    <Speech />
                  </div>
                  <p className="text-slate-500">Pronunciation</p>
                </div>
                <p className="text-2xl font-semibold mb-3">
                  Phát âm -{" "}
                  <span className="text-primary">
                    {testData.fluency_coherence.indexOf(".") !== -1
                      ? testData.fluency_coherence
                      : testData.fluency_coherence + ".0"}
                  </span>
                </p>
                {parseFloat(testData.fluency_coherence_improvement) > 0 && (
                  <p className="text-green-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingUp size={20} />
                    <span>
                      Tăng {testData.fluency_coherence_improvement} band so với
                      bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.fluency_coherence_improvement) < 0 && (
                  <p className="text-red-600 mb-3 flex items-center space-x-2 font-semibold">
                    <TrendingDown size={20} />
                    <span>
                      Giảm{" "}
                      {parseFloat(testData.fluency_coherence_improvement) * -1}{" "}
                      band so với bài trước
                    </span>
                  </p>
                )}
                {parseFloat(testData.fluency_coherence_improvement) === 0 && (
                  <p className="text-amber-600 mb-3 flex items-center space-x-2">
                    <EqualApproximately size={20} />
                    <span>Band không đổi</span>
                  </p>
                )}
                <Progress
                  value={
                    (Number.parseFloat(testData.lexical_resource) / 9) * 100
                  }
                  className="mb-3"
                  indicatorColor="bg-primary"
                />
                <p className="text-slate-500 text-sm font-semibold">
                  {0.0 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) <= 4.0 &&
                    "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                  {4.5 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) < 6.5 &&
                    "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                  {7.0 <= Number.parseFloat(testData.lexical_resource) &&
                    Number.parseFloat(testData.lexical_resource) <= 8.0 &&
                    "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                  {Number.parseFloat(testData.lexical_resource) > 8.0 &&
                    "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                </p>
              </div>
            </div>
            <Carousel className="md:hidden block m-auto w-full mb-5 max-w-xs flex-none">
              <p className="text-center text-slate-500 font-semibold text-sm mb-3">
                Vuốt sang phải để xem tiếp
              </p>
              <CarouselContent>
                <CarouselItem>
                  <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                        <BookA />
                      </div>
                      <p className="text-slate-500">Lexical Resources</p>
                    </div>
                    <p className="text-2xl font-semibold mb-3">
                      Từ vựng -{" "}
                      <span className="text-primary">
                        {testData.lexical_resource.indexOf(".") !== -1
                          ? testData.lexical_resource
                          : testData.lexical_resource + ".0"}
                      </span>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.lexical_resource) / 9) * 100
                      }
                      className="mb-3"
                    />
                    <p className="text-slate-500 text-sm font-semibold">
                      {0.0 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) <= 4.0 &&
                        "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                      {4.5 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) <= 6.5 &&
                        "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                      {7.0 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) <= 8.0 &&
                        "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                      {Number.parseFloat(testData.lexical_resource) > 8.0 &&
                        "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                        <Cog />
                      </div>
                      <p className="text-slate-500">Grammatical Range</p>
                    </div>
                    <p className="text-2xl font-semibold mb-3">
                      Ngữ pháp -{" "}
                      <span className="text-primary">
                        {testData.grammatical_range.indexOf(".") !== -1
                          ? testData.grammatical_range
                          : testData.grammatical_range + ".0"}
                      </span>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.grammatical_range) / 9) *
                        100
                      }
                      className="mb-3"
                      indicatorColor="bg-primary"
                    />
                    <p className="text-slate-500 text-sm font-semibold">
                      {0.0 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) <= 4.0 &&
                        "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                      {4.5 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) < 6.5 &&
                        "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                      {7.0 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) <= 8.0 &&
                        "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                      {Number.parseFloat(testData.grammatical_range) > 8.0 &&
                        "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                        <Blend />
                      </div>
                      <p className="text-slate-500">Fluency and Coherence</p>
                    </div>
                    <p className="text-2xl font-semibold mb-3">
                      Trôi chảy -{" "}
                      <span className="text-primary">
                        {testData.lexical_resource.indexOf(".") !== -1
                          ? testData.fluency_coherence
                          : testData.fluency_coherence + ".0"}
                      </span>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.lexical_resource) / 9) * 100
                      }
                      className="mb-3"
                      indicatorColor="bg-primary"
                    />
                    <p className="text-slate-500 text-sm font-semibold">
                      {0.0 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) <= 4.0 &&
                        "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                      {4.5 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) < 6.5 &&
                        "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                      {7.0 <= Number.parseFloat(testData.lexical_resource) &&
                        Number.parseFloat(testData.lexical_resource) <= 8.0 &&
                        "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                      {Number.parseFloat(testData.lexical_resource) > 8.0 &&
                        "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                    </p>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="rounded-lg md:p-5 p-3 bg-white border-1">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-primary/10 rounded-full text-primary font-semibold p-3 text-sm w-fit">
                        <Speech />
                      </div>
                      <p className="text-slate-500">Pronunciation</p>
                    </div>
                    <p className="text-2xl font-semibold mb-3">
                      Phát âm -{" "}
                      <span className="text-primary">
                        {testData.grammatical_range.indexOf(".") !== -1
                          ? testData.grammatical_range
                          : testData.grammatical_range + ".0"}
                      </span>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.grammatical_range) / 9) *
                        100
                      }
                      className="mb-3"
                      indicatorColor="bg-primary"
                    />
                    <p className="text-slate-500 text-sm font-semibold">
                      {0.0 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) <= 4.0 &&
                        "Cần cải thiện nhiều! - Khó truyền đạt ý, ngữ pháp và từ vựng yếu."}
                      {4.5 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) < 6.5 &&
                        "Khá ổn! - Giao tiếp được nhưng còn lỗi ngữ pháp, từ vựng."}
                      {7.0 <= Number.parseFloat(testData.grammatical_range) &&
                        Number.parseFloat(testData.grammatical_range) <= 8.0 &&
                        "Rất tốt! - Trôi chảy, từ vựng phong phú, ít lỗi."}
                      {Number.parseFloat(testData.grammatical_range) > 8.0 &&
                        "Xuất sắc! - Tự nhiên, chính xác, gần như bản xứ. 👏"}
                    </p>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 transform -translate-x-1/2 translate-y-0" />
              <CarouselNext className="absolute right-0 transform translate-x-1/2 translate-y-0" />
            </Carousel>
            <div className="flex-none md:w-[35%] w-full border border-1 rounded-lg h-fit md:p-5 p-3 md:mb-0 mb-5">
              <p className="text-xl font-semibold mb-3 flex items-center space-x-2">
                <SparklesIcon /> <span>Đề bài & Nhận xét</span>
              </p>
              <Tabs className="w-full h-[400px]" defaultValue="topic">
                <TabsList className="grid w-full grid-cols-3 mb-3 rounded-full">
                  <TabsTrigger
                    value="topic"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <PenLineIcon /> Đề bài
                  </TabsTrigger>
                  <TabsTrigger
                    value="review"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <MessageCircle /> Nhận xét
                  </TabsTrigger>
                  <TabsTrigger
                    value="listen"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Headphones /> Nghe lại
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="topic" className="h-full overflow-auto">
                  <div className="mb-3 overflow-auto">
                    {testData.task === "1" ? (
                      <>
                        <div className="mb-3">
                          <p className="font-semibold bg-slate-200 rounded-full px-3 py-1 w-fit text-xs mb-2">
                            Part 1
                          </p>
                          {testData.topic.map((v, i) => (
                            <p
                              className="py-2 px-3 rounded-lg border border-1 mb-3 bg-slate-50/50"
                              key={i}
                            >
                              {v}
                            </p>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <p className="font-semibold bg-slate-200 rounded-full px-3 py-1 w-fit text-xs mb-2">
                            Part 2
                          </p>
                          {testData.topic.task_two_question}
                        </div>
                        <div>
                          <p className="font-semibold bg-slate-200 rounded-full px-3 py-1 w-fit text-xs mb-2">
                            Part 3
                          </p>
                          {testData.topic.task_three_follow_up.map((v, i) => (
                            <p key={i}>{v}</p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="review">
                  <div className="mb-3">
                    <p className="text-lg font-semibold">Nhận xét</p>
                    <p className="text-slate-500">
                      {testData.review.general_feedback}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="listen">
                  <p className="font-semibold mb-3">Nghe lại bài nói của bạn</p>
                  <audio controls className="w-full mb-10">
                    <source src={testData.uploaded_content} type="audio/wav" />
                  </audio>
                  {typeof testData.pronunciation_accuracy === "object" ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button className="w-full">Xem phát âm của bạn</Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-[90%]">
                        <DrawerHeader>
                          <DrawerTitle>Xem lại bài làm của bạn</DrawerTitle>
                          <DrawerDescription>
                            Bài làm của bạn ở dang chữ. Nếu có lỗi phát âm thì
                            từ đó sẽ được hightlight nha.
                          </DrawerDescription>
                        </DrawerHeader>
                        <div className="px-4">
                          {testData.pronunciation_accuracy.length === 0 ? (
                            <p className="text-green-600 font-semibold">
                              Tốt lắm! Hệ thống của chúng mình không phát hiện
                              lỗi sai phát âm{" "}
                            </p>
                          ) : (
                            <p className="text-yellow-600">
                              Hãy xem những sửa phát âm dưới này nha
                            </p>
                          )}
                          {testData.user_response_raw !== "" ? (
                            <TextHighlighter
                              text={testData.user_response_raw}
                              highlightData={testData.pronunciation_accuracy}
                            />
                          ) : (
                            "Bài làm của bạn chưa hỗ trợ chức năng này. Vui lòng tạo lần thử mới ở phiên bản mới."
                          )}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <>
                      <Button className="w-full" disabled={true}>
                        Xem phát âm của bạn
                      </Button>
                      <p className="text-red">
                        Bài nói này được thực hiện trước khi chức năng này được
                        cập nhật. Vui lòng thử lại bằng lần kiểm tra khác
                      </p>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="w-full">
            <Tabs className="w-full h-[400px]" defaultValue="chat">
              <div className="">
                <p className="text-3xl font-bold tracking-tight">
                  Câu trả lời của {userStore.user.fullname}
                </p>
                <p className="text-slate-500 mb-3">
                  Toàn bộ câu trả lời của bạn được AI tách ra từ đoạn ghi âm.
                  Hãy ấn vào câu trả lời của bạn để thấy được câu trả lời đã
                  được AI cải thiện nha
                </p>
                <TabsList className="grid w-fit grid-cols-3 mb-3 rounded-full px-1">
                  <TabsTrigger
                    value="chat"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2"
                  >
                    <MessageCircle /> Dạng chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="paragraph"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2"
                  >
                    <Mic /> Dạng tổng thể
                  </TabsTrigger>
                  <TabsTrigger
                    value="errorlist"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-2"
                  >
                    <Mic /> Bảng chữa lỗi
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value="chat"
                className="w-full rounded-lg md:bg-slate-50 md:px-5 md:pt-5 max-w-fit h-fit md:pb-5 pb-50"
              >
                <div className="w-full rounded-lg md:bg-sky-600/20 p-3 max-w-fit text-sky-600 font-semibold mb-3 md:block hidden">
                  Bạch Dương sẽ thử phân biệt câu trả lời của bạn và câu hỏi mà
                  bạn đang trả lời. Nếu có sai sót thì không phải lo lắng nha!
                  Điểm của bạn được chấm trên tổng thể nên sẽ không bị ảnh hưởng
                  😄. Nếu bạn cần xem các sửa chữa thì hãy ấn vào dạng tổng thể
                  nha.
                </div>
                <div className="mb-5">
                  <div className="flex space-x-2">
                    <div className="flex-none w-fit h-fit top-0">
                      <Image
                        src="/logo.png"
                        height="50"
                        width="50"
                        className="w-[30px] h-[30px] rounded-full border border-1"
                        alt="logo"
                      />
                    </div>
                    <div className="h-fit p-3 bg-primary text-white rounded-xl border border-1 shadow-sm">
                      <p className="text-sm">
                        Hey there 👋! My name is Bach Duong and I will be your
                        IELTS examiner today! Lets begin our test and wish you
                        the best of luck 😉
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex space-x-2">
                    <div className="flex-none w-fit h-fit top-0">
                      <Image
                        src="/logo.png"
                        height="50"
                        width="50"
                        className="w-[30px] h-[30px] rounded-full border border-1"
                        alt="logo"
                      />
                    </div>
                    <div className="h-fit p-3 bg-primary text-white rounded-xl border border-1 shadow-sm">
                      <p className="text-sm">
                        Your recording will be processed and I will try to see
                        which question you are answering to. I might make
                        mistakes but don't worry! This won't affect your band
                        score 😄
                      </p>
                    </div>
                  </div>
                </div>
                {testData.task === "1" ? (
                  <>
                    {partOne.map((v, i) => (
                      <div key={i}>
                        <div className="mb-5">
                          <div className="flex space-x-2">
                            <div className="flex-none w-fit h-fit top-0">
                              <Image
                                src="/logo.png"
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                            <div className="h-fit p-3 bg-primary text-white rounded-xl border border-1 shadow-sm">
                              <p className="text-sm">{v.question}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-end space-x-2">
                            <div className="h-fit p-3 bg-white rounded-xl border border-1 shadow-sm cursor-pointer">
                              <p className="text-sm">{v.response}</p>
                            </div>
                            <div className="h-inherit w-[30px] flex-none">
                              <Image
                                src={userStore.user.avatar || "/logo.png"}
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex space-x-2">
                            <div className="flex-none w-fit h-fit top-0">
                              <Image
                                src="/logo.png"
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                            <div className="h-fit p-3 bg-primary text-white rounded-xl border border-1 shadow-sm">
                              <p className="font-semibold mb-3 text-sm">
                                Bạn có thể trả lời như sau:
                              </p>
                              <p className="text-sm">{v.improved_version}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="text-slate-500 font-semibold text-center mb-3">
                      Part 2
                    </p>
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <div className="h-fit top-0">
                          <Image
                            src="/logo.png"
                            height="50"
                            width="50"
                            className="w-[30px] h-[30px] rounded-full border border-1"
                            alt="logo"
                          />
                        </div>
                        <div className="h-fit p-3  bg-primary rounded-xl text-white shadow-sm">
                          <p className="text-sm">
                            {testData.topic.task_two_question}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-end space-x-2">
                        <div className="h-fit p-2 md:p-3  bg-white rounded-xl border border-1 shadow-sm cursor-pointer">
                          <p className="text-sm">{partTwo}</p>
                        </div>
                        <div className="h-inherit flex-none w-fit">
                          <Image
                            src={userStore.user.avatar || "/logo.png"}
                            height="50"
                            width="50"
                            className="w-[30px] h-[30px] rounded-full border border-1"
                            alt="logo"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <div className="h-fit w-fit flex-none top-0">
                          <Image
                            src="/logo.png"
                            height="50"
                            width="50"
                            className="w-[30px] h-[30px] rounded-full border border-1"
                            alt="logo"
                          />
                        </div>
                        <div className="h-fit p-3 bg-primary rounded-xl text-white shadow-sm">
                          <p className="text-sm">
                            {testData.review.specific_feedback[0].feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <div className="flex-none w-fit h-fit top-0">
                          <Image
                            src="/logo.png"
                            height="50"
                            width="50"
                            className="w-[30px] h-[30px] rounded-full border border-1"
                            alt="logo"
                          />
                        </div>
                        <div className="h-fit p-3 bg-primary rounded-xl text-white shadow-sm">
                          <p className="text-sm">
                            Bạn có thể thử trả lời như thế này:{" "}
                          </p>
                          <p className="font-semibold text-sm">
                            {
                              testData.review.specific_feedback[0]
                                .improved_version
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-500 font-semibold text-center mb-3">
                      Part 3
                    </p>
                    {partThree.map((v, i) => (
                      <div key={i}>
                        <div className="mb-3">
                          <div className="flex space-x-2">
                            <div className="h-fit top-0">
                              <Image
                                src="/logo.png"
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                            <div className="h-fit md:p-3 bg-primary rounded-xl text-white shadow-sm">
                              <p className="text-sm">{v.question}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-end space-x-2">
                            <div className="h-fit md:p-3 p-2  bg-white rounded-xl border border-1 shadow-sm">
                              <p className="text-sm">{v.response}</p>
                            </div>
                            <div className="h-inherit w-[30px] flex-none">
                              <Image
                                src={userStore.user.avatar || "/logo.png"}
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex space-x-2">
                            <div className="h-fit top-0">
                              <Image
                                src="/logo.png"
                                height="50"
                                width="50"
                                className="w-[30px] h-[30px] rounded-full border border-1"
                                alt="logo"
                              />
                            </div>
                            <div className="h-fit md:p-3 p-2  bg-primary rounded-xl text-white shadow-sm">
                              <p className="text-sm">
                                Bạn có thể thử trả lời như thế này:
                              </p>
                              <p className="font-semibold text-sm">
                                {v.improved_version}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-fit top-0">
                          <Image
                            src="/logo.png"
                            height="50"
                            width="50"
                            className="w-[30px] h-[30px] rounded-full border border-1"
                            alt="logo"
                          />
                        </div>
                        <div className="h-fit md:p-3 p-2  bg-primary rounded-xl text-white shadow-sm">
                          <p>
                            {testData.review.specific_feedback[1] !== undefined
                              ? testData.review.specific_feedback[1].feedback
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              <TabsContent
                value="paragraph"
                className="w-full rounded-lg border border-1"
              >
                <div className="bg-slate-100 rounded-lg h-fit">
                  <div className="p-3">
                    {testData.review.grammar_improvements.length === 0 &&
                    testData.review.vocab_improvements.length === 0 ? (
                      <p className="text-green-600 font-semibold">
                        Tốt lắm. Sau khi cân nhắc band điểm bạn đã chọn và câu
                        trả lời của bạn thì không có gì phải sửa nha!
                      </p>
                    ) : (
                      <p className="text-yellow-600 font-semibold">
                        Hãy xem những sửa chữa dưới đây để cải thiện band điểm
                        của bạn nha!
                      </p>
                    )}
                  </div>
                  <div className="w-full p-3 bg-white rounded-lg border border-t-1 border-b-0 border-l-0 border-r-0">
                    {improveFunc(testData, testData.user_response_raw)}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="errorlist" className="w-full rounded-lg">
                {testData.review.grammar_improvements.length === 0 &&
                testData.review.vocab_improvements.length === 0 ? (
                  <p className="text-green-600 font-semibold mb-3">
                    Tốt lắm. Sau khi cân nhắc band điểm bạn đã chọn và câu trả
                    lời của bạn thì không có gì phải sửa nha!
                  </p>
                ) : (
                  <p className="text-yellow-600 font-semibold mb-3">
                    Hãy xem những sửa chữa dưới đây để cải thiện band điểm của
                    bạn nha!
                  </p>
                )}
                {testData.review.grammar_improvements.map((v, i) => (
                  <div
                    className="bg-slate-100 rounded-lg h-fit border border-1 mb-3 md:w-fit w-full"
                    key={i}
                  >
                    <div className="p-3">
                      <p className="text-sm font-semibold px-3 py-1 bg-red-500/20 text-red-500 rounded-full border border-1 border-red-500 w-fit">
                        Cải thiện ngữ pháp
                      </p>
                    </div>
                    <div className="w-full p-3 bg-white rounded-t-lg border border-t-1 border-b-0 border-l-0 border-r-0 flex flex-wrap-1 items-center space-x-2">
                      <div className="bg-red-600/20 text-red-600 rounded-lg p-3 w-fit">
                        {v.to_improve}
                      </div>
                      <ArrowRight className="h-[20px] w-[20px]" />
                      <div className="bg-green-600/20 text-green-600 rounded-lg p-3 w-fit">
                        {v.improvement}
                      </div>
                    </div>
                    <div className="w-full p-3 bg-white rounded-b-lg border border-t-1 border-b-0 border-l-0 border-r-0">
                      <p className="text-slate-500 text-sm font-semibold">
                        Tại sao:
                      </p>
                      <p className="text-slate-500 text-sm">{v.why}</p>
                    </div>
                  </div>
                ))}
                {testData.review.vocab_improvements.map((v, i) => (
                  <div
                    className="bg-slate-100 rounded-lg h-fit border border-1 mb-3 md:w-fit w-full"
                    key={i}
                  >
                    <div className="p-3">
                      <p className="text-sm font-semibold px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-1 border-amber-500 w-fit">
                        Cải thiện từ vựng
                      </p>
                    </div>
                    <div className="w-full p-3 bg-white rounded-t-lg border border-t-1 border-b-0 border-l-0 border-r-0 flex flex-wrap-1 items-center space-x-2">
                      <div className="bg-amber-600/20 text-amber-600 rounded-lg p-3 w-fit">
                        {v.to_improve}
                      </div>
                      <ArrowRight className="h-[20px] w-[20px]" />
                      <div className="bg-green-600/20 text-green-600 rounded-lg p-3 w-fit">
                        {v.improvement}
                      </div>
                    </div>
                    <div className="w-full p-3 bg-white rounded-b-lg border border-t-1 border-b-0 border-l-0 border-r-0">
                      <p className="text-slate-500 text-sm font-semibold">
                        Tại sao:
                      </p>
                      <p className="text-slate-500 text-sm">{v.why}</p>
                    </div>
                  </div>
                ))}
                {testData.review.sentence_improvements.map((v, i) => (
                  <div
                    className="bg-slate-100 rounded-lg h-fit border border-1 mb-3 md:w-fit w-full"
                    key={i}
                  >
                    <div className="p-3">
                      <p className="text-sm font-semibold px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full border border-1 border-purple-500 w-fit">
                        Cải thiện cấu trúc câu
                      </p>
                    </div>
                    <div className="w-full p-3 bg-white rounded-t-lg border border-t-1 border-b-0 border-l-0 border-r-0 flex flex-wrap-1 items-center space-x-2">
                      <div className="bg-purple-600/20 text-purple-600 rounded-lg p-3 w-fit">
                        {v.to_improve}
                      </div>
                      <ArrowRight className="h-[20px] w-[20px]" />
                      <div className="bg-green-600/20 text-green-600 rounded-lg p-3 w-fit">
                        {v.improvement}
                      </div>
                    </div>
                    <div className="w-full p-3 bg-white rounded-b-lg border border-t-1 border-b-0 border-l-0 border-r-0">
                      <p className="text-slate-500 text-sm font-semibold">
                        Tại sao:
                      </p>
                      <p className="text-slate-500 text-sm">{v.why}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      );
    }
  }
}

function LoadingSkeleton() {
  return (
    <div className="w-full h-screen md:p-10 p-5 md:flex md:space-x-5">
      <div className="md:grow">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-40 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <div className="md:flex md:flex-none md:w-[35%] hidden h-fit w-full">
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}
