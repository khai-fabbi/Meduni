# API Documentation - MTT LMS System

## Tổng quan hệ thống

Đây là hệ thống LMS (Learning Management System) được xây dựng trên serverless architecture với AWS Lambda, DynamoDB và API Gateway. Hệ thống hỗ trợ quản lý khóa học, người dùng, thanh toán (SePay), chat, và hệ thống affiliate.

**Base URL:** `/api/v1`

> **⚠️ Lưu ý quan trọng:** Tài liệu này đã được verify và cập nhật để đảm bảo tính chính xác về database interactions. Tất cả tên bảng database đều được kiểm tra từ source code thực tế.

---

## 1. AUTHENTICATION APIs

### 1.1 Đăng nhập
- **Endpoint:** `POST /api/v1/auth/login`
- **Request Body:**
```json
{
  "email": "string", // Tùy chọn
  "phone": "string", // Tùy chọn (email hoặc phone bắt buộc)
  "password": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string",
    "accessToken": "string",
    "refreshToken": "string",
    "total_cart": "string",
    "total_notification": "string"
  }
}
```
- **Nghiệp vụ:** Xác thực người dùng, tạo access token và refresh token
- **Database:** Đọc từ `users` table, ghi vào `personal_access_tokens` table

### 1.2 Đăng ký
- **Endpoint:** `POST /api/v1/auth/register`
- **Request Body:**
```json
{
  "email": "string",
  "phone": "string",
  "password": "string",
  "user_name": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Tạo tài khoản mới, gửi OTP xác thực
- **Database:** Ghi vào `users` table, `otp_token` table

### 1.3 Xác thực đăng ký
- **Endpoint:** `GET /api/v1/auth/verify-register?otp={otp}`
- **Query Parameters:**
  - `otp`: Mã OTP từ SMS/Email
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Xác thực OTP và kích hoạt tài khoản
- **Database:** Đọc/cập nhật `otp_token` table, cập nhật `users` table

### 1.4 Refresh Token
- **Endpoint:** `GET /api/v1/auth/refresh-token`
- **Headers:** `Authorization: Bearer {refresh_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```
- **Nghiệp vụ:** Tạo access token mới từ refresh token
- **Database:** Đọc/ghi `personal_access_tokens` table

### 1.5 Quên mật khẩu
- **Endpoint:** `POST /api/v1/auth/forgot-password`
- **Request Body:**
```json
{
  "email": "string", // Tùy chọn
  "phone": "string"  // Tùy chọn
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {}
}
```
- **Nghiệp vụ:** Gửi mã OTP để reset mật khẩu
- **Database:** Đọc `users` table, ghi `otp_token` table

### 1.6 Xác thực reset mật khẩu
- **Endpoint:** `GET /api/v1/auth/reset-password?token={token}&otp={otp}&phone={phone}&email={email}`
- **Query Parameters:**
  - `token`: Token reset password
  - `otp`: Mã OTP
  - `phone`: Số điện thoại (tùy chọn)
  - `email`: Email (tùy chọn)
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Xác thực OTP cho việc reset mật khẩu
- **Database:** Đọc `otp_token` table

### 1.7 Reset mật khẩu
- **Endpoint:** `POST /api/v1/auth/reset-password`
- **Request Body:**
```json
{
  "newPassword": "string",
  "confirmPassword": "string",
  "token": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string"
  }
}
```
- **Nghiệp vụ:** Đặt lại mật khẩu mới
- **Database:** Cập nhật `users` table

### 1.8 Đăng xuất
- **Endpoint:** `POST /api/v1/auth/logout`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Hủy access token hiện tại
- **Database:** Cập nhật `personal_access_tokens` table

### 1.9 Gửi lại OTP
- **Endpoint:** `GET /api/v1/auth/resend-otp?phone={phone}&otpType={type}&email={email}`
- **Query Parameters:**
  - `phone`: Số điện thoại
  - `otpType`: Loại OTP (register, reset_password)
  - `email`: Email
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Gửi lại mã OTP
- **Database:** Ghi `otp_token` table

---

## 2. USER MANAGEMENT APIs

### 2.1 Lấy thông tin người dùng
- **Endpoint:** `GET /api/v1/user/info`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "gender": 1,
    "birthday": "string",
    "address": "string",
    "country": "string",
    "province": "string",
    "district": "string",
    "favorite_courses": ["string"]
  }
}
```
- **Nghiệp vụ:** Lấy thông tin chi tiết của người dùng hiện tại
- **Database:** Đọc từ `users` table

### 2.2 Cập nhật thông tin người dùng
- **Endpoint:** `POST /api/v1/user/update-info`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "user_name": "string",
  "phone": "string",
  "avatar": "string",
  "gender": 1,
  "birthday": "string",
  "address": "string",
  "country": "string",
  "province": "string",
  "district": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string"
  }
}
```
- **Nghiệp vụ:** Cập nhật thông tin cá nhân
- **Database:** Cập nhật `users` table

### 2.3 Đổi mật khẩu
- **Endpoint:** `POST /api/v1/user/update-password`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string"
  }
}
```
- **Nghiệp vụ:** Thay đổi mật khẩu người dùng
- **Database:** Cập nhật `users` table

### 2.4 Lấy danh sách quốc gia
- **Endpoint:** `GET /api/v1/user/country`
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "country_code": "string",
      "country_name": "string",
      "provinces": [
        {
          "province_code": "string",
          "province_name": "string",
          "districts": [
            {
              "district_code": "string",
              "district_name": "string"
            }
          ]
        }
      ]
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách quốc gia, tỉnh thành, quận huyện
- **Database:** Đọc từ static data hoặc external API

