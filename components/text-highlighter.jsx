"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Ear } from "lucide-react"
import { Button } from "./ui/button"

export default function TextHighlighter({ text, highlightData }) {
  // Default values if props are not provided
  const [paragraph, setParagraph] = useState(
    text || "I am a sample text with some words to highlight. These words will have popovers.",
  )
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  }
  const [wordData, setWordData] = useState(
    highlightData || [
      {
        end_time: 0.69,
        rating: "6.0",
        start_time: 0.0,
        word: "I",
      },
      {
        end_time: 1.5,
        rating: "4.2",
        start_time: 0.7,
        word: "sample",
      },
      {
        end_time: 2.3,
        rating: "7.8",
        start_time: 1.6,
        word: "highlight",
      },
    ],
  )

  // Update state when props change
  useEffect(() => {
    if (text) setParagraph(text)
    if (highlightData) setWordData(highlightData)
  }, [text, highlightData])

  // Function to highlight words in text with popovers
  const highlightText = (text, wordDataArray) => {
    if (!text || !wordDataArray.length) return text

    // Create a map to store all matches and their positions
    const matches = []

    // Find all matches for each word in the data array
    wordDataArray.forEach((item) => {
      const { word, rating, start_time, end_time } = item

      // Escape special regex characters
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

      // Create regex with word boundaries
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi")

      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          data: item,
        })
      }
    })

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Filter out overlapping matches (keeping earlier ones)
    const filteredMatches = []
    let lastEnd = -1

    for (const match of matches) {
      if (match.start >= lastEnd) {
        filteredMatches.push(match)
        lastEnd = match.end
      }
    }

    // Build the result with highlighted spans and popovers
    const result = []
    let lastIndex = 0

    filteredMatches.forEach((match, index) => {
      // Add text before this match
      if (match.start > lastIndex) {
        result.push(text.substring(lastIndex, match.start))
      }

      // Add the highlighted match with popover
      result.push(
        <Popover key={index}>
          <PopoverTrigger asChild>
            <span
              style={{
                backgroundColor: getColorByRating(match.data.rating),
                padding: "0 2px",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              {match.text}
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <div style={{ fontSize: "0.875rem" }}>
                <Button variant="outline" onClick={() => speak(match.text.toLowerCase())}>
                    <Ear /> Nghe lại chuẩn
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>,
      )

      lastIndex = match.end
    })

    // Add any remaining text
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex))
    }

    return result
  }

  // Helper function to get color based on rating
  const getColorByRating = (rating) => {
    const numRating = Number.parseFloat(rating)

    if (numRating >= 8) return "#bbf7d0" // green
    if (numRating >= 6) return "#bfdbfe" // blue
    if (numRating >= 4) return "#fed7aa" // orange
    return "#fecaca" // red
  }

  const highlightedContent = highlightText(paragraph, wordData)

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          padding: "1rem",
          border: "1px solid #e2e8f0",
          borderRadius: "0.375rem",
          backgroundColor: "#f8fafc",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Chỉnh sửa phát âm:</h2>
        <div style={{ lineHeight: "1.5" }}>{highlightedContent}</div>
      </div>
    </div>
  )
}

