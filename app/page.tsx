"use client";

import { Orbitron } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import content from "./content.json";

const orbitron = Orbitron({ subsets: ["latin"] });

export default function Home() {
  const [tweetData, setTweetData] = useState({
    views: "0",
    likes: "0",
    retweets: "0",
    replies: "0"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const portfolioVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const fetchTweetData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTweetData({
          views: "1.2M",
          likes: "45.2K",
          retweets: "8.5K",
          replies: "892"
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tweet data:", error);
        setIsLoading(false);
      }
    };

    fetchTweetData();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProjectHover = (index: number, isHovering: boolean) => {
    setHoveredProject(isHovering ? index : null);
    const video = portfolioVideoRefs.current[index];
    if (video) {
      if (isHovering) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case 'video':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'color':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'motion':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full bg-zinc-950 ${orbitron.className}`}>
      {/* Background subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-zinc-950 to-pink-950/20 -z-10" />
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px] -z-10" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{content.site.logo.short}</span>
            </div>
            <span className="text-white font-semibold text-lg">{content.site.logo.full}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            {content.navigation.links.map((link, index) => (
              <a key={index} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {content.navigation.social.map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                {social.icon === 'twitter' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )}
                {social.icon === 'github' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                {social.icon === 'linkedin' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-8">
            {content.hero.badge.show && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-sm text-green-400 font-medium">{content.hero.badge.text}</span>
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                {content.hero.title.line1}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {content.hero.title.line2}
                </span>
              </h1>
              <p className="text-base lg:text-lg text-zinc-400 max-w-md">
                {content.hero.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={content.hero.buttons.primary.href} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-center">
                {content.hero.buttons.primary.text}
              </a>
              <a href={content.hero.buttons.secondary.href} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors text-center">
                {content.hero.buttons.secondary.text}
              </a>
            </div>

            {/* Stats inline */}
            <div className="pt-8 flex items-center gap-8 text-sm">
              {content.hero.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Video Player */}
          <div className="lg:col-span-7">
            <div className="w-full">
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                
                {/* Video Header */}
                <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {content.video.showLiveBadge && (
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                    <span className="text-sm text-zinc-300 font-medium">{content.video.title}</span>
                  </div>
                  <a 
                    href={content.video.tweetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    <span className="hidden sm:inline">{content.video.viewOnXText}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                
                {/* Video Player */}
                <div className="relative bg-black group">
                  <video
                    ref={videoRef}
                    className="w-full aspect-video object-cover"
                    loop
                    playsInline
                    onClick={togglePlay}
                  >
                    <source src={content.video.videoPath} type="video/mp4" />
                  </video>

                  {/* Play/Pause Overlay */}
                  {!isPlaying && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                      onClick={togglePlay}
                    >
                      <div className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all transform hover:scale-110">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Custom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="text-white hover:text-purple-400 transition-colors"
                        >
                          {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-purple-400 transition-colors"
                          >
                            {isMuted || volume === 0 ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                              </svg>
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                          />
                        </div>

                        <div className="text-white text-sm font-medium">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <button
                        onClick={() => videoRef.current?.requestFullscreen()}
                        className="text-white hover:text-purple-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{content.video.statsLabels.views}</div>
                    </div>

                    <div className="space-y-1">
                      {isLoading ? (
                        <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
                      ) : (
                        <div className="text-lg font-bold text-white">{tweetData.likes}</div>
                      )}
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{content.video.statsLabels.likes}</div>
                    </div>

                    <div className="space-y-1">
                      {isLoading ? (
                        <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
                      ) : (
                        <div className="text-lg font-bold text-white">{tweetData.retweets}</div>
                      )}
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{content.video.statsLabels.retweets}</div>
                    </div>

                    <div className="space-y-1">
                      {isLoading ? (
                        <div className="h-5 bg-zinc-800 rounded animate-pulse mx-auto w-12" />
                      ) : (
                        <div className="text-lg font-bold text-white">{tweetData.replies}</div>
                      )}
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{content.video.statsLabels.replies}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-zinc-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-black text-white">
              {content.about.title}
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {content.about.description}
            </p>
          </div>
          
          <div className="grid gap-6">
            {content.about.highlights.map((highlight, index) => (
              <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-500/50 transition-colors">
                <h3 className="text-lg font-bold text-white mb-2">{highlight.title}</h3>
                <p className="text-zinc-400">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-2">{content.services.subtitle}</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white">{content.services.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.services.items.map((service, index) => (
            <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                {getServiceIcon(service.icon)}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-zinc-400">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-2">{content.tools.subtitle}</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white">{content.tools.title}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.tools.items.map((tool, index) => (
            <div key={index} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-500/50 transition-all hover:-translate-y-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">
                  {tool.logo === 'ae' && 'Ae'}
                  {tool.logo === 'vegas' && 'V'}
                  {tool.logo === 'premiere' && 'Pr'}
                  {tool.logo === 'davinci' && 'D'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{tool.name}</h3>
              <p className="text-xs text-zinc-500">{tool.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-zinc-800/50">
        <div className="text-center mb-16">
          <p className="text-purple-400 font-semibold mb-2">{content.portfolio.subtitle}</p>
          <h2 className="text-3xl lg:text-4xl font-black text-white">{content.portfolio.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.portfolio.projects.map((project, index) => (
            <div 
              key={index} 
              className="group relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors cursor-pointer"
              onMouseEnter={() => handleProjectHover(index, true)}
              onMouseLeave={() => handleProjectHover(index, false)}
            >
              {/* Video Preview */}
              <video
                ref={(el) => (portfolioVideoRefs.current[index] = el)}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
              >
                <source src={project.videoPath} type="video/mp4" />
              </video>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              
              {/* Play Icon */}
              {hoveredProject !== index && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 rounded-full bg-purple-600/80 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <p className="text-purple-400 text-sm font-medium mb-1">{project.category}</p>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-black text-white">
              {content.contact.title}
            </h2>
            <p className="text-lg text-zinc-400">
              {content.contact.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.contact.methods.map((method, index) => (
              <div key={index} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-purple-500/50 transition-colors">
                <p className="text-sm text-zinc-500 mb-2">{method.platform}</p>
                <p className="text-white font-semibold">{method.handle}</p>
              </div>
            ))}
          </div>

          <a 
            href={`mailto:${content.contact.email}`}
            className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Send an Email
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-zinc-800/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{content.site.logo.short}</span>
              </div>
              <span className="text-zinc-400 text-sm">{content.footer.copyright}</span>
            </div>

            <div className="flex items-center gap-6">
              {content.footer.links.map((link, index) => (
                <a key={index} href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {content.navigation.social.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                  {social.icon === 'twitter' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {social.icon === 'github' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  )}
                  {social.icon === 'linkedin' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}