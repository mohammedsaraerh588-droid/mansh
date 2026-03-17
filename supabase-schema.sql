-- ============================================
-- EDUCATIONAL PLATFORM - Supabase SQL Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  bio TEXT,
  headline TEXT,
  website TEXT,
  twitter TEXT,
  linkedin TEXT,
  total_students INTEGER DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  courses_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  title_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  original_price DECIMAL(10,2),
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  language TEXT DEFAULT 'ar',
  duration_hours DECIMAL(5,1) DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'rejected', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  requirements TEXT[],
  what_you_learn TEXT[],
  tags TEXT[],
  certificate_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MODULES TABLE (Course Sections)
-- ============================================
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'video' CHECK (type IN ('video', 'text', 'quiz', 'assignment', 'resource')),
  content TEXT,
  video_url TEXT,
  cloudinary_public_id TEXT,
  video_duration INTEGER DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  resources JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  payment_id TEXT,
  stripe_session_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'free')),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ============================================
-- LESSON PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  watch_time INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pass_mark INTEGER DEFAULT 70,
  time_limit INTEGER,
  max_attempts INTEGER DEFAULT 3,
  shuffle_questions BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  type TEXT DEFAULT 'mcq' CHECK (type IN ('mcq', 'true_false', 'short')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QUIZ ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  answers JSONB,
  score INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  time_taken INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  coupon_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COUPONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  applicable_to TEXT DEFAULT 'all' CHECK (applicable_to IN ('all', 'specific')),
  course_ids UUID[],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CERTIFICATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
  certificate_url TEXT,
  verification_code TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
DROP POLICY IF EXISTS "Everyone can view categories" ON public.categories;
CREATE POLICY "Everyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Courses policies
DROP POLICY IF EXISTS "Published courses viewable by all" ON public.courses;
CREATE POLICY "Published courses viewable by all" ON public.courses FOR SELECT USING (status = 'published' OR teacher_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Teachers can create courses" ON public.courses;
CREATE POLICY "Teachers can create courses" ON public.courses FOR INSERT WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can update own courses" ON public.courses;
CREATE POLICY "Teachers can update own courses" ON public.courses FOR UPDATE USING (auth.uid() = teacher_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete courses" ON public.courses;
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR teacher_id = auth.uid()
);

-- Modules policies
DROP POLICY IF EXISTS "Modules viewable by enrolled or teacher" ON public.modules;
CREATE POLICY "Modules viewable by enrolled or teacher" ON public.modules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (status = 'published' OR teacher_id = auth.uid()))
);

DROP POLICY IF EXISTS "Teachers manage own modules" ON public.modules;
CREATE POLICY "Teachers manage own modules" ON public.modules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

-- Lessons policies
DROP POLICY IF EXISTS "Preview lessons public, enrolled only for rest" ON public.lessons;
CREATE POLICY "Preview lessons public, enrolled only for rest" ON public.lessons FOR SELECT USING (
  is_preview = true OR
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = lessons.course_id AND student_id = auth.uid() AND payment_status IN ('completed', 'free')) OR
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Teachers manage own lessons" ON public.lessons;
CREATE POLICY "Teachers manage own lessons" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

-- Enrollments policies
DROP POLICY IF EXISTS "Students view own enrollments" ON public.enrollments;
CREATE POLICY "Students view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Students can enroll" ON public.enrollments;
CREATE POLICY "Students can enroll" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "System can update enrollment" ON public.enrollments;
CREATE POLICY "System can update enrollment" ON public.enrollments FOR UPDATE USING (auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lesson progress policies
DROP POLICY IF EXISTS "Students manage own progress" ON public.lesson_progress;
CREATE POLICY "Students manage own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = student_id);

-- Quiz policies
DROP POLICY IF EXISTS "Enrolled students view quizzes" ON public.quizzes;
CREATE POLICY "Enrolled students view quizzes" ON public.quizzes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = quizzes.course_id AND student_id = auth.uid() AND payment_status IN ('completed', 'free')) OR
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

DROP POLICY IF EXISTS "Teachers manage quizzes" ON public.quizzes;
CREATE POLICY "Teachers manage quizzes" ON public.quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid())
);

-- Quiz questions policies
DROP POLICY IF EXISTS "View quiz questions if can view quiz" ON public.quiz_questions;
CREATE POLICY "View quiz questions if can view quiz" ON public.quiz_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quizzes q 
    JOIN public.enrollments e ON e.course_id = q.course_id 
    WHERE q.id = quiz_id AND e.student_id = auth.uid() AND e.payment_status IN ('completed', 'free'))
  OR EXISTS (SELECT 1 FROM public.quizzes q JOIN public.courses c ON c.id = q.course_id WHERE q.id = quiz_id AND c.teacher_id = auth.uid())
);

