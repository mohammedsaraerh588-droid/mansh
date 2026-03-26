'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { User, Globe, Twitter, Linkedin, Loader2, Save, Briefcase,
         CheckCircle, AlertCircle, Stethoscope, Lock } from 'lucide-react'
import Image from 'next/image'

export default function ProfilePage() {
  const [profile,  setProfile]  = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState<{type:'ok'|'err',text:string}|null>(null)
  const [pwForm,   setPwForm]   = useState({ current:'', next:'', confirm:'' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg,    setPwMsg]    = useState<{type:'ok'|'err',text:string}|null>(null)
  const [showPw,   setShowPw]   = useState(false)
  const [tab,      setTab]      = useState<'info'|'password'>('info')
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const { data:{ session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      setProfile(data); setLoading(false)
    })()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      full_name:  profile.full_name,
      headline:   profile.headline,
      bio:        profile.bio,
      website:    profile.website,
      twitter:    profile.twitter,
      linkedin:   profile.linkedin,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id)
    setSaving(false)
    setMsg(error ? {type:'err', text:'فشل الحفظ.'} : {type:'ok', text:'تم حفظ التغييرات ✓'})
    setTimeout(() => setMsg(null), 3000)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { setPwMsg({type:'err', text:'كلمتا المرور غير متطابقتين'}); return }
    if (pwForm.next.length < 8) { setPwMsg({type:'err', text:'كلمة المرور يجب أن تكون 8 أحرف على الأقل'}); return }
    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    setPwSaving(false)
    if (error) setPwMsg({type:'err', text:error.message})
    else { setPwMsg({type:'ok', text:'تم تغيير كلمة المرور ✓'}); setPwForm({current:'',next:'',confirm:''}) }
    setTimeout(() => setPwMsg(null), 4000)
  }

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',padding:'80px 0'}}>
      <Loader2 size={30} className="spin" style={{color:'var(--alpha-green)'}}/>
    </div>
  )

  const roleLabel = profile?.role==='admin'?'مدير':profile?.role==='teacher'?'معلم':'طالب'
  const roleBadge = profile?.role==='admin'?'badge-red':profile?.role==='teacher'?'badge-green':'badge-gray'

  return (
    <div style={{maxWidth:780,margin:'0 auto',padding:'32px 20px'}}>

      {/* Header card */}
      <div className="card" style={{overflow:'hidden',marginBottom:20}}>
        <div style={{height:90,background:'linear-gradient(135deg,#1B5E20,#2E7D32)',position:'relative'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 80% at 50% -10%,rgba(255,255,255,.07) 0%,transparent 60%)'}}/>
        </div>
        <div style={{padding:'0 24px 20px',display:'flex',alignItems:'flex-end',gap:14,marginTop:-36}}>
          <div style={{position:'relative',flexShrink:0}}>
            <div style={{width:70,height:70,borderRadius:'50%',overflow:'hidden',border:'4px solid var(--surface)',background:'var(--alpha-green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'#fff',boxShadow:'0 4px 14px rgba(0,0,0,.15)',position:'relative'}}>
              {profile?.avatar_url
                ? <Image src={profile.avatar_url} alt="" fill style={{objectFit:'cover'}}/>
                : (profile?.full_name?.[0] || <Stethoscope size={26}/>)}
            </div>
          </div>
          <div style={{paddingBottom:4}}>
            <h1 style={{fontSize:19,fontWeight:800,color:'var(--tx1)',marginBottom:3}}>{profile?.full_name||'مستخدم'}</h1>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span style={{fontSize:12,color:'var(--tx3)'}}>{profile?.email}</span>
              <span className={`badge ${roleBadge}`} style={{fontSize:10}}>{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,background:'var(--surface2)',borderRadius:10,padding:4}}>
        {[['info','المعلومات الشخصية'],['password','تغيير كلمة المرور']].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v as any)}
            style={{flex:1,padding:'8px 0',borderRadius:7,border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:700,
              background:tab===v?'var(--surface)':'transparent',
              color:tab===v?'var(--tx1)':'var(--tx3)',
              boxShadow:tab===v?'var(--sh1)':'none',transition:'all .15s'}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'info' ? (
        <div className="card" style={{padding:'24px 28px'}}>
          <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:18}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:18}}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:13,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:2}}>المعلومات الشخصية</h3>
                <Input label="الاسم الكامل" value={profile?.full_name||''} leftIcon={<User size={14}/>}
                  onChange={e=>setProfile((p:any)=>({...p,full_name:e.target.value}))}/>
                <Input label="التخصص / المسمى الوظيفي" placeholder="طالب طب..." leftIcon={<Briefcase size={14}/>}
                  value={profile?.headline||''} onChange={e=>setProfile((p:any)=>({...p,headline:e.target.value}))}/>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:6,color:'var(--tx3)'}}>نبذة شخصية</label>
                  <textarea className="inp" style={{minHeight:90,resize:'vertical'}} placeholder="اكتب نبذة عن نفسك..."
                    value={profile?.bio||''} onChange={e=>setProfile((p:any)=>({...p,bio:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <h3 style={{fontSize:13,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:2}}>الروابط</h3>
                <Input label="الموقع الشخصي" placeholder="https://..." dir="ltr" leftIcon={<Globe size={14}/>}
                  value={profile?.website||''} onChange={e=>setProfile((p:any)=>({...p,website:e.target.value}))}/>
                <Input label="تويتر / X" placeholder="https://twitter.com/..." dir="ltr" leftIcon={<Twitter size={14}/>}
                  value={profile?.twitter||''} onChange={e=>setProfile((p:any)=>({...p,twitter:e.target.value}))}/>
                <Input label="لينكد إن" placeholder="https://linkedin.com/in/..." dir="ltr" leftIcon={<Linkedin size={14}/>}
                  value={profile?.linkedin||''} onChange={e=>setProfile((p:any)=>({...p,linkedin:e.target.value}))}/>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:16,borderTop:'1px solid var(--brd)'}}>
              {msg ? (
                <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:8,background:msg.type==='ok'?'var(--ok-bg)':'var(--err-bg)'}}>
                  {msg.type==='ok'?<CheckCircle size={13} style={{color:'var(--ok)'}}/>:<AlertCircle size={13} style={{color:'var(--err)'}}/>}
                  <span style={{fontSize:13,fontWeight:600,color:msg.type==='ok'?'var(--ok)':'var(--err)'}}>{msg.text}</span>
                </div>
              ) : <span/>}
              <button type="submit" disabled={saving} className="btn-register btn-md" style={{padding:'10px 24px'}}>
                {saving?<><Loader2 size={14} className="spin"/>حفظ...</>:<><Save size={14}/>حفظ التغييرات</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card" style={{padding:'24px 28px',maxWidth:440}}>
          <h3 style={{fontSize:14,fontWeight:800,color:'var(--tx1)',marginBottom:18,display:'flex',alignItems:'center',gap:7}}>
            <Lock size={15} style={{color:'var(--alpha-green)'}}/>تغيير كلمة المرور
          </h3>
          <form onSubmit={handlePassword} style={{display:'flex',flexDirection:'column',gap:14}}>
            <Input label="كلمة المرور الجديدة" type={showPw?'text':'password'} dir="ltr"
              value={pwForm.next} onChange={e=>setPwForm(p=>({...p,next:e.target.value}))}
              leftIcon={<Lock size={14}/>} required/>
            <Input label="تأكيد كلمة المرور" type={showPw?'text':'password'} dir="ltr"
              value={pwForm.confirm} onChange={e=>setPwForm(p=>({...p,confirm:e.target.value}))}
              leftIcon={<Lock size={14}/>} required/>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--tx3)',cursor:'pointer'}}>
              <input type="checkbox" checked={showPw} onChange={e=>setShowPw(e.target.checked)} style={{width:14,height:14}}/>
              إظهار كلمة المرور
            </label>
            {pwMsg && (
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'8px 12px',borderRadius:8,background:pwMsg.type==='ok'?'var(--ok-bg)':'var(--err-bg)'}}>
                {pwMsg.type==='ok'?<CheckCircle size={13} style={{color:'var(--ok)'}}/>:<AlertCircle size={13} style={{color:'var(--err)'}}/>}
                <span style={{fontSize:12,fontWeight:600,color:pwMsg.type==='ok'?'var(--ok)':'var(--err)'}}>{pwMsg.text}</span>
              </div>
            )}
            <button type="submit" disabled={pwSaving} className="btn-register btn-full" style={{justifyContent:'center',padding:'10px 0',marginTop:4}}>
              {pwSaving?<><Loader2 size={14} className="spin"/>جاري التغيير...</>:<><Lock size={14}/>تغيير كلمة المرور</>}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
