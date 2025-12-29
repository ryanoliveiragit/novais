"use client";

import { useState, useRef } from "react";

interface PortfolioVideoCardProps {
  title: string;
  category: string;
  videoUrl: string;
  index: number;
}

export default function PortfolioVideoCard({
  title,
  category,
  videoUrl,
  index
}: PortfolioVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getEmbedUrl = (url: string): { embedUrl: string; type: "youtube" | "twitter" | "local" } => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0] || "";
      }
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        type: "youtube"
      };
    }

    // Twitter/X
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return {
        embedUrl: url,
        type: "twitter"
      };
    }

    // Local video
    return { embedUrl: videoUrl, type: "local" };
  };

  const { embedUrl, type } = getEmbedUrl(videoUrl);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (type === "local" && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (type === "local" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* YouTube Embed */}
      {type === "youtube" && (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`${embedUrl}${isHovered ? "?autoplay=1&mute=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {/* Twitter/X Embed */}
      {type === "twitter" && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-purple-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <p className="text-sm text-zinc-400">Twitter/X Video</p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
            >
              View on X
            </a>
          </div>
        </div>
      )}

      {/* Local Video */}
      {type === "local" && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
        >
          <source src={embedUrl} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

      {/* Play Icon */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <p className="text-purple-400 text-sm font-medium mb-1">{category}</p>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </div>
  );
}
