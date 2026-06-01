# PHASE_2_FACEBOOK_PROJECTS_AI_SEO.md

# Điện Máy Nga Sơn - Phase 2
## Công Trình Thực Tế + Facebook Integration + AI SEO Generator

## Mục tiêu

Biến mỗi công trình thực tế thành:

- 1 Facebook Post
- 1 Landing Page SEO
- 1 Tài sản SEO lâu dài trên website

Mục tiêu dài hạn:

- 365 công trình/năm
- 365 bài Facebook
- 365 landing page SEO
- Tăng độ phủ từ khóa địa phương Kinh Môn - Hải Dương

---

# Kiến trúc tổng thể

Facebook
↓
Công trình thực tế (Projects)
↓
AI hỗ trợ tạo nội dung SEO
↓
Website Publish
↓
Google Index

---

# Module Projects

## Database

Bảng:

projects

Các trường đề xuất:

- id
- title
- slug
- category
- location
- facebook_url
- thumbnail
- content
- seo_title
- seo_description
- status
- created_at
- updated_at

## Categories

- Lắp đặt điều hòa
- Bảo dưỡng điều hòa
- Sửa điều hòa
- Sửa máy giặt
- Giao hàng
- Lắp đặt tivi
- Tủ lạnh
- Công trình khác

---

# Admin CMS

## Routes

/admin/projects

/admin/projects/new

/admin/projects/[id]/edit

## Chức năng

- Tạo công trình
- Sửa công trình
- Xóa công trình
- Draft / Published
- Gắn link Facebook
- SEO metadata

---

# Public Website

## Danh sách

/du-an

Hoặc

/cong-trinh-thuc-te

## Chi tiết

/du-an/[slug]

Ví dụ:

/du-an/lap-dieu-hoa-daikin-hiep-an-kinh-mon

---

# Facebook Integration V1

Không dùng API.

Admin nhập:

- Tiêu đề
- Link Facebook Post
- Ảnh đại diện
- Mô tả ngắn
- Nội dung

Website hiển thị:

- Link Facebook gốc
- Nút xem bài đăng

Điều kiện:

- Facebook Post phải để Public

---

# Facebook Integration V2

Import thủ công từ Facebook.

Workflow:

1. Copy link Facebook
2. Paste vào CMS
3. Hệ thống đọc metadata
4. Sinh draft công trình
5. Admin chỉnh sửa
6. Publish

---

# Facebook Integration V3

Meta Graph API.

Workflow:

Facebook Page
↓
Graph API
↓
Import bài mới
↓
Lưu Draft
↓
Admin duyệt
↓
Publish

Lưu ý:

Ưu tiên Facebook Page thay vì Facebook cá nhân.

---

# AI SEO Generator

## Mục tiêu

Giảm thời gian tạo bài SEO xuống dưới 3 phút.

## Input

- Tiêu đề Facebook
- Mô tả Facebook
- Địa điểm
- Loại dịch vụ

## AI sinh

- SEO Title
- Slug
- Meta Description
- H1
- Outline
- Nội dung SEO
- FAQ
- Schema gợi ý

---

# Workflow AI

Bước 1

Đăng Facebook:

- 5-10 ảnh
- 1 video
- mô tả ngắn

Bước 2

Copy link Facebook

Bước 3

CMS

Tạo công trình mới

Bước 4

AI đọc:

- tiêu đề
- mô tả
- địa điểm
- loại dịch vụ

Bước 5

AI sinh:

- slug
- seo title
- meta description
- bài SEO hoàn chỉnh

Bước 6

Admin chỉnh sửa

Bước 7

Publish

---

# SEO Local Area Expansion

Sau khi có nhiều công trình:

Tạo trang khu vực:

- /kinh-mon
- /quang-thanh
- /hiep-an
- /minh-tan
- /phuc-thanh

Mỗi trang gồm:

- Công trình đã làm
- Dịch vụ nổi bật
- Sản phẩm nổi bật
- Lead Form

---

# Thư viện ảnh thực tế

Route:

/hinh-anh-thuc-te

Bộ lọc:

- Điều hòa
- Máy giặt
- Tivi
- Tủ lạnh
- Giao hàng
- Lắp đặt

---

# KPI Sau 12 Tháng

Mục tiêu:

- 300-500 công trình
- 300-500 bài Facebook
- 300-500 landing page SEO
- Tăng mạnh độ phủ SEO địa phương

---

# Thứ tự triển khai

Sau khi hoàn thành CMS cốt lõi:

1. Service CRUD
2. Blog CRUD
3. Lead Management
4. Settings Management
5. Cloudinary
6. Production CMS

Sau đó:

7. Projects Module
8. Facebook Link Integration
9. AI SEO Generator
10. Local Area Pages
11. Real Project Gallery

