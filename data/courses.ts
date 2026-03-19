export interface Course {
  id: string
  teacher_id: string
  title: string
  slug: string
  description: string
  short_description: string
  thumbnail_url: string
  price: number
  currency?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  duration_hours: number
  total_lessons: number
  total_students?: number
  avg_rating?: number
  total_reviews?: number
  status?: 'draft' | 'published'
  is_featured?: boolean
  requirements?: string[]
  what_you_learn?: string[]
  tags?: string[]
  certificate_enabled?: boolean
  created_at: string
}

const courses: Course[] = [
  {
    id: '1',
    teacher_id: 'teacher1',
    title: 'أساسيات التشريح البشري',
    slug: 'anatomy-fundamentals',
    description: 'تعلم تشريح الجسم البشري بطريقة تفاعلية وعملية',
    short_description: 'دورة شاملة تغطي جميع أنظمة الجسم البشري مع رسوم توضيحية ثلاثية الأبعاد',
    thumbnail_url: '/images/medical/anatomy.jpg',
    price: 199,
    currency: 'USD',
    level: 'beginner',
    language: 'ar',
    duration_hours: 12.5,
    total_lessons: 45,
    total_students: 1247,
    avg_rating: 4.9,
    total_reviews: 289,
    status: 'published',
    is_featured: true,
    requirements: ['لا توجد متطلبات مسبقة'],
    what_you_learn: ['تشريح جميع أجهزة الجسم', 'الرسوم التوضيحية ثلاثية الأبعاد', 'التطبيقات السريرية'],
    tags: ['تشريح', 'أساسيات', 'طبي', 'رسوم ثلاثية'],
    certificate_enabled: true,
    created_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    teacher_id: 'teacher2',
    title: 'فسيولوجيا الجهاز العصبي',
    slug: 'neurophysiology',
    description: 'فهم عميق لعمليات الجهاز العصبي',
    short_description: 'الفسيولوجيا العصبية من الأساسيات إلى التطبيقات السريرية',
    thumbnail_url: '/images/medical/brain.jpg',
    price: 0,
    level: 'intermediate',
    language: 'ar',
    duration_hours: 8.2,
    total_lessons: 32,
    total_students: 856,
    avg_rating: 4.8,
    total_reviews: 156,
    status: 'published',
    is_featured: true,
    requirements: ['أساسيات البيولوجيا', 'معرفة بالتشريح العصبي'],
    what_you_learn: ['وظائف الجهاز العصبي', 'نقل الإشارات العصبية', 'الأمراض العصبية الشائعة'],
    tags: ['فسيولوجيا', 'جهاز عصبي', 'متقدم', 'بحث'],
    certificate_enabled: true,
    created_at: '2025-02-01T14:20:00Z',
  },
  {
    id: '3',
    teacher_id: 'teacher3',
    title: 'التشخيص التفريقي في الطب الباطني',
    slug: 'differential-diagnosis',
    description: 'مهارات التشخيص التفريقي العملية',
    short_description: 'تقديم نهج منهجي للتشخيص التفريقي في أشهر الحالات السريرية',
    thumbnail_url: '/images/medical/diagnosis.jpg',
    price: 299,
    currency: 'USD',
    level: 'advanced',
    language: 'ar',
    duration_hours: 15.0,
    total_lessons: 58,
    total_students: 623,
    avg_rating: 4.7,
    total_reviews: 198,
    status: 'published',
    is_featured: false,
    requirements: ['خبرة في الطب الباطني', 'معرفة بالفحوصات'],
    what_you_learn: ['التشخيص التفريقي', 'الحالات الشائعة', 'الفحوصات التشخيصية'],
    tags: ['باطنية', 'تشخيص', 'متقدم', 'سريري'],
    certificate_enabled: true,
    created_at: '2025-03-10T09:15:00Z',
  },
]

export default courses
