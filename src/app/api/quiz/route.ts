import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// GET /api/quiz?lessonId=xxx  — جلب أسئلة الاختبار
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get('lessonId')
  if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // جلب الأسئلة مع الخيارات (بدون الإجابة الصحيحة للطالب)
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id,question,option_a,option_b,option_c,option_d,points,order_num')
    .eq('lesson_id', lessonId)
    .order('order_num', { ascending: true })

  // جلب محاولة سابقة للطالب
  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('id,score,total_points,passed,answers,completed_at')
    .eq('student_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  // لوحة الصدارة (أعلى 10 نتائج)
  const { data: leaderboard } = await supabase
    .from('quiz_attempts')
    .select('score,total_points,profiles(full_name)')
    .eq('lesson_id', lessonId)
    .eq('passed', true)
    .order('score', { ascending: false })
    .limit(10)

  return NextResponse.json({
    questions: questions || [],
    previousAttempt: attempt || null,
    leaderboard: leaderboard || [],
  })
}

// POST /api/quiz — تسليم الإجابات
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, answers } = await req.json()
  // answers: { questionId: 'a' | 'b' | 'c' | 'd' }

  // جلب الأسئلة مع الإجابات الصحيحة
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id,correct_answer,points')
    .eq('lesson_id', lessonId)

  if (!questions?.length) return NextResponse.json({ error: 'No questions' }, { status: 404 })

  let score = 0
  let totalPoints = 0
  const result: Record<string, boolean> = {}

  questions.forEach(q => {
    totalPoints += q.points || 1
    const isCorrect = answers[q.id] === q.correct_answer
    if (isCorrect) score += q.points || 1
    result[q.id] = isCorrect
  })

  const passed = totalPoints > 0 ? (score / totalPoints) >= 0.5 : false

  // حفظ المحاولة
  const { data: attempt } = await supabase.from('quiz_attempts').insert({
    student_id:   session.user.id,
    lesson_id:    lessonId,
    score,
    total_points: totalPoints,
    passed,
    answers,
    completed_at: new Date().toISOString(),
  }).select().single()

  return NextResponse.json({ score, totalPoints, passed, result, attemptId: attempt?.id })
}
