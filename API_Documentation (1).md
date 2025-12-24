# MTT LMS API Documentation

## Tổng quan
Đây là tài liệu API cho hệ thống MTT Learning Management System (LMS), cung cấp các endpoint để quản lý khóa học, sự kiện, người dùng và các tính năng khác.

## Base URL
```
https://api.mtt.com
```

## Authentication
Hầu hết các API yêu cầu xác thực thông qua JWT token trong header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication APIs

### 1.1 Đăng nhập bằng Social Media
**Endpoint:** `POST /auth/login-by-social`  
**Phương thức:** POST  
**Mô tả:** Đăng nhập vào hệ thống thông qua tài khoản social media (Google, Facebook, Zalo, etc.)

**Request Body:**
```json
{
  "social_id": "string",
  "social_type": "GOOGLE|FACEBOOK|ZALO|APPLE",
  "user_name": "string",
  "email": "string",
  "phone": "string",
  "country_number": "string"
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### 1.2 Xác thực tài khoản Social
**Endpoint:** `GET /auth/verify-account-social`  
**Phương thức:** GET  
**Mô tả:** Xác thực tài khoản social media đã đăng ký

**Query Parameters:**
- `social_id`: ID từ social media
- `social_type`: Loại social media

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### 1.3 Lấy danh sách profile con
**Endpoint:** `GET /auth/list-kid-profile`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách profile của các tài khoản con (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "user_id": "string",
      "user_name": "string",
      "email": "string",
      "phone": "string"
    }
  ]
}
```

---

## 2. Course APIs

### 2.1 Lấy gợi ý khóa học
**Endpoint:** `GET /course/suggestions`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách gợi ý khóa học dựa trên từ khóa

**Query Parameters:**
- `keyword`: Từ khóa tìm kiếm

**Response:**
```json
{
  "request_id": "string",
  "data": ["course_id_1", "course_id_2"]
}
```

### 2.2 Yêu thích khóa học
**Endpoint:** `POST /course/favorite`  
**Phương thức:** POST  
**Mô tả:** Thêm/xóa khóa học khỏi danh sách yêu thích (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "course_id": "string",
  "is_favorite": true
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": true
}
```

### 2.3 Lấy thumbnail khóa học
**Endpoint:** `GET /course/{id}/thumbnail`  
**Phương thức:** GET  
**Mô tả:** Lấy hình ảnh thumbnail của khóa học

**Path Parameters:**
- `id`: ID khóa học

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "course_id": "string",
    "thumbnail_url": "string",
    "title": "string"
  }
}
```

---

## 3. Event APIs

### 3.1 Lấy danh sách sự kiện trực tiếp
**Endpoint:** `GET /events/live`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách các sự kiện trực tiếp (yêu cầu xác thực cơ bản)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `from`: Thời gian bắt đầu (optional)
- `to`: Thời gian kết thúc (optional)
- `teacher_id`: ID giáo viên (optional)
- `category_id`: ID danh mục (optional)

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "lesson_id": "string",
      "title": "string",
      "start_time": "string",
      "end_time": "string",
      "teacher_name": "string",
      "category_name": "string"
    }
  ]
}
```

### 3.2 Lấy chi tiết sự kiện trực tiếp
**Endpoint:** `GET /events/live/{lesson_id}`  
**Phương thức:** GET  
**Mô tả:** Lấy thông tin chi tiết của một sự kiện trực tiếp (yêu cầu xác thực cơ bản)

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `lesson_id`: ID bài học/sự kiện

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "lesson_id": "string",
    "title": "string",
    "description": "string",
    "start_time": "string",
    "end_time": "string",
    "teacher_info": {},
    "zoom_info": {},
    "materials": []
  }
}
```

