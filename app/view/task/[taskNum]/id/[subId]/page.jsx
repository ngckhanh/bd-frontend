"use client";

import { use, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import instance from "@/axiosInstance/instance";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowRight,
  Bot,
  MessageCircleMore,
  Pencil,
  Share,
  User2Icon,
} from "lucide-react";
import reactStringReplace from "react-string-replace";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import axios from 'axios';

export default function ViewSubmission(props) {
  const taskData = use(props.params);
  const [testData, setTestData] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [partOne, setPartOne] = useState([]);
  const [partTwo, setPartTwo] = useState("");
  const [partThree, setPartThree] = useState([]);
  const [subPublic, setSubPublic] = useState(false);

  const improve = useCallback((testData, toImprove) => {
    const improvements = [
      {
        type: "grammar",
        data: testData.review.grammar_improvements,
        className: "bg-red-100 text-red-600",
      },
      {
        type: "vocab",
        data: testData.review.vocab_improvements,
        className: "bg-yellow-100 text-yellow-600",
      },
    ];

    improvements.forEach(({ data, className }) => {
      data.forEach((v) => {
        toImprove = reactStringReplace(toImprove, v.to_improve, (match, i) => (
          <Popover key={`${i}-improve-${v.improvement}`}>
            <PopoverTrigger asChild>
              <span
                className={`w-fit ${className} font-semibold hover:bg-opacity-70 transition ease-in-out duration-150 p-2 focus-visible:bg-opacity-70 border border-r-0 border-l-0 border-t-0 border-b-2`}
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

  const fetchTestData = useCallback(async () => {
    try {
      let response;
      await instance.get(
        `/speaking/personal/get/${taskData.taskNum}/${taskData.subId}`,
        {
          validateStatus: (status) => { return status < 400 }
        },
      )
      .then((res) => response = res)
      .catch((err) => {
        toast.error('Không tìm thấy bài làm của bạn');
        window.location.href = "/";
        return;
      })

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
          } else {
            setPartTwo(improve(newData, newData.user_response_task_two));
            setPartThree(
              newData.user_response_task_three.map((v) => ({
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
    const checkInterval = setInterval(fetchTestData, 3000);
    return () => clearInterval(checkInterval);
  }, [fetchTestData]);

  if (isInitialLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div className="py-3 px-4 w-full flex items-center justify-between border border-b-1 border-r-0 border-l-0 border-t-0 shadow-sm mb-3">
        <div className="tracking-tight text-xl flex items-center space-x-2 p-3 w-fit h-fit md:m-0 m-auto">
          <div className="bg-blue-500 rounded-lg p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"
              />
            </svg>
          </div>
          <div className="">
            <p className="p-0 m-0 leading-5 font-semibold">
              Bạch Dương <span className="text-blue-500">App</span>
            </p>
            <p className="text-slate-500 text-sm font-semibold">Giám khảo AI</p>
          </div>
        </div>
        <div className="md:flex hidden items-center space-x-6">
          <Link
            href="/#features"
            className="text-slate-500 font-semibold hover:text-slate-600"
          >
            Tính năng
          </Link>
          <Link
            href="/#pricing"
            className="text-slate-500 font-semibold hover:text-slate-600"
          >
            Bảng giá
          </Link>
          <Link
            href="/#about"
            className="text-slate-500 font-semibold hover:text-slate-600"
          >
            Về chúng mình
          </Link>
          <Link
            href="/#partner"
            className="text-slate-500 font-semibold hover:text-slate-600"
          >
            Hợp tác
          </Link>
          <Link href="/speaking">
            <Button>Bất đầu</Button>
          </Link>
        </div>
      </div>
      <div className="bg-green-100 text-green-600 font-semibold text-center px-3 py-2 w-fit m-auto mb-3 rounded-lg">
        Bạn đang xem bài làm của người dùng khác.
      </div>
      <div className="w-full h-screen md:px-10 md:py-5 p-5 md:flex md:space-x-5">
        <div className="md:grow">
          {testData.finished === false &&
            testData.error_occurred === false &&
            testData.uploaded_content === "" && (
              <div className="bg-amber-100 p-3 rounded-lg text-amber-600 font-semibold text-sm mb-3">
                <p className="">
                    Người dùng chưa thực hiện bài kiểm tra này
                </p>
              </div>
            )}
          <div className="w-full items-center justify-between mb-3 md:flex hidden">
            <div>
              <p className="text-3xl font-semibold flex items-center space-x-3">
                <span>Tổng kết bài làm</span>{" "}
                <Badge>Part {testData.task === "1" ? "1" : "2 + 3"}</Badge>
              </p>
              <p className="text-sm font-semibold text-slate-500">
                Được tạo vào {testData.created_at}
              </p>
            </div>
            <div className="flex items-center space-x-2">
                {testData.finished ? (
                <div className="px-3 py-2 text-sm font-semibold bg-green-300/60 text-green-600 rounded-lg">
                    Chấm thành công
                </div>
                ) : (
                <div className="px-3 py-2 text-sm font-semibold bg-amber-300/60 text-amber-600 rounded-lg flex items-center space-x-2">
                    <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-amber-500"></span>
                    </span>
                    <span>Đang chấm</span>
                </div>
                )}
            </div>
          </div>
          {/* Mobile view header */}
          <div className="w-full md:hidden block">
            <div className="text-3xl font-semibold text-center">
              <Badge>Part {testData.task === "1" ? "1" : "2 + 3"}</Badge>
              <p>Tổng kết bài làm</p>
            </div>
            <p className="text-sm font-semibold text-slate-500 text-center mb-2">
              Đã tạo vào {testData.created_at}
            </p>
            {testData.finished ? (
              <div className="w-fit mb-3 px-3 py-2 text-sm font-semibold bg-green-300/60 text-green-600 rounded-lg m-auto">
                Chấm thành công
              </div>
            ) : (
              <div className="w-fit mb-3 px-3 py-2 text-sm font-semibold bg-amber-300/60 text-amber-600 rounded-lg m-auto">
                Đang chấm
              </div>
            )}
          </div>
          <div className="w-full bg-primary/10 rounded-lg text-primary font-semibold p-3 text-sm mb-5">
            Chúng mình sử dụng AI để ghép câu trả lời của bạn với câu hỏi. Nếu
            có sai sót hãy báo cho chúng mình nha!
          </div>
          <div className="w-full pb-3">
            {/* Main content */}
            {testData.task === "1" ? (
              <PartOneContent partOne={partOne} />
            ) : (
              <PartTwoThreeContent
                testData={testData}
                partTwo={partTwo}
                partThree={partThree}
              />
            )}
          </div>
        </div>
        <SidebarContent testData={testData} />
      </div>
    </>
  );
}

function PartOneContent({ partOne }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="flex items-center space-x-2 mb-3">
          <MessageCircleMore className="text-primary" />
          <span className="font-semibold">Bạn trả lời</span>
        </p>
      </div>
      <div className="leading-8 text-slate-600">
        <Accordion type="single" collapsible>
          {partOne.map((v, i) => (
            <AccordionItem key={i} value={i + 1}>
              <AccordionTrigger>{v.question}</AccordionTrigger>
              <AccordionContent className="leading-7">
                <div className="mb-3">{v.response}</div>
                <Card>
                  <CardContent>
                    <p className="flex items-center space-x-2">
                      <Bot className="text-red-400" />
                      <span className="font-semibold">Nhận xét của AI</span>
                    </p>
                    <p className="leading-7 text-sm mb-5">{v.feedback}</p>
                    <p className="flex items-center space-x-2">
                      <Bot className="text-red-400" />
                      <span className="font-semibold">AI trả lời mẫu</span>
                    </p>
                    <p className="leading-7 text-sm mb-5">
                      {v.improved_version}
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

function PartTwoThreeContent({ testData, partTwo, partThree }) {
  return (
    <Tabs className="w-full" defaultValue="part2">
      <TabsList className="grid w-full grid-cols-2 mb-3">
        <TabsTrigger value="part2">Part 2</TabsTrigger>
        <TabsTrigger value="part3">Part 3</TabsTrigger>
      </TabsList>
      <TabsContent value="part2">
        {testData.finished && (
          <>
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center space-x-2 mb-3">
                  <MessageCircleMore className="text-primary" />
                  <span className="font-semibold">Bạn trả lời</span>
                </p>
              </div>
              <div className="leading-8 text-slate-600">{partTwo}</div>
            </div>
            <Card>
              <CardContent>
                <p className="flex items-center space-x-2">
                  <Bot className="text-red-400" />
                  <span className="font-semibold">Nhận xét của AI</span>
                </p>
                <p className="leading-7 text-sm mb-5">
                  {testData.review.specific_feedback[0].feedback}
                </p>
                <p className="flex items-center space-x-2">
                  <Pencil className="text-red-400" />
                  <span className="font-semibold">Câu trả lời mẫu</span>
                </p>
                <p className="leading-7 text-sm">
                  {testData.review.specific_feedback[0].improved_version}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </TabsContent>
      <TabsContent value="part3">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <p className="flex items-center space-x-2 mb-3">
              <MessageCircleMore className="text-primary" />
              <span className="font-semibold">Bạn trả lời</span>
            </p>
          </div>
          <Accordion type="single" className="w-full" collapsible>
            {partThree.map((v, i) => (
              <AccordionItem key={i} value={i + 1}>
                <AccordionTrigger>{v.question}</AccordionTrigger>
                <AccordionContent className="leading-7">
                  <div className="mb-3">{v.response}</div>
                  <Card>
                    <CardContent>
                      <p className="flex items-center space-x-2">
                        <Pencil className="text-red-400" />
                        <span className="font-semibold">Câu trả lời mẫu</span>
                      </p>
                      <p className="leading-7 text-sm">{v.improved_version}</p>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Card>
          <CardContent>
            <p className="flex items-center space-x-2">
              <Bot className="text-red-400" />
              <span className="font-semibold">Nhận xét của AI</span>
            </p>
            <p className="leading-7 text-sm mb-5">
              {testData.finished &&
                testData.review.specific_feedback[1].feedback}
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function SidebarContent({ testData }) {
  return (
    <div className="md:flex md:flex-none md:w-[35%] hidden h-fit w-full">
      <div className="w-full p-5 bg-white shadow-md border border-1 rounded-lg mb-3">
        <Tabs defaultValue="mark">
          <TabsList className="grid grid-cols-3 w-full mb-3">
            <TabsTrigger value="mark">Điểm số</TabsTrigger>
            <TabsTrigger value="review">Nhận xét</TabsTrigger>
            <TabsTrigger value="topic">Đề bài</TabsTrigger>
          </TabsList>
          <TabsContent value="mark">
            {testData.finished ? (
              <>
                <div className="w-full mb-3">
                  {Number.parseFloat(testData.total_mark) >= 7.0 && (
                    <div className="w-fit">
                      <div className="w-fit mb-3">
                        <CircularProgressbar
                          value={testData.total_mark}
                          maxValue={9}
                          className="h-[100px] w-[100px]"
                          text={`${testData.total_mark}/9.0`}
                          styles={buildStyles({
                            pathColor: "#008000",
                            textColor: "#008000",
                          })}
                        />
                      </div>
                      <p className="font-semibold text-sm">
                        Good / Very Good / Expert User
                      </p>
                      <p className="text-sm text-slate-500">
                        Giao tiếp tự nhiên, mạch lạc với ít lỗi sai. Vốn từ
                        phong phú, ngữ pháp vững vàng. Hiểu và diễn đạt ý tưởng
                        phức tạp tốt.
                      </p>
                    </div>
                  )}
                  {Number.parseFloat(testData.total_mark) >= 5.0 &&
                    Number.parseFloat(testData.total_mark) < 7.0 && (
                      <div>
                        <div className="w-fit mb-3">
                          <CircularProgressbar
                            value={testData.total_mark}
                            maxValue={9}
                            className="h-[100px] w-[100px]"
                            text={`${testData.total_mark}/9.0`}
                            styles={buildStyles({
                              pathColor: "#ffbf00",
                              textColor: "#ffbf00",
                            })}
                          />
                        </div>
                        <p className="font-semibold text-sm">
                          Moderate / Competent User
                        </p>
                        <p className="text-sm text-slate-500">
                          Có thể trò chuyện nhưng đôi khi mắc lỗi. Vốn từ hạn
                          chế, ngữ pháp chưa chắc chắn. Khó khăn khi nghe hoặc
                          diễn đạt ý tưởng phức tạp.
                        </p>
                      </div>
                    )}
                  {Number.parseFloat(testData.total_mark) < 5.0 && (
                    <div>
                      <div className="w-fit mb-3">
                        <CircularProgressbar
                          value={testData.total_mark}
                          maxValue={9}
                          className="h-[100px] w-[100px]"
                          text={`${testData.total_mark}/9.0`}
                          styles={buildStyles({
                            pathColor: "#FF0000",
                            textColor: "#FF0000",
                          })}
                        />
                      </div>
                      <p className="font-semibold text-sm">
                        Basic / Limited User
                      </p>
                      <p className="text-sm text-slate-500">
                        Gặp khó khăn khi diễn đạt ý tưởng. Nhiều lỗi sai về từ
                        vựng, ngữ pháp, phát âm. Hiểu và phản hồi bằng tiếng Anh
                        còn hạn chế.
                      </p>
                    </div>
                  )}
                </div>
                <div className="">
                  <p className="font-semibold text-sm mb-2">Phân tích điểm</p>
                  <div className="mb-3">
                    <p className="text-slate-500 text-sm mb-1">
                      Từ vựng -{" "}
                      <b>{Number.parseFloat(testData.lexical_resource)}</b>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.lexical_resource) / 9) * 100
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <p className="text-slate-500 text-sm mb-1">
                      Ngữ pháp -{" "}
                      <b>{Number.parseFloat(testData.grammatical_range)}</b>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.grammatical_range) / 9) *
                        100
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <p className="text-slate-500 text-sm mb-1">
                      Trôi chảy -{" "}
                      <b>{Number.parseFloat(testData.fluency_coherence)}</b>
                    </p>
                    <Progress
                      value={
                        (Number.parseFloat(testData.fluency_coherence) / 9) *
                        100
                      }
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-slate-600 font-semibold text-sm">
                Bài đang được chấm
              </p>
            )}
          </TabsContent>
          <TabsContent value="review">
            {testData.finished ? (
              <div className="w-full h-[400px] overflow-y-scroll">
                <div className="w-full mb-3">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center space-x-2 mb-3">
                      <Bot className="text-primary" />
                      <span className="font-semibold">Nhận xét của AI</span>
                    </p>
                  </div>
                  <div className="text-slate-600 text-sm">
                    {testData.review.general_feedback}
                  </div>
                </div>
                <div className="w-full mb-3">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center space-x-2 mb-3">
                      <Pencil className="text-primary" />
                      <span className="font-semibold">Gợi ý cải thiện</span>
                    </p>
                  </div>
                  <div>
                    <div className="mb-3">
                      <p className="font-semibold text-sm mb-1">Ngữ pháp</p>
                      {testData.review.grammar_improvements.map((v, i) => (
                        <div key={i} className="mb-3 text-sm">
                          <p className="p-2 bg-red-100 italic rounded-lg mb-1">
                            {v.to_improve}
                          </p>
                          <div className="flex justify-center items-center space-x-2">
                            <ArrowRight className="flex-none w-[24px] h-[24px]" />
                            <span className="p-2 rounded-lg bg-green-100">
                              {v.improvement}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-3">
                      <p className="font-semibold text-sm mb-1">Từ vựng</p>
                      {testData.review.vocab_improvements.map((v, i) => (
                        <div key={i} className="mb-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="bg-red-100 p-2 rounded-lg italic">
                              {v.to_improve}
                            </span>
                            <ArrowRight className="flex-none w-[24px] h-[24px]" />
                            <span className="p-2 rounded-lg bg-green-100">
                              {v.improvement}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mb-3">
                      <p className="font-semibold text-sm mb-1">Cấu trúc câu</p>
                      {testData.review.sentence_improvements.map((v, i) => (
                        <div key={i} className="mb-3 text-sm">
                          <p className="p-2 bg-red-100 italic rounded-lg mb-1">
                            {v.to_improve}
                          </p>
                          <div className="flex justify-center items-center space-x-2">
                            <ArrowRight className="flex-none w-[24px] h-[24px]" />
                            <span className="p-2 rounded-lg bg-green-100">
                              {v.improvement}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-semibold text-slate-600 text-sm">
                Bài đang được chấm
              </p>
            )}
          </TabsContent>
          <TabsContent value="topic">
            <div className="w-full mb-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center space-x-2 mb-3">
                  <User2Icon className="text-primary" />
                  <span className="font-semibold">Đề bài</span>
                </p>
              </div>
              <div className="text-slate-600 text-sm">
                {testData.task === "1" ? (
                  <div className="text-slate-600 text-sm">
                    {testData.topic.map((v, i) => (
                      <div className="mb-1" key={i}>
                        {v}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold mb-1">Part 2</p>
                    <div className="text-slate-600 text-sm mb-5">
                      {testData.topic.task_two_question}
                    </div>
                    <p className="text-sm font-semibold mb-1">Part 3</p>
                    <div className="text-slate-600 text-sm">
                      {testData.topic.task_three_follow_up
                        .map((v, i) => (
                          <div className="mb-1" key={i}>
                            {v}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
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