### 2.5 Lấy thông tin hỗ trợ
- **Endpoint:** `GET /api/v1/user/help`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "sales_name": "string",
    "sales_email": "string",
    "sales_phone": "string",
    "care_name": "string",
    "care_email": "string",
    "care_phone": "string",
    "support_name": "string",
    "support_email": "string",
    "support_phone": "string"
  }
}
```
- **Nghiệp vụ:** Lấy thông tin nhân viên hỗ trợ được phân công
- **Database:** Đọc từ `users` table và các bảng staff

### 2.6 Lấy danh sách ghi chú
- **Endpoint:** `GET /api/v1/user/notes?page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số item trên trang (mặc định: 10)
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "note_id": "string",
      "note_content": "string",
      "course_name": "string",
      "teacher_name": "string",
      "updated_at": "string"
    }
  ],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy tất cả ghi chú của người dùng
- **Database:** Đọc từ `notes` table

### 2.7 Xóa ghi chú
- **Endpoint:** `DELETE /api/v1/user/notes`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "note_ids": ["string"]
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "is_success": true
  }
}
```
- **Nghiệp vụ:** Xóa nhiều ghi chú cùng lúc
- **Database:** Xóa từ `notes` table

### 2.8 Tải ghi chú theo ID
- **Endpoint:** `GET /api/v1/user/download-note/{noteId}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `noteId`: ID của ghi chú
- **Response:**
```json
{
  "request_id": "string",
  "data": "base64_pdf_content"
}
```
- **Nghiệp vụ:** Tạo và tải file PDF của ghi chú
- **Database:** Đọc từ `notes` table

### 2.9 Tải file ZIP ghi chú
- **Endpoint:** `POST /api/v1/user/note/zip`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "ids": ["string"]
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": "base64_zip_content"
}
```
- **Nghiệp vụ:** Tạo file ZIP chứa nhiều ghi chú
- **Database:** Đọc từ `notes` table

---

## 3. COURSE MANAGEMENT APIs

### 3.1 Lấy danh sách khóa học
- **Endpoint:** `GET /api/v1/courses?page={page}&limit={limit}&sort={sort}&category={category}&search={search}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
  - `sort`: Sắp xếp (1: tổng mua, 2: ngày tạo, 3: đánh giá, 4: roadmap, 5: học viên, 6: giá)
  - `category`: ID danh mục
  - `search`: Từ khóa tìm kiếm
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "videos": [CourseDto],
    "audios": [CourseDto],
    "streams": [CourseDto]
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học theo loại và bộ lọc
- **Database:** Đọc từ `courses`, `categories`, `teachers` table

### 3.2 Lấy khóa học video
- **Endpoint:** `GET /api/v1/courses/videos?page={page}&limit={limit}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [CourseDto],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học loại video
- **Database:** Đọc từ `courses` table với filter tag=VIDEO

### 3.3 Lấy khóa học audio
- **Endpoint:** `GET /api/v1/courses/audios?page={page}&limit={limit}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [CourseDto],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học loại audio
- **Database:** Đọc từ `courses` table với filter tag=AUDIO

### 3.4 Lấy khóa học livestream
- **Endpoint:** `GET /api/v1/courses/live-streams?page={page}&limit={limit}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [CourseDto],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học loại livestream
- **Database:** Đọc từ `courses` table với filter tag=STREAM

### 3.5 Lấy thông tin khóa học theo ID
- **Endpoint:** `GET /api/v1/courses/{course_id}?rate={true/false}&tab={tab}`
- **Path Parameters:**
  - `course_id`: ID khóa học
- **Query Parameters:**
  - `rate`: Có lấy đánh giá hay không
  - `tab`: Tab hiển thị (overview, content, rate)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "course_id": "string",
    "course_name": "string",
    "description": "string",
    "teacher_name": "string",
    "category_name": "string",
    "course_image": "string",
    "price": "string",
    "rate_avg": 4.5,
    "total_rate": 100,
    "total_student": 1000,
    "overview": {},
    "chapters": [],
    "rates": []
  }
}
```
- **Nghiệp vụ:** Lấy thông tin chi tiết khóa học
- **Database:** Đọc từ `courses`, `chapters`, `lessons`, `rates` table

### 3.6 Lấy thông tin Zoom của khóa học
- **Endpoint:** `GET /api/v1/courses/zoom-info?course_id={course_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `course_id`: ID khóa học
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "meeting_id": "string",
    "meeting_password": "string",
    "join_url": "string",
    "start_time": "string"
  }
}
```
- **Nghiệp vụ:** Lấy thông tin phòng Zoom của khóa học
- **Database:** Đọc từ `zoom_links`, `map_zoom_links` table

### 3.7 Lấy khuyến mãi theo khóa học
- **Endpoint:** `GET /api/v1/courses/{course_id}/promotions?expire_time={timestamp}`
- **Path Parameters:**
  - `course_id`: ID khóa học
- **Query Parameters:**
  - `expire_time`: Thời gian hết hạn (timestamp)
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "id": "string",
      "course_id": "string",
      "course_name": "string",
      "price": 1000000,
      "price_without_discount": 2000000,
      "expire_time": 1640995200
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách khuyến mãi của khóa học
- **Database:** Đọc từ `campaigns`, `courses` table