### 3.3 Đăng ký sự kiện trực tiếp
**Endpoint:** `POST /events/live/register`  
**Phương thức:** POST  
**Mô tả:** Đăng ký tham gia sự kiện trực tiếp (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "course_id": "string"
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "message": "Đăng ký thành công"
  }
}
```

### 3.4 Lấy danh sách sự kiện đã đăng ký
**Endpoint:** `GET /events/registered`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách các sự kiện mà người dùng đã đăng ký (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "lesson_id": "string",
      "title": "string",
      "start_time": "string",
      "status": "registered"
    }
  ]
}
```

### 3.5 Hủy đăng ký sự kiện
**Endpoint:** `DELETE /events/live/unregister`  
**Phương thức:** DELETE  
**Mô tả:** Hủy đăng ký tham gia sự kiện trực tiếp (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "message": "Hủy đăng ký thành công"
  }
}
```

---

## 4. User APIs

### 4.1 Lấy thông tin người dùng
**Endpoint:** `GET /user/info`  
**Phương thức:** GET  
**Mô tả:** Lấy thông tin chi tiết của người dùng hiện tại (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "user_id": "string",
    "user_name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "gender": 1,
    "birthday": "string",
    "address": "string"
  }
}
```

### 4.2 Cập nhật thông tin người dùng
**Endpoint:** `PUT /user/info`  
**Phương thức:** PUT  
**Mô tả:** Cập nhật thông tin cá nhân của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "user_name": "string",
  "phone": "string",
  "email": "string",
  "avatar": "string",
  "gender": 1,
  "birthday": "string",
  "address": "string"
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "user_id": "string",
    "user_name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

### 4.3 Xóa tài khoản
**Endpoint:** `DELETE /user/account`  
**Phương thức:** DELETE  
**Mô tả:** Xóa tài khoản người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": true
}
```

### 4.4 Lấy lịch sử giao dịch điểm
**Endpoint:** `GET /user/point-history`  
**Phương thức:** GET  
**Mô tả:** Lấy lịch sử các giao dịch điểm của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "transaction_id": "string",
      "point_amount": 100,
      "transaction_type": "earn|spend",
      "description": "string",
      "created_at": "string"
    }
  ]
}
```

### 4.5 Lấy tổng điểm người dùng
**Endpoint:** `GET /user/total-points`  
**Phương thức:** GET  
**Mô tả:** Lấy tổng số điểm hiện tại của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": 1500
}
```

---

## 5. Banner APIs

### 5.1 Lấy danh sách banner
**Endpoint:** `GET /banners`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách tất cả banner (yêu cầu xác thực cơ bản)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "banner_id": "string",
      "title": "string",
      "image_url": "string",
      "link_url": "string",
      "order": 1
    }
  ]
}
```

### 5.2 Lấy banner sự kiện
**Endpoint:** `GET /banners/event`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách banner liên quan đến sự kiện (yêu cầu xác thực cơ bản)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "banner_id": "string",
      "title": "string",
      "image_url": "string",
      "event_id": "string"
    }
  ]
}
```

---

## 6. Lesson APIs

### 6.1 Tìm kiếm bài học
**Endpoint:** `GET /lessons/search`  
**Phương thức:** GET  
**Mô tả:** Tìm kiếm bài học theo từ khóa

**Query Parameters:**
- `keyword`: Từ khóa tìm kiếm
- `category_id`: ID danh mục (optional)
- `teacher_id`: ID giáo viên (optional)

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "lesson_id": "string",
      "title": "string",
      "description": "string",
      "duration": 60,
      "teacher_name": "string"
    }
  ]
}
```

### 6.2 Lấy bài học theo giáo viên
**Endpoint:** `GET /lessons/teacher/{teacher_id}`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách bài học của một giáo viên cụ thể

**Path Parameters:**
- `teacher_id`: ID giáo viên

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "lesson_id": "string",
      "title": "string",
      "description": "string",
      "created_at": "string"
    }
  ]
}
```

### 6.3 Cập nhật tiến độ học tập
**Endpoint:** `POST /lessons/progress`  
**Phương thức:** POST  
**Mô tả:** Cập nhật tiến độ học tập của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "lesson_id": "string",
  "progress_percentage": 75,
  "time_watched": 1800
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "message": "Cập nhật tiến độ thành công"
  }
}
```

