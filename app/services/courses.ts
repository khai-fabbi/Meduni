import type {
  CoursesList,
  Certificate,
  CertificateListItem,
  CoursesListQueryParams,
  CourseCategory,
  CourseDetail,
  MyCourse,
  LessonDetail
} from '~/types/course'
import type { ApiResponse } from '~/types/common'
import type { Ref } from 'vue'

export const coursesService = {
  /**
   * Lấy danh sách khóa học
   * @param query - Query parameters
   */
  getList: (query?: CoursesListQueryParams | Ref<CoursesListQueryParams>) => {
    return useApiFetch<ApiResponse<CoursesList>>(ApiEndpoint.Courses.GetList, {
      query: computed(() => {
        const queryParams = unref(query) || {}
        return {
          ...(queryParams.page && { page_number: queryParams.page }),
          ...(queryParams.limit && { page_size: queryParams.limit }),
          ...(queryParams.sort && { sort: queryParams.sort }),
          ...(queryParams.category_id && { category_id: queryParams.category_id }),
          ...(queryParams.keyword && { keyword: queryParams.keyword })
        }
      })
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

  getCourseById: (courseId: string) => {
    return useApiFetch<ApiResponse<CourseDetail>>(ApiEndpoint.Courses.GetDetail(courseId), {
      method: 'GET'
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
  }
}