### 3.8 Lấy đánh giá khóa học
- **Endpoint:** `GET /api/v1/courses/{course_id}/rates?page={page}&limit={limit}&sort={sort}`
- **Path Parameters:**
  - `course_id`: ID khóa học
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
  - `sort`: Sắp xếp (0: mới nhất, 1: sao cao, 2: sao thấp)
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "rate_id": "string",
      "user_name": "string",
      "star": 5,
      "comment": "string",
      "created_at": "string"
    }
  ],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  },
  "info": {
    "rate_avg": 4.5,
    "total_rate": 100,
    "star_distribution": {
      "5": 50,
      "4": 30,
      "3": 15,
      "2": 3,
      "1": 2
    }
  }
}
```
- **Nghiệp vụ:** Lấy danh sách đánh giá và thống kê
- **Database:** Đọc từ `rates` table

---

## 4. MY COURSE APIs

### 4.1 Lấy khóa học của tôi
- **Endpoint:** `GET /api/v1/user/courses?page={page}&limit={limit}&sort={sort}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
  - `sort`: Sắp xếp (1: ngày mua, 2: tiến độ giảm, 3: tiến độ tăng, 4: học gần đây)
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "id": "string",
      "course_id": "string",
      "course_name": "string",
      "progress": 75,
      "last_time": "string",
      "expire_time": 1640995200,
      "course_image": "string"
    }
  ],
  "page": {
    "current": 1,
    "total": 10,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học đã mua
- **Database:** Đọc từ `courses_users` table

### 4.2 Lấy chi tiết khóa học của tôi
- **Endpoint:** `GET /api/v1/user/courses/{id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user (courses_users.id)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "id": "string",
    "course_id": "string",
    "course_name": "string",
    "progress": 75,
    "chapters": [
      {
        "chapter_id": "string",
        "chapter_name": "string",
        "lessons": [
          {
            "lesson_id": "string",
            "lesson_name": "string",
            "lesson_type": "VIDEO",
            "is_completed": true,
            "lesson_duration": 3600
          }
        ]
      }
    ]
  }
}
```
- **Nghiệp vụ:** Lấy chi tiết khóa học và tiến độ học
- **Database:** Đọc từ `courses_users`, `chapters`, `lessons`, `progress_log` table

### 4.3 Lấy khóa học sắp diễn ra
- **Endpoint:** `GET /api/v1/user/courses/up-coming?page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "id": "string",
      "course_name": "string",
      "next_lesson": {
        "lesson_id": "string",
        "lesson_name": "string",
        "start_date": "string"
      }
    }
  ]
}
```
- **Nghiệp vụ:** Lấy khóa học có buổi học sắp diễn ra
- **Database:** Đọc từ `courses_users`, `lessons` table

### 4.4 Lấy khóa học đang học
- **Endpoint:** `GET /api/v1/user/courses/continue?page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "id": "string",
      "course_name": "string",
      "progress": 50,
      "last_lesson": {
        "lesson_id": "string",
        "lesson_name": "string"
      }
    }
  ]
}
```
- **Nghiệp vụ:** Lấy khóa học đang học dở
- **Database:** Đọc từ `courses_users` table với progress < 100

### 4.5 Lấy bài học theo ID
- **Endpoint:** `GET /api/v1/user/courses/{id}/lessons/{lesson_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "lesson_id": "string",
    "title": "string",
    "description": "string",
    "lesson_path": "string",
    "lesson_duration": 3600,
    "lesson_type": "VIDEO",
    "is_completed": true,
    "zoom_links": []
  }
}
```
- **Nghiệp vụ:** Lấy chi tiết bài học và quyền truy cập
- **Database:** Đọc từ `lessons`, `courses_users`, `progress_log` table

### 4.6 Ghi log tham gia livestream
- **Endpoint:** `PUT /api/v1/user/courses/{id}/join-log`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
- **Request Body:**
```json
{
  "lesson_id": "string",
  "join_time": "string",
  "device_info": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Ghi lại thời gian tham gia livestream
- **Database:** Ghi vào `histories_join` table

### 4.7 Ghi log lỗi thiết bị
- **Endpoint:** `PUT /api/v1/user/courses/{id}/log-error`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
- **Request Body:**
```json
{
  "lesson_id": "string",
  "error_message": "string",
  "device_info": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Ghi log lỗi khi học
- **Database:** Ghi vào `log_live` table

### 4.8 Lấy lịch sử thanh toán
- **Endpoint:** `GET /api/v1/user/payments?page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "transaction_id": "string",
      "course_name": "string",
      "amount": 1000000,
      "payment_status": "COMPLETED",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy lịch sử thanh toán của user
- **Database:** Đọc từ `payments2`, `courses` table

### 4.9 Lấy log tham gia
- **Endpoint:** `GET /api/v1/user/courses/{id}/lessons/{lesson_id}/join-log`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "join_time": "string",
      "leave_time": "string",
      "duration": 3600
    }
  ]
}
```
- **Nghiệp vụ:** Lấy lịch sử tham gia bài học
- **Database:** Đọc từ `histories_join` table

### 4.10 Lấy chứng chỉ
- **Endpoint:** `GET /api/v1/{my_course_id}/certificate`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "user_name": "string",
    "course_name": "string",
    "program_type": "string",
    "completed_at": "ISODateString|null",
    "course_id": "string",
    "category_id": "string"
  }
}
```
- **Nghiệp vụ:** Trả thông tin chứng chỉ (không trả file/base64)
- **Database:** Đọc từ `courses_users` table

### 4.11 Lấy danh sách chứng chỉ
- **Endpoint:** `GET /api/v1/user/certificates`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "my_course_id": "string",
      "course_name": "string",
      "completion_date": "string",
      "progress": 100
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học đã hoàn thành
- **Database:** Đọc từ `courses_users` table với progress = 100

### 4.12 Lấy danh sách trả góp
- **Endpoint:** `GET /api/v1/user/installments`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "user_installment_id": "string",
      "course_name": "string",
      "total_amount": 2000000,
      "paid_amount": 1000000,
      "remaining_amount": 1000000,
      "next_payment_date": "string",
      "installment_status": "ACTIVE"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách khoản trả góp
- **Database:** Đọc từ `user_installments` table

### 4.13 Hủy trả góp
- **Endpoint:** `PUT /api/v1/user/courses/{id}/cancel-installment-payment`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Hủy khoản trả góp
- **Database:** Cập nhật `user_installments` table

---

## 5. LESSON APIs

### 5.1 Lấy thông tin Zoom của bài học
- **Endpoint:** `GET /api/v1/lessons/zoom-info?lesson_id={lesson_id}&course_id={course_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `lesson_id`: ID bài học
  - `course_id`: ID khóa học
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "meeting_id": "string",
    "meeting_password": "string",
    "join_url": "string",
    "start_time": "string"
  }
}
```
- **Nghiệp vụ:** Lấy thông tin Zoom meeting của bài học
- **Database:** Đọc từ `zoom_links`, `lessons` table

### 5.2 Hoàn thành bài học
- **Endpoint:** `POST /api/v1/lessons/{lesson_id}/complete`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `lesson_id`: ID bài học
- **Request Body:**
```json
{
  "my_course_id": "string",
  "completion_time": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Đánh dấu bài học đã hoàn thành và cập nhật tiến độ
- **Database:** Ghi vào `progress_log`, cập nhật `courses_users` table

### 5.3 Ghi log tiến độ học
- **Endpoint:** `POST /api/v1/lessons/{lesson_id}/progress-log`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `lesson_id`: ID bài học
- **Request Body:**
```json
{
  "my_course_id": "string",
  "current_time": 1800,
  "total_time": 3600
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Ghi log tiến độ xem video
- **Database:** Ghi vào `progress_log` table

### 5.4 Lấy bài học theo ID
- **Endpoint:** `GET /api/v1/courses/{course_id}/lessons/{lesson_id}`
- **Path Parameters:**
  - `course_id`: ID khóa học
  - `lesson_id`: ID bài học
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "lesson_id": "string",
    "title": "string",
    "description": "string",
    "lesson_path": "string",
    "lesson_duration": 3600,
    "lesson_type": "VIDEO"
  }
}
```
- **Nghiệp vụ:** Lấy thông tin chi tiết bài học
- **Database:** Đọc từ `lessons` table

---

## 6. EXERCISE APIs

### 6.1 Lấy bài tập theo ID
- **Endpoint:** `GET /api/v1/courses/{id}/exercises/{exercise_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `exercise_id`: ID bài tập
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "exercise_id": "string",
    "exercise_name": "string",
    "description": "string",
    "questions": [
      {
        "question_id": "string",
        "question_text": "string",
        "question_type": "MULTIPLE_CHOICE",
        "answers": [
          {
            "answer_id": "string",
            "answer_text": "string"
          }
        ]
      }
    ],
    "time_limit": 3600,
    "max_attempts": 3
  }
}
```
- **Nghiệp vụ:** Lấy chi tiết bài tập và câu hỏi
- **Database:** Đọc từ `exercises` table

### 6.2 Nộp bài tập
- **Endpoint:** `POST /api/v1/courses/{id}/exercises/{exercise_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `exercise_id`: ID bài tập
- **Request Body:**
```json
{
  "answers": [
    {
      "question_id": "string",
      "selected_answers": ["string"]
    }
  ],
  "completion_time": 1800
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "result_id": "string",
    "score": 85,
    "total_questions": 10,
    "correct_answers": 8,
    "passed": true
  }
}
```
- **Nghiệp vụ:** Chấm điểm và lưu kết quả bài tập
- **Database:** Ghi vào `exercises_results` table

### 6.3 Làm lại bài tập
- **Endpoint:** `GET /api/v1/courses/{id}/exercises/{exercise_id}/retry`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `exercise_id`: ID bài tập
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "can_retry": true,
    "remaining_attempts": 2,
    "reset_exercise": {}
  }
}
```
- **Nghiệp vụ:** Kiểm tra và reset bài tập để làm lại
- **Database:** Đọc từ `exercises_results` table

