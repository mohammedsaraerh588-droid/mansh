'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { User, Globe, Twitter, Linkedin, Loader2, Save, Briefcase, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(()=>{
    (async()=>{
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id',session.user.id).single()
      setProfile(data); setLoading(false)
    })()
  },[])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); if (!profile) return
    setSaving(true); setSaved(false)
    await supabase.from('profiles').update({ full_name:profile.full_name, headline:profile.headline, bio:profile.bio, website:profile.website, twitter:profile.twitter, linkedin:profile.linkedin, updated_at:new Date().toISOString() }).eq('id',profile.id)
    setSaving(false); setSaved(true)
    setTimeout(()=>setSaved(false), 3000)
  }

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  const roleLabel = profile?.role==='admin'?'مدير المنصة':profile?.role==='teacher'?'معلم':'طالب'

  return (
    <div style={{maxWidth:860,margin:'0 auto',padding:'32px 20px'}}>
      <div className="card" style={{overflow:'hidden'}}>
        {/* Cover */}
        <div style={{height:100,background:'linear-gradient(135deg,#1c1c2e,#2a2a42,#1c1c2e)'}}/>
        <div style={{padding:'0 28px 28px'}}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'flex-end',gap:18,marginTop:-32,marginBottom:20}}>
            <div style={{width:72,height:72,borderRadius:'50%',overflow:'hidden',border:'4px solid var(--surface)',background:'linear-gradient(135deg,#b8912a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:900,color:'#fff',flexShrink:0}}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : profile?.full_name?.charAt(0)||'م'}
            </div>
            <div style={{paddingBottom:6}}>
              <h1 style={{fontSize:20,fontWeight:900,color:'var(--txt1)',marginBottom:2}}>{profile?.full_name}</h1>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:13,color:'var(--txt2)'}}>{profile?.email}</span>
                <span className="badge badge-gold" style={{fontSize:10}}>{roleLabel}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
              {/* Left */}
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:14,fontWeight:800,color:'var(--txt1)',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>المعلومات الشخصية</h3>
                <Input label="الاسم الكامل" value={profile?.full_name||''} onChange={e=>setProfile({...profile,full_name:e.target.value})} leftIcon={<User size={15}/>}/>
                <Input label="المسمى / التخصص" placeholder="مطور برمجيات..." value={profile?.headline||''} onChange={e=>setProfile({...profile,headline:e.target.value})} leftIcon={<Briefcase size={15}/>}/>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:6,color:'var(--txt2)'}}>نبذة شخصية</label>
                  <textarea className="inp" style={{minHeight:110,resize:'vertical'}} placeholder="تحدث عن نفسك..."
                    value={profile?.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})}/>
                </div>
              </div>
              {/* Right */}
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:14,fontWeight:800,color:'var(--txt1)',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>الروابط والحسابات</h3>
                <Input label="الموقع الشخصي" placeholder="https://yourwebsite.com" value={profile?.website||''} onChange={e=>setProfile({...profile,website:e.target.value})} leftIcon={<Globe size={15}/>} dir="ltr"/>
                <Input label="تويتر / X" placeholder="https://twitter.com/username" value={profile?.twitter||''} onChange={e=>setProfile({...profile,twitter:e.target.value})} leftIcon={<Twitter size={15}/>} dir="ltr"/>
                <Input label="لينكد إن" placeholder="https://linkedin.com/in/username" value={profile?.linkedin||''} onChange={e=>setProfile({...profile,linkedin:e.target.value})} leftIcon={<Linkedin size={15}/>} dir="ltr"/>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:24,paddingTop:20,borderTop:'1px solid var(--border)'}}>
              {saved ? (
                <span style={{display:'flex',alignItems:'center',gap:7,fontSize:13,fontWeight:700,color:'#16a34a'}}>
                  <CheckCircle size={16}/>تم حفظ التغييرات
                </span>
              ) : <span/>}
              <button type="submit" disabled={saving} className="btn btn-gold btn-md">
                {saving ? <Loader2 size={15} className="spin"/> : <Save size={15}/>}
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
