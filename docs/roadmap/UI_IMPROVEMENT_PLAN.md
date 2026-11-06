# UI_IMPROVEMENT_PLAN.md

# Điện Máy Nga Sơn – Kế hoạch cải thiện UI

Ngày lập: 2026-11-06

Phạm vi: website public (trang chủ, sản phẩm, dịch vụ, header, footer, CTA mobile).

Tài liệu gốc phải tuân theo: `docs/UI_UX_GUIDELINES.md`, `AGENTS.md`.

---

# 1. Mục tiêu

* Tăng tỉ lệ chuyển đổi: gọi điện, nhắn Zalo, Messenger, gửi báo giá.
* Mobile là ưu tiên số 1 (320–414px).
* Tạo niềm tin bằng nội dung thật: ảnh thật, công trình thật, số liệu thật.
* Giữ Lighthouse: Performance > 90, Accessibility > 90, SEO > 95.

Không làm:

* Giỏ hàng, thanh toán, carousel tự chạy, video nền, animation nặng (Framer Motion).
* Số liệu, đánh giá, cam kết không có thật.

---

# 2. Hiện trạng (đánh giá ngày 2026-11-06)

Kiểm tra bằng trình duyệt ở 1440px và 375px (giả lập mobile).

## 2.1 Lỗi nghiêm trọng

| # | Vấn đề | Vị trí |
|---|---|---|
| A1 | Mobile không có menu điều hướng (link bị ẩn, không có nút ☰). Menu thiếu "Công trình thực tế". | `src/components/layout/header.tsx` |
| A2 | Trang chủ lộ chữ ghi chú dev: "…không phải sản phẩm trong cơ sở dữ liệu", badge "Hiển thị trang chủ". Không dùng sản phẩm nổi bật thật trong DB. | `app/page.tsx` |
| A3 | Hero trang chủ hiển thị tỉ lệ doanh thu nội bộ 70% / 20% / 10%. | `app/page.tsx` |
| A4 | Danh sách sản phẩm mobile: 1 cột, mỗi thẻ cao ~722px, bộ lọc chiếm trọn màn hình đầu. | `app/products/page.tsx`, `product-card.tsx` |
| A5 | Thanh CTA dưới cùng dùng tiếng Anh ("Call", "Quote"), không icon, 4 nút ngang hàng, không tính safe-area iPhone. | `mobile-sticky-cta.tsx` |

## 2.2 Thiếu so với guidelines

* Không logo; hero không có hình; trang chủ chỉ có chữ.
* Danh mục, dịch vụ trên trang chủ là dữ liệu cứng, không link tới trang chi tiết thật.
* Thẻ sản phẩm hiển thị 3 thông số đầu tiên bất kỳ (thường là "Khu vực hỗ trợ / Bảo hành: Theo hãng" lặp lại), thiếu công suất, diện tích phòng, % giảm giá.
* Không lọc được theo công suất / diện tích phòng.
* Chưa có: công trình thực tế, logo hãng, đánh giá khách hàng, số liệu tin cậy có icon (guidelines mục 11, 15, 16).
* Trang dịch vụ chưa có bảng giá tham khảo cụ thể.
* Nút trên header mobile cao 36px (< 44px khuyến nghị).

## 2.3 Đang làm tốt (giữ nguyên)

* Bố cục chi tiết sản phẩm: ảnh trái – thông tin phải – form báo giá.
* Trang dịch vụ: quy trình từng bước, form dính bên phải.
* Không tràn ngang ở 375px; footer chừa chỗ cho thanh CTA.

---

# 3. Nghiên cứu tham khảo

| Nguồn | Học được |
|---|---|
| Điện Máy Xanh, Nguyễn Kim | Lọc theo "1 HP – 9.000 BTU", nhãn "Dưới 15m²" trên thẻ, badge -%, dòng quà tặng / miễn phí lắp đặt, nội dung tư vấn dưới lưới sản phẩm. |
| Website điện lạnh địa phương (trungtamdienlanhhanoi24h.vn, dienlanhtrunganh.com, chuyensuadieuhoahanoi.com) | Bảng giá theo triệu chứng (Hạng mục / Dấu hiệu / Giá tham khảo), "Kiểm tra miễn phí – báo giá trước khi sửa", quy trình 4 bước, danh sách xã/phường, ảnh thợ thật, nút Zalo/Gọi nổi. Lỗi cần tránh: số liệu mâu thuẫn giữa các trang, link `tel:` rỗng. |
| meta.vn – bảng giá lắp đặt | Gói lắp đặt gồm 5m ống đồng; vượt tính theo mét theo HP; giá giá đỡ, dây điện, ống thoát nước. |
| One Hour Heating & Air, Genz-Ryan, Hiller (Mỹ) | Hero 1 câu + dải huy hiệu tin cậy, quy trình đơn giản, "dấu hiệu cần gọi thợ", gói bảo dưỡng định kỳ, danh sách khu vực phục vụ. |
| shadcnblocks (miễn phí), Breeze HVAC template (tham khảo bố cục) | Block Hero / Stats / Testimonial / FAQ / Logos. Không thay toàn bộ template – chỉ học bố cục. |

