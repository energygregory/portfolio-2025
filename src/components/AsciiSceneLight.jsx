import { useRef, useEffect } from "react"

export function AsciiSceneLight() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay prevented:", error)
      })
    }
  }, [])

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      <video
        ref={videoRef}
        src="/1221.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />
    </div>
  )
}
