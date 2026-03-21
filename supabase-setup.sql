-- ═══════════════════════════════════════════════════════
-- منصة تعلّم الطبية — SQL Setup Script
-- شغّل هذا في Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- ══ 1. الشهادات ══════════════════════════════════════
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
CREATE POLICY "students_own_certs" ON certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "insert_own_certs"   ON certificates FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ══ 2. تقييمات الدورات ═══════════════════════════════
CREATE TABLE IF NOT EXISTS course_reviews (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id)  ON DELETE CASCADE,
  course_id  uuid REFERENCES courses(id)   ON DELETE CASCADE,
  rating     int  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_reviews"  ON course_reviews FOR SELECT USING (true);
CREATE POLICY "student_write_review" ON course_reviews FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "student_update_review" ON course_reviews FOR UPDATE USING (auth.uid() = student_id);

-- ══ 3. ملاحظات الدروس ════════════════════════════════
CREATE TABLE IF NOT EXISTS lesson_notes (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id    uuid REFERENCES profiles(id)  ON DELETE CASCADE,
  lesson_id     uuid REFERENCES lessons(id)   ON DELETE CASCADE,
  content       text NOT NULL,
  timestamp_sec int  DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_own_notes" ON lesson_notes FOR ALL USING (auth.uid() = student_id);

-- ══ 4. كوبونات الخصم ═════════════════════════════════
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
CREATE POLICY "public_read_coupons"   ON coupons FOR SELECT USING (true);
CREATE POLICY "teacher_manage_coupons" ON coupons FOR ALL USING (auth.uid() = created_by);

-- ══ 5. الإشعارات ══════════════════════════════════════
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
CREATE POLICY "user_own_notifs" ON notifications FOR ALL USING (auth.uid() = user_id);

-- ══ 6. المفضلة ════════════════════════════════════════
CREATE TABLE IF NOT EXISTS wishlist (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES profiles(id)  ON DELETE CASCADE,
  course_id  uuid REFERENCES courses(id)   ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_own_wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- ══ 7. تعديل جدول enrollments — إضافة amount_paid ════
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES coupons(id);

-- ══ 8. دالة increment_course_students ════════════════
CREATE OR REPLACE FUNCTION increment_course_students(course_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE courses SET total_students = COALESCE(total_students, 0) + 1 WHERE id = course_id;
END;
$$;

-- ══ 9. تلقائي — إشعار عند تسجيل في دورة ══════════════
CREATE OR REPLACE FUNCTION notify_on_enrollment()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  course_title text;
BEGIN
  SELECT title INTO course_title FROM courses WHERE id = NEW.course_id;
  INSERT INTO notifications(user_id, type, message, link)
  VALUES (NEW.student_id, 'course', 'تم تسجيلك في دورة: ' || COALESCE(course_title,''), '/dashboard/student/courses');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_enrollment ON enrollments;
CREATE TRIGGER trg_notify_enrollment
  AFTER INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION notify_on_enrollment();

-- ══ 10. تلقائي — إشعار عند إصدار شهادة ═══════════════
CREATE OR REPLACE FUNCTION notify_on_certificate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notifications(user_id, type, message, link)
  VALUES (NEW.student_id, 'certificate', 'تهانينا! حصلت على شهادة إتمام: ' || NEW.course_title, '/dashboard/student/certificates');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_notify_certificate ON certificates;
CREATE TRIGGER trg_notify_certificate
  AFTER INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION notify_on_certificate();

-- ══ الانتهاء ══════════════════════════════════════════
-- بعد تشغيل هذا السكريبت، المنصة جاهزة بالكامل!
