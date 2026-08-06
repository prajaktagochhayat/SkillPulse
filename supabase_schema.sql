-- ====================================================================
-- SKILLPULSE ASSESSMENTS PLATFORM - PRODUCTION SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase Project: SQL Editor -> New Query
-- ====================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('ADMIN', 'STUDENT')) DEFAULT 'STUDENT',
  status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
  avatar_url TEXT,
  bio TEXT,
  xp_points INT DEFAULT 1400,
  level INT DEFAULT 4,
  streak_days INT DEFAULT 6,
  saved_quiz_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. QUIZZES (SUBJECT TRACKS) TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
  duration_minutes INT DEFAULT 20,
  passing_score_pct INT DEFAULT 60,
  max_attempts INT DEFAULT 3,
  status TEXT CHECK (status IN ('Draft', 'Published')) DEFAULT 'Published',
  thumbnail_url TEXT,
  average_rating NUMERIC(3, 2) DEFAULT 4.90,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CHAPTERS TABLE (SUBJECT CURRICULUM WITH OVERVIEW NOTES)
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  summary_notes TEXT NOT NULL, -- Multi-paragraph study notes
  key_concepts TEXT[] DEFAULT '{}',
  code_example TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUESTIONS BANK TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT CHECK (type IN ('single', 'multiple', 'boolean', 'text')) DEFAULT 'single',
  marks INT DEFAULT 1,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Intermediate',
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUESTION OPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);

-- 7. QUIZ ATTEMPTS & EVALUATION RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  certificate_id TEXT UNIQUE NOT NULL,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE SET NULL,
  quiz_title TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  score INT DEFAULT 0,
  total_marks INT DEFAULT 0,
  percentage INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  unanswered_count INT DEFAULT 0,
  time_taken_seconds INT DEFAULT 0,
  status TEXT CHECK (status IN ('PASSED', 'FAILED')) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH-SPEED QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_quizzes_category ON public.quizzes(category_id);
CREATE INDEX IF NOT EXISTS idx_chapters_quiz ON public.chapters(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_certificate ON public.quiz_attempts(certificate_id);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated read policies
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Public read chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Users read own attempts" ON public.quiz_attempts FOR SELECT USING (true);
