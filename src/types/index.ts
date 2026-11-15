export type UserRole = 'teacher' | 'student';

export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | '11-ci Sinif' | 'All';

export interface Student {
  id: string;
  name: string;
  group: EnglishLevel;
  parentPhone: string;
  studentPhone?: string;
  monthlyFee: number;
  accessCode: string;
  avatar?: string;
  joinedDate: string;
  notes?: string;
  email?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  topic?: string;
  note?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examTitle: string;
  date: string; // YYYY-MM-DD
  readingScore: number;
  listeningScore: number;
  grammarScore: number;
  vocabularyScore: number;
  totalScore: number;
  maxScore: number;
  teacherFeedback: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface TuitionPayment {
  id: string;
  studentId: string;
  monthYear: string; // e.g., "2026-11"
  amount: number;
  status: PaymentStatus;
  paymentDate?: string;
  receiptNote?: string;
}

export type LessonTopic = 'Tenses' | 'Modal Verbs' | 'Vocabulary' | 'Listening' | 'Speaking' | 'Grammar' | 'Writing';

export interface LessonVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  videoId: string;
  level: EnglishLevel;
  topic: LessonTopic;
  duration: string;
  uploadDate: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  topic: LessonTopic;
  level: EnglishLevel;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  timestamp: string;
  answers: Record<string, number>; // questionId -> selectedIndex
}

export interface Flashcard {
  id: string;
  front: string; // English word / phrase
  back: string; // Azerbaijani translation
  phonetic?: string;
  exampleSentence: string;
  level: EnglishLevel;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  level: EnglishLevel;
  description: string;
  cards: Flashcard[];
}

export interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  group: EnglishLevel;
  dueDate: string;
  resourceName: string;
  resourceUrl?: string;
  contentMarkdown?: string;
}
