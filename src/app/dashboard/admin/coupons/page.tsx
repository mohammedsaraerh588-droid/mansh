'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { PlusCircle, Trash2, Tag, Loader2, Copy, CheckCircle } from 'lucide-react'

export default function AdminCouponsPage() {
  const [coupons,   setCoupons]  = useState<any[]>([])
  const [courses,   setCourses]  = useState<any[]>([])
  const [loading,   setLoading]  = useState(true)
  const [saving,    setSaving]   = useState(false)
  const [copied,    setCopied]   = useState('')
  const [form, setForm] = useState({
    code:'', discount_percent:10, max_uses:'', expires_at:'', course_id:'', is_active:true
  })
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    (async () => {
      const [{ data:c }, { data:cr }] = await Promise.all([
        supabase.from('coupons').select('*,courses(title)').order('created_at',{ascending:false}),
        supabase.from('courses').select('id,title').eq('status','published').order('title'),
      ])
      setCoupons(c||[]); setCourses(cr||[]); setLoading(false)
    })()
  },[])

  const generate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    setForm(f=>({...f, code: Array.from({length:8},()=>chars[Math.floor(Math.random()*chars.length)]).join('')}))
  }

  const save = async () => {
    if (!form.code || !form.discount_percent) return
    setSaving(true)
    const { data, error } = await supabase.from('coupons').insert({
      code:             form.code.toUpperCase(),
      discount_percent: Number(form.discount_percent),
      is_active:        form.is_active,
      max_uses:         form.max_uses ? Number(form.max_uses) : null,
      expires_at:       form.expires_at || null,
      course_id:        form.course_id || null,
    }).select('*,courses(title)').single()
    if (!error && data) { setCoupons(p=>[data,...p]); setForm({code:'',discount_percent:10,max_uses:'',expires_at:'',course_id:'',is_active:true}) }
    else alert(error?.message || 'خطأ في الحفظ')
    setSaving(false)
  }

  const toggle = async (id:string, is_active:boolean) => {
    await supabase.from('coupons').update({is_active:!is_active}).eq('id',id)
    setCoupons(p=>p.map(c=>c.id===id?{...c,is_active:!is_active}:c))
  }

  const remove = async (id:string) => {
    if (!confirm('حذف هذا الكوبون؟')) return
    await supabase.from('coupons').delete().eq('id',id)
    setCoupons(p=>p.filter(c=>c.id!==id))
  }

  const copy = (code:string) => {
    navigator.clipboard.writeText(code)
    setCopied(code); setTimeout(()=>setCopied(''),2000)
  }

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={28} className="spin" style={{color:'var(--alpha-green)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>الإدارة</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',letterSpacing:'-.02em'}}>إدارة كوبونات الخصم</h1>
      </div>

      {/* New Coupon Form */}
      <div className="card" style={{padding:'22px 24px'}}>
        <h2 style={{fontSize:15,fontWeight:800,color:'var(--tx1)',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <PlusCircle size={16} style={{color:'var(--alpha-green)'}}/>إنشاء كوبون جديد
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>كود الخصم</label>
            <div style={{display:'flex',gap:6}}>
              <input value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))}
                placeholder="SAVE20" maxLength={16}
                style={{flex:1,padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:14,fontFamily:'monospace',outline:'none',direction:'ltr'}}/>
              <button onClick={generate} className="btn btn-outline btn-sm" title="توليد تلقائي">🎲</button>
            </div>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>نسبة الخصم %</label>
            <input type="number" min={1} max={100} value={form.discount_percent}
              onChange={e=>setForm(f=>({...f,discount_percent:Number(e.target.value)}))}
              style={{width:'100%',padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:14,outline:'none'}}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>الحد الأقصى للاستخدام</label>
            <input type="number" min={1} value={form.max_uses} placeholder="غير محدود"
              onChange={e=>setForm(f=>({...f,max_uses:e.target.value}))}
              style={{width:'100%',padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:14,outline:'none'}}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>تاريخ الانتهاء</label>
            <input type="date" value={form.expires_at} onChange={e=>setForm(f=>({...f,expires_at:e.target.value}))}
              style={{width:'100%',padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:14,outline:'none'}}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:700,color:'var(--tx3)',display:'block',marginBottom:5}}>خاص بدورة (اختياري)</label>
            <select value={form.course_id} onChange={e=>setForm(f=>({...f,course_id:e.target.value}))}
              style={{width:'100%',padding:'9px 12px',borderRadius:9,border:'1.5px solid var(--brd)',background:'var(--surface)',color:'var(--tx1)',fontSize:13,outline:'none'}}>
              <option value="">كل الدورات</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        </div>
        <button onClick={save} disabled={saving||!form.code} className="btn-register" style={{marginTop:16,padding:'10px 24px'}}>
          {saving?<><Loader2 size={14} className="spin"/>جاري الحفظ...</>:<><Tag size={14}/>إنشاء الكوبون</>}
        </button>
      </div>

      {/* Coupons List */}
      <div className="card" style={{overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid var(--brd)'}}>
          <h2 style={{fontSize:15,fontWeight:800,color:'var(--tx1)'}}>الكوبونات ({coupons.length})</h2>
        </div>
        {coupons.length === 0
          ? <div style={{padding:40,textAlign:'center',color:'var(--tx3)',fontSize:14}}>لا توجد كوبونات بعد</div>
          : <table className="tbl">
            <thead><tr><th>الكود</th><th>الخصم</th><th>الاستخدام</th><th>الدورة</th><th>الانتهاء</th><th>الحالة</th><th></th></tr></thead>
            <tbody>
              {coupons.map(c=>(
                <tr key={c.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontFamily:'monospace',fontWeight:700,fontSize:13,color:'var(--tx1)'}}>{c.code}</span>
                      <button onClick={()=>copy(c.code)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--tx4)',display:'flex'}}>
                        {copied===c.code?<CheckCircle size={12} style={{color:'var(--ok)'}}/>:<Copy size={12}/>}
                      </button>
                    </div>
                  </td>
                  <td><span className="badge badge-green">{c.discount_percent}%</span></td>
                  <td style={{fontSize:13}}>{c.used_count||0}{c.max_uses?` / ${c.max_uses}`:' / ∞'}</td>
                  <td style={{fontSize:12,color:'var(--tx3)'}}>{c.courses?.title||'الكل'}</td>
                  <td style={{fontSize:12,color:'var(--tx3)'}}>{c.expires_at?new Date(c.expires_at).toLocaleDateString('ar-SA'):'—'}</td>
                  <td>
                    <button onClick={()=>toggle(c.id,c.is_active)}
                      className={`badge ${c.is_active?'badge-green':'badge-gray'}`} style={{cursor:'pointer',border:'none',fontFamily:'inherit'}}>
                      {c.is_active?'فعّال':'متوقف'}
                    </button>
                  </td>
                  <td>
                    <button onClick={()=>remove(c.id)} className="btn btn-danger btn-sm"><Trash2 size={12}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>
    </div>
  )
}
