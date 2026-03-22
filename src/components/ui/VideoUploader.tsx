'use client'
import { useState, useRef } from 'react'
import { Upload, CheckCircle, Loader2, Film, AlertCircle, X } from 'lucide-react'

interface Props {
  onUploaded: (publicId: string, url: string) => void
  accept?: string
}

export default function VideoUploader({ onUploaded, accept = 'video/*' }: Props) {
  const [uploading,  setUploading]  = useState(false)
  const [progress,   setProgress]   = useState(0)
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState('')
  const [fileName,   setFileName]   = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    if (!file) return
    setError(''); setDone(false); setProgress(0)
    setFileName(file.name)
    setUploading(true)

    try {
      // 1. جلب توقيع الرفع من الـ API
      const sigRes = await fetch('/api/upload-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_type: 'video' }),
      })
      if (!sigRes.ok) throw new Error('فشل الحصول على توقيع الرفع')
      const { signature, timestamp, folder, cloud_name, api_key } = await sigRes.json()

      // 2. رفع مباشرة لـ Cloudinary مع تتبع التقدم
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', String(timestamp))
      formData.append('folder', folder)
      formData.append('api_key', api_key)
      formData.append('resource_type', 'video')

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText)
            onUploaded(res.public_id, res.secure_url)
            setDone(true)
            resolve()
          } else {
            reject(new Error('فشل الرفع: ' + xhr.status))
          }
        }
        xhr.onerror = () => reject(new Error('خطأ في الشبكة'))
        xhr.send(formData)
      })
    } catch (e: any) {
      console.error('[VIDEO_UPLOAD]', e)
      setError(e.message || 'فشل الرفع، حاول مرة أخرى')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const reset = () => { setDone(false); setProgress(0); setFileName(''); setError('') }

  return (
    <div>
      <input ref={inputRef} type="file" accept={accept} style={{display:'none'}}
        onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}/>

      {done ? (
        <div style={{padding:'20px 16px', borderRadius:12, background:'var(--ok-bg)', border:'2px solid var(--ok-brd)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <CheckCircle size={20} style={{color:'var(--ok)', flexShrink:0}}/>
            <div>
              <p style={{fontSize:13, fontWeight:700, color:'var(--ok)', margin:0}}>تم الرفع بنجاح ✓</p>
              <p style={{fontSize:11, color:'var(--tx3)', margin:0, marginTop:2}}>{fileName}</p>
            </div>
          </div>
          <button onClick={reset} style={{background:'none', border:'none', cursor:'pointer', color:'var(--tx3)', display:'flex'}}>
            <X size={16}/>
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            border: `2px dashed ${error ? 'var(--err)' : uploading ? 'var(--alpha-green)' : 'var(--brd)'}`,
            borderRadius: 12, padding: '32px 20px', textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: uploading ? 'var(--alpha-green-l)' : 'var(--surface2)',
            transition: 'all .2s',
          }}>

          {uploading ? (
            <>
              <Loader2 size={32} className="spin" style={{color:'var(--alpha-green)', margin:'0 auto 12px'}}/>
              <p style={{fontSize:14, fontWeight:700, color:'var(--tx1)', marginBottom:8}}>{fileName}</p>
              <div style={{height:6, borderRadius:99, background:'var(--surface3)', overflow:'hidden', maxWidth:280, margin:'0 auto'}}>
                <div style={{height:'100%', borderRadius:99, background:'var(--alpha-green)', width:`${progress}%`, transition:'width .3s'}}/>
              </div>
              <p style={{fontSize:12, color:'var(--tx3)', marginTop:8}}>{progress}% مكتمل</p>
            </>
          ) : error ? (
            <>
              <AlertCircle size={32} style={{color:'var(--err)', margin:'0 auto 12px'}}/>
              <p style={{fontSize:13, color:'var(--err)', fontWeight:600, marginBottom:8}}>{error}</p>
              <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); reset() }}>حاول مجدداً</button>
            </>
          ) : (
            <>
              <div style={{width:52, height:52, borderRadius:14, background:'var(--alpha-green-l)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px'}}>
                <Film size={24} style={{color:'var(--alpha-green)'}}/>
              </div>
              <p style={{fontSize:15, fontWeight:700, color:'var(--tx1)', marginBottom:6}}>اسحب الفيديو هنا</p>
              <p style={{fontSize:13, color:'var(--tx3)', marginBottom:14}}>أو اضغط لاختيار ملف</p>
              <div className="btn-register btn-sm" style={{display:'inline-flex', padding:'8px 20px', pointerEvents:'none'}}>
                <Upload size={14}/>اختر فيديو
              </div>
              <p style={{fontSize:11, color:'var(--tx4)', marginTop:12}}>MP4, MOV, AVI — حد أقصى 500MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
