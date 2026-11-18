# ⚡ Giải Mã Cấu Hình Electron (EdTech Realtime Quiz)

Ứng dụng web Single-Page Application (SPA) tổ chức trò chơi trắc nghiệm Hóa học tương tác thời gian thực dành cho lớp học, tối ưu cho máy chiếu giáo viên và điện thoại học sinh.

---

## 🔗 Đường dẫn sử dụng trực tiếp (Live Links)

### 1. Trên GitHub Pages:
* 📱 **Màn hình Học sinh (Điện thoại):** [https://vynguyen-gif.github.io/electron-quiz/](https://vynguyen-gif.github.io/electron-quiz/)
* 🖥️ **Màn hình Giáo viên (Máy chiếu / Bảng xếp hạng):** [https://vynguyen-gif.github.io/electron-quiz/?view=teacher](https://vynguyen-gif.github.io/electron-quiz/?view=teacher) *(hoặc [teacher.html](https://vynguyen-gif.github.io/electron-quiz/teacher.html))*

> 💡 **Mẹo:** Ngay tại màn hình nhập tên của học sinh, Thầy/Cô cũng có thể bấm trực tiếp vào nút **"🖥️ Thầy/Cô bấm vào đây để mở Màn hình Giáo viên"** ở phía dưới để chuyển giao diện nhanh mà không cần gõ URL.

### 2. Trên Vercel (Nếu đã import dự án):
* 📱 **Màn hình Học sinh:** `https://<ten-du-an>.vercel.app/`
* 🖥️ **Màn hình Giáo viên:** `https://<ten-du-an>.vercel.app/?view=teacher` *(hoặc `https://<ten-du-an>.vercel.app/teacher`)*

---

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
- Truy cập qua tham số URL: `?view=teacher` hoặc file `teacher.html`.
- Tự động tạo mã QR kích thước lớn để học sinh quét trên màn hình lớn.
- Bộ đếm sĩ số học sinh kết nối theo thời gian thực.
- Bảng xếp hạng Top 5 (Dynamic Leaderboard) cập nhật tức thì với hiệu ứng đổi vị trí khi học sinh nộp bài.
- Chức năng làm mới phiên chơi cho các lớp tiếp theo.

---

## 🚀 Hướng dẫn cấu hình Supabase

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard) và tạo project mới.
2. Mở tab **SQL Editor**, dán toàn bộ nội dung trong file `schema.sql` và bấm **Run**.
3. Mở file `script.js` và điền URL và API Key của bạn:
```javascript
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
```
