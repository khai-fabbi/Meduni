import type {
  CoursesList,
  Certificate,
  CertificateListItem,
  CoursesListQueryParams,
  CourseCategory,
  CourseDetail,
  MyCourse,
  LessonDetail,
  ContentByKeywordAiResponse,
  DataContentByKeywordAiRequest,
  Chapter
} from '~/types/course'
import type { ApiResponse } from '~/types/common'
import type { Ref } from 'vue'
import type { UseFetchOptions } from '#app'

export const coursesService = {
  /**
   * Lấy danh sách khóa học
   * @param query - Query parameters
   */
  getList: (query?: CoursesListQueryParams | Ref<CoursesListQueryParams>, options?: UseFetchOptions<ApiResponse<CoursesList>>) => {
    return useApiFetch<ApiResponse<CoursesList>>(ApiEndpoint.Courses.GetList, {
      query: computed(() => {
        const queryParams = unref(query) || {}
        return {
          ...(queryParams.page && { page_number: queryParams.page }),
          ...(queryParams.limit && { page_size: queryParams.limit }),
          ...(queryParams.sort && { sort: queryParams.sort }),
          ...(queryParams.category_id && { category_id: queryParams.category_id }),
          ...(queryParams.keyword && { keyword: queryParams.keyword }),
          ...(queryParams.ignore && { ignore: queryParams.ignore })
        }
      }),
      ...options
    })
  },

  /**
   * Lấy khóa học của tôi (my courses)
   * @param query - Query parameters
   */
  getMyCourses: (
    query?: CoursesListQueryParams | Ref<CoursesListQueryParams>
  ) => {
    return useApiFetch<ApiResponse<MyCourse[]>>(
      ApiEndpoint.Courses.GetMyCourses,
      {
        query: computed(() => {
          const queryParams = unref(query) || {}
          return {
            ...(queryParams.page && { page_number: queryParams.page }),
            ...(queryParams.limit && { page_size: queryParams.limit }),
            ...(queryParams.keyword && { keyword: queryParams.keyword })
          }
        })
      }
    )
  },

  getCourseById: (courseId: string, options?: UseFetchOptions<ApiResponse<CourseDetail>>) => {
    return useApiFetch<ApiResponse<CourseDetail>>(ApiEndpoint.Courses.GetDetail(courseId), {
      method: 'GET',
      ...options
    })
  },

  /**
   * Lấy chứng chỉ theo my_course_id
   * @param myCourseId - ID khóa học của user (courses_users.id)
   */
  getCertificate: (myCourseId: string) => {
    return useApiFetch<ApiResponse<Certificate>>(
      ApiEndpoint.Courses.GetCertificate(myCourseId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Lấy danh sách chứng chỉ của user
   */
  getCertificates: () => {
    return useApiFetch<ApiResponse<CertificateListItem[]>>(
      ApiEndpoint.Courses.GetCertificates,
      {
        method: 'GET'
      }
    )
  },

  getCategories: () => {
    return useApiFetch<ApiResponse<CourseCategory[]>>(ApiEndpoint.Courses.GetCategories)
  },

  /**
   * Lấy chi tiết bài học theo ID
   * @param myCourseId - ID khóa học của user (courses_users.id)
   * @param lessonId - ID bài học
   */
  getLessonById: (myCourseId: string, lessonId: string) => {
    return useApiFetch<ApiResponse<LessonDetail>>(
      ApiEndpoint.Courses.GetLessonDetail(myCourseId, lessonId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Lấy chi tiết khóa học của tôi (có progress)
   * @param myCourseId - ID khóa học của user (courses_users.id)
   */
  getMyCourseDetail: (myCourseId: string) => {
    return useApiFetch<ApiResponse<MyCourse & { chapters?: Chapter[] }>>(
      ApiEndpoint.Courses.GetMyCourseDetail(myCourseId),
      {
        method: 'GET'
      }
    )
  },
  getContentByKeywordAi: (payload: DataContentByKeywordAiRequest) => {
    const config = useRuntimeConfig()
    const beCesintelligentUrl = config.public.beCesintelligentUrl as string
    const beCesintelligentApiKey = config.public.beCesintelligentApiKey as string
    return $fetch<ContentByKeywordAiResponse>(`${beCesintelligentUrl}/v1/chat-messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Authorization': `Bearer ${beCesintelligentApiKey}`,
        'Content-Type': 'application/json'
      })
    })
  },

  /**
   * Hoàn thành bài học
   * @param lessonId - ID bài học
   * @param courseId - ID khóa học
   * @param myCourseId - ID khóa học của user (courses_users.id)
   */
  completeLesson: (lessonId: string, courseId: string, myCourseId: string) => {
    const { $api } = useNuxtApp()
    type CompleteLessonResponse = {
      progress: number
      course_content?: CourseDetail['chapters']
    }
    return $api<ApiResponse<CompleteLessonResponse>>(
      ApiEndpoint.Courses.CompleteLesson(lessonId),
      {
        method: 'POST',
        body: {
          course_id: courseId,
          id: myCourseId,
          lesson_id: lessonId
        }
      }
    )
  },

  /**
   * Lưu log tiến độ học
   * @param lessonId - ID bài học
   * @param position - Vị trí hiện tại đã xem (giây)
   * @param duration - Tổng thời gian bài học (giây)
   */
  saveProgressLog: (lessonId: string, position: number, duration: number) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<boolean>>(
      ApiEndpoint.Courses.SaveProgressLog(lessonId),
      {
        method: 'PUT',
        body: {
          position,
          duration
        }
      }
    )
  },

  /**
   * Lấy log tham gia bài học (lần đầu)
   * @param myCourseId - ID khóa học của user
   * @param lessonId - ID bài học
   */
  getJoinLog: (myCourseId: string, lessonId: string) => {
    const { $api } = useNuxtApp()
    type JoinLogResponse = {
      history_id: string
      duration: number
      position: number
    }
    return $api<ApiResponse<JoinLogResponse>>(
      ApiEndpoint.Courses.GetJoinLog(myCourseId, lessonId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Cập nhật log tham gia bài học (lần thứ 2 trở đi)
   * @param myCourseId - ID khóa học của user
   * @param lessonId - ID bài học
   * @param historyId - ID lịch sử từ lần gọi GET join-log
   */
  updateJoinLog: (myCourseId: string, lessonId: string, historyId: string) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<boolean>>(
      ApiEndpoint.Courses.UpdateJoinLog(myCourseId),
      {
        method: 'PUT',
        body: {
          lesson_id: lessonId,
          history_id: historyId
        }
      }
    )
  },

  /**
   * Lấy bài tập theo ID
   * @param myCourseId - ID khóa học của user
   * @param exerciseId - ID bài tập
   */
  getExercise: (myCourseId: string, exerciseId: string) => {
    const { $api } = useNuxtApp()
    type ExerciseQuestion = {
      id: number
      question: string
      question_type: number
      multiple_choice_type: number
      answers: Array<{
        content: string
        is_choose: boolean
      }>
    }
    type ExerciseResponse = {
      id: string
      exercise_id: string
      exercise_name: string
      chapter_id?: string
      course_id: string
      lesson_id: string
      my_course_id: string
      exercise_type: number
      file_uploads?: string[]
      teacher_id?: string[]
      teacher_name?: string
      questions: ExerciseQuestion[]
      time_remaining: number
      is_complete?: boolean
      submit_date?: string
      submit_time?: number
      review_status?: number
    }
    return $api<ApiResponse<ExerciseResponse[]>>(
      ApiEndpoint.Courses.GetExercise(myCourseId, exerciseId),
      {
        method: 'GET'
      }
    )
  },

  /**
   * Nộp bài tập
   * @param myCourseId - ID khóa học của user
   * @param exerciseId - ID bài tập
   * @param exerciseData - Toàn bộ dữ liệu bài tập để submit
   */
  submitExercise: (myCourseId: string, exerciseId: string, exerciseData: {
    id: string
    exercise_id: string
    exercise_name: string
    chapter_id?: string
    course_id: string
    lesson_id: string
    my_course_id: string
    exercise_type: number
    file_uploads?: string[]
    teacher_id?: string[]
    questions: Array<{
      id?: number
      question_id?: string
      question: string
      question_type: number
      multiple_choice_type: number
      answers: Array<{
        answer_id?: string
        content: string
        is_choose?: boolean
        result?: boolean
      }>
    }>
    time_remaining: number
  }) => {
    const { $api } = useNuxtApp()
    type SubmitExerciseResponse = {
      result_id: string
      score: number
      total_questions: number
      correct_answers: number
      passed: boolean
    }
    return $api<ApiResponse<SubmitExerciseResponse>>(
      ApiEndpoint.Courses.SubmitExercise(myCourseId, exerciseId),
      {
        method: 'POST',
        body: exerciseData
      }
    )
  },

  /**
   * Cập nhật bài tập trong quá trình làm bài
   * @param myCourseId - ID khóa học của user
   * @param exerciseId - ID bài tập
   * @param answers - Mảng câu trả lời
   */
  updateExercise: (myCourseId: string, exerciseId: string, answers: Array<{ question_id: string, selected_answers: string[] }>) => {
    const { $api } = useNuxtApp()
    return $api<ApiResponse<boolean>>(
      ApiEndpoint.Courses.UpdateExercise(myCourseId, exerciseId),
      {
        method: 'PUT',
        body: {
          answers
        }
      }
    )
  },

  /**
   * Làm lại bài tập
   * @param myCourseId - ID khóa học của user
   * @param exerciseId - ID bài tập
   */
  retryExercise: (myCourseId: string, exerciseId: string) => {
    const { $api } = useNuxtApp()
    type RetryExerciseResponse = {
      can_retry: boolean
      remaining_attempts: number
      reset_exercise: Record<string, unknown>
    }
    return $api<ApiResponse<RetryExerciseResponse>>(
      ApiEndpoint.Courses.RetryExercise(myCourseId, exerciseId),
      {
        method: 'GET'
      }
    )
  }
}
