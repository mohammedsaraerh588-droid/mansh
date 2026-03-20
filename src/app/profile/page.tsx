'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
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
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--brand)'}}/>
    </div>
  )

  const roleLabel = profile?.role==='admin'?'مدير المنصة':profile?.role==='teacher'?'معلم':'طالب'
  const roleBadge = profile?.role==='admin'?'badge-red':profile?.role==='teacher'?'badge-brand':'badge-gray'

  return (
    <div style={{maxWidth:860,margin:'0 auto',padding:'32px 20px'}}>
      <div className="card" style={{overflow:'hidden'}}>
        {/* Cover */}
        <div style={{height:110,background:'linear-gradient(135deg,#060608 0%,#1a1040 50%,#0c1a40 100%)',position:'relative'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% -20%,rgba(99,91,255,.28) 0%,transparent 60%)'}}/>
        </div>
        <div style={{padding:'0 28px 32px'}}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'flex-end',gap:16,marginTop:-36,marginBottom:24}}>
            <div style={{width:72,height:72,borderRadius:'50%',overflow:'hidden',border:'4px solid var(--surface)',background:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:900,color:'#fff',flexShrink:0,boxShadow:'var(--shb)'}}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                : profile?.full_name?.charAt(0) || <Stethoscope size={28}/>}
            </div>
            <div style={{paddingBottom:4}}>
              <h1 style={{fontSize:20,fontWeight:800,color:'var(--tx1)',marginBottom:4,letterSpacing:'-.01em'}}>{profile?.full_name||'مستخدم'}</h1>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{fontSize:13,color:'var(--tx3)'}}>{profile?.email}</span>
                <span className={`badge ${roleBadge}`} style={{fontSize:10}}>{roleLabel}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:14,fontWeight:700,color:'var(--tx1)',paddingBottom:8,borderBottom:'1px solid var(--brd)',letterSpacing:'-.01em'}}>المعلومات الشخصية</h3>
                <Input label="الاسم الكامل" value={profile?.full_name||''} onChange={e=>setProfile({...profile,full_name:e.target.value})} leftIcon={<User size={14}/>}/>
                <Input label="التخصص / المسمى الوظيفي" placeholder="طالب طب..." value={profile?.headline||''} onChange={e=>setProfile({...profile,headline:e.target.value})} leftIcon={<Briefcase size={14}/>}/>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6,color:'var(--tx3)'}}>نبذة شخصية</label>
                  <textarea className="inp" style={{minHeight:100,resize:'vertical'}} placeholder="تحدث عن نفسك..."
                    value={profile?.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})}/>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:14,fontWeight:700,color:'var(--tx1)',paddingBottom:8,borderBottom:'1px solid var(--brd)',letterSpacing:'-.01em'}}>الروابط والحسابات</h3>
                <Input label="الموقع الشخصي" placeholder="https://..." value={profile?.website||''} onChange={e=>setProfile({...profile,website:e.target.value})} leftIcon={<Globe size={14}/>} dir="ltr"/>
                <Input label="تويتر / X" placeholder="https://twitter.com/..." value={profile?.twitter||''} onChange={e=>setProfile({...profile,twitter:e.target.value})} leftIcon={<Twitter size={14}/>} dir="ltr"/>
                <Input label="لينكد إن" placeholder="https://linkedin.com/in/..." value={profile?.linkedin||''} onChange={e=>setProfile({...profile,linkedin:e.target.value})} leftIcon={<Linkedin size={14}/>} dir="ltr"/>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:20,borderTop:'1px solid var(--brd)'}}>
              <div>
                {msg && (
                  <div style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',borderRadius:9,background:msg.type==='ok'?'var(--ok-bg)':'var(--err-bg)'}}>
                    {msg.type==='ok'?<CheckCircle size={14} style={{color:'var(--ok)'}}/>:<AlertCircle size={14} style={{color:'var(--err)'}}/>}
                    <span style={{fontSize:13,fontWeight:600,color:msg.type==='ok'?'var(--ok)':'var(--err)'}}>{msg.text}</span>
                  </div>
                )}
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary btn-md">
                {saving ? <><Loader2 size={14} className="spin"/>جاري الحفظ...</> : <><Save size={14}/>حفظ التغييرات</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