---

## 7. Notification APIs

### 7.1 Lấy cài đặt thông báo
**Endpoint:** `GET /notifications/settings`  
**Phương thức:** GET  
**Mô tả:** Lấy cài đặt thông báo của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "push_notification": true,
    "email_notification": false,
    "sms_notification": true,
    "course_updates": true,
    "event_reminders": true
  }
}
```

### 7.2 Cập nhật cài đặt thông báo
**Endpoint:** `PUT /notifications/settings`  
**Phương thức:** PUT  
**Mô tả:** Cập nhật cài đặt thông báo của người dùng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "push_notification": true,
  "email_notification": false,
  "sms_notification": true,
  "course_updates": true,
  "event_reminders": true
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "push_notification": true,
    "email_notification": false,
    "sms_notification": true,
    "course_updates": true,
    "event_reminders": true
  }
}
```

### 7.3 Đánh dấu thông báo đã đọc
**Endpoint:** `POST /notifications/read`  
**Phương thức:** POST  
**Mô tả:** Đánh dấu thông báo là đã đọc (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notification_ids": ["id1", "id2", "id3"]
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "message": "Đánh dấu đã đọc thành công"
  }
}
```

---

## 8. FAQ APIs

### 8.1 Lấy danh sách FAQ
**Endpoint:** `GET /faqs`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách các câu hỏi thường gặp

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "faq_id": "string",
      "question": "string",
      "answer": "string",
      "category": "string",
      "order": 1
    }
  ]
}
```

---

## 9. News APIs

### 9.1 Lấy tin tức mới nhất
**Endpoint:** `GET /news/latest`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách tin tức mới nhất

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "news_id": "string",
      "title": "string",
      "summary": "string",
      "image_url": "string",
      "published_at": "string"
    }
  ]
}
```

### 9.2 Lấy chi tiết tin tức
**Endpoint:** `GET /news/{news_id}`  
**Phương thức:** GET  
**Mô tả:** Lấy nội dung chi tiết của một tin tức

**Path Parameters:**
- `news_id`: ID tin tức

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "news_id": "string",
    "title": "string",
    "content": "string",
    "image_url": "string",
    "author": "string",
    "published_at": "string",
    "tags": ["tag1", "tag2"]
  }
}
```

---

## 10. Payment APIs

### 10.1 Lấy thông tin khóa học theo giao dịch
**Endpoint:** `GET /payment/course/{transaction_id}`  
**Phương thức:** GET  
**Mô tả:** Lấy thông tin khóa học dựa trên ID giao dịch thanh toán (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `transaction_id`: ID giao dịch thanh toán

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "course_id": "string",
    "course_name": "string",
    "transaction_status": "completed",
    "purchase_date": "string"
  }
}
```

---

## 11. QR Payment APIs

### 11.1 Lấy danh sách khóa học QR
**Endpoint:** `GET /qr-pay/courses`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách khóa học có thể mua qua QR code

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "course_id": "string",
      "course_name": "string",
      "price": 500000,
      "qr_code": "string"
    }
  ]
}
```

### 11.2 Mua khóa học qua QR
**Endpoint:** `POST /qr-pay/buy`  
**Phương thức:** POST  
**Mô tả:** Thực hiện mua khóa học thông qua QR code (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "course_id": "string",
  "qr_code": "string"
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "transaction_id": "string",
    "message": "Mua khóa học thành công"
  }
}
```

---

## 12. Affiliate Campaign APIs

### 12.1 Lấy danh sách phần thưởng đổi điểm
**Endpoint:** `GET /affiliate/rewards`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách các phần thưởng có thể đổi bằng điểm (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "reward_id": "string",
      "name": "string",
      "description": "string",
      "point_cost": 1000,
      "available_quantity": 50
    }
  ]
}
```