### 6.4 Cập nhật bài tập
- **Endpoint:** `PUT /api/v1/courses/{id}/exercises/{exercise_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `id`: ID khóa học của user
  - `exercise_id`: ID bài tập
- **Request Body:**
```json
{
  "answers": [
    {
      "question_id": "string",
      "selected_answers": ["string"]
    }
  ]
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Cập nhật câu trả lời trong quá trình làm bài
- **Database:** Cập nhật `exercises_results` table

---

## 7. NOTE APIs

### 7.1 Lấy ghi chú theo bài học
- **Endpoint:** `GET /api/v1/courses/{my_course_id}/lessons/{lesson_id}/notes?page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "note_id": "string",
      "note_content": "string",
      "note_time": 1800,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách ghi chú của bài học
- **Database:** Đọc từ `notes` table

### 7.2 Thêm ghi chú
- **Endpoint:** `POST /api/v1/courses/{my_course_id}/lessons/{lesson_id}/notes`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Request Body:**
```json
{
  "note_content": "string",
  "note_time": 1800
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "note_id": "string",
    "note_content": "string",
    "note_time": 1800,
    "created_at": "string"
  }
}
```
- **Nghiệp vụ:** Tạo ghi chú mới cho bài học
- **Database:** Ghi vào `notes` table

### 7.3 Cập nhật ghi chú
- **Endpoint:** `PUT /api/v1/courses/{my_course_id}/lessons/{lesson_id}/notes`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Request Body:**
```json
{
  "note_id": "string",
  "note_content": "string",
  "note_time": 1800
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "note_id": "string",
    "note_content": "string",
    "note_time": 1800,
    "updated_at": "string"
  }
}
```
- **Nghiệp vụ:** Cập nhật nội dung ghi chú
- **Database:** Cập nhật `notes` table

### 7.4 Xóa ghi chú
- **Endpoint:** `DELETE /api/v1/courses/{my_course_id}/lessons/{lesson_id}/notes/{note_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
  - `lesson_id`: ID bài học
  - `note_id`: ID ghi chú
- **Response:**
```json
{
  "request_id": "string",
  "data": true
}
```
- **Nghiệp vụ:** Xóa ghi chú
- **Database:** Xóa từ `notes` table

### 7.5 Tải ghi chú
- **Endpoint:** `GET /api/v1/courses/{my_course_id}/{lesson_id}/notes/download`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `my_course_id`: ID khóa học của user
  - `lesson_id`: ID bài học
- **Response:**
```json
{
  "request_id": "string",
  "data": "base64_pdf_content"
}
```
- **Nghiệp vụ:** Tạo file PDF chứa tất cả ghi chú của bài học
- **Database:** Đọc từ `notes` table

---

## 8. CART APIs

### 8.1 Thêm vào giỏ hàng
- **Endpoint:** `POST /api/v1/cart`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "course_info": [
    {
      "course_id": "string",
      "my_course_id": "string (optional)",
      "expire_time": "number (optional)",
      "is_installment": "boolean (optional)",
      "number_of_installment": "number (required nếu có my_course_id)",
      "point_transaction_history_id": "string (optional)",
      "funnel_info": {
        "sale_course_id": "string",
        "user_id": "string",
        "lesson_id": "string",
        "meeting_number": "number"
      }
    }
  ]
}
```
- **Mô tả các trường:**
  - `course_info`: Mảng các khóa học cần thêm vào giỏ hàng (bắt buộc, tối thiểu 1 phần tử)
  - `course_id`: ID khóa học (bắt buộc)
  - `my_course_id`: ID khóa học của người dùng (tùy chọn)
  - `expire_time`: Thời gian hết hạn (tùy chọn)
  - `is_installment`: Có trả góp hay không (tùy chọn)
  - `number_of_installment`: Số kỳ trả góp (bắt buộc khi có my_course_id)
  - `point_transaction_history_id`: ID lịch sử giao dịch điểm (tùy chọn)
  - `funnel_info`: Thông tin funnel (tùy chọn)
- **Response:**
```json
{
  "request_id": "string",
  "data": "any (cart IDs hoặc thông tin giỏ hàng)"
}
```
- **Nghiệp vụ:** Thêm một hoặc nhiều khóa học vào giỏ hàng
- **Database:** Ghi vào `carts` table

### 8.2 Cập nhật giỏ hàng
- **Endpoint:** `PUT /api/v1/cart`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "cart_id": "string",
  "amount": "number (optional)",
  "expire_time": "number (optional)"
}
```
- **Mô tả các trường:**
  - `cart_id`: ID giỏ hàng cần cập nhật (bắt buộc)
  - `amount`: Số tiền/số lượng (tùy chọn, phải là số)
  - `expire_time`: Thời gian hết hạn (tùy chọn, phải là số)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "carts": [],
    "count": "number"
  }
}
```
- **Nghiệp vụ:** Cập nhật thông tin giỏ hàng (amount hoặc expire_time)
- **Database:** Cập nhật `carts` table

### 8.3 Lấy giỏ hàng
- **Endpoint:** `GET /api/v1/cart`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "cart_id": "string",
      "course_id": "string",
      "course_name": "string",
      "course_image": "string",
      "quantity": 1,
      "price": 1000000,
      "discount_price": 800000,
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách sản phẩm trong giỏ hàng
- **Database:** Đọc từ `carts`, `courses` table

### 8.4 Ước tính giỏ hàng
- **Endpoint:** `GET /api/v1/cart/est-cart?course_info[]={course_info}`
- **Headers:** Không yêu cầu authentication
- **Query Parameters:**
  - `course_info[]`: Danh sách thông tin khóa học (comma-separated)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "carts": [],
    "count": "number"
  }
}
```
- **Nghiệp vụ:** Tính toán tổng tiền và thông tin giỏ hàng dựa trên thông tin khóa học
- **Database:** Đọc từ `carts`, `courses` table

