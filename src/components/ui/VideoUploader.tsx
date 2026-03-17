'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle2, Loader2, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface VideoUploaderProps {
  onSuccess: (videoUrl: string, publicId: string) => void;
  currentVideoUrl?: string;
  className?: string;
}

export default function VideoUploader({ onSuccess, currentVideoUrl, className = '' }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 500MB (example)
    if (file.size > 500 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى هو 500 ميجابايت.')
      return
    }

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    // Needs to be your unsigned upload preset from Cloudinary
    formData.append('upload_preset', 'ml_default') 
    // Cloudinary cloud name
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      
      if (res.ok) {
        onSuccess(data.secure_url, data.public_id)
      } else {
        throw new Error(data.error?.message || 'فشل رفع الفيديو')
      }
    } catch (err: any) {
      console.error('Upload Error:', err)
      setError(err.message || 'حدث خطأ أثناء الرفع')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {currentVideoUrl ? (
        <div className="bg-surface-3 p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-success flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              تم إرفاق الفيديو بنجاح
            </span>
            <label className="cursor-pointer text-sm text-primary hover:underline font-bold">
              تغيير الفيديو
              <input type="file" accept="video/mp4,video/mkv,video/avi" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          <video src={currentVideoUrl} controls className="w-full h-auto max-h-64 bg-black rounded-lg" />
        </div>
      ) : (
        <div className="border-2 border-dashed border-border hover:border-primary-light transition-colors rounded-xl p-8 bg-surface-2">
           <div className="text-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <UploadCloud className="w-8 h-8 text-primary" />}
             </div>
             
             {uploading ? (
               <div>
                  <h4 className="font-bold text-lg mb-2">جاري رفع الفيديو...</h4>
                  <p className="text-sm text-text-muted">الرجاء عدم إغلاق هذه الصفحة.</p>
               </div>
             ) : (
               <div>
                  <h4 className="font-bold text-lg mb-2">قم باختيار ملف فيديو من جهازك</h4>
                  <p className="text-sm text-text-secondary mb-6">الصيغ المدعومة: MP4, AVI, MKV. الحد الأقصى 500MB</p>
                  
                  <label className="btn-primary inline-flex cursor-pointer shadow-sm">
                    اختيار فيديو
                    <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                  </label>
               </div>
             )}
             
             {error && <p className="text-error text-sm mt-4">{error}</p>}
           </div>
        </div>
      )}
    </div>
  )
}
