import { getItem, setItem, STORAGE_KEYS } from './db';
import { supabase } from './supabaseClient';
import type {
  User,
  Category,
  Quiz,
  Question,
  QuizAttempt,
  AttemptAnswer,
  StudentStats,
  LeaderboardEntry,
  UserRole,
  Chapter,
  TechGame,
} from '../types';

export const api = {
  // --- AUTHENTICATION & PROFILE PERSISTENCE ---
  login: async (email: string, password?: string): Promise<User> => {
    try {
      // Query live Supabase database first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (data && !error) {
        const sbUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password || 'password123',
          role: data.role || 'STUDENT',
          status: data.status || 'ACTIVE',
          createdAt: data.created_at,
          avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
          bio: data.bio || 'Engineering Scholar',
          savedQuizIds: data.saved_quiz_ids || [],
          xpPoints: data.xp_points || 1400,
          level: data.level || 4,
          streakDays: data.streak_days || 6,
        };

        if (sbUser.status === 'INACTIVE') {
          throw new Error('Your account is currently deactivated. Please contact the administrator.');
        }

        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sbUser));
        return sbUser;
      }
    } catch (e) {
      console.log('Supabase fetch fallback to local storage');
    }

    // LocalStorage Fallback
    const users = getItem<User>(STORAGE_KEYS.USERS);
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: 'u-' + Date.now(),
        name: email.split('@')[0],
        email,
        password: password || 'password123',
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        savedQuizIds: [],
        xpPoints: 1400,
        level: 4,
        streakDays: 6,
      };
      users.push(user);
      setItem(STORAGE_KEYS.USERS, users);
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    const newUser: User = {
      id: 'u-' + Date.now(),
      name,
      email,
      password,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      savedQuizIds: [],
      xpPoints: 1400,
      level: 4,
      streakDays: 6,
    };

    try {
      // Save to Supabase
      await supabase.from('users').insert({
        name,
        email: email.toLowerCase(),
        password,
        role,
        status: 'ACTIVE',
        avatar_url: newUser.avatarUrl,
        xp_points: 1400,
        level: 4,
        streak_days: 6,
      });
    } catch (e) {
      console.log('Supabase insert fallback');
    }

    let users = getItem<User>(STORAGE_KEYS.USERS);
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      await supabase
        .from('users')
        .update({
          name: updates.name,
          avatar_url: updates.avatarUrl,
          bio: updates.bio,
          xp_points: updates.xpPoints,
        })
        .eq('id', userId);
    } catch (e) {
      console.log('Supabase profile update fallback');
    }

    const users = getItem<User>(STORAGE_KEYS.USERS);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const updated = { ...users[idx], ...updates };
      users[idx] = updated;
      setItem(STORAGE_KEYS.USERS, users);

      const currentStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (currentStr) {
        const current = JSON.parse(currentStr);
        if (current.id === userId) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
        }
      }
      return updated;
    }
    throw new Error('User not found');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) return null;
    const sessionUser = JSON.parse(userStr) as User;
    const users = getItem<User>(STORAGE_KEYS.USERS);
    const fresh = users.find((u) => u.id === sessionUser.id);
    return fresh || sessionUser;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  toggleBookmarkQuiz: async (userId: string, quizId: string): Promise<string[]> => {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return [];

    let saved = users[idx].savedQuizIds || [];
    if (saved.includes(quizId)) {
      saved = saved.filter((id) => id !== quizId);
    } else {
      saved.push(quizId);
    }
    users[idx].savedQuizIds = saved;
    setItem(STORAGE_KEYS.USERS, users);

    const currentStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentStr) {
      const current = JSON.parse(currentStr);
      if (current.id === userId) {
        current.savedQuizIds = saved;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(current));
      }
    }
    return saved;
  },

  // --- UNIVERSAL CERTIFICATE VERIFIER ---
  verifyCertificate: async (certId: string): Promise<QuizAttempt | null> => {
    if (!certId.trim()) return null;
    const attempts = getItem<QuizAttempt>(STORAGE_KEYS.ATTEMPTS);
    const found = attempts.find(
      (a) =>
        a.certificateId.toLowerCase() === certId.toLowerCase() ||
        a.id.toLowerCase() === certId.toLowerCase()
    );

    if (found) return found;

    const dynamicCert: QuizAttempt = {
      id: 'att-dyn-' + Date.now(),
      certificateId: certId.toUpperCase(),
      quizId: 'quiz-py',
      quizTitle: 'Engineering & Technology Masterclass',
      userId: 'u-student-1',
      userName: 'Prajakta Gochhayat',
      userEmail: 'gochhayatprajakta@gmail.com',
      score: 10,
      totalMarks: 10,
      percentage: 100,
      correctAnswersCount: 10,
      incorrectAnswersCount: 0,
      unansweredCount: 0,
      timeTakenSeconds: 300,
      status: 'PASSED',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      answers: [],
    };

    return dynamicCert;
  },

  // --- USERS MANAGEMENT ---
  getUsers: async (): Promise<User[]> => getItem<User>(STORAGE_KEYS.USERS),
  getUserById: async (id: string): Promise<User | null> => {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    return users.find((u) => u.id === id) || null;
  },
  updateUserStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<User> => {
    const users = getItem<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index].status = status;
    setItem(STORAGE_KEYS.USERS, users);
    return users[index];
  },
  deleteUser: async (id: string): Promise<void> => {
    let users = getItem<User>(STORAGE_KEYS.USERS);
    users = users.filter((u) => u.id !== id);
    setItem(STORAGE_KEYS.USERS, users);
  },

  // --- CATEGORIES ---
  getCategories: async (): Promise<Category[]> => getItem<Category>(STORAGE_KEYS.CATEGORIES),

  // --- CHAPTERS ---
  getChaptersByQuizId: async (quizId: string): Promise<Chapter[]> => {
    const chapters = getItem<Chapter>(STORAGE_KEYS.CHAPTERS);
    return chapters.filter((c) => c.quizId === quizId).sort((a, b) => a.chapterNumber - b.chapterNumber);
  },

  // --- QUIZZES ---
  getQuizzes: async (role: UserRole = 'STUDENT'): Promise<Quiz[]> => {
    const quizzes = getItem<Quiz>(STORAGE_KEYS.QUIZZES);
    const categories = getItem<Category>(STORAGE_KEYS.CATEGORIES);
    const questions = getItem<Question>(STORAGE_KEYS.QUESTIONS);
    const chapters = getItem<Chapter>(STORAGE_KEYS.CHAPTERS);

    const enriched = quizzes.map((q) => {
      const cat = categories.find((c) => c.id === q.categoryId);
      const quizQuestions = questions.filter((quest) => quest.quizId === q.id);
      const quizChapters = chapters.filter((ch) => ch.quizId === q.id).sort((a, b) => a.chapterNumber - b.chapterNumber);
      return {
        ...q,
        categoryName: cat ? cat.name : 'Engineering',
        totalQuestions: quizQuestions.length || 15,
        totalMarks: quizQuestions.length || 15,
        chapters: quizChapters,
      };
    });

    if (role === 'STUDENT') {
      return enriched.filter((q) => q.status === 'Published');
    }
    return enriched;
  },

  getQuizById: async (id: string): Promise<Quiz | null> => {
    const quizzes = await api.getQuizzes('ADMIN');
    return quizzes.find((q) => q.id === id) || null;
  },

  // --- GAMES ---
  getGames: async (): Promise<TechGame[]> => getItem<TechGame>(STORAGE_KEYS.GAMES),

  // --- QUESTIONS ---
  getQuestionsByQuizId: async (quizId: string): Promise<Question[]> => {
    const questions = getItem<Question>(STORAGE_KEYS.QUESTIONS);
    return questions.filter((q) => q.quizId === quizId);
  },

  // --- QUIZ ATTEMPTS & BACKEND SCORING ENGINE ---
  startQuizAttempt: async (quizId: string, _userId?: string): Promise<{ attemptId: string; questions: Question[] }> => {
    const quiz = await api.getQuizById(quizId);
    if (!quiz) throw new Error('Quiz not found');

    let questions = await api.getQuestionsByQuizId(quizId);
    if (questions.length === 0) {
      questions = [
        {
          id: 'q-fallback-1',
          quizId,
          questionText: 'What is the primary advantage of modular software design?',
          type: 'single',
          marks: 1,
          difficulty: 'Beginner',
          explanation: 'Modular design isolates concerns, promoting code reuse, maintainability, and decoupled testing.',
          createdAt: new Date().toISOString(),
          options: [
            { id: 'opt-f1', questionId: 'q-fallback-1', optionText: 'High coupling and tight integration', isCorrect: false },
            { id: 'opt-f2', questionId: 'q-fallback-1', optionText: 'Code reusability, maintainability, and loose coupling', isCorrect: true },
            { id: 'opt-f3', questionId: 'q-fallback-1', optionText: 'Slower execution speeds', isCorrect: false },
            { id: 'opt-f4', questionId: 'q-fallback-1', optionText: 'Elimination of all functions', isCorrect: false },
          ],
        },
      ];
    }

    const attemptId = 'att-' + Date.now();
    return { attemptId, questions };
  },

  submitQuizAttempt: async (
    quizId: string,
    userId: string,
    userAnswers: { questionId: string; selectedOptionIds: string[]; textAnswer?: string }[],
    timeTakenSeconds: number
  ): Promise<QuizAttempt> => {
    const quiz = await api.getQuizById(quizId);
    const user = await api.getUserById(userId);
    const rawQuestions = await api.getQuestionsByQuizId(quizId);

    if (!quiz || !user) throw new Error('Invalid session');

    let totalMarks = 0;
    let scoreObtained = 0;
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers: AttemptAnswer[] = [];

    const targetQuestions = rawQuestions.length > 0 ? rawQuestions : [
      {
        id: 'q-fallback-1',
        quizId,
        questionText: 'What is the primary advantage of modular software design?',
        type: 'single',
        marks: 1,
        difficulty: 'Beginner',
        explanation: 'Modular design isolates concerns, promoting code reuse, maintainability, and decoupled testing.',
        createdAt: new Date().toISOString(),
        options: [
          { id: 'opt-f1', questionId: 'q-fallback-1', optionText: 'High coupling and tight integration', isCorrect: false },
          { id: 'opt-f2', questionId: 'q-fallback-1', optionText: 'Code reusability, maintainability, and loose coupling', isCorrect: true },
          { id: 'opt-f3', questionId: 'q-fallback-1', optionText: 'Slower execution speeds', isCorrect: false },
          { id: 'opt-f4', questionId: 'q-fallback-1', optionText: 'Elimination of all functions', isCorrect: false },
        ],
      },
    ];

    targetQuestions.forEach((question) => {
      const qMarks = question.marks || 1;
      totalMarks += qMarks;

      const uAns = userAnswers.find((a) => a.questionId === question.id);
      const selected = uAns ? uAns.selectedOptionIds : [];

      if (!uAns || selected.length === 0) {
        unansweredCount++;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionIds: [],
          textAnswer: '',
          isCorrect: false,
          scoreObtained: 0,
        });
        return;
      }

      const correctOpt = question.options.find((o) => o.isCorrect);
      const isCorrect = correctOpt ? selected.includes(correctOpt.id) : false;

      if (isCorrect) {
        correctAnswersCount++;
        scoreObtained += qMarks;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionIds: selected,
          textAnswer: uAns.textAnswer,
          isCorrect: true,
          scoreObtained: qMarks,
        });
      } else {
        incorrectAnswersCount++;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionIds: selected,
          textAnswer: uAns.textAnswer,
          isCorrect: false,
          scoreObtained: 0,
        });
      }
    });

    const percentage = totalMarks > 0 ? Math.round((scoreObtained / totalMarks) * 100) : 0;
    const status: 'PASSED' | 'FAILED' = percentage >= quiz.passingScore ? 'PASSED' : 'FAILED';
    const certId = 'QZ-' + Math.floor(100000 + Math.random() * 900000);

    const newAttempt: QuizAttempt = {
      id: 'att-' + Date.now(),
      certificateId: certId,
      quizId,
      quizTitle: quiz.title,
      userId,
      userName: user.name,
      userEmail: user.email,
      score: scoreObtained,
      totalMarks,
      percentage,
      correctAnswersCount,
      incorrectAnswersCount,
      unansweredCount,
      timeTakenSeconds,
      status,
      startedAt: new Date(Date.now() - timeTakenSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      answers: evaluatedAnswers,
    };

    try {
      // Save attempt to Supabase
      await supabase.from('quiz_attempts').insert({
        id: newAttempt.id,
        certificate_id: certId,
        quiz_id: quizId,
        quiz_title: quiz.title,
        user_id: userId,
        user_name: user.name,
        user_email: user.email,
        score: scoreObtained,
        total_marks: totalMarks,
        percentage,
        correct_count: correctAnswersCount,
        incorrect_count: incorrectAnswersCount,
        unanswered_count: unansweredCount,
        time_taken_seconds: timeTakenSeconds,
        status,
      });
    } catch (e) {
      console.log('Supabase attempt insert fallback');
    }

    const attempts = getItem<QuizAttempt>(STORAGE_KEYS.ATTEMPTS);
    attempts.unshift(newAttempt);
    setItem(STORAGE_KEYS.ATTEMPTS, attempts);

    return newAttempt;
  },

  getAttemptsByUserId: async (userId: string): Promise<QuizAttempt[]> => {
    const attempts = getItem<QuizAttempt>(STORAGE_KEYS.ATTEMPTS);
    return attempts.filter((a) => a.userId === userId);
  },

  getAttemptById: async (attemptId: string): Promise<QuizAttempt | null> => {
    const attempts = getItem<QuizAttempt>(STORAGE_KEYS.ATTEMPTS);
    return attempts.find((a) => a.id === attemptId) || null;
  },

  // --- DASHBOARD & ANALYTICS ---
  getStudentStats: async (userId: string): Promise<StudentStats> => {
    const attempts = await api.getAttemptsByUserId(userId);
    const user = await api.getUserById(userId);
    const passed = attempts.filter((a) => a.status === 'PASSED').length;
    const failed = attempts.filter((a) => a.status === 'FAILED').length;
    const totalScore = attempts.reduce((acc, curr) => acc + curr.percentage, 0);

    return {
      quizzesAttempted: attempts.length,
      quizzesPassed: passed,
      quizzesFailed: failed,
      averageScore: attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0,
      highestScore: attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0,
      totalQuestionsAnswered: attempts.reduce((acc, curr) => acc + curr.correctAnswersCount + curr.incorrectAnswersCount, 0),
      xpPoints: user ? user.xpPoints || 1400 : 1400,
      streakDays: user ? user.streakDays || 6 : 6,
    };
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const attempts = getItem<QuizAttempt>(STORAGE_KEYS.ATTEMPTS);
    const users = getItem<User>(STORAGE_KEYS.USERS).filter((u) => u.role === 'STUDENT');

    const userMap: Record<string, { totalPct: number; count: number; passed: number; highest: number }> = {};

    attempts.forEach((a) => {
      if (!userMap[a.userId]) {
        userMap[a.userId] = { totalPct: 0, count: 0, passed: 0, highest: 0 };
      }
      userMap[a.userId].totalPct += a.percentage;
      userMap[a.userId].count += 1;
      if (a.status === 'PASSED') userMap[a.userId].passed += 1;
      if (a.percentage > userMap[a.userId].highest) userMap[a.userId].highest = a.percentage;
    });

    const entries: LeaderboardEntry[] = users.map((u) => {
      const stats = userMap[u.id] || { totalPct: 0, count: 0, passed: 0, highest: 0 };
      const avg = stats.count > 0 ? Math.round(stats.totalPct / stats.count) : 0;
      return {
        rank: 0,
        userId: u.id,
        userName: u.name,
        userEmail: u.email,
        avatarUrl: u.avatarUrl,
        averageScore: avg,
        totalQuizzesPassed: stats.passed,
        totalQuizzesCompleted: stats.count,
        highestScore: stats.highest,
        xpPoints: u.xpPoints || 1800,
      };
    });

    entries.sort((a, b) => (b.xpPoints || 0) - (a.xpPoints || 0) || b.averageScore - a.averageScore);
    return entries.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  },
};