DROP POLICY IF EXISTS "Teachers manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Teachers manage quiz questions" ON public.quiz_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.quizzes q JOIN public.courses c ON c.id = q.course_id WHERE q.id = quiz_id AND c.teacher_id = auth.uid())
);

-- Quiz attempts policies
DROP POLICY IF EXISTS "Students manage own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Students manage own quiz attempts" ON public.quiz_attempts FOR ALL USING (auth.uid() = student_id);

-- Payments policies
DROP POLICY IF EXISTS "Users view own payments" ON public.payments;
CREATE POLICY "Users view own payments" ON public.payments FOR SELECT USING (auth.uid() = student_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND teacher_id = auth.uid()));

-- Coupons policies
DROP POLICY IF EXISTS "Everyone can view active coupons" ON public.coupons;
CREATE POLICY "Everyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Teachers and admins manage coupons" ON public.coupons;
CREATE POLICY "Teachers and admins manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Certificates policies
DROP POLICY IF EXISTS "Everyone can view certificates (for verification)" ON public.certificates;
CREATE POLICY "Everyone can view certificates (for verification)" ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "System creates certificates" ON public.certificates;
CREATE POLICY "System creates certificates" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Reviews policies
DROP POLICY IF EXISTS "Everyone can view approved reviews" ON public.reviews;
CREATE POLICY "Everyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Enrolled students can review" ON public.reviews;
CREATE POLICY "Enrolled students can review" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = student_id AND
  EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = reviews.course_id AND student_id = auth.uid() AND payment_status IN ('completed', 'free'))
);

DROP POLICY IF EXISTS "Students can update own reviews" ON public.reviews;
CREATE POLICY "Students can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = student_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update course avg rating on review change
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses SET
    avg_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) AND is_approved = true),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE course_id = COALESCE(NEW.course_id, OLD.course_id) AND is_approved = true)
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_rating_on_review ON public.reviews;
CREATE TRIGGER update_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_course_rating();

-- Update enrollment progress
CREATE OR REPLACE FUNCTION public.update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_percentage INTEGER;
  v_enrollment_id UUID;
BEGIN
  SELECT COUNT(*) INTO v_total_lessons FROM public.lessons WHERE course_id = NEW.course_id;
  SELECT COUNT(*) INTO v_completed_lessons FROM public.lesson_progress WHERE course_id = NEW.course_id AND student_id = NEW.student_id AND is_completed = true;
  
  IF v_total_lessons > 0 THEN
    v_percentage := ROUND((v_completed_lessons::DECIMAL / v_total_lessons) * 100);
  ELSE
    v_percentage := 0;
  END IF;
  
  UPDATE public.enrollments SET 
    progress_percentage = v_percentage,
    completed_at = CASE WHEN v_percentage = 100 THEN NOW() ELSE NULL END
  WHERE student_id = NEW.student_id AND course_id = NEW.course_id
  RETURNING id INTO v_enrollment_id;
  
  -- Auto-create certificate on 100% completion
  IF v_percentage = 100 AND v_enrollment_id IS NOT NULL THEN
    INSERT INTO public.certificates (student_id, course_id, enrollment_id)
    VALUES (NEW.student_id, NEW.course_id, v_enrollment_id)
    ON CONFLICT (student_id, course_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_progress_on_lesson_complete ON public.lesson_progress;
CREATE TRIGGER update_progress_on_lesson_complete
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_enrollment_progress();

-- ============================================
-- SEED DATA - Categories
-- ============================================
INSERT INTO public.categories (name, name_ar, slug, icon, color) VALUES
  ('Programming', 'البرمجة', 'programming', '💻', '#6366f1'),
  ('Design', 'التصميم', 'design', '🎨', '#ec4899'),
  ('Business', 'الأعمال', 'business', '💼', '#f59e0b'),
  ('Marketing', 'التسويق', 'marketing', '📢', '#10b981'),
  ('Data Science', 'علم البيانات', 'data-science', '📊', '#3b82f6'),
  ('Languages', 'اللغات', 'languages', '🌍', '#8b5cf6'),
  ('Photography', 'التصوير', 'photography', '📷', '#ef4444'),
  ('Music', 'الموسيقى', 'music', '🎵', '#f97316'),
  ('Personal Development', 'التطوير الذاتي', 'personal-development', '🚀', '#14b8a6'),
  ('Finance', 'المالية', 'finance', '💰', '#84cc16')
ON CONFLICT DO NOTHING;