Quyết định: **không thay template**. Giữ codebase hiện tại (Next 16 + Tailwind 4), nâng cấp từng component.

---

# 4. Nguyên tắc thiết kế áp dụng

* Màu giữ theo guidelines: Primary `#0EA5E9`, CTA cam `#F97316`, nền section `#F8FAFC`.
* Icon: `lucide-react` (tree-shaken, chỉ import icon dùng tới).
* Bo góc `rounded-lg`/`rounded-xl`, bóng nhẹ, hover tinh tế (150–300ms).
* Nút bấm trên mobile cao tối thiểu 44px.
* Nút Gọi luôn nổi bật nhất (màu cam). Zalo thứ hai (xanh).
* Mọi số liệu/cam kết lấy từ một nguồn (Settings hoặc DB), không viết cứng ở nhiều nơi.
* Khối nội dung chưa có dữ liệu thì **ẩn**, không hiển thị nội dung giả.

---

# 5. Lộ trình

## Đợt 1 – Sửa lỗi & tối ưu mobile (không cần thêm nội dung) — HOÀN THÀNH 2026-11-06

Kết quả kiểm tra:

* Menu mobile hoạt động (link cao 48px, tự đóng khi chuyển trang); A1–A5 đã xử lý.
* Không tràn ngang ở 320px / 375px trên: trang chủ, sản phẩm, chi tiết sản phẩm, dịch vụ, liên hệ, giới thiệu, blog, công trình, 404 (sửa thêm lỗi tràn ngang có sẵn ở `/contact` khi 320px).
* Danh sách sản phẩm mobile: 2 cột, thẻ cao ~388px (trước ~722px), thẻ đầu tiên ở ~609px (trước ~869px).
* Lọc công suất khớp DB: 9.000 BTU = 4, 12.000 BTU = 5, 18.000 BTU = 3, 24.000 BTU = 0.
* Lighthouse mobile trang chủ (localhost): Accessibility 96, SEO 100. Best Practices 81 chỉ do chạy HTTP localhost.
* LCP lab (Slow 4G + CPU 4x, localhost): trang chủ 3,1s, trang giới thiệu 2,5s. ~1,2s là CSS chặn render (chung toàn site). Cần đo lại trên Vercel sau deploy.

Độ tương phản màu (đã xử lý 2026-11-06): nút cam `#F97316` → `#C2410C` (5,2:1), nút xanh `#0EA5E9` → `#0369A1` (5,9:1), chữ link `#0284C7` → `#0369A1`, badge giảm giá `#EF4444` → `#DC2626`. `#0EA5E9` chỉ còn dùng cho viền/trang trí.

### 1.1 Header

* Thêm menu mobile (nút ☰ → danh sách link, tap ≥ 44px, đóng khi chọn link).
* Thêm "Công trình" vào menu desktop + mobile.
* Desktop: hiển thị số điện thoại thật cạnh nút Gọi.
* Nút header mobile cao ≥ 44px.

### 1.2 Thanh CTA dưới cùng (mobile)

* Nhãn tiếng Việt + icon: **Gọi** (nền cam, nổi bật) · **Zalo** · **Messenger** · **Báo giá**.
* `padding-bottom: env(safe-area-inset-bottom)` cho iPhone.
* Giữ tracking GA4 (`phone_click`, `zalo_click`, `facebook_click`, `quote_click`).

### 1.3 Trang chủ

Thứ tự section mới (theo guidelines mục 10, bỏ phần chưa có dữ liệu):

1. **Hero**: tiêu đề + mô tả + Gọi ngay / Nhắn Zalo / Báo giá; dải cam kết bằng icon (chỉ cam kết đã có trong nội dung site: tư vấn miễn phí, báo giá trước khi làm, hỗ trợ tại Kinh Môn). Bên phải: **"Chọn điều hòa theo diện tích phòng"** (4 lựa chọn link tới bộ lọc). Bỏ khối 70/20/10.
2. **Danh mục có icon**, link tới `/products?category=...`.
3. **Điều hòa nổi bật**: sản phẩm `isFeatured` thật từ DB, dùng thẻ sản phẩm mới. Bỏ chữ dev.
4. **Dịch vụ nổi bật**: dịch vụ thật từ DB, link tới trang chi tiết.
5. **Công trình thực tế**: 3 công trình mới nhất (ẩn nếu chưa có).
6. **Thương hiệu**: logo nếu đã upload, nếu chưa thì tên hãng; link tới lọc theo hãng.
7. **Vì sao chọn chúng tôi**: có icon, giữ nội dung hiện tại (không thêm số liệu chưa xác thực).
8. Khu vực phục vụ, Blog, Form báo giá (giữ, chỉnh nhẹ).

### 1.4 Thẻ sản phẩm

