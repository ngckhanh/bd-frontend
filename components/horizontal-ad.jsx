"use client"

import Script from "next/script";
import { useEffect, useRef } from "react"

export default function GoogleAdsense() {
  const adRef = useRef(null)
  const isAdInitialized = useRef(false)

  useEffect(() => {
    // Create a new script element
    const script = document.createElement("script")
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4624816506300999"
    script.async = true
    script.crossOrigin = "anonymous"

    // Append the script to the document
    document.head.appendChild(script)

    // Clean up function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, []);

  return (
    <div className="ad-container">
        <ins 
            className="adsbygoogle"
            data-ad-client="ca-pub-4624816506300999"
            data-ad-slot="2847821894"
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    </div>
  )
}

