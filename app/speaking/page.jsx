"use client";
import useUserStore from "../(store)/userStore";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import instance from "@/axiosInstance/instance";
import { Speech, PenSquare, ArrowLeft, Plus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react"
import {  
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";

export default function Home() {
  const [open, setOpen] = useState(false);
  // const [selectionMode, setSelectionMode] = useState("create");
  const [selectionMode, setSelectionMode] = useState("choose");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedTopicTask, setSelectedTopicTask] = useState("1");
  const [taskOneTopicList, setTaskOneTopicList] = useState([]);
  const [taskTwoTopicList, setTaskTwoTopicList] = useState([]);
  const userStore = useUserStore();
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState("home");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [topicSelectPanelOpen, setTopicSelectPanelOpen] = useState(false);
  const [roomCreating, setRoomCreating] = useState(false);

  const createRoomFunction = () => {
    instance.post(
      "/speaking/personal/create/with-id",
      {
        task: selectedTopicTask,
        topic_id: selectedTopicId,
      },
      {
        headers: {
          Authorization: localStorage.getItem('token'),
        }
      }
    )
    .then((res) => {
      window.location.href = `/speaking/view/task/${selectedTopicTask}/id/${res.data.room_id}/take`
    })
    .catch((err) => {
      console.log(err);
      toast.error('Đã có lỗi xảy ra trong quá trình tạo phòng. Vui lòng thử lại sau.');
      setRoomCreating(false);
    })
  }

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTaskOneTopics = taskOneTopicList.filter(topic =>
      topic.question_content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredTaskTwoTopics = taskTwoTopicList.filter(topic =>
      topic.task_two_question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getTopic = async () => {
      await instance
        .get("/speaking/personal/topic-list/with-id")
        .then((res) => {
          setTaskOneTopicList(res.data.task_one);
          setTaskTwoTopicList(res.data.task_two_three);
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            "Đã có lỗi xảy ra khi tải danh sách chủ đề. Tải lại trang để thử lại"
          );
        })
    };
    getTopic();
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        className="grow flex items-center justify-center overflow-auto p-5 md:p-0"
        style={{
          background: 'linear-gradient(180deg, rgba(251,192,119,0.2) 0%, rgba(255,255,255,1) 40%)',
        }}
      >
        { page === "home" ? (
          <motion.div className="w-full m-auto h-full md:pt-20 pt-10" initial={{ opacity: 0 }} animate={{ opacity: 100 }}>
            <div className="m-auto lg:w-[60%] md:w-[70%] w-full mb-10">
              <div className="w-fit text-center m-auto bg-sky-100 text-sky-600 font-semibold tracking-tight rounded-lg p-3 mb-3">
                🎉 Đến hết 30/6, mọi lần nạp sẽ được gấp đôi! Ấn vào phần Nạp token để biết thêm chi tiết.
              </div>
              <Image src="/logo.png" height={511} width={511} alt="logo" className="w-[100px] h-auto m-auto rounded-full border border-1 shadow-md mb-5"/>
              <p className="text-center md:text-3xl text-2xl font-semibold mb-3 tracking-tight">Xin chào, {userStore.user.fullname}! 👋</p>
              <p className="text-slate-500/80 font-semibold text-center md:text-2xl text-lg tracking-tight">Bạch Dương có thể giúp bạn luyện IELTS Speaking và Writing.<br/>Hôm nay bạn muốn luyện kĩ năng nào?</p>
            </div>
            <div className="lg:w-[50%] md:w-[70%] m-auto grid md:grid-cols-2 grid-cols-1 md:gap-4 px-3 gap-2">
              <div 
                className="w-full rounded-lg bg-white border border-1 md:p-5 p-3 hover:shadow-sm hover:shadow-primary/50 hover:border-primary transition ease-in-out duration-200 cursor-pointer"
                onClick={() => setPage("createSpeaking")}
              >
                <div className="rounded-lg h-[40px] w-[40px] flex items-center justify-center bg-primary/20 text-primary mb-5">
                  <Speech size={25}/>
                </div>                
                <p className="text-xl font-semibold mb-3 tracking-tight">Đánh giá Speaking</p>
                <p className="text-slate-600">Sử dụng phòng thi ảo của Bạch Dương AI. Có ngay kết quá sau 2-4 phút</p>
              </div>
              <div 
                className="w-full rounded-lg bg-white border border-1 md:p-5 p-3 hover:shadow-sm hover:shadow-green-600/50 hover:border-green-600 transition ease-in-out duration-200 cursor-pointer" 
                onClick={(e) => { window.location.href = `https://writing.bachduong.app/auth/callback?token=${localStorage.getItem('token')}` }}>
                <div className="rounded-lg h-[40px] w-[40px] flex items-center justify-center bg-green-600/20 text-green-600 mb-5">
                  <PenSquare size={25}/>
                </div>                
                <p className="text-xl font-semibold mb-3 tracking-tight">Đánh giá Writing</p>
                <p className="text-slate-600">Cung cấp bài làm của bạn cùng đề bài. Có kết quả ngay.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="lg:w-[60%] md:w-[70%] m-auto h-full md:pt-20 pt-10">
            <Button
              variant="outline"
              className="mb-3"
              onClick={() => setPage("home")}
            >
              <ArrowLeft size={20}/>
              Quay lại
            </Button>
            <motion.div className="p-5 md:p-8 bg-white rounded-xl border border-1 shadow-sm" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 100, y: -1 }} transition={{ duration: 0.3, damping: 10 }}>
              <div className="items-center space-x-2 flex mb-10">
                <div className="rounded-lg h-[40px] w-[40px] flex items-center justify-center bg-primary/20 text-primary">
                  <Speech size={25}/>
                </div>                
                <p className="text-primary font-semibold">Đánh giá Speaking</p>
              </div> 
              <div className="text-2xl font-semibold space-x-2 flex flex-wrap items-center">
                <Select className="flex flex-wrap" onValueChange={(value) => { setSelectedTopicTask(value); console.log(value) }}>
                  <span>Mình muốn tạo phòng thi IELTS Speaking ảo</span>
                  <SelectTrigger className="w-fit border-0 ring-0 shadow-none text-2xl text-primary px-0">
                    <SelectValue placeholder="Part 1"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Part 1</SelectItem>
                    <SelectItem value="2">Part 2 & 3</SelectItem>
                  </SelectContent>
                </Select>
                <Sheet open={topicSelectPanelOpen} onOpenChange={(isOpen) => { setTopicSelectPanelOpen(isOpen); setSearchQuery("")}}>
                  <SheetTrigger asChild>
                    <span className="flex flex-wrap items-center justify-start space-x-2">
                      <p>với đề bài là</p> 
                      <p 
                        className={`${selectedTopic === "" ? 'text-slate-500' : 'text-primary'} flex items-center justify-start space-x-2 cursor-pointer hover:text-slate-600`}
                      >
                        <span>{selectedTopic === "" ? 'ấn vào đây để chọn đề' : selectedTopic}</span> 
                        <Plus size={15}/>
                      </p>
                    </span>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:h-[95vh] h-[85%] md:p-10 p-5" side="bottom">
                    <SheetHeader className="p-0 m-0">
                      <SheetTitle></SheetTitle>
                    </SheetHeader>
                    <p className="text-4xl font-semibold">Danh sách đề IELTS Speaking</p>
                    <p className="text-slate-500 font-semibold mb-5">Hãy chọn 1 trong số đề dưới đây. Các đề dưới được lấy từ Forecast Quý 1/2025</p>
                    <div className="mb-5">
                      <p className="mb-1 font-semibold">Nhập đề bạn cần tìm</p>
                      <Input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm đề bài"
                        className="w-full"
                      />
                    </div>
                    <p className="font-semibold">hoặc chọn một trong những đề dưới đây</p>
                    <div className="w-full grid md:grid-cols-2 grid-cols-1 h-fit overflow-auto">
                      {selectedTopicTask === "1" ? (
                        filteredTaskOneTopics.map((topic, index) => (
                          <div 
                            key={index}
                            className="w-full p-2 h-full"
                            onClick={() => {
                              setSelectedTopic(topic.truncated);
                              setSelectedTopicIndex(index);
                              setSelectedTopicId(topic.question_id);
                              setTopicSelectPanelOpen(false);
                            }}
                          >
                            <div 
                              className="p-3 rounded-lg border border-1 hover:shadow-sm hover:shadow-primary/50 hover:border-primary cursor-pointer transition ease-in-out duration-200"
                            >
                              <p className="font-semibold">{topic.truncated}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        filteredTaskTwoTopics.map((topic, index) => (
                          <div 
                            key={index}
                            className="w-full p-2 h-full"
                            onClick={() => {
                              setSelectedTopic(topic.task_two_question.split('.')[0]);
                              setSelectedTopicIndex(index);
                              setSelectedTopicId(topic.question_id);
                              setTopicSelectPanelOpen(false);
                            }}
                          >
                            <div className="p-3 rounded-lg border border-1 hover:shadow-sm hover:shadow-primary/50 hover:border-primary cursor-pointer transition ease-in-out duration-200">
                              <p className="font-semibold">{topic.task_two_question.split('.')[0]}</p>
                              <p>{topic.task_two_question.split('.')[1]}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {
                selectedTopicId ? (
                  <Button 
                    className="w-full mt-5"
                    onClick={(e) => {
                      setRoomCreating(true);
                      createRoomFunction();
                    }}
                    disabled={roomCreating}
                  >
                    {
                      roomCreating ? (
                        "Đang tạo phòng..."
                      ) : (
                        <>
                          Tạo phòng thi <ArrowRight/>
                        </>
                      )
                    }
                  </Button>
                ) : (<></>)
              }
            </motion.div>
          </div>
        ) }
      </div>
      <div className="flex-none h-fit p-3">
        <p className="text-center font-semibold text-slate-500 text-sm">Bạch Dương AI có thể mắc sai lầm trong lúc chấm bài. Liên hệ trợ giúp nếu bạn gặp vấn đề</p>
      </div>
    </div>
  )
}
