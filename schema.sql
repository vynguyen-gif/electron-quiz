-- Kịch bản khởi tạo Database Supabase (PostgreSQL)
-- Bảng leaderboard cho trò chơi Giải mã cấu hình electron

CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    score INT4 NOT NULL DEFAULT 0,
    last_answered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Cấu hình REPLICA IDENTITY để Supabase Realtime gửi đầy đủ record khi UPDATE
ALTER TABLE public.leaderboard REPLICA IDENTITY FULL;

-- Policies cho phép truy cập qua anon role
CREATE POLICY "Cho phép đọc công khai leaderboard"
ON public.leaderboard FOR SELECT
TO anon
USING (true);

CREATE POLICY "Cho phép học sinh đăng ký"
ON public.leaderboard FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Cho phép cập nhật điểm"
ON public.leaderboard FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Kích hoạt Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;
