# ⚡ Giải Mã Cấu Hình Electron (EdTech Realtime Quiz)

Ứng dụng web Single-Page Application (SPA) tổ chức trò chơi trắc nghiệm Hóa học tương tác thời gian thực dành cho lớp học, tối ưu cho máy chiếu giáo viên và điện thoại học sinh.

## 🛠️ Stack công nghệ
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Tailwind CSS (CDN).
- **Backend & Realtime Database**: [Supabase](https://supabase.com/) (PostgreSQL + Supabase Realtime).
- **Thư viện phụ trợ**: QRCode.js, Canvas Confetti.

---

## 🌟 Tính năng chính

### 1. Luồng Học sinh (Student View - Mobile First)
- Quét mã QR tham gia ngay, không cần cài đặt ứng dụng.
- Đồng hồ đếm ngược 30 giây với thanh tiến trình trực quan (Xanh ➔ Vàng ➔ Đỏ).
- Hệ thống tính điểm dựa trên tốc độ phản xạ (tối đa 2000 điểm/câu: 1000 điểm gốc + 1000 điểm tốc độ).
- Phản hồi tức thì (Real-time feedback) giải thích bản chất hóa học sau mỗi câu hỏi.
- Chống mất dữ liệu khi vô tình tải lại trang (`sessionStorage`).

### 2. Luồng Giáo viên (Teacher View - Desktop / Projector)
- Truy cập qua tham số URL: `?view=teacher`.
- Tự động tạo mã QR kích thước lớn để học sinh quét trên màn hình lớn.
- Bộ đếm sĩ số học sinh kết nối theo thời gian thực.
- Bảng xếp hạng Top 5 (Dynamic Leaderboard) cập nhật tức thì với hiệu ứng đổi vị trí khi học sinh nộp bài.
- Chức năng làm mới phiên chơi cho các lớp tiếp theo.

---

## 🚀 Hướng dẫn cài đặt & Triển khai

### Bước 1: Thiết lập Database Supabase
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard) và tạo project mới.
2. Mở tab **SQL Editor**, dán toàn bộ nội dung trong file `schema.sql` và bấm **Run**.

### Bước 2: Cấu hình API Key trong `script.js`
Mở file `script.js` và cập nhật thông tin dự án của bạn:
```javascript
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
```

### Bước 3: Chạy ứng dụng
Mở thư mục trên bất kỳ máy chủ HTTP nào (Live Server trên VS Code, Python HTTP server, GitHub Pages, Vercel, Netlify,...):
```bash
python -m http.server 8085
```
- **Học sinh tham gia**: `http://localhost:8085/` (hoặc domain triển khai)
- **Màn hình giáo viên**: `http://localhost:8085/?view=teacher`

---

## 📄 Bản quyền & Tác giả
Phát triển cho mục đích giáo dục môn Hóa học (Chương Cấu trúc nguyên tử & Cấu hình electron).
