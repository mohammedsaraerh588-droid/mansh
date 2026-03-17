'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ArrowRight, TrendingUp, DollarSign, Users, Download, FileText, Loader2 } from 'lucide-react'

interface Sale {
  id: string
  course_id: string
  student_name: string
  amount: number
  currency: string
  status: string
  created_at: string
  course_title?: string
}

interface CourseStats {
  id: string
  title: string
  total_revenue: number
  student_count: number
  currency: string
}

export default function TeacherSalesPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const [sales, setSales] = useState<Sale[]>([])
  const [courseStats, setCourseStats] = useState<CourseStats[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      // Fetch courses for this teacher
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title, price, currency')
        .eq('teacher_id', session.user.id)

      if (!courses) {
        setLoading(false)
        return
      }

      // Fetch enrollments to get sales data
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          price,
          currency,
          created_at,
          profiles(full_name)
        `)
        .in('course_id', courses.map(c => c.id))

      // Process sales data
      const processedSales: Sale[] = []
      let total = 0
      const stats: { [key: string]: CourseStats } = {}

      courses.forEach(course => {
        stats[course.id] = {
          id: course.id,
          title: course.title,
          total_revenue: 0,
          student_count: 0,
          currency: course.currency || 'USD'
        }
      })

      if (enrollments) {
        enrollments.forEach((enrollment: any) => {
          processedSales.push({
            id: enrollment.id,
            course_id: enrollment.course_id,
            student_name: enrollment.profiles?.full_name || 'Unknown',
            amount: enrollment.price || 0,
            currency: enrollment.currency || 'USD',
            status: 'completed',
            created_at: enrollment.created_at,
            course_title: courses.find(c => c.id === enrollment.course_id)?.title
          })

          // Update stats
          if (stats[enrollment.course_id]) {
            stats[enrollment.course_id].total_revenue += enrollment.price || 0
            stats[enrollment.course_id].student_count += 1
          }
          total += enrollment.price || 0
        })
      }

      setSales(processedSales)
      setCourseStats(Object.values(stats))
      setTotalRevenue(total)
      setCurrency(courses[0]?.currency || 'USD')
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sales data:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, curr: string = currency) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: curr,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/teacher">
          <Button variant="ghost" className="p-2 border border-border bg-white hover:bg-surface-2 text-text-secondary">
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            المبيعات والإيرادات
          </h1>
          <p className="text-sm text-text-secondary mt-1">عرض جميع المبيعات والإيرادات من دوراتك</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="glass-card p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">إجمالي الإيرادات</p>
              <h2 className="text-3xl font-bold mt-2 text-primary">{formatCurrency(totalRevenue)}</h2>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="glass-card p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">عدد المبيعات</p>
              <h2 className="text-3xl font-bold mt-2 text-primary">{sales.length}</h2>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <FileText className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Average Sale */}
        <div className="glass-card p-6 bg-white border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">متوسط المبيعة</p>
              <h2 className="text-3xl font-bold mt-2 text-primary">
                {formatCurrency(sales.length > 0 ? totalRevenue / sales.length : 0)}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Stats */}
      {courseStats.length > 0 && (
        <div className="glass-card p-6 bg-white border border-border">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            إحصائيات الدورات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseStats.map((stat) => (
              <div key={stat.id} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-all">
                <h3 className="font-bold text-lg mb-3">{stat.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">الإجمالي</span>
                    <span className="font-semibold text-primary">{formatCurrency(stat.total_revenue, stat.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">عدد الطلاب</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {stat.student_count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Table */}
      {sales.length > 0 ? (
        <div className="glass-card p-6 bg-white border border-border overflow-hidden">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
            <FileText className="w-5 h-5 text-primary" />
            قائمة المبيعات
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 font-bold text-text-secondary">الطالب</th>
                  <th className="text-right py-3 px-4 font-bold text-text-secondary">الدورة</th>
                  <th className="text-center py-3 px-4 font-bold text-text-secondary">المبلغ</th>
                  <th className="text-center py-3 px-4 font-bold text-text-secondary">التاريخ</th>
                  <th className="text-center py-3 px-4 font-bold text-text-secondary">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-surface-2 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium">{sale.student_name}</td>
                    <td className="py-4 px-4 text-sm">{sale.course_title}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-center text-primary">
                      {formatCurrency(sale.amount, sale.currency)}
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-text-secondary">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="badge badge-success text-xs">مكتمل</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 bg-white border border-dashed border-border text-center">
          <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-6 text-text-muted">
            <DollarSign className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا توجد مبيعات حتى الآن</h3>
          <p className="text-text-secondary mb-6">ابدأ بإنشاء دورات واحصل على طلاب للبدء في جني الأرباح</p>
          <Link href="/dashboard/teacher/courses/new">
            <Button variant="primary">إنشاء دورة جديدة</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
