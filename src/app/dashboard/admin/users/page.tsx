'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Users, Search, Loader2, Trash2, ShieldCheck, UserCheck } from 'lucide-react'

export default function AdminUsersPage() {
  const [users,    setUsers]    = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string|null>(null)
  const router   = useRouter()
  const supabase = createSupabaseBrowserClient()

  const fetchUsers = async () => {
    setLoading(true)
    const { data:{ session } } = await supabase.auth.getSession()
    if (!session) return
    const { data:p } = await supabase.from('profiles').select('role').eq('id',session.user.id).single()
    if (p?.role!=='admin') { router.push('/dashboard/student'); return }
    const { data } = await supabase.from('profiles').select('*').order('created_at',{ascending:false})
    if (data) setUsers(data)
    setLoading(false)
  }
  useEffect(()=>{ fetchUsers() },[])

  const changeRole = async (id:string, role:string) => {
    if (!confirm(`تغيير الصلاحية إلى "${roleLabel(role)}"؟`)) return
    setUsers(u=>u.map(x=>x.id===id?{...x,role}:x))
    const { error } = await supabase.from('profiles').update({role}).eq('id',id)
    if (error) { alert('حدث خطأ.'); fetchUsers() }
  }

  const deleteUser = async (id:string, name:string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟\nهذا الإجراء لا يمكن التراجع عنه.`)) return
    setDeleting(id)
    await supabase.from('profiles').delete().eq('id',id)
    setUsers(u=>u.filter(x=>x.id!==id))
    setDeleting(null)
  }

  const roleLabel = (r:string) => r==='admin'?'مدير':r==='teacher'?'معلم':'طالب'
  const roleBadge = (r:string) => r==='admin'?'badge-red':r==='teacher'?'badge-teal':'badge-gray'

  const filtered = users.filter(u=>
    u.email?.toLowerCase().includes(search.toLowerCase())||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}><Loader2 size={30} className="spin" style={{color:'var(--teal)'}}/></div>

  return (
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
      <div>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--alpha-green)',marginBottom:4}}>الإدارة</p>
        <h1 style={{fontSize:24,fontWeight:900,color:'var(--tx1)',marginBottom:4,display:'flex',alignItems:'center',gap:10}}>
          <Users size={20} style={{color:'var(--alpha-green)'}}/>إدارة المستخدمين
        </h1>
        <p style={{fontSize:14,color:'var(--tx3)'}}>{users.length} مستخدم — غيّر الصلاحية لأي مستخدم لتعيينه معلماً أو مديراً</p>
      </div>

      {/* Quick tip */}
      <div style={{background:'var(--alpha-green-l)',border:'1px solid var(--alpha-green-m)',borderRadius:10,padding:'12px 16px',fontSize:13,color:'var(--alpha-green-2)',display:'flex',alignItems:'center',gap:8}}>
        <UserCheck size={15}/>
        <span>لتعيين معلم جديد: ابحث عنه → غيّر الصلاحية من القائمة المنسدلة إلى <strong>معلم</strong></span>
      </div>

      {/* Search */}
      <div className="card" style={{padding:16}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',display:'flex'}}><Search size={15}/></span>
          <input className="inp" style={{paddingRight:40}} placeholder="ابحث بالاسم أو البريد..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{overflow:'hidden'}}>
        <table className="tbl">
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th style={{textAlign:'center'}}>الصلاحية</th>
              <th style={{textAlign:'center'}}>تغيير</th>
              <th style={{textAlign:'center'}}>حذف</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={5} style={{textAlign:'center',padding:32,color:'var(--txt3)'}}>لا يوجد مستخدمون مطابقون</td></tr>
            ) : filtered.map(u=>(
              <tr key={u.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:'var(--teal)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,color:'#fff',flexShrink:0}}>
                      {u.full_name?.[0]||'؟'}
                    </div>
                    <span style={{fontWeight:700}}>{u.full_name||'بدون اسم'}</span>
                  </div>
                </td>
                <td style={{color:'var(--txt2)',fontSize:13}}>{u.email}</td>
                <td style={{textAlign:'center'}}>
                  <span className={`badge ${roleBadge(u.role)}`}>{roleLabel(u.role)}</span>
                </td>
                <td style={{textAlign:'center'}}>
                  <select className="inp" style={{width:'auto',padding:'5px 10px',fontSize:12}}
                    value={u.role} onChange={e=>changeRole(u.id,e.target.value)}>
                    <option value="student">طالب</option>
                    <option value="teacher">معلم</option>
                    <option value="admin">مدير</option>
                  </select>
                </td>
                <td style={{textAlign:'center'}}>
                  <button onClick={()=>deleteUser(u.id,u.full_name||u.email)}
                    disabled={deleting===u.id || u.role==='admin'}
                    className="btn btn-sm btn-danger"
                    title={u.role==='admin'?'لا يمكن حذف المدير':'حذف المستخدم'}>
                    {deleting===u.id ? <Loader2 size={13} className="spin"/> : <Trash2 size={13}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
