"use client";

import { useState, useEffect } from "react";

interface ExternalVideoPlayerProps {
  videoUrl: string;
  tweetUrl?: string;
  title: string;
  showLiveBadge?: boolean;
  viewOnXText?: string;
  tweetData?: {
    views: string;
    likes: string;
    retweets: string;
    replies: string;
  };
  isLoading?: boolean;
  statsLabels?: {
    views: string;
    likes: string;
    retweets: string;
    replies: string;
  };
}

export default function ExternalVideoPlayer({
  videoUrl,
  tweetUrl,
  title,
  showLiveBadge = false,
  viewOnXText = "View on X",
  tweetData = {
    views: "0",
    likes: "0",
    retweets: "0",
    replies: "0"
  },
  isLoading = false,
  statsLabels = {
    views: "Views",
    likes: "Likes",
    retweets: "Retweets",
    replies: "Replies"
  }
}: ExternalVideoPlayerProps) {
  const [embedHtml, setEmbedHtml] = useState<string>("");
  const [embedLoading, setEmbedLoading] = useState(false);

  const getEmbedUrl = (url: string): { embedUrl: string; type: "youtube" | "twitter" | "unknown" } => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
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

    return { embedUrl: "", type: "unknown" };
  };

  const { embedUrl: finalEmbedUrl, type } = getEmbedUrl(videoUrl);

  useEffect(() => {
    if (type === "twitter") {
      setEmbedLoading(true);

      // Fetch embed HTML from our API
      fetch(`/api/twitter-embed?url=${encodeURIComponent(finalEmbedUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.html) {
            setEmbedHtml(data.html);
          }
          setEmbedLoading(false);
        })
        .catch((error) => {
          console.error("Error loading Twitter embed:", error);
          setEmbedLoading(false);
        });

      // Load Twitter widgets script
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;

      if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
        document.body.appendChild(script);
      }
    }
  }, [type, finalEmbedUrl]);

  useEffect(() => {
    // Reload Twitter widgets when embedHtml changes
    if (embedHtml && type === "twitter") {
      // @ts-ignore
      if (window.twttr?.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }
  }, [embedHtml, type]);

  return (
    <div className="w-full">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">

        {/* Video Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showLiveBadge && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
            <span className="text-sm text-zinc-300 font-medium">{title}</span>
          </div>
          {tweetUrl && (
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <span className="hidden sm:inline">{viewOnXText}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Video Player */}
        <div className="relative bg-black">
          {type === "youtube" && (
            <iframe
              className="w-full aspect-video"
              src={finalEmbedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {type === "twitter" && (
            <div className="w-full min-h-[500px] flex items-center justify-center p-6 bg-zinc-950">
              {embedLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-zinc-400">Loading tweet...</p>
                </div>
              ) : embedHtml ? (
                <div
                  className="twitter-embed-container max-w-full"
                  dangerouslySetInnerHTML={{ __html: embedHtml }}
                />
              ) : (
                <div className="text-center">
                  <p className="text-zinc-400 mb-4">Failed to load tweet</p>
                  <a
                    href={finalEmbedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    View on X/Twitter
                  </a>
                </div>
              )}
            </div>
          )}

          {type === "unknown" && (
            <div className="w-full aspect-video flex items-center justify-center bg-zinc-900">
              <p className="text-zinc-500">URL de vídeo não suportado</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="px-6 py-5 border-t border-zinc-800">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              {isLoading ? (
                <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
              ) : (
                <div className="text-lg font-bold text-white">{tweetData.views}</div>
              )}
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{statsLabels.views}</div>
            </div>

            <div className="space-y-1">
              {isLoading ? (
                <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
              ) : (
                <div className="text-lg font-bold text-white">{tweetData.likes}</div>
              )}
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{statsLabels.likes}</div>
            </div>

            <div className="space-y-1">
              {isLoading ? (
                <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
              ) : (
                <div className="text-lg font-bold text-white">{tweetData.retweets}</div>
              )}
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{statsLabels.retweets}</div>
            </div>

            <div className="space-y-1">
              {isLoading ? (
                <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
              ) : (
                <div className="text-lg font-bold text-white">{tweetData.replies}</div>
              )}
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{statsLabels.replies}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
