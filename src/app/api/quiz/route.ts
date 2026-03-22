import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { isRateLimited, getIP } from '@/lib/rateLimit'

export async function GET(req: Request) {
  try {
  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get('lessonId')
  if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id,question,option_a,option_b,option_c,option_d,points,position,order_num')
    .eq('lesson_id', lessonId)
    .order('position', { ascending: true })

  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('id,score,total_points,passed,completed_at')
    .eq('student_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: leaderboard } = await supabase
    .from('quiz_attempts')
    .select('score,total_points,profiles(full_name)')
    .eq('lesson_id', lessonId)
    .eq('passed', true)
    .order('score', { ascending: false })
    .limit(10)

  return NextResponse.json({ questions: questions||[], previousAttempt: attempt||null, leaderboard: leaderboard||[] })  } catch (err: unknown) {
    console.error('[QUIZ_GET]', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
  if (isRateLimited(getIP(req), { limit: 15, window: 60 })) {
    return NextResponse.json({ error: 'محاولات كثيرة، انتظر قليلاً.' }, { status: 429 })
  }
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId, answers } = await req.json()
  if (!lessonId?.trim() || !answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })
  }
  const { data: questions } = await supabase
    .from('quiz_questions').select('id,correct_option,points').eq('lesson_id', lessonId)

  if (!questions?.length) return NextResponse.json({ error: 'No questions' }, { status: 404 })

  let score = 0, totalPoints = 0
  const result: Record<string, boolean> = {}
  questions.forEach(q => {
    totalPoints += q.points || 1
    const correctLetter = (q.correct_option || 'option_a').replace('option_', '')
    const isCorrect = answers[q.id] === correctLetter
    if (isCorrect) score += q.points || 1
    result[q.id] = isCorrect
  })

  const passed = totalPoints > 0 ? (score / totalPoints) >= 0.5 : false
  const { data: attempt } = await supabase.from('quiz_attempts').insert({
    student_id: session.user.id, lesson_id: lessonId,
    score, total_points: totalPoints, passed, answers,
    completed_at: new Date().toISOString(),
  }).select().single()

  return NextResponse.json({ score, totalPoints, passed, result, attemptId: attempt?.id })  } catch (err: unknown) {
    console.error('[QUIZ_POST]', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
