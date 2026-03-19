'use client'
import Image from 'next/legacy/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { User, Globe, Twitter, Linkedin, Loader2, Save, Briefcase, CheckCircle, AlertCircle, Stethoscope } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState<{type:'ok'|'err',text:string}|null>(null)
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id',session.user.id).maybeSingle()
      setProfile(data); setLoading(false)
    })()
  },[])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name, headline: profile.headline,
      bio: profile.bio, website: profile.website,
      twitter: profile.twitter, linkedin: profile.linkedin,
      updated_at: new Date().toISOString()
    }).eq('id', profile.id)
    setSaving(false)
    setMsg(error ? {type:'err',text:'فشل الحفظ. حاول مرة أخرى.'} : {type:'ok',text:'تم حفظ التغييرات بنجاح'})
    setTimeout(()=>setMsg(null), 3000)
  }

  if (loading) return (
    <div className="flex justify-center py-20 opacity-30">
      <Loader2 size={32} className="spin text-navy"/>
    </div>
  )

  const roleLabel = profile?.role==='admin'?'مدير المنصة':profile?.role==='teacher'?'معلم':'طالب'
  const roleBadge = profile?.role==='admin'?'badge-red':profile?.role==='teacher'?'badge-teal':'badge-gray'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <div className="card overflow-hidden shadow-2xl shadow-navy/5 bg-white border-0">
        {/* Cover with Gradient Mesh */}
        <div className="h-40 md:h-56 bg-navy relative overflow-hidden">
           <div className="absolute inset-0 opacity-20" 
                style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(100,255,218,0.2) 1px, transparent 0)', backgroundSize: '24px 24px'}} />
           <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] rounded-full bg-mint/5 blur-[80px]" />
           <div className="absolute bottom-[-30%] left-[-5%] w-[300px] h-[300px] rounded-full bg-gold/5 blur-[60px]" />
        </div>

        <div className="px-6 md:px-12 pb-12 relative">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 mb-10 text-center md:text-right">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-8 border-white bg-navy shadow-2xl flex items-center justify-center text-4xl font-black text-white relative group">
{profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile avatar" width={160} height={160} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                   <span className="text-mint/40 italic font-serif opacity-0 group-hover:opacity-100 transition-opacity absolute top-4">Dr.</span>
                   {profile?.full_name?.charAt(0) || <Stethoscope size={40}/>}
                </div>
              )}
            </div>
            <div className="flex-1 pb-4">
              <h1 className="text-2xl md:text-4xl font-black text-navy mb-2 tracking-tight">
                {profile?.full_name || 'مرحباً بك'}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <span className="text-sm font-bold text-txt2 opacity-60">{profile?.email}</span>
                <span className={cn('badge-dark px-3 mt-1 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest', roleBadge)}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Profile Info */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                   <div className="w-1.5 h-6 bg-navy rounded-full" />
                   <h3 className="text-lg font-black text-navy tracking-tight">المعلومات الأساسية</h3>
                </div>
                
                <div className="space-y-6">
                    <Input label="الاسم الكامل" value={profile?.full_name||''} onChange={e=>setProfile({...profile,full_name:e.target.value})} leftIcon={<User size={16}/>}/>
                    <Input label="التخصص / المسمى الوظيفي" placeholder="طالب طب، أخصائي جراحة..." value={profile?.headline||''} onChange={e=>setProfile({...profile,headline:e.target.value})} leftIcon={<Briefcase size={16}/>}/>
                    
                    <div className="w-full">
                      <label className="block text-xs font-black text-navy opacity-40 uppercase tracking-widest mb-3">نبذة شخصية</label>
                      <textarea 
                        className="inp min-h-[140px] resize-none focus:ring-4 focus:ring-mint/5 transition-all text-sm leading-relaxed" 
                        placeholder="تحدث عن مسيرتك الطبية واهتماماتك..."
                        value={profile?.bio||''} 
                        onChange={e=>setProfile({...profile,bio:e.target.value})}
                      />
                    </div>
                </div>
              </div>

              {/* Socials */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                   <div className="w-1.5 h-6 bg-mint rounded-full" />
                   <h3 className="text-lg font-black text-navy tracking-tight">التواجد الرقمي</h3>
                </div>
                
                <div className="p-6 bg-bg2/50 rounded-3xl space-y-5 border border-white">
                    <Input label="الموقع الشخصي" placeholder="https://..." value={profile?.website||''} onChange={e=>setProfile({...profile,website:e.target.value})} leftIcon={<Globe size={16}/>} dir="ltr"/>
                    <Input label="تويتر / X" placeholder="@username" value={profile?.twitter||''} onChange={e=>setProfile({...profile,twitter:e.target.value})} leftIcon={<Twitter size={16}/>} dir="ltr"/>
                    <Input label="لينكد إن" placeholder="linkedin.com/in/..." value={profile?.linkedin||''} onChange={e=>setProfile({...profile,linkedin:e.target.value})} leftIcon={<Linkedin size={16}/>} dir="ltr"/>
                </div>
                
                <div className="p-6 bg-navy rounded-3xl text-white/40 text-[10px] font-bold leading-relaxed tracking-wide uppercase">
                   <AlertCircle size={14} className="text-mint mb-2" />
                   سيتم عرض هذه الروابط في صفحتك العامة للمدربين والزملاء.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-border">
              <div className="min-h-[40px]">
                {msg && (
                  <div className={cn(
                    'fade-up flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 shadow-sm',
                    msg.type==='ok' ? 'bg-ok-bg border-ok/20 text-ok' : 'bg-err-bg border-err/20 text-err'
                  )}>
                    {msg.type==='ok' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-black">{msg.text}</span>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={saving} 
                className="btn btn-primary btn-xl shadow-2xl shadow-navy/20 min-w-[200px]"
              >
                {saving ? (
                  <><Loader2 size={20} className="spin"/> جاري الحفظ...</>
                ) : (
                  <><Save size={20}/> تحديث البيانات</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