### 8.5 Mua nhanh
- **Endpoint:** `POST /api/v1/quick-buy`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "sale_course_id": "string",
  "lesson_id": "string",
  "course_id": "string"
}
```
- **Mô tả các trường:**
  - `sale_course_id`: ID khóa học sale (bắt buộc)
  - `lesson_id`: ID bài học (bắt buộc)
  - `course_id`: ID khóa học (bắt buộc)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "payment_url": "string",
    "transaction_id": "string",
    "amount": "number"
  }
}
```
- **Nghiệp vụ:** Mua khóa học ngay không qua giỏ hàng
- **Database:** Ghi vào `carts`, `payments2` table

---

## 9. PAYMENT APIs

### 9.1 Tạo giao dịch thanh toán
- **Endpoint:** `POST /api/v1/payment/transaction`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "carts": [
    {
      "cart_id": "string",
      "course_id": "string",
      "quantity": 1
    }
  ],
  "payment_method": "SEPAY", // Chỉ hỗ trợ SEPAY và INSTALLMENT
  "coupon_code": "string",
  "return_url": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "transaction_id": "string",
    "payment_url": "string",
    "amount": 1000000,
    "currency": "VND"
  }
}
```
- **Nghiệp vụ:** Tạo giao dịch thanh toán và redirect đến cổng thanh toán SePay
- **Database:** Ghi vào `payments2`, cập nhật `carts` table
- **Lưu ý:** Hệ thống hiện tại chỉ hỗ trợ SePay và trả góp

### 9.2 Thêm khóa học miễn phí
- **Endpoint:** `POST /api/v1/payment/transaction/free/{course_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `course_id`: ID khóa học miễn phí
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "id": "string",
    "course_id": "string",
    "course_name": "string",
    "progress": 0,
    "created_at": "string"
  }
}
```
- **Nghiệp vụ:** Thêm khóa học miễn phí vào tài khoản
- **Database:** Ghi vào `courses_users` table

---

## 10. SEPAY PAYMENT APIs

### 10.1 Tạo giao dịch SePay
- **Endpoint:** `POST /api/v1/sepay/transaction`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "carts": [
    {
      "cart_id": "string",
      "course_id": "string",
      "quantity": 1
    }
  ],
  "payment_method": "SEPAY", // Chỉ hỗ trợ SEPAY
  "coupon_code": "string",
  "return_url": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "transaction_id": "string",
    "payment_url": "string",
    "qr_code": "string",
    "amount": 1000000,
    "currency": "VND"
  }
}
```
- **Nghiệp vụ:** Tạo giao dịch thanh toán qua SePay và redirect đến cổng thanh toán SePay
- **Database:** Ghi vào `payments2`, cập nhật `carts` table
- **Lưu ý:** Hệ thống SePay chỉ hỗ trợ thanh toán SePay

### 10.2 Webhook SePay
- **Endpoint:** `POST /api/v1/sepay/webhook`
- **Request Body:**
```json
{
  "transaction_id": "string",
  "status": "SUCCESS",
  "amount": 1000000,
  "signature": "string"
}
```
- **Response:**
```json
{
  "status": "OK"
}
```
- **Nghiệp vụ:** Nhận thông báo kết quả thanh toán từ SePay
- **Database:** Cập nhật `payments2`, `courses_users` table

