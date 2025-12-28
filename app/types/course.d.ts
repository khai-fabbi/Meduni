/**
 * Course Types
*/
export interface CoursesListQueryParams {
  page?: number
  limit?: number
  sort?: number
  category_id?: string
  keyword?: string
}

export interface EffectiveDuration {
  expire_time: number
  is_default: boolean
  is_unlimited: boolean
  price: number
  is_gift: boolean
}

export interface Overview {
  course_name: string
  description: string
  study_duration: string
  total_chapter: number
  total_lecture: number
  total_exercise: number
}

export interface CourseDetail {
  course_id: string
  course_name: string
  slug: string
  tag: number[]
  teacher: {
    teacher_name: string
    teacher_id: string
  }
  price: number
  total_session: number
  total_student: number
  total_buy: number
  course_status: number
  price_status: number
  created_at: string
  total_rate: number
  rate_avg: number
  category: {
    category_name: string
    category_id: string
    category_tag: string
    category_color: string
  }
  chapters: Chapter[]
  description: string
  is_vip: number
  course_image: string
  effective_duration: EffectiveDuration[]
  program_type: number
  is_favorite: boolean
  benefit_note: string
  target_note: string
  thumbnail: {
    is_default: boolean
    path: string
  }[]
  video_path: string
  category_id: string
  category_name: string
  category_color: string
  is_installment: boolean
  is_special_coach: boolean
  has_multiple_tabs: boolean
  info: CourseDetailInfo

  // if isOwned
  my_course_id?: string
}

export interface ChapterExercise {
  exercise_id: string
  exercise_name: string
  exercise_order: number
}

export interface Chapter {
  chapter_order: number
  chapter_exercises: ChapterExercise[]
  chapter_name: string
  chapter_id: string
  lessons: Lesson[]
}

export type LessonExercise = ChapterExercise
export interface Lesson {
  lesson_order: number
  lesson_name: string
  exercises: LessonExercise[]
  lesson_type: number
  lesson_duration: number
  lesson_id: string
}

export interface CourseDetailInfo {
  total_chapter: number
  total_lesson: number
  total_exercise: number
  total_duration: number
}

export interface Course {
  course_id: string
  course_name: string
  slug: string
  tag: number[]
  price: number
  total_session: number
  total_student: number
  total_buy: number
  course_status: number
  price_status: number
  created_at: string
  total_rate: number
  rate_avg: number
  description: string
  is_vip: number
  course_image: string
  effective_duration?: EffectiveDuration[]
  program_type: number
  teacher_name: string
  overview: Overview
  category_id: string
  category_name: string
  category_color: string
}

export interface Page {
  page_number: number
  page_size: number
  page_count: number
  total_records: number
}

export interface CoursesList {
  data: Course[]
  page: Page
}

export interface CourseDetailResponse {
  data: CourseDetail[]
  page: Page
}

export interface Certificate {
  user_name: string
  course_name: string
  program_type: string
  completed_at: string | null
  course_id: string
  category_id: string
}

export interface CertificateListItem {
  my_course_id: string
  course_name: string
  completion_date: string
  progress: number
}

export interface CourseCategory {
  category_color: string
  category_id: string
  category_name: string
  category_name_normalize: string
  category_tag: string
  created_at: string
  created_by: string
  parent_id: string
  slug: string
  total_course: number
  updated_at: string
  updated_by: string
}

export interface MyCourseInfo {
  total_chapter?: number
  total_lesson?: number
  total_exercise?: number
  total_duration?: number
}

export interface MyCourse {
  id: string
  course_id: string
  course_name: string
  teacher_name?: string
  course_image: string
  progress: number
  last_time?: string
  expire_time?: number
  info?: MyCourseInfo
}

export interface MyCourseListResponse {
  data: MyCourse[]
  page: Page
}

export interface LessonDetail {
  lesson_id: string
  lesson_name: string
  description: string
  course_id: string
  chapter_id: string
  lesson_path: string
  lesson_duration: number
  lesson_size: number
  file_name: string
  lesson_type: number
  teacher_name: string
  outstanding_quote: string
  lesson_order: number
  is_locked: boolean
  lesson_material: unknown[]
}
