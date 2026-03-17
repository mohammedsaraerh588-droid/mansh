'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Users, Search, Loader2 } from 'lucide-react'

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  const fetchUsers = async () => {
    setLoading(true)
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    const { data:p } = await supabase.from('profiles').select('role').eq('id',session.user.id).single()
    if (p?.role!=='admin') { router.push('/dashboard/student'); return }
    const { data } = await supabase.from('profiles').select('*').order('created_at',{ascending:false})
    if (data) setUsers(data); setLoading(false)
  }

  useEffect(()=>{ fetchUsers() },[])

  const changeRole = async (id:string, role:string) => {
    if (!confirm(`تغيير الصلاحية إلى ${role === 'teacher'?'معلم':role==='admin'?'مدير':'طالب'}؟`)) return
    setUsers(u=>u.map(x=>x.id===id?{...x,role}:x))
    const { error } = await supabase.from('profiles').update({role}).eq('id',id)
    if (error) { alert('حدث خطأ.'); fetchUsers() }
  }

  const filtered = users.filter(u=>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const roleLabel = (r:string) => r==='admin'?'مدير':r==='teacher'?'معلم':'طالب'
  const roleBadge = (r:string) => r==='admin'?'badge-red':r==='teacher'?'badge-dark':'badge-gray'

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--gold)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <div>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--gold)',marginBottom:5}}>إدارة النظام</p>
        <h1 style={{fontSize:26,fontWeight:900,color:'var(--txt1)',marginBottom:4,display:'flex',alignItems:'center',gap:10}}>
          <Users size={22} style={{color:'var(--gold)'}}/>إدارة المستخدمين
        </h1>
        <p style={{fontSize:14,color:'var(--txt2)'}}>ترقية الطلاب إلى معلمين أو تغيير الصلاحيات.</p>
      </div>

      {/* Search */}
      <div className="card" style={{padding:20}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',display:'flex'}}>
            <Search size={15}/>
          </span>
          <input className="inp" style={{paddingRight:40}} placeholder="ابحث بالاسم أو البريد..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{overflow:'hidden'}}>
        <table className="tbl">
          <thead><tr>
            <th>المستخدم</th><th>البريد الإلكتروني</th>
            <th style={{textAlign:'center'}}>الصلاحية</th><th style={{textAlign:'center'}}>تغيير</th>
          </tr></thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={4} style={{textAlign:'center',padding:32,color:'var(--txt3)'}}>لا يوجد مستخدمون مطابقون</td></tr>
            ) : filtered.map(u=>(
              <tr key={u.id}>
                <td style={{fontWeight:700}}>{u.full_name||'بدون اسم'}</td>
                <td style={{color:'var(--txt2)',fontSize:13}}>{u.email}</td>
                <td style={{textAlign:'center'}}>
                  <span className={`badge ${roleBadge(u.role)}`}>{roleLabel(u.role)}</span>
                </td>
                <td style={{textAlign:'center'}}>
                  <select className="inp" style={{width:'auto',padding:'6px 10px',fontSize:13}}
                    value={u.role} onChange={e=>changeRole(u.id,e.target.value)}>
                    <option value="student">طالب</option>
                    <option value="teacher">معلم</option>
                    <option value="admin">مدير</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