### 10.3 Kiểm tra trạng thái giao dịch
- **Endpoint:** `GET /api/v1/sepay/transaction/{transactionId}/status`
- **Path Parameters:**
  - `transactionId`: ID giao dịch
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "transaction_id": "string",
    "status": "SUCCESS",
    "amount": 1000000,
    "created_at": "string",
    "updated_at": "string"
  }
}
```
- **Nghiệp vụ:** Kiểm tra trạng thái giao dịch SePay
- **Database:** Đọc từ `payments2` table

---

## 11. CHAT APIs

### 11.1 Tạo user tạm thời
- **Endpoint:** `POST /api/v1/chat/create-temp-user`
- **Request Body:**
```json
{
  "user_name": "string",
  "phone": "string",
  "email": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "temp_user_id": "string",
    "access_token": "string"
  }
}
```
- **Nghiệp vụ:** Tạo user tạm thời để chat không cần đăng ký
- **Database:** Ghi vào `temp_users` table

### 11.2 Gửi tin nhắn
- **Endpoint:** `POST /api/v1/chat/send-chat`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "channel_id": "string",
  "message": "string",
  "message_type": "TEXT"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "message_id": "string",
    "channel_id": "string",
    "message": "string",
    "created_at": "string"
  }
}
```
- **Nghiệp vụ:** Gửi tin nhắn chat
- **Database:** Ghi vào `chat` table

### 11.3 Lấy danh sách tin nhắn
- **Endpoint:** `GET /api/v1/chat/list?channel_id={channel_id}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `channel_id`: ID kênh chat
  - `page`: Số trang
  - `limit`: Số tin nhắn trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "message_id": "string",
      "user_name": "string",
      "message": "string",
      "message_type": "TEXT",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy lịch sử chat
- **Database:** Đọc từ `chat` table

### 11.4 Tạo chat public livestream
- **Endpoint:** `POST /api/v1/chat/create-public-live-chat`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "lesson_id": "string",
  "message": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "message_id": "string",
    "channel_id": "string"
  }
}
```
- **Nghiệp vụ:** Tạo tin nhắn chat công khai trong livestream
- **Database:** Ghi vào `live_chat` table

### 11.5 Lấy chat public livestream
- **Endpoint:** `GET /api/v1/chat/list-public-live-chat?lesson_id={lesson_id}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `lesson_id`: ID bài học
  - `page`: Số trang
  - `limit`: Số tin nhắn trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "message_id": "string",
      "user_name": "string",
      "message": "string",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy chat công khai của livestream
- **Database:** Đọc từ `live_chat` table

### 11.6 Tạo chat private livestream
- **Endpoint:** `POST /api/v1/chat/create-private-live-chat`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "lesson_id": "string",
  "message": "string",
  "recipient_id": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "message_id": "string",
    "channel_id": "string"
  }
}
```
- **Nghiệp vụ:** Tạo tin nhắn chat riêng tư trong livestream
- **Database:** Ghi vào `live_chat` table

### 11.7 Lấy chat private livestream
- **Endpoint:** `GET /api/v1/chat/list-private-live-chat?lesson_id={lesson_id}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `lesson_id`: ID bài học
  - `page`: Số trang
  - `limit`: Số tin nhắn trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "message_id": "string",
      "sender_name": "string",
      "recipient_name": "string",
      "message": "string",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy chat riêng tư của livestream
- **Database:** Đọc từ `live_chat` table

### 11.8 Lấy danh sách kênh khóa học
- **Endpoint:** `GET /api/v1/chat/list-course-channel?course_id={course_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `course_id`: ID khóa học
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "channel_id": "string",
      "channel_name": "string",
      "last_message": "string",
      "last_message_time": "string",
      "unread_count": 5
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách kênh chat của khóa học
- **Database:** Đọc từ `course_chat` table

### 11.9 Lấy chat khóa học
- **Endpoint:** `GET /api/v1/chat/list-course-chat?course_id={course_id}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `course_id`: ID khóa học
  - `page`: Số trang
  - `limit`: Số tin nhắn trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "message_id": "string",
      "user_name": "string",
      "message": "string",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy chat của khóa học
- **Database:** Đọc từ `course_chat` table

### 11.10 Tạo chat khóa học
- **Endpoint:** `POST /api/v1/chat/create-course-chat`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "course_id": "string",
  "message": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "message_id": "string",
    "course_id": "string"
  }
}
```
- **Nghiệp vụ:** Tạo tin nhắn chat trong khóa học
- **Database:** Ghi vào `course_chat` table

### 11.11 Kiểm tra tin nhắn mới
- **Endpoint:** `GET /api/v1/chat/new-chat-status?course_id={course_id}&last_check={timestamp}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `course_id`: ID khóa học
  - `last_check`: Timestamp lần check cuối
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "has_new_message": true,
    "new_message_count": 3,
    "last_message_time": "string"
  }
}
```
- **Nghiệp vụ:** Kiểm tra có tin nhắn mới không
- **Database:** Đọc từ `course_chat` table

---

## 12. SUPPORT APIs

### 12.1 Tạo câu hỏi hỗ trợ
- **Endpoint:** `POST /api/v1/support/qa`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "category": "TECHNICAL",
  "priority": "MEDIUM"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "support_case_id": "string",
    "title": "string",
    "status": "OPEN",
    "created_at": "string"
  }
}
```
- **Nghiệp vụ:** Tạo ticket hỗ trợ mới
- **Database:** Ghi vào `support` table

### 12.2 Tạo chat hỗ trợ
- **Endpoint:** `POST /api/v1/support/chat`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "support_case_id": "string",
  "message": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "message_id": "string",
    "support_case_id": "string",
    "message": "string",
    "created_at": "string"
  }
}
```
- **Nghiệp vụ:** Gửi tin nhắn trong ticket hỗ trợ
- **Database:** Ghi vào `support_chat` table

