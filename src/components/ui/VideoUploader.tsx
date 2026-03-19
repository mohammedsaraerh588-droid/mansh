'use client'
import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle, AlertCircle, Video, RefreshCw } from 'lucide-react'

interface Props {
  onSuccess: (videoUrl: string, publicId: string) => void
  currentVideoUrl?: string | null
  className?: string
}

export default function VideoUploader({ onSuccess, currentVideoUrl, className = '' }: Props) {
  const [uploading,  setUploading]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [error,      setError]      = useState('')
  const [done,       setDone]       = useState(false)
  const [preview,    setPreview]    = useState<string | null>(currentVideoUrl || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.size > 500 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى 500 ميجابايت.')
      return
    }
    if (!file.type.startsWith('video/')) {
      setError('الرجاء اختيار ملف فيديو صحيح.')
      return
    }

    setUploading(true); setError(''); setDone(false); setProgress(0)

    try {
      // 1. Get signed credentials from our API
      const sigRes = await fetch('/api/upload-signature', { method: 'POST' })
      if (!sigRes.ok) throw new Error('فشل الحصول على صلاحية الرفع')
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json()

      // 2. Upload to Cloudinary with real progress
      const formData = new FormData()
      formData.append('file',           file)
      formData.append('signature',      signature)
      formData.append('timestamp',      String(timestamp))
      formData.append('api_key',        apiKey)
      formData.append('folder',         folder)
      formData.append('resource_type',  'video')

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText)
            setPreview(data.secure_url)
            setDone(true)
            onSuccess(data.secure_url, data.public_id)
            resolve()
          } else {
            const err = JSON.parse(xhr.responseText)
            reject(new Error(err.error?.message || 'فشل رفع الفيديو'))
          }
        }
        xhr.onerror = () => reject(new Error('خطأ في الاتصال'))
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`)
        xhr.send(formData)
      })
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء الرفع')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    setPreview(null); setDone(false); setProgress(0); setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  /* ── Render ── */
  if (preview && done) {
    return (
      <div className={className} style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:700,color:'var(--teal)'}}>
            <CheckCircle size={17}/>تم رفع الفيديو بنجاح
          </span>
          <button onClick={reset} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:700,color:'var(--txt2)',background:'none',border:'none',cursor:'pointer'}}>
            <RefreshCw size={13}/>استبدال الفيديو
          </button>
        </div>
        <video src={preview} controls style={{width:'100%',maxHeight:260,borderRadius:12,background:'#000'}}/>
      </div>
    )
  }

  if (preview && !done) {
    return (
      <div className={className} style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:700,color:'var(--teal)'}}>
            <Video size={16}/>فيديو مرفق مسبقاً
          </span>
          <button onClick={reset} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,fontWeight:700,color:'var(--txt2)',background:'none',border:'none',cursor:'pointer'}}>
            <RefreshCw size={13}/>استبدال الفيديو
          </button>
        </div>
        <video src={preview} controls style={{width:'100%',maxHeight:260,borderRadius:12,background:'#000'}}/>
      </div>
    )
  }

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleChange}/>

      {uploading ? (
        /* Progress state */
        <div style={{border:'1px solid var(--border)',borderRadius:12,padding:24,textAlign:'center',background:'var(--surface)'}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'var(--teal-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <UploadCloud size={24} style={{color:'var(--teal)'}}/>
          </div>
          <p style={{fontWeight:700,fontSize:15,marginBottom:6,color:'var(--txt1)'}}>جاري رفع الفيديو...</p>
          <p style={{fontSize:13,color:'var(--txt3)',marginBottom:16}}>لا تغلق الصفحة حتى يكتمل الرفع</p>
          {/* Progress bar */}
          <div style={{background:'var(--bg3)',borderRadius:99,height:8,overflow:'hidden',marginBottom:8}}>
            <div style={{height:'100%',background:'var(--teal)',borderRadius:99,width:`${progress}%`,transition:'width .3s ease'}}/>
          </div>
          <p style={{fontSize:13,fontWeight:700,color:'var(--teal)'}}>{progress}%</p>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={e=>e.preventDefault()}
          onClick={()=>inputRef.current?.click()}
          style={{border:'2px dashed var(--border2)',borderRadius:12,padding:'36px 24px',textAlign:'center',background:'var(--bg2)',cursor:'pointer',transition:'all .2s'}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--teal)';(e.currentTarget as HTMLElement).style.background='var(--teal-soft)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--border2)';(e.currentTarget as HTMLElement).style.background='var(--bg2)'}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:'var(--teal-soft)',border:'1px solid rgba(13,148,136,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px'}}>
            <UploadCloud size={22} style={{color:'var(--teal)'}}/>
          </div>
          <p style={{fontWeight:700,fontSize:15,marginBottom:6,color:'var(--txt1)'}}>اسحب وأفلت الفيديو هنا</p>
          <p style={{fontSize:13,color:'var(--txt2)',marginBottom:16}}>أو اضغط لاختيار ملف من جهازك</p>
          <span style={{display:'inline-block',padding:'9px 22px',borderRadius:9,background:'var(--teal)',color:'#fff',fontSize:13,fontWeight:700}}>
            اختيار فيديو
          </span>
          <p style={{fontSize:11,color:'var(--txt3)',marginTop:12}}>MP4, MOV, AVI, MKV — الحد الأقصى 500MB</p>
        </div>
      )}

      {error && (
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:9,background:'var(--err-bg)',border:'1px solid rgba(220,38,38,.15)',marginTop:10}}>
          <AlertCircle size={15} style={{color:'var(--err)',flexShrink:0}}/>
          <span style={{fontSize:13,color:'var(--err)'}}>{error}</span>
        </div>
      )}
    </div>
  )
}
