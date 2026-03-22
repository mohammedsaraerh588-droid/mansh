-- جدول المدونة
CREATE TABLE IF NOT EXISTS blog_posts (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title         text NOT NULL,
  slug          text UNIQUE NOT NULL,
  excerpt       text,
  content       text,
  cover_image   text,
  author_id     uuid REFERENCES profiles(id) ON DELETE SET NULL,
  category      text,
  tags          text[],
  published     bool DEFAULT false,
  published_at  timestamptz,
  read_time     int DEFAULT 5,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_posts" ON blog_posts;
DROP POLICY IF EXISTS "author_manage_posts" ON blog_posts;
CREATE POLICY "public_read_posts"   ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "author_manage_posts" ON blog_posts FOR ALL   USING (auth.uid() = author_id);

-- إضافة علاقة author في الـ query
-- profiles يحتوي بالفعل على full_name و avatar_url
