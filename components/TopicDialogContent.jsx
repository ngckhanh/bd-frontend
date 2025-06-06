import { useState } from "react";
import { DialogClose, DialogTopicContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
const TopicDialogContent = ({
    open,
    setOpen,
    taskOneTopicList,
    taskTwoTopicList,
    selectedTopicIndex,
    setSelectedTopicIndex,
    setSelectedTopicTask,
    selectedTopic,
    setSelectedTopic,
    handleSelectTopic,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTaskOneTopics = taskOneTopicList.filter(topic =>
        topic.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredTaskTwoTopics = taskTwoTopicList.filter(topic =>
        topic.task_two_question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DialogTopicContent className="w-full max-w-3xl h-[90%] overflow-y-auto fixed">
            <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Vui lòng chọn đề dưới đây</DialogTitle>
            </DialogHeader>

            <div className="flex-grow overflow-y-auto px-4">
                {/* Search Input */}
                <Input
                    type="text"
                    placeholder="Tìm kiếm đề..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded-md"

                />
            </div>


            <div className="flex-grow overflow-y-auto px-4">
                <Tabs defaultValue="part-1" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100  rounded-md">
                        <TabsTrigger value="part-1">Đề Part 1</TabsTrigger>
                        <TabsTrigger value="part-2-3">Đề Part 2 & 3</TabsTrigger>
                    </TabsList>

                    {/* --- PART 1 --- */}
                    <TabsContent className="w-full" value="part-1">
                        <div className="p-2 max-h-[200px] sm:max-h-[250px] overflow-y-auto w-full rounded-lg border mb-5">
                            {filteredTaskOneTopics.length > 0 ? (
                                filteredTaskOneTopics.map((topic, index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        variant="outline"
                                        className={`mb-1 mr-2 w-full sm:w-auto text-left justify-start border whitespace-normal break-words h-auto px-3 py-2 ${selectedTopicIndex === index
                                                ? "bg-gray-300 text-black border-black"
                                                : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                            }`}
                                        onClick={() => {
                                            setSelectedTopicIndex(index);
                                            setSelectedTopicTask(1);
                                            setSelectedTopic(topic.topic);
                                        }}
                                    >
                                        {topic.topic}
                                    </Button>

                                ))
                            ) : (
                                <div className="grid md:grid-cols-5 grid-cols-2 gap-2">
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                </div>
                            )}
                        </div>

                        {/* Hiển thị nội dung đề đã chọn */}
                        <div id="preview" className="w-full">
                            {taskOneTopicList.length > 0 && selectedTopicIndex !== null && (
                                <div className="w-full p-2 bg-gray-50 rounded-md">
                                    <h2 className="font-semibold mb-2">
                                        {taskOneTopicList[selectedTopicIndex].topic}
                                    </h2>
                                    <div
                                        className="text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: taskOneTopicList[selectedTopicIndex].questions.join("<br/>"),
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* --- PART 2 & 3 --- */}
                    <TabsContent className="w-full" value="part-2-3">
                        <div className="p-2 max-h-[200px] sm:max-h-[250px] overflow-y-auto w-full rounded-lg border mb-5">
                            {filteredTaskTwoTopics.length > 0 ? (
                                filteredTaskTwoTopics.map((topic, index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        variant="outline"
                                        className={`mb-1 mr-2 w-full sm:w-auto text-left justify-start border whitespace-normal break-words h-auto px-3 py-2 ${selectedTopicIndex === index
                                            ? "bg-gray-300 text-black border-black"
                                            : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                            }`}
                                        onClick={() => {
                                            setSelectedTopicIndex(index);
                                            setSelectedTopicTask(2);
                                            setSelectedTopic(topic.task_two_question);
                                        }}
                                    >
                                        {topic.task_two_question.split(".")[0]}
                                    </Button>

                                ))
                            ) : (
                                <div className="grid md:grid-cols-5 grid-cols-2 gap-2">
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                    <Skeleton className="h-[30px] w-full"></Skeleton>
                                </div>
                            )}
                        </div>

                        {/* Hiển thị nội dung đề đã chọn */}
                        <div id="preview" className="w-full">
                            {taskTwoTopicList.length > 0 && selectedTopicIndex !== null && (
                                <div className="w-full p-2 bg-gray-50 rounded-md">
                                    <h2 className="font-semibold mb-2">
                                        {taskTwoTopicList[selectedTopicIndex].task_two_question.split(".")[0]}
                                    </h2>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: taskTwoTopicList[selectedTopicIndex].task_two_question,
                                        }}
                                        className="mb-3 text-gray-700"
                                    ></div>
                                    <p className="font-semibold mb-2">Task 3 đi kèm:</p>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: taskTwoTopicList[selectedTopicIndex].task_three_followup.join("<br/>"),
                                        }}
                                        className="text-gray-700"
                                    ></div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>



            {/* Footer */}
            <DialogFooter className="flex flex-wrap justify-center sm:justify-between gap-2 p-4 border-t">
                <DialogClose asChild>
                    <Button variant="secondary" className="w-full sm:w-1/3 md:w-1/4">
                        Đóng
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button
                        onClick={handleSelectTopic}
                        disabled={!selectedTopic}
                        className={`w-full sm:w-2/3 md:w-1/4 transition duration-200 ${!selectedTopic
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Chọn & Tạo Phòng
                    </Button>
                </DialogClose>
            </DialogFooter>

        </DialogTopicContent>
    );
};

export default TopicDialogContent;