### 12.2 Đổi điểm lấy phần thưởng
**Endpoint:** `POST /affiliate/exchange`  
**Phương thức:** POST  
**Mô tả:** Thực hiện đổi điểm để lấy phần thưởng (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reward_id": "string",
  "quantity": 1
}
```

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "success": true,
    "exchange_id": "string",
    "message": "Đổi thưởng thành công"
  }
}
```

---

## 13. Support APIs

### 13.1 Lấy danh sách hỗ trợ đã kết thúc
**Endpoint:** `GET /support/ended`  
**Phương thức:** GET  
**Mô tả:** Lấy danh sách các yêu cầu hỗ trợ đã hoàn thành (yêu cầu xác thực)

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "request_id": "string",
  "data": [
    {
      "support_id": "string",
      "title": "string",
      "status": "resolved",
      "resolved_at": "string",
      "agent_name": "string"
    }
  ]
}
```

---

## 14. Chat APIs

### 14.1 Lấy tùy chọn chat
**Endpoint:** `GET /chat/options`  
**Phương thức:** GET  
**Mô tả:** Lấy các tùy chọn chat hỗ trợ

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "chat_enabled": true,
    "support_hours": "8:00 - 18:00",
    "chat_types": ["support", "general", "technical"]
  }
}
```

---

## 15. App Configuration APIs

### 15.1 Lấy cấu hình ứng dụng
**Endpoint:** `GET /config/app`  
**Phương thức:** GET  
**Mô tả:** Lấy cấu hình chung của ứng dụng

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "app_name": "MTT LMS",
    "version": "2.0.0",
    "maintenance_mode": false,
    "features": {
      "live_streaming": true,
      "offline_events": true,
      "qr_payment": true
    }
  }
}
```

### 15.2 Lấy phiên bản ứng dụng
**Endpoint:** `GET /version/app`  
**Phương thức:** GET  
**Mô tả:** Lấy thông tin phiên bản ứng dụng

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "current_version": "2.0.0",
    "latest_version": "2.1.0",
    "force_update": false,
    "update_message": "Có phiên bản mới"
  }
}
```

---

## 16. Maintenance APIs

### 16.1 Kiểm tra trạng thái bảo trì
**Endpoint:** `GET /maintenance/status`  
**Phương thức:** GET  
**Mô tả:** Kiểm tra xem hệ thống có đang trong chế độ bảo trì hay không

**Response:**
```json
{
  "request_id": "string",
  "data": {
    "maintenance_mode": false,
    "message": "Hệ thống hoạt động bình thường",
    "estimated_duration": null
  }
}
```

---

## Error Responses

Tất cả các API đều trả về format response thống nhất. Khi có lỗi, response sẽ có cấu trúc:

```json
{
  "request_id": "string",
  "error": {
    "code": "ERROR_CODE",
    "message": "Mô tả lỗi chi tiết",
    "details": {}
  }
}
```

## Common Error Codes

- `UNAUTHORIZED`: Chưa xác thực hoặc token hết hạn
- `FORBIDDEN`: Không có quyền truy cập
- `BAD_REQUEST`: Dữ liệu request không hợp lệ
- `NOT_FOUND`: Tài nguyên không tồn tại
- `INTERNAL_SERVER_ERROR`: Lỗi hệ thống

## Rate Limiting

- **Public APIs**: 100 requests/minute
- **Authenticated APIs**: 1000 requests/minute
- **Admin APIs**: 5000 requests/minute

## Notes

- Tất cả thời gian đều sử dụng format ISO 8601
- Các ID sử dụng UUID format
- File upload giới hạn 10MB cho hình ảnh, 100MB cho video
- API timeout: 20 giây
- Hỗ trợ CORS cho các domain được cấu hình
