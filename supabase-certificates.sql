-- جدول الشهادات
-- انسخ هذا SQL وشغّله في Supabase SQL Editor

CREATE TABLE IF NOT EXISTS certificates (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id          uuid REFERENCES courses(id)  ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  student_name       text NOT NULL,
  course_title       text NOT NULL,
  teacher_name       text DEFAULT 'منصة تعلّم الطبية',
  issued_at          timestamptz DEFAULT now(),
  created_at         timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_read_own_certs"
  ON certificates FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "service_insert_certs"
  ON certificates FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ملاحظة: أضف هذا الـ webhook في Supabase:
-- Dashboard > Authentication > Hooks > Send Email Hook
-- URL: https://mansh-eta.vercel.app/api/webhooks/new-user
-- Events: user.created
