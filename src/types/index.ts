export type UserRole = 'student' | 'teacher' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  bio: string | null
  headline: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  total_students: number
  total_courses: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  name_ar: string
  slug: string
  icon: string | null
  color: string
  courses_count: number
  created_at: string
}

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all'
export type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived'

export interface Course {
  id: string
  teacher_id: string
  category_id: string | null
  title: string
  title_ar: string | null
  slug: string
  description: string | null
  short_description: string | null
  thumbnail_url: string | null
  price: number
  currency: string
  original_price: number | null
  level: CourseLevel
  language: string
  duration_hours: number
  total_lessons: number
  total_students: number
  avg_rating: number
  total_reviews: number
  status: CourseStatus
  is_featured: boolean
  requirements: string[] | null
  what_you_learn: string[] | null
  tags: string[] | null
  certificate_enabled: boolean
  created_at: string
  updated_at: string
  // Joined fields
  teacher?: Profile
  category?: Category
}

export interface Module {
  id: string
  course_id: string
  title: string
  description: string | null
  position: number
  lessons_count: number
  created_at: string
  // Joined
  lessons?: Lesson[]
}

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment' | 'resource'

export interface Lesson {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string | null
  type: LessonType
  content: string | null
  video_url: string | null
  cloudinary_public_id: string | null
  video_duration: number
  position: number
  is_preview: boolean
  resources: Resource[]
  created_at: string
  updated_at: string
}

export interface Resource {
  name: string
  url: string
  type: string
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'free'

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  payment_id: string | null
  stripe_session_id: string | null
  payment_status: PaymentStatus
  amount_paid: number
  currency: string
  progress_percentage: number
  completed_at: string | null
  enrolled_at: string
  // Joined
  course?: Course
  student?: Profile
}

export interface LessonProgress {
  id: string
  student_id: string
  lesson_id: string
  course_id: string
  is_completed: boolean
  watch_time: number
  completed_at: string | null
  created_at: string
}

export interface Quiz {
  id: string
  lesson_id: string
  course_id: string
  title: string
  description: string | null
  pass_mark: number
  time_limit: number | null
  max_attempts: number
  shuffle_questions: boolean
  created_at: string
  // Joined
  questions?: QuizQuestion[]
}

export type QuestionType = 'mcq' | 'true_false' | 'short'

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  type: QuestionType
  options: string[] | null
  correct_answer: string
  explanation: string | null
  points: number
  position: number
}

export interface QuizAttempt {
  id: string
  student_id: string
  quiz_id: string
  answers: Record<string, string>
  score: number
  total_points: number
  percentage: number
  passed: boolean
  time_taken: number | null
  completed_at: string
}

export interface Payment {
  id: string
  student_id: string
  course_id: string
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  amount: number
  currency: string
  status: string
  coupon_code: string | null
  discount_amount: number
  created_at: string
  // Joined
  course?: Course
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number | null
  used_count: number
  valid_from: string
  valid_until: string | null
  applicable_to: 'all' | 'specific'
  course_ids: string[] | null
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface Certificate {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  certificate_url: string | null
  verification_code: string
  issued_at: string
  // Joined
  student?: Profile
  course?: Course
}

export interface Review {
  id: string
  student_id: string
  course_id: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  // Joined
  student?: Profile
}

export interface DashboardStats {
  total_students: number
  total_courses: number
  total_revenue: number
  total_certificates: number
  monthly_revenue: { month: string; revenue: number }[]
  top_courses: { title: string; students: number; revenue: number }[]
}
