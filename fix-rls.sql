-- ============================================
-- FIX: Update RLS Policies for Lessons and Modules to allow Admins
-- Run this in Supabase SQL Editor
-- ============================================

-- Lessons Policies
DROP POLICY IF EXISTS "Preview lessons public, enrolled only for rest" ON public.lessons;
CREATE POLICY "Preview lessons public, enrolled only for rest" ON public.lessons FOR SELECT USING (
  is_preview = true OR
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = lessons.course_id AND student_id = auth.uid() AND payment_status IN ('completed', 'free')) OR
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

DROP POLICY IF EXISTS "Teachers manage own lessons" ON public.lessons;
CREATE POLICY "Teachers manage own lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Modules Policies
DROP POLICY IF EXISTS "Modules viewable by enrolled or teacher" ON public.modules;
CREATE POLICY "Modules viewable by enrolled or teacher" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (status = 'published' OR teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

DROP POLICY IF EXISTS "Teachers manage own modules" ON public.modules;
CREATE POLICY "Teachers manage own modules" ON public.modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (teacher_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
