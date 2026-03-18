'use client'

interface Props {
  publicId?: string
  url?: string
  title?: string
  onEnded?: () => void
}

export function VideoPlayer({ publicId, url, title, onEnded }: Props) {

  // YouTube
  const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be')
  if (isYouTube) {
    const videoId = url?.includes('v=')
      ? url.split('v=')[1]?.split('&')[0]
      : url?.split('/').pop()
    return (
      <div style={{position:'relative',paddingBottom:'56.25%',height:0,borderRadius:12,overflow:'hidden',background:'#000'}}>
        <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
          title={title||'فيديو'} frameBorder="0" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
      </div>
    )
  }

  // Cloudinary أو رابط مباشر
  const videoSrc = publicId
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}`
    : url

  if (videoSrc) {
    return (
      <div style={{borderRadius:12,overflow:'hidden',background:'#000',boxShadow:'var(--s3)'}}>
        <video src={videoSrc} controls style={{width:'100%',maxHeight:520,display:'block'}}
          onEnded={onEnded} title={title}
          controlsList="nodownload">
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
    )
  }

  // لا يوجد فيديو
  return (
    <div style={{aspectRatio:'16/9',background:'var(--bg3)',borderRadius:12,border:'2px dashed var(--border2)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
      <span style={{fontSize:32}}>🎬</span>
      <p style={{fontSize:14,color:'var(--txt3)'}}>لم يتم رفع فيديو لهذا الدرس بعد</p>
    </div>
  )
}
