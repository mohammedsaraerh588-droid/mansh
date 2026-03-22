-- ═══════════════════════════════════════════════════════════
-- إصلاح سياسات RLS لجدول profiles
-- شغّل هذا في Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- إزالة السياسات القديمة
DROP POLICY IF EXISTS "Users can view own profile"    ON profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles"   ON profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable"  ON profiles;
DROP POLICY IF EXISTS "profiles_select"               ON profiles;
DROP POLICY IF EXISTS "profiles_update"               ON profiles;
DROP POLICY IF EXISTS "profiles_insert"               ON profiles;

-- تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 1. أي مستخدم يرى ملفه الشخصي
CREATE POLICY "own_profile_select"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. المدير يرى جميع الملفات الشخصية
CREATE POLICY "admin_profiles_select"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. المستخدم يُحدّث ملفه الشخصي (ما عدا الـ role)
CREATE POLICY "own_profile_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Service Role يتجاوز كل السياسات (تلقائي في Supabase)
-- لا تحتاج سياسة خاصة — createSupabaseAdminClient يستخدم service_role

-- ═══════════════════════════════════════════════════════════
-- تحقق من السياسات الحالية
-- ═══════════════════════════════════════════════════════════
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
