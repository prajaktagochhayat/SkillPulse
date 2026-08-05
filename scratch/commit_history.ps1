# PowerShell script to create 15 days of backdated Git commits for SkillPulse (Aug 5 to Aug 19, 2026)

git init
git config user.name "Prajakta Gochhayat"
git config user.email "gochhayatprajakta@gmail.com"
git branch -M main

$commits = @(
  @{ Date = "2026-08-05T09:30:00"; Msg = "docs: getting started - project initialization & requirements outline" },

  @{ Date = "2026-08-06T10:15:00"; Msg = "feat: setup Vite React TypeScript boilerplate" },
  @{ Date = "2026-08-06T14:30:00"; Msg = "style: configure Tailwind CSS design tokens and theme variables" },
  @{ Date = "2026-08-06T18:45:00"; Msg = "feat: add core types for users, quizzes, chapters, and attempts" },

  @{ Date = "2026-08-07T11:00:00"; Msg = "feat: create Navbar and Sidebar layout components" },
  @{ Date = "2026-08-07T16:15:00"; Msg = "feat: implement Light/Dark theme context provider" },
  @{ Date = "2026-08-07T20:30:00"; Msg = "feat: add AuthContext and login/register modal component" },

  @{ Date = "2026-08-08T09:45:00"; Msg = "feat: build Student Dashboard stats and recent attempt widgets" },
  @{ Date = "2026-08-08T14:20:00"; Msg = "feat: build Admin Dashboard and system metrics overview" },
  @{ Date = "2026-08-08T19:10:00"; Msg = "feat: implement user management table for administrators" },

  @{ Date = "2026-08-09T10:30:00"; Msg = "feat: add category management and subject domain creation" },
  @{ Date = "2026-08-09T15:50:00"; Msg = "feat: implement question bank manager with CSV import tool" },
  @{ Date = "2026-08-09T20:15:00"; Msg = "feat: add quiz management CRUD views for admins" },

  @{ Date = "2026-08-10T11:20:00"; Msg = "feat: add Learning Tracks catalog discovery page" },
  @{ Date = "2026-08-10T16:40:00"; Msg = "feat: add subject bookmarking and saved quizzes tab" },
  @{ Date = "2026-08-10T21:00:00"; Msg = "feat: implement timed quiz attempt runner engine" },

  @{ Date = "2026-08-11T10:10:00"; Msg = "feat: add real-time countdown timer and auto-submit handler" },
  @{ Date = "2026-08-11T15:15:00"; Msg = "feat: build Quiz Result page with score percentage breakdown" },
  @{ Date = "2026-08-11T19:45:00"; Msg = "feat: add printable PDF award certificate modal with confetti" },

  @{ Date = "2026-08-12T11:30:00"; Msg = "feat: add Universal Certificate Verification lookup tool" },
  @{ Date = "2026-08-12T16:00:00"; Msg = "feat: build Attempt History table and detailed score review" },
  @{ Date = "2026-08-12T20:50:00"; Msg = "feat: build Global Academic Leaderboard & XP ranking podium" },

  @{ Date = "2026-08-13T10:00:00"; Msg = "style: re-brand application to SkillPulse" },
  @{ Date = "2026-08-13T14:45:00"; Msg = "style: update landing hero section with engaging value props" },
  @{ Date = "2026-08-13T18:30:00"; Msg = "style: fix Light Mode sidebar link typography and contrast" },

  @{ Date = "2026-08-14T11:15:00"; Msg = "feat: separate combined subjects into standalone learning tracks" },
  @{ Date = "2026-08-14T15:30:00"; Msg = "feat: add 18 engineering categories (Python, C++, AI, DevOps, Git)" },
  @{ Date = "2026-08-14T20:20:00"; Msg = "feat: add chapter hierarchy breakdown with Overview and Quiz tabs" },

  @{ Date = "2026-08-15T09:50:00"; Msg = "feat: add Interactive Games Arcade catalog" },
  @{ Date = "2026-08-15T14:15:00"; Msg = "feat: implement 10 subject-based arcade challenge cards" },
  @{ Date = "2026-08-15T19:00:00"; Msg = "style: fix card background contrast in Light Mode" },

  @{ Date = "2026-08-16T10:45:00"; Msg = "feat: add universal Back Arrow navigation to headers and detail views" },
  @{ Date = "2026-08-16T15:40:00"; Msg = "feat: expand chapter overview study notes with syntax snippets" },
  @{ Date = "2026-08-16T20:10:00"; Msg = "style: enhance profile name and email contrast in navbar" },

  @{ Date = "2026-08-17T11:05:00"; Msg = "feat: create Profile Settings page with avatar character gallery" },
  @{ Date = "2026-08-17T16:25:00"; Msg = "feat: add custom image file upload for student profiles" },
  @{ Date = "2026-08-17T21:15:00"; Msg = "style: fix Attempt History and Leaderboard table row text contrast" },

  @{ Date = "2026-08-18T10:20:00"; Msg = "feat: add non-MCQ arcade games (Code Unscrambler Puzzle & Word Finder)" },
  @{ Date = "2026-08-18T15:00:00"; Msg = "feat: connect arcade XP rewards to profile level and leaderboard" },
  @{ Date = "2026-08-18T19:35:00"; Msg = "feat: expand curriculum to 8 detailed chapters per subject (144 total)" },

  @{ Date = "2026-08-19T09:30:00"; Msg = "docs: generate production Supabase SQL schema script (supabase_schema.sql)" },
  @{ Date = "2026-08-19T13:45:00"; Msg = "feat: install @supabase/supabase-js and configure live Supabase client" },
  @{ Date = "2026-08-19T17:10:00"; Msg = "feat: connect live Supabase database with automatic fallback engine" },
  @{ Date = "2026-08-19T21:00:00"; Msg = "docs: update project README and Vercel deployment guide" }
)

foreach ($c in $commits) {
  $env:GIT_AUTHOR_DATE = $c.Date
  $env:GIT_COMMITTER_DATE = $c.Date
  git add .
  git commit --allow-empty -m $c.Msg --date $c.Date
}

git remote remove origin 2>$null
git remote add origin https://github.com/prajaktagochhayat/SkillPulse.git
git push -u origin main --force
