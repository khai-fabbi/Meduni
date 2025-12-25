interface Thumbnail {
  is_default: boolean
  path: string
}

export interface News {
  news_id: string // Primary key
  title: string // Tiêu đề bài viết
  short_description: string // Mô tả ngắn
  content: string // Nội dung đầy đủ
  cover_image: string // URL ảnh bìa
  view_count: number // Số lượt xem
  created_at: string // Ngày tạo
  updated_at: string // Ngày cập nhật
  status: number // Trạng thái (1: active, 0: inactive)
}

export interface ListNews {
  items: News[]
  limit?: number
  page?: number
  total?: number
  total_pages?: number
}

export interface MostViewedNews {
  cover_image: string
  created_at: string
  news_id: string
  short_description: string
  title: string
  view_count: number
}

export interface NewsDetail {
  content: string
  cover_image: string
  created_at: string
  news_id: string
  short_description: string
  title: string
  view_count: number
}