### 12.3 Lấy danh sách chat hỗ trợ
- **Endpoint:** `GET /api/v1/support/chat?support_case_id={case_id}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `support_case_id`: ID ticket hỗ trợ
  - `page`: Số trang
  - `limit`: Số tin nhắn trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "message_id": "string",
      "sender_name": "string",
      "sender_role": "USER",
      "message": "string",
      "created_at": "string"
    }
  ]
}
```
- **Nghiệp vụ:** Lấy lịch sử chat hỗ trợ
- **Database:** Đọc từ `support_chat` table

---

## 13. REFERRAL SYSTEM APIs

### 13.1 Xử lý giới thiệu
- **Endpoint:** `POST /api/v1/user/referral/process`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "referral_code": "string",
  "transaction_id": "string",
  "course_id": "string",
  "amount": 1000000
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "processed": true,
    "referral_earnings": [
      {
        "referrer_id": "string",
        "level": 1,
        "commission_rate": 0.1,
        "commission_amount": 100000
      }
    ]
  }
}
```
- **Nghiệp vụ:** Xử lý hoa hồng khi có giao dịch thành công
- **Database:** Ghi vào `referral_transaction`, cập nhật `user_referral_tree` table

### 13.2 Lấy cây giới thiệu
- **Endpoint:** `GET /api/v1/user/referral/tree?level={level}&page={page}&limit={limit}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `level`: Cấp độ giới thiệu (1, 2, 3...)
  - `page`: Số trang
  - `limit`: Số item trên trang
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "referral_code": "string",
    "total_referrals": 50,
    "total_earnings": 5000000,
    "referrals": [
      {
        "user_id": "string",
        "user_name": "string",
        "level": 1,
        "total_purchases": 3,
        "total_earnings": 300000,
        "joined_at": "string"
      }
    ]
  }
}
```
- **Nghiệp vụ:** Lấy cây người dùng được giới thiệu
- **Database:** Đọc từ `user_referral_tree`, `referral_transaction` table

### 13.3 Lấy thông tin giới thiệu
- **Endpoint:** `GET /api/v1/user/referral/info`
- **Headers:** `Authorization: Bearer {access_token}`
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "referral_code": "string",
    "referral_link": "string",
    "total_direct_referrals": 20,
    "total_indirect_referrals": 30,
    "total_direct_earnings": 2000000,
    "total_indirect_earnings": 1000000,
    "total_earnings": 3000000,
    "commission_rates": {
      "level_1": 0.1,
      "level_2": 0.05,
      "level_3": 0.025
    }
  }
}
```
- **Nghiệp vụ:** Lấy thông tin tổng quan về hệ thống giới thiệu
- **Database:** Đọc từ `users`, `user_referral_tree`, `referral_transaction` table

### 13.4 Migration mã giới thiệu
- **Endpoint:** `POST /api/v1/user/referral/migrate`
- **Headers:** `Authorization: Bearer {access_token}`
- **Request Body:**
```json
{
  "old_referral_code": "string",
  "new_referral_code": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "migrated": true,
    "affected_users": 25
  }
}
```
- **Nghiệp vụ:** Migration dữ liệu mã giới thiệu cũ
- **Database:** Cập nhật `users`, `user_referral_tree` table

---

## 14. NOTIFICATION APIs

### 14.1 Lấy danh sách thông báo
- **Endpoint:** `GET /api/v1/notifications?page={page}&limit={limit}&type={type}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
  - `type`: Loại thông báo (SYSTEM, COURSE, PAYMENT, PROMOTION)
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "notification_id": "string",
      "title": "string",
      "content": "string",
      "type": "SYSTEM",
      "is_read": false,
      "created_at": "string",
      "data": {}
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách thông báo của user
- **Database:** Đọc từ `notifications` table

### 14.2 Lấy chi tiết thông báo
- **Endpoint:** `GET /api/v1/notifications/{notification_id}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Path Parameters:**
  - `notification_id`: ID thông báo
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "notification_id": "string",
    "title": "string",
    "content": "string",
    "type": "SYSTEM",
    "is_read": true,
    "created_at": "string",
    "data": {},
    "actions": [
      {
        "label": "Xem khóa học",
        "action": "VIEW_COURSE",
        "url": "/courses/123"
      }
    ]
  }
}
```
- **Nghiệp vụ:** Lấy chi tiết và đánh dấu đã đọc thông báo
- **Database:** Đọc và cập nhật `notifications` table

---

## 15. CATEGORY APIs

### 15.1 Lấy danh sách danh mục
- **Endpoint:** `GET /api/v1/categories`
- **Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "category_id": "string",
      "category_name": "string",
      "category_color": "#FF6B6B",
      "description": "string",
      "course_count": 25,
      "is_active": true
    }
  ]
}
```
- **Nghiệp vụ:** Lấy danh sách tất cả danh mục khóa học
- **Database:** Đọc từ `categories` table

### 15.2 Lấy khóa học theo danh mục
- **Endpoint:** `GET /api/v1/categories/{category_id}/courses?page={page}&limit={limit}&sort={sort}`
- **Path Parameters:**
  - `category_id`: ID danh mục
- **Query Parameters:**
  - `page`: Số trang
  - `limit`: Số item trên trang
  - `sort`: Sắp xếp
- **Response:**
```json
{
  "request_id": "string",
  "data": [CourseDto],
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  }
}
```
- **Nghiệp vụ:** Lấy danh sách khóa học theo danh mục
- **Database:** Đọc từ `courses`, `categories` table

---

## 16. COMMON APIs

### 16.1 Health check
- **Endpoint:** `GET /api/v1/health`
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "status": "OK",
    "timestamp": "string",
    "version": "1.0.0"
  }
}
```
- **Nghiệp vụ:** Kiểm tra trạng thái hệ thống
- **Database:** Không

### 16.2 Test gửi email
- **Endpoint:** `POST /api/v1/test-mail`
- **Request Body:**
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "body": "Test content"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "sent": true,
    "message_id": "string"
  }
}
```
- **Nghiệp vụ:** Test chức năng gửi email
- **Database:** Không

