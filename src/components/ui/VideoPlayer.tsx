'use client'

import { CldVideoPlayer } from 'next-cloudinary'
import 'next-cloudinary/dist/cld-video-player.css'

interface VideoPlayerProps {
  publicId?: string;
  url?: string;
  title?: string;
  onEnded?: () => void;
}

export function VideoPlayer({ publicId, url, title, onEnded }: VideoPlayerProps) {
  // 1. YouTube Detection
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be')
  
  if (isYouTube) {
    const videoId = url?.includes('v=') 
      ? url.split('v=')[1]?.split('&')[0] 
      : url?.split('/').pop()

    return (
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-xl overflow-hidden"
        ></iframe>
      </div>
    )
  }

  // 2. Cloudinary Player
  if (publicId) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/5 shadow-2xl">
        <CldVideoPlayer
          width="1920"
          height="1080"
          src={publicId}
          onEnded={onEnded}
          colors={{
            accent: '#3b82f6', // primary blue
            base: '#0f172a',   // surface dark
            text: '#ffffff'
          }}
          fontFace="Inter"
          logo={false}
        />
      </div>
    )
  }

  // 3. Fallback Native Player (Direct URL)
  if (url) {
    return (
       <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <video 
            src={url} 
            controls 
            className="w-full h-full"
            onEnded={onEnded}
          />
       </div>
    )
  }

  return (
    <div className="aspect-video w-full bg-surface-3 flex flex-col items-center justify-center text-text-muted rounded-xl border border-dashed border-border">
      <p>لا يوجد فيديو متاح لهذا الدرس</p>
    </div>
  )
}