* Badge **-X%** khi có giá khuyến mãi.
* Chip nổi bật lấy từ thông số: **Công suất**, **Diện tích phù hợp**, **Công nghệ** (Inverter).
* Bỏ mô tả ngắn và danh sách thông số dài trên thẻ (đã có ở trang chi tiết).
* Cả thẻ (ảnh + tên) link tới chi tiết; hành động: **Gọi** + **Zalo** (icon, gọn).
* Mobile **2 cột**; desktop 3–4 cột.

### 1.5 Trang danh sách sản phẩm

* Hero ngắn lại.
* **Chip danh mục** (Tất cả / Điều hòa / Tivi / Tủ lạnh / Máy giặt).
* **Chip công suất ↔ diện tích phòng** (chỉ với điều hòa): 9.000 BTU (< 15m²), 12.000 BTU (15–20m²), 18.000 BTU (20–30m²), 24.000 BTU (30–40m²). Bộ lọc mới `capacity` truy vấn thông số "Công suất".
* Bộ lọc chi tiết (hãng, giá, sắp xếp) gập lại trên mobile.

### 1.6 Footer

* Hiển thị số điện thoại, địa chỉ, giờ làm việc rõ ràng; link Công trình; danh sách khu vực phục vụ.

### Tiêu chí hoàn thành Đợt 1

* Không còn lỗi A1–A5.
* `tsc`, `eslint`, `next build` sạch.
* Kiểm tra trình duyệt ở 375px và 1440px: menu mobile hoạt động, không tràn ngang, sản phẩm 2 cột, lọc theo công suất đúng.
* Tracking GA4 vẫn hoạt động với nút mới.

---

## Đợt 2 – Tạo niềm tin — CODE HOÀN THÀNH 2026-11-06, chờ nội dung thật

Đã làm: logo (Settings → header), dải số liệu (Settings, tự ẩn), chính sách bảo hành + gói lắp đặt điều hòa (Settings, mỗi dòng một ý, tự ẩn), đánh giá khách hàng (`/admin/testimonials`, khối trang chủ tự ẩn), bảng giá dịch vụ (ô "Bảng giá tham khảo" trong form dịch vụ, dạng `Hạng mục | Giá | Ghi chú`), khu vực phục vụ (`/admin/service-areas`, footer lấy từ DB). Ảnh hero dùng Banner sẵn có; logo hãng dùng trường `logoUrl` của Brands.

| Hạng mục | Cách làm | Nội dung cần cung cấp |
|---|---|---|
| Logo | Upload qua Settings, hiển thị header/footer/OG | File logo |
| Ảnh hero | Upload qua Banner hoặc Settings | 1–3 ảnh cửa hàng/thợ/công trình |
| Dải số liệu tin cậy | Thêm khóa Settings: số năm, số công trình, thời gian phản hồi, bảo hành; khối tự ẩn nếu trống | Số liệu thật |
| Logo hãng | Upload logo trong admin Brands (đã có trường `logoUrl`) | Logo các hãng |
| Đánh giá khách hàng | Model `Testimonial` + admin CRUD (tên, xã/phường, nội dung, ảnh tùy chọn) | 3–5 đánh giá thật |
| Bảng giá dịch vụ | Trường bảng giá cho từng dịch vụ (Hạng mục / Dấu hiệu / Giá tham khảo), hiển thị dạng thẻ trên mobile | Bảng giá sửa, vệ sinh, nạp gas |
| Gói lắp đặt điều hòa | Khối trên trang chi tiết điều hòa: miễn phí gì, vật tư phát sinh theo mét/HP, bảo hành lắp đặt | Chính sách lắp đặt |
| Khu vực phục vụ | Danh sách xã/phường từ Settings | Danh sách xã/phường |

## Đợt 3 – Mở rộng — HOÀN THÀNH 2026-11-06

* Gói bảo dưỡng định kỳ: tạo như một dịch vụ trong admin (ví dụ "Gói vệ sinh 2 lần/năm") kèm bảng giá; không cần module riêng.
* Trang theo khu vực: `/khu-vuc/{slug}` (dùng tiền tố `/khu-vuc/` để tránh trùng route gốc) + `/khu-vuc`.
* Khối "Chọn điều hòa bao nhiêu BTU?" dưới lưới `/products` (khi xem tất cả hoặc danh mục điều hòa).
* Tìm kiếm: nút trên header → `/tim-kiem` (sản phẩm, dịch vụ, bài viết; gõ không dấu vẫn tìm được; `noindex`).
* Thư viện ảnh `/hinh-anh-thuc-te` lọc theo loại công trình.

---

# 6. Rủi ro & lưu ý

* Không đưa số liệu ước lượng lên web trước khi chủ cửa hàng xác nhận.
* Bộ lọc công suất dựa vào thông số "Công suất" nhập trong admin – sản phẩm thiếu thông số này sẽ không xuất hiện khi lọc. Admin cần nhập thống nhất dạng "9000 BTU".
* Ảnh sản phẩm hiện là ảnh mẫu; cần thay ảnh thật trước khi launch.

END OF FILE