### 16.3 Lấy signed URL
- **Endpoint:** `GET /api/v1/signed-url?file_path={path}&expires={seconds}`
- **Headers:** `Authorization: Bearer {access_token}`
- **Query Parameters:**
  - `file_path`: Đường dẫn file trên S3
  - `expires`: Thời gian hết hạn (seconds)
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "signed_url": "string",
    "expires_at": "string"
  }
}
```
- **Nghiệp vụ:** Tạo URL có chữ ký để truy cập file
- **Database:** Không

### 16.4 Liên hệ
- **Endpoint:** `POST /api/v1/contact`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "contact_id": "string",
    "submitted": true
  }
}
```
- **Nghiệp vụ:** Gửi form liên hệ
- **Database:** Ghi vào `contact_forms` table

---

## 17. CUSTOMER APIs

### 17.1 Đăng ký thông tin khách hàng
- **Endpoint:** `POST /api/v1/customer`
- **Request Body:**
```json
{
  "user_name": "string",
  "email": "string",
  "phone": "string",
  "referral_code": "string"
}
```
- **Response:**
```json
{
  "request_id": "string",
  "data": {
    "userId": "string",
    "user_name": "string",
    "email": "string",
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```
- **Nghiệp vụ:** Đăng ký nhanh thông tin khách hàng cho funnel
- **Database:** Ghi vào `users` table

---

## Database Tables Summary

### Core Tables:
1. **users** - Thông tin người dùng, đọc/ghi/cập nhật
2. **courses** - Thông tin khóa học, chủ yếu đọc
3. **lessons** - Bài học, chủ yếu đọc
4. **chapters** - Chương học, chủ yếu đọc
5. **categories** - Danh mục, chủ yếu đọc
6. **courses_users** - Khóa học của user, đọc/ghi/cập nhật
7. **payments2** - Giao dịch thanh toán, ghi/đọc/cập nhật
8. **carts** - Giỏ hàng, đọc/ghi/cập nhật/xóa
9. **notes** - Ghi chú, đọc/ghi/cập nhật/xóa
10. **exercises** - Bài tập, chủ yếu đọc
11. **exercises_results** - Kết quả bài tập, ghi/đọc
12. **rates** - Đánh giá, đọc/ghi
13. **notifications** - Thông báo, đọc/cập nhật
14. **admin_notifications_2** - Thông báo admin, đọc/ghi
15. **chat** - Chat, ghi/đọc
16. **support** - Hỗ trợ, ghi/đọc
17. **support_chat** - Chat hỗ trợ, ghi/đọc
18. **course_chat** - Chat khóa học, ghi/đọc
19. **live_chat** - Chat livestream, ghi/đọc
20. **user_referral_tree** - Cây giới thiệu, đọc/ghi/cập nhật
21. **referral_transaction** - Giao dịch giới thiệu, ghi/đọc (Lưu ý: Có thể không được sử dụng trực tiếp)

### Authentication Tables:
22. **personal_access_tokens** - Token xác thực, đọc/ghi/cập nhật
23. **otp_token** - OTP, ghi/đọc (có TTL)

### Payment Tables:
24. **user_installments** - Trả góp, đọc/cập nhật
25. **course_payment_slot** - Slot thanh toán khóa học, ghi/đọc

### System Tables:
26. **zoom_links** - Liên kết Zoom, đọc
27. **map_zoom_links** - Mapping Zoom links, đọc/ghi
28. **zoom_sdk_credentials** - Thông tin đăng nhập Zoom SDK, đọc
29. **contact_forms** - Form liên hệ, ghi
30. **progress_log** - Log tiến độ học, ghi/đọc
31. **histories_join** - Lịch sử tham gia, ghi/đọc
32. **user_chat_history** - Lịch sử chat user, ghi/đọc
33. **admins** - Thông tin admin, đọc
34. **experts** - Thông tin chuyên gia, đọc
35. **banners** - Banner hệ thống, đọc
36. **campaign** - Chiến dịch khuyến mãi, đọc
37. **affiliate_participants** - Người tham gia affiliate, đọc/ghi/cập nhật
38. **affiliate_campaigns** - Chiến dịch affiliate, đọc
39. **point_transaction_history** - Lịch sử giao dịch điểm, ghi/đọc/cập nhật

---

## Error Codes và Response Format

### Standard Response Format:
```json
{
  "request_id": "string",
  "data": "any",
  "page": {
    "current": 1,
    "total": 100,
    "per_page": 10
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` - Không có quyền truy cập
- `VALIDATION_ERROR` - Lỗi validate dữ liệu
- `NOT_FOUND` - Không tìm thấy resource
- `ALREADY_EXISTS` - Dữ liệu đã tồn tại
- `PAYMENT_FAILED` - Thanh toán thất bại
- `INSUFFICIENT_BALANCE` - Không đủ số dư
- `COURSE_NOT_PURCHASED` - Chưa mua khóa học
- `LESSON_LOCKED` - Bài học bị khóa
- `EXERCISE_LIMIT_EXCEEDED` - Vượt quá số lần làm bài
- `OTP_EXPIRED` - OTP hết hạn
- `OTP_INVALID` - OTP không đúng

---

## Authentication

Hệ thống sử dụng JWT tokens với 2 loại:
- **Access Token**: Thời gian sống ngắn, dùng để xác thực API calls
- **Refresh Token**: Thời gian sống dài, dùng để tạo access token mới

Headers cần thiết:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## Rate Limiting

- **Authentication APIs**: 5 requests/minute per IP
- **Payment APIs**: 10 requests/minute per user
- **General APIs**: 100 requests/minute per user
- **Chat APIs**: 50 requests/minute per user

---

## Pagination

Hầu hết APIs hỗ trợ pagination với parameters:
- `page`: Số trang (mặc định: 1)
- `limit`: Số items per page (mặc định: 10, max: 100)

Response sẽ có thêm `page` object chứa thông tin phân trang.
