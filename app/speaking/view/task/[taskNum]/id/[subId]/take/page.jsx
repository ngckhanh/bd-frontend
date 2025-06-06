"use client"
import useUserStore from "@/app/(store)/userStore"
import { useRouter } from "next/navigation"
import { use, useEffect, useState, useRef, useCallback } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import instance from "@/axiosInstance/instance"
import { Skeleton } from "@/components/ui/skeleton"
import { Mic, Play, Square, Send, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import TypingIndicator from "@/components/typing-indicator"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { motion } from "motion/react"
import { useRef as useCanvasRef } from "react"

export default function StartTest(props) {
  const params = use(props.params)
  const [testData, setTestData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const userStore = useUserStore()
  const router = useRouter()
  const [audioWarning, setAudioWarning] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState("")
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submissionId, setSubmissionId] = useState("")
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [isCancelTestDialogOpen, setIsCancelTestDialogOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [topic, setTopic] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  const canvasRef = useCanvasRef(null)
  const animationRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Toggle audio playback
  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  // Clean up recording resources
  const cleanupRecording = useCallback(() => {
    // Stop any ongoing recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    // Stop and clean up media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Stop visualization
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      // Clean up any existing recording first
      cleanupRecording()

      // Reset state
      setIsRecording(false)
      setElapsedTime(0)
      audioChunksRef.current = []

      // Get media stream with higher quality audio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
        },
      })

      streamRef.current = stream

      // Create media recorder with higher bitrate
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      })

      mediaRecorderRef.current = mediaRecorder

      // Set up audio analyzer for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      dataArrayRef.current = dataArray

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Only create audio blob if we have chunks
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          })

          // Revoke previous URL if it exists
          if (audioURL) {
            URL.revokeObjectURL(audioURL)
          }

          const url = URL.createObjectURL(audioBlob)
          setAudioURL(url)
        }
      }

      // Request data every 1 second to ensure we capture everything
      mediaRecorder.start(1000)
      setIsRecording(true)

      // Start visualization
      visualizeAudio()

      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Recording error:", error)
      if (error.name === "NotAllowedError") {
        setAudioWarning(true)
      } else {
        toast.error("Đã có lỗi xảy ra trong lúc bật mic của bạn. Tải lại trang hoặc báo lỗi với bên hỗ trợ.")
      }
    }
  }, [cleanupRecording, audioURL])

  // Re-record audio
  const reRecord = useCallback(() => {
    // Clean up existing recording
    cleanupRecording()

    // Reset state
    setIsPlaying(false)

    // Revoke previous URL if it exists
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
      setAudioURL("")
    }

    // Start new recording
    startRecording()
  }, [cleanupRecording, startRecording, audioURL])

  // Audio visualization function
  const visualizeAudio = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext("2d")
    const analyser = analyserRef.current
    const dataArray = dataArrayRef.current

    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    // Set up frequency data analysis
    analyser.fftSize = 128
    const bufferLength = analyser.frequencyBinCount
    const frequencyData = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      // Get frequency data
      analyser.getByteFrequencyData(frequencyData)

      // Clear canvas
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      // Calculate bar width and spacing
      const barCount = 30 // Fixed number of bars for consistent look
      const barWidth = 3
      const barSpacing = 3
      const totalBarWidth = barWidth + barSpacing

      // Center the visualization
      const startX = (WIDTH - barCount * totalBarWidth) / 2

      // Draw bars
      for (let i = 0; i < barCount; i++) {
        // Use frequency data to determine bar height, with some randomization for inactive bars
        let barHeight

        if (i < bufferLength) {
          barHeight = (frequencyData[i % bufferLength] / 255) * (HEIGHT - 10)
          // Ensure minimum height for active visualization
          barHeight = Math.max(barHeight, 5)
        } else {
          // For bars beyond our data, create a random height for visual effect
          barHeight = Math.random() * 10 + 5
        }

        // Position each bar
        const x = startX + i * totalBarWidth

        // Draw the bar with different colors based on activity
        if (i < bufferLength && frequencyData[i % bufferLength] > 50) {
          canvasCtx.fillStyle = "#3b82f6" // Blue for active bars
        } else {
          canvasCtx.fillStyle = "#e5e7eb" // Light gray for inactive bars
        }

        canvasCtx.fillRect(x, (HEIGHT - barHeight) / 2, barWidth, barHeight)
      }
    }

    draw()
  }, [])

  // Stop recording audio
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      // Request final data chunk before stopping
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.requestData()
        mediaRecorderRef.current.stop()
      }

      setIsRecording(false)

      // Clean up timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      // Keep the stream reference for potential re-recording
    }
  }, [isRecording])

  // Submit test recording
  const submitTest = useCallback(async () => {
    if (!audioURL) {
      toast.error("Bạn cần ghi âm trước khi nộp bài")
      return
    }

    setSubmitting(true)
    try {
      const audioData = await fetch(audioURL)
      const blob = await audioData.blob()
      const formData = new FormData()
      formData.append("audio", blob, "recording.webm")

      const response = await instance({
        method: "post",
        url: `/speaking/personal/submit/${params.taskNum}/${params.subId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })

      if (response.status === 200) {
        toast.success("Bài đã được nộp. Đang chờ AI chấm")
        router.push(`/speaking/view/task/${params.taskNum}/id/${params.subId}`)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(
        "Đã có lỗi xảy ra, vui lòng tải lại trang để sửa lỗi. Nếu lỗi còn lặp lại hãy liên hệ với bộ phận hỗ trợ",
      )
    } finally {
      setSubmitting(false)
    }
  }, [audioURL, params.taskNum, params.subId, router])

  // Stop test and delete submission
  const stopTest = useCallback(async () => {
    try {
      const response = await instance({
        method: "post",
        url: `/speaking/personal/delete/${params.taskNum}/${params.subId}`,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })

      if (response.status === 200) {
        window.location.href = "/speaking"
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Đã có lỗi khi liên lạc với máy chủ")
    }
  }, [params.taskNum, params.subId, router])

  useEffect(() => {
    const getTestData = async () => {
      setIsLoading(true)

      try {
        const response = await instance({
          method: "get",
          url: `/speaking/personal/get/${params.taskNum}/${params.subId}`,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })

        if (response.status === 200) {
          const data = response.data.data
          console.log("Response Data:", data)

          if (data.finished === false && !data.error_occurred) {
            setTestData(data)
            setSubmissionId(data.submission_id)
            instance
              .get(`/speaking/personal/topic-list/with-id/get/${data.task}/${data.topic_id}`)
              .then((response) => {
                setTopic(response.data)
              })
              .catch((error) => {
                console.error("Error occurred:", error)
                toast.error("Đã có lỗi khi tải dàn ý và bài mẫu")
              })
            toast.success("Đã tải thông tin phòng thi")
          } else if (data.finished === false && data.error_occurred === true) {
            toast.error("Đã có lỗi xảy ra với bài thi này và đã được báo cáo. Bạn sẽ được chuyển về trang chính")
            router.push("/speaking")
          } else {
            router.push(`/speaking/view/task/${params.taskNum}/id/${params.subId}`)
          }
        } else {
          console.error("Error Response:", response.data)
          toast.error(response.data.message)
        }
      } catch (error) {
        console.error("Error occurred:", error)
        if (error.response?.status === 404) {
          toast.error(error.response.data.message)
          router.push("/speaking")
        } else {
          toast.error("Đã có lỗi khi liên lạc với máy chủ")
          router.push("/speaking")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getTestData()
  }, [params.taskNum, params.subId, router])

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up recording resources
      cleanupRecording()

      // Clean up audio URL object
      if (audioURL) {
        URL.revokeObjectURL(audioURL)
      }
    }
  }, [audioURL, cleanupRecording])

  // Message appearance animation effect
  useEffect(() => {
    if (!isLoading) {
      // Start showing messages with delay
      const messageCount = 3 // Total number of messages
      let currentMessage = 0

      const showNextMessage = () => {
        if (currentMessage < messageCount) {
          setVisibleMessages(currentMessage + 1)
          currentMessage++
          setTimeout(showNextMessage, 500) // 0.5 second delay between messages
        }
      }

      // Start the sequence
      showNextMessage()
    }
  }, [isLoading])

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev)
  }

  // Replace the entire return statement with this updated version that works with the layout
  return (
    <div
      className="flex w-full h-full"
      style={{
        background: "linear-gradient(360deg, rgba(251,192,119,0.2) 0%, rgba(255,255,255,1) 50%)",
      }}
    >
      <div
        className={`w-full h-screen flex-col overflow-auto pt-25 md:px-10 px-5 transition-all duration-300 ${isPanelOpen ? "md:mr-[500px]" : ""}`}
      >
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center h-[80vh]">
            <Skeleton className="h-12 w-3/4 max-w-md" />
            <Skeleton className="h-64 w-3/4 max-w-md" />
            <Skeleton className="h-12 w-3/4 max-w-md" />
          </div>
        ) : (
          <div className="w-full md:w-[60%] flex flex-col h-full m-auto md:mt-10 grow">
            {/* Topic Card */}
            <div className="grow w-full overflow-auto">
              {visibleMessages >= 1 ? (
                <div className="flex space-x-5 mb-5">
                  <Image
                    src="/logo.png"
                    height="30"
                    width="30"
                    alt="logo"
                    className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                  />
                  <div className="md:w-fit w-full">
                    <p className="mb-1 font-medium">Bach Duong AI</p>
                    <p className="text-slate-500">
                      👋 Hello! My name is Bach Duong and I will be your IELTS Examiner today.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-5 mb-5">
                  <Image
                    src="/logo.png"
                    height="30"
                    width="30"
                    alt="logo"
                    className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                  />
                  <TypingIndicator />
                </div>
              )}

              {visibleMessages >= 2 ? (
                <div className="flex space-x-5 mb-5">
                  <Image
                    src="/logo.png"
                    height="30"
                    width="30"
                    alt="logo"
                    className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                  />
                  <div className="md:w-fit w-full">
                    <p className="mb-1 font-medium">Bach Duong AI</p>
                    <p className="text-slate-500">
                      Read the questions below carefully and when you are ready, hit record. After you have finished all
                      the questions, hit submit.
                    </p>
                  </div>
                </div>
              ) : visibleMessages >= 1 ? (
                <div className="flex space-x-5 mb-5">
                  <Image
                    src="/logo.png"
                    height="30"
                    width="30"
                    alt="logo"
                    className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                  />
                  <TypingIndicator />
                </div>
              ) : null}

              {visibleMessages >= 3 ? (
                <>
                  <div className="flex space-x-5 mb-5">
                    <Image
                      src="/logo.png"
                      height="30"
                      width="30"
                      alt="logo"
                      className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                    />
                    {testData.task === "1" ? (
                      <div className="md:w-fit w-full">
                        <p className="mb-1 font-medium">Bach Duong AI</p>
                        <div
                          className="text-slate-500"
                          dangerouslySetInnerHTML={{ __html: testData.topic.join("<br/>") || "Đang tải chủ đề..." }}
                        ></div>
                      </div>
                    ) : (
                      <div className="md:w-fit w-full">
                        <p className="mb-1 font-medium">Bach Duong AI</p>
                        <div
                          className="text-slate-500"
                          dangerouslySetInnerHTML={{ __html: testData.topic.task_two_question || "Đang tải chủ đề..." }}
                        ></div>
                      </div>
                    )}
                  </div>
                  {testData.task === "2" && (
                    <div className="flex space-x-5 mb-5">
                      <Image
                        src="/logo.png"
                        height="30"
                        width="30"
                        alt="logo"
                        className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                      />
                      <div className="md:w-fit w-full">
                        <p className="mb-1 font-medium">Bach Duong AI</p>
                        <div
                          className="text-slate-500"
                          dangerouslySetInnerHTML={{
                            __html: testData.topic.task_three_follow_up.join("<br/>") || "Đang tải chủ đề...",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </>
              ) : visibleMessages >= 2 ? (
                <div className="flex items-center space-x-5 mb-5">
                  <Image
                    src="/logo.png"
                    height="30"
                    width="30"
                    alt="logo"
                    className="h-[30px] w-[30px] rounded-full border border-1 shadow-sm"
                  />
                  <TypingIndicator />
                </div>
              ) : null}

              <div className="prose max-w-none"></div>
            </div>

            {/* Recording Interface */}
            <div className="flex flex-col items-center gap-4 flex-none h-[200px] fixed-bottom">
              {/* Modern Pill-shaped Recording Interface */}
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                {audioURL && (
                  <>
                    <Button onClick={reRecord} className="bg-blue-600 hover:bg-blue-700 rounded-full px-5" size="sm">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Ghi lại</span>
                      </div>
                    </Button>

                    <Button
                      onClick={submitTest}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700 rounded-full px-5"
                      size="sm"
                    >
                      {submitting ? (
                        "Đang nộp bài..."
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>Nộp bài</span>
                        </div>
                      )}
                    </Button>
                  </>
                )}

                <Button onClick={togglePanel} size="sm" variant="outline" className="rounded-full px-5">
                  {isPanelOpen ? "Đóng dàn ý" : "Mở dàn ý"}
                </Button>

                <Dialog open={isCancelTestDialogOpen} onOpenChange={setIsCancelTestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-red-500 text-xs rounded-full" size="sm">
                      Hủy bài thi
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Xác nhận hủy bài thi</DialogTitle>
                      <DialogDescription>
                        Bạn có chắc chắn muốn hủy bài thi này? Hành động này không thể hoàn tác.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-4 mt-4">
                      <Button variant="outline" onClick={() => setIsCancelTestDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button variant="destructive" onClick={stopTest}>
                        Xác nhận hủy
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="w-full max-w-md bg-gray-50 rounded-full shadow-sm border border-gray-100 p-3 flex items-center">
                {!isRecording && !audioURL ? (
                  <>
                    <button
                      onClick={startRecording}
                      className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm mr-3 flex-shrink-0"
                      disabled={submitting}
                    >
                      <Mic className="h-5 w-5 text-white" />
                    </button>
                    <div className="flex-grow h-10 flex items-center justify-center">
                      <p className="text-gray-400 text-sm">Tap to record</p>
                    </div>
                    <div className="text-gray-500 ml-2 font-mono text-sm flex-shrink-0">{formatTime(elapsedTime)}</div>
                  </>
                ) : isRecording ? (
                  <>
                    <button
                      onClick={stopRecording}
                      className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-800 flex items-center justify-center transition-all shadow-sm mr-3 flex-shrink-0 animate-pulse"
                      disabled={submitting}
                    >
                      <Square className="h-4 w-4 text-white" />
                    </button>
                    <div className="flex-grow h-10">
                      <canvas ref={canvasRef} width="400" height="40" className="w-full h-full"></canvas>
                    </div>
                    <div className="text-gray-500 ml-2 font-mono text-sm flex-shrink-0">{formatTime(elapsedTime)}</div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={togglePlayback}
                      className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all shadow-sm mr-3 flex-shrink-0"
                      disabled={submitting}
                    >
                      {isPlaying ? (
                        <Square className="h-4 w-4 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      )}
                    </button>
                    <div className="flex-grow h-10">
                      <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
                        <div className="w-full h-full flex items-center">
                          {/* Static waveform for playback */}
                          <div className="flex items-center h-full w-full justify-center space-x-1">
                            {Array.from({ length: 30 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-[3px] rounded-full ${i % 3 === 0 ? "bg-blue-500" : "bg-gray-300"}`}
                                style={{
                                  height: `${Math.max(5, Math.min(30, Math.random() * 25 + 5))}px`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-500 ml-2 font-mono text-sm flex-shrink-0">{formatTime(elapsedTime)}</div>
                  </>
                )}
              </div>

              {/* Hidden audio element for playback */}
              {audioURL && <audio ref={audioRef} src={audioURL} className="hidden" onEnded={handleAudioEnded} />}

            </div>

            {/* Audio Permission Warning */}
            {audioWarning && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Bạn cần cấp quyền truy cập microphone để ghi âm. Vui lòng kiểm tra cài đặt trình duyệt của bạn.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white border-l transition-all duration-150 overflow-y-auto z-40
        ${isPanelOpen ? "translate-x-0 w-full md:w-[500px]" : "translate-x-full w-0"}`}
      >
        <motion.div
          className="py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.3 }}
        >
          <div className="px-3 pb-3 flex justify-between items-center mb-6 border border-b-1 border-r-0 border-l-0 border-t-0">
            <div>
              <h2 className="text-lg font-semibold text-primary">Dàn ý và bài mẫu</h2>
              <p className="text-sm text-gray-500">Dưới đây là dàn ý và bài làm mẫu cho đề bài này</p>
            </div>
            <Button variant="ghost" size="sm" onClick={togglePanel} className="hover:bg-gray-100">
              ✕
            </Button>
          </div>

          <div className="space-y-4 px-3">
            <div className="w-full">
              <p className="text-primary font-semibold">Dàn ý</p>
              <div className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {isLoading === false && topic !== undefined ? topic.outline : "Đang tải dàn ý..."}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

