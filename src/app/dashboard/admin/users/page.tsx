'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Users, Search, Target, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Verify Admin
    const { data: pData } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    
    if (pData?.role !== 'admin') {
      router.push('/dashboard/student')
      return
    }
    setIsAdmin(true)

    // Fetch all users
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (data) setUsers(data)
    setLoading(false)
  }

  const changeUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`هل أنت متأكد من تغيير صلاحية هذا المستخدم إلى ${newRole}؟`)) return

    // Optimistic Update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      alert('حدث خطأ أثناء تغيير الصلاحية.')
      fetchUsers() // revert
    }
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(search.toLowerCase()) || 
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  if (!isAdmin) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin">
            <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              إدارة المستخدمين والصلاحيات
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              يمكنك من خلال هذه الصفحة ترقية الطلاب إلى معلمين أو العكس.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card bg-white border border-border p-6 rounded-xl">
        {/* Search */}
        <div className="flex items-center gap-4 mb-6 relative">
          <Search className="w-5 h-5 text-text-muted absolute right-4" />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو البريد الإلكتروني..." 
            className="w-full pl-4 pr-12 py-3 bg-surface border border-border rounded-lg outline-none focus:border-primary transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-surface-2 border-b border-border">
                <th className="text-right py-3 px-4 font-semibold text-text-secondary">الاسم</th>
                <th className="text-right py-3 px-4 font-semibold text-text-secondary">البريد الإلكتروني</th>
                <th className="text-center py-3 px-4 font-semibold text-text-secondary">الصلاحية الحالية</th>
                <th className="text-left py-3 px-4 font-semibold text-text-secondary">تغيير الصلاحية</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-text-muted">
                    لا يوجد مستخدمين مطابقين للبحث
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-surface transition-colors">
                    <td className="py-3 px-4 font-bold">{user.full_name || 'بدون اسم'}</td>
                    <td className="py-3 px-4 text-text-secondary">{user.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${
                        user.role === 'admin' ? 'badge-error' :
                        user.role === 'teacher' ? 'bg-primary-light text-primary-dark border-primary/20 border' :
                        'badge-gray'
                      }`}>
                        {user.role === 'admin' ? 'مدير المنصة' : user.role === 'teacher' ? 'معلم' : 'طالب'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                       <select 
                          className="px-3 py-1.5 bg-surface border border-border rounded-md text-sm outline-none cursor-pointer"
                          value={user.role}
                          onChange={(e) => changeUserRole(user.id, e.target.value)}
                        >
                          <option value="student">طالب</option>
                          <option value="teacher">معلم</option>
                          <option value="admin">مدير المنصة</option>
                       </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
