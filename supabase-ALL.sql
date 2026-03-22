-- ═══════════════════════════════════════════════════════════════
-- منصة تعلّم الطبية — SQL كامل لتشغيله في Supabase SQL Editor
-- شغّل هذا الملف كاملاً دفعة واحدة
-- ═══════════════════════════════════════════════════════════════

-- ══ 1. الشهادات ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS certificates (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id          uuid REFERENCES courses(id)  ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  student_name       text NOT NULL,
  course_title       text NOT NULL,
  teacher_name       text DEFAULT 'منصة تعلّم الطبية',
  issued_at          timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "students_own_certs" ON certificates;
DROP POLICY IF EXISTS "insert_own_certs"   ON certificates;
CREATE POLICY "students_own_certs" ON certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "insert_own_certs"   ON certificates FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ══ 2. تقييمات الدورات ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS course_reviews (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id  uuid REFERENCES courses(id)  ON DELETE CASCADE,
  rating     int  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_reviews"   ON course_reviews;
DROP POLICY IF EXISTS "student_write_review"  ON course_reviews;
DROP POLICY IF EXISTS "student_update_review" ON course_reviews;
CREATE POLICY "public_read_reviews"   ON course_reviews FOR SELECT USING (true);
CREATE POLICY "student_write_review"  ON course_reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "student_update_review" ON course_reviews FOR UPDATE USING (auth.uid() = student_id);

-- ══ 3. ملاحظات الدروس ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lesson_notes (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id     uuid REFERENCES lessons(id)  ON DELETE CASCADE,
  content       text NOT NULL,
  timestamp_sec int  DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "student_own_notes" ON lesson_notes;
CREATE POLICY "student_own_notes" ON lesson_notes FOR ALL USING (auth.uid() = student_id);

-- ══ 4. كوبونات الخصم ═════════════════════════════════════════
CREATE TABLE IF NOT EXISTS coupons (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code             text UNIQUE NOT NULL,
  discount_percent int  NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  is_active        bool DEFAULT true,
  max_uses         int,
  used_count       int  DEFAULT 0,
  expires_at       timestamptz,
  course_id        uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_by       uuid REFERENCES profiles(id),
  created_at       timestamptz DEFAULT now()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_coupons"    ON coupons;
DROP POLICY IF EXISTS "teacher_manage_coupons" ON coupons;
CREATE POLICY "public_read_coupons"    ON coupons FOR SELECT USING (true);
CREATE POLICY "teacher_manage_coupons" ON coupons FOR ALL   USING (auth.uid() = created_by);

-- ══ 5. الإشعارات ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type       text DEFAULT 'info',
  message    text NOT NULL,
  link       text,
  is_read    bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_own_notifs" ON notifications;
CREATE POLICY "user_own_notifs" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ══ 6. المفضلة ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS wishlist (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id  uuid REFERENCES courses(id)  ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_own_wishlist" ON wishlist;
CREATE POLICY "user_own_wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- ══ 7. المدونة ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  slug         text UNIQUE NOT NULL,
  excerpt      text,
  content      text,
  cover_image  text,
  author_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category     text,
  tags         text[],
  published    bool DEFAULT false,
  published_at timestamptz,
  read_time    int  DEFAULT 5,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_posts"   ON blog_posts;
DROP POLICY IF EXISTS "author_manage_posts" ON blog_posts;
CREATE POLICY "public_read_posts"   ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "author_manage_posts" ON blog_posts FOR ALL   USING (auth.uid() = author_id);

-- ══ 8. رسائل التواصل ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text,
  message    text NOT NULL,
  is_read    bool DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_messages" ON contact_messages;
DROP POLICY IF EXISTS "anyone_insert"       ON contact_messages;
CREATE POLICY "admin_read_messages" ON contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "anyone_insert" ON contact_messages FOR INSERT WITH CHECK (true);

-- ══ 9. تقدم الدروس ════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lesson_progress (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id   uuid REFERENCES profiles(id)  ON DELETE CASCADE,
  course_id    uuid REFERENCES courses(id)   ON DELETE CASCADE,
  lesson_id    uuid REFERENCES lessons(id)   ON DELETE CASCADE,
  is_completed bool DEFAULT false,
  completed_at timestamptz,
  UNIQUE(student_id, lesson_id)
);
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "student_own_progress" ON lesson_progress;
CREATE POLICY "student_own_progress" ON lesson_progress FOR ALL USING (auth.uid() = student_id);

-- ══ 10. محاولات الاختبارات ════════════════════════════════════
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id    uuid REFERENCES lessons(id)  ON DELETE CASCADE,
  score        int  DEFAULT 0,
  total_points int  DEFAULT 0,
  passed       bool DEFAULT false,
  answers      jsonb,
  completed_at timestamptz DEFAULT now()
);
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "student_own_attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "public_read_attempts" ON quiz_attempts;
CREATE POLICY "student_own_attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "public_read_attempts" ON quiz_attempts FOR SELECT USING (true);

-- ══ 11. أعمدة إضافية في enrollments ══════════════════════════
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS amount_paid      numeric DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS coupon_id        uuid REFERENCES coupons(id);
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress_percentage int DEFAULT 0;

-- ══ 12. دالة increment_course_students ════════════════════════
CREATE OR REPLACE FUNCTION increment_course_students(course_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE courses
  SET total_students = COALESCE(total_students, 0) + 1
  WHERE id = course_id;
END;
$$;

-- ══ 13. Trigger — إشعار عند التسجيل ══════════════════════════
CREATE OR REPLACE FUNCTION notify_on_enrollment()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_title text;
BEGIN
  SELECT title INTO v_title FROM courses WHERE id = NEW.course_id;
  INSERT INTO notifications(user_id, type, message, link)
  VALUES (NEW.student_id, 'course',
          'تم تسجيلك في دورة: ' || COALESCE(v_title,''),
          '/dashboard/student/courses');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_enrollment ON enrollments;
CREATE TRIGGER trg_notify_enrollment
  AFTER INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION notify_on_enrollment();

-- ══ 14. Trigger — إشعار عند إصدار شهادة ═══════════════════════
CREATE OR REPLACE FUNCTION notify_on_certificate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notifications(user_id, type, message, link)
  VALUES (NEW.student_id, 'certificate',
          'تهانينا! حصلت على شهادة إتمام: ' || NEW.course_title,
          '/dashboard/student/certificates');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_certificate ON certificates;
CREATE TRIGGER trg_notify_certificate
  AFTER INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION notify_on_certificate();

-- ══ الانتهاء ═══════════════════════════════════════════════════
-- ✅ تم إنشاء جميع الجداول والـ Triggers
-- المنصة جاهزة بالكامل!
