'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Users, Video, DollarSign, Award, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalCertificates: 0
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: pData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(pData)

      if (pData?.role !== 'admin') {
        window.location.href = '/dashboard/student'
        return
      }

      // Fetch basic stats
      const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
      const { count: certsCount } = await supabase.from('certificates').select('*', { count: 'exact', head: true })
      
      // Calculate revenue (approximate from enrollments)
      const { data: courses } = await supabase.from('courses').select('total_students, price')
      let totalRev = 0
      courses?.forEach(c => totalRev += (c.total_students || 0) * (c.price || 0))

      setStats({
        totalUsers: usersCount || 0,
        totalCourses: coursesCount || 0,
        totalRevenue: totalRev,
        totalCertificates: certsCount || 0
      })

      // Fetch recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (users) setRecentUsers(users)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm">مدير</span>
          نظرة عامة على المنصة
        </h1>
        <p className="text-text-secondary">مرحباً {profile?.full_name}، إليك إحصائيات منصتك الشاملة.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card border border-border hover:border-primary/50 bg-white transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary-light flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm text-text-secondary font-medium">إجمالي المستخدمين</div>
          </div>
          <div className="text-3xl font-black">{stats.totalUsers}</div>
        </div>
        
        <div className="stat-card border border-border hover:border-accent/50 bg-white transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div className="text-sm text-text-secondary font-medium">الدروس المتاحة</div>
          </div>
          <div className="text-3xl font-black">{stats.totalCourses}</div>
        </div>

        <div className="stat-card border border-border hover:border-success/50 bg-white transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-sm text-text-secondary font-medium">إجمالي الإيرادات</div>
          </div>
          <div className="text-3xl font-black">{formatPrice(stats.totalRevenue)}</div>
        </div>

        <div className="stat-card border border-border hover:border-purple-500/50 bg-white transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-sm text-text-secondary font-medium">الشهادات الممنوحة</div>
          </div>
          <div className="text-3xl font-black">{stats.totalCertificates}</div>
        </div>
      </div>

      {/* Lists row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="glass-card overflow-hidden bg-white border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-secondary">
              <Users className="w-5 h-5 text-primary" />
              أحدث المستخدمين تسجيلاً
            </h2>
            <Link href="/dashboard/admin/users" className="text-sm font-bold text-primary hover:underline">
              إدارة المستخدمين
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 border border-border transition-all">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {user.full_name || 'بدون اسم'}
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      user.role === 'teacher' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-white/5 text-text-secondary border-white/10'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">{user.email}</div>
                </div>
                <Link href="/dashboard/admin/users">
                  <button className="p-2 hover:bg-surface-3 rounded-lg text-text-muted hover:text-primary transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Tasks Placeholder */}
        <div className="glass-card overflow-hidden bg-white border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-2 text-secondary">
              <Award className="w-5 h-5 text-accent" />
              المهام الإدارية
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-text-secondary">التراخيص والدورات المطلوبة المراجعة ستظهر هنا.</p>
            <div className="w-full text-center p-8 bg-surface-2 border border-dashed border-border rounded-2xl text-text-muted">
              لا توجد مهام معلقة
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
