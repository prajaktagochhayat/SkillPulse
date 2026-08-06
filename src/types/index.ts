export type UserRole = 'ADMIN' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type QuizStatus = 'Draft' | 'Published' | 'Unpublished';
export type QuestionType = 'single' | 'multiple' | 'boolean' | 'text';
export type GameType =
  | 'bug-hunter'
  | 'concept-match'
  | 'speed-sprint'
  | 'pointer-arena'
  | 'thread-race'
  | 'event-loop'
  | 'sql-runner'
  | 'cyber-defense'
  | 'devops-container'
  | 'os-scheduling';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
  savedQuizIds?: string[];
  bio?: string;
  xpPoints?: number;
  level?: number;
  streakDays?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: string;
}

export interface Option {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  chapterId?: string;
  questionText: string;
  type: QuestionType;
  options: Option[];
  explanation: string;
  marks: number;
  difficulty: DifficultyLevel;
  imageUrl?: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  quizId: string;
  chapterNumber: number;
  title: string;
  description: string;
  summaryNotes: string;
  keyConcepts: string[];
  codeExample?: string;
  questionIds?: string[];
}

export interface QuizRating {
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  difficulty: DifficultyLevel;
  duration: number; // in minutes
  passingScore: number; // percentage e.g. 60
  maxAttempts: number;
  status: QuizStatus;
  thumbnailUrl?: string;
  allowNegativeMarking?: boolean;
  negativeMark?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  totalQuestions?: number;
  totalMarks?: number;
  chapters?: Chapter[];
  ratings?: QuizRating[];
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TechGame {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  type: GameType;
  description: string;
  difficulty: DifficultyLevel;
  icon: string;
}

export interface GameScore {
  gameId: string;
  userId: string;
  userName: string;
  score: number;
  highScore: number;
  maxCombo: number;
  playedAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer?: string;
  isCorrect: boolean;
  scoreObtained: number;
}

export interface QuizAttempt {
  id: string;
  certificateId: string;
  quizId: string;
  chapterId?: string;
  quizTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unansweredCount: number;
  timeTakenSeconds: number;
  status: 'PASSED' | 'FAILED';
  startedAt: string;
  completedAt: string;
  answers: AttemptAnswer[];
}

export interface DashboardStats {
  totalStudents: number;
  totalQuizzes: number;
  publishedQuizzes: number;
  draftQuizzes: number;
  totalQuestions: number;
  totalQuizAttempts: number;
  averageScore: number;
  passedAttempts: number;
  failedAttempts: number;
}

export interface StudentStats {
  quizzesAttempted: number;
  quizzesPassed: number;
  quizzesFailed: number;
  averageScore: number;
  highestScore: number;
  totalQuestionsAnswered: number;
  xpPoints: number;
  streakDays: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  averageScore: number;
  totalQuizzesPassed: number;
  totalQuizzesCompleted: number;
  highestScore: number;
  xpPoints?: number;
}
