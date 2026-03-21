'use client'

interface Props {
  publicId?: string
  url?: string
  title?: string
  thumbnail?: string
  onEnded?: () => void
}

export default function VideoPlayer({ publicId, url, title, thumbnail, onEnded }: Props) {
  // Cloudinary video
  if (publicId) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const src = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}`
    return (
      <video
        controls
        poster={thumbnail}
        onEnded={onEnded}
        style={{width:'100%',borderRadius:12,background:'#000',maxHeight:480}}
        preload="metadata"
      >
        <source src={src} type="video/mp4"/>
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    )
  }

  // YouTube / Vimeo embed
  if (url) {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    const vimeoMatch   = url.match(/vimeo\.com\/(\d+)/)

    if (youtubeMatch) {
      return (
        <div style={{position:'relative',paddingTop:'56.25%',borderRadius:12,overflow:'hidden',background:'#000'}}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`}
            title={title || 'فيديو'}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
          />
        </div>
      )
    }

    if (vimeoMatch) {
      return (
        <div style={{position:'relative',paddingTop:'56.25%',borderRadius:12,overflow:'hidden',background:'#000'}}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            title={title || 'فيديو'}
            frameBorder="0"
            allowFullScreen
            style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
          />
        </div>
      )
    }

    // رابط فيديو مباشر
    return (
      <video
        src={url}
        controls
        poster={thumbnail}
        onEnded={onEnded}
        style={{width:'100%',borderRadius:12,background:'#000',maxHeight:480}}
        preload="metadata"
      >
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    )
  }

  // لا يوجد مصدر
  return (
    <div style={{width:'100%',aspectRatio:'16/9',background:'var(--surface3)',borderRadius:12,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
      <span style={{fontSize:36}}>🎬</span>
      <p style={{fontSize:14,color:'var(--tx3)',fontWeight:600}}>لا يوجد فيديو لهذا الدرس</p>
    </div>
  )
}
