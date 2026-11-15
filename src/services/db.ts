import {
  Student,
  AttendanceRecord,
  ExamResult,
  TuitionPayment,
  LessonVideo,
  Quiz,
  QuizAttempt,
  FlashcardDeck,
  HomeworkItem
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_TUITION,
  INITIAL_VIDEOS,
  INITIAL_QUIZZES,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_HOMEWORK
} from '../data/mockData';

const STORAGE_KEYS = {
  STUDENTS: 'emil_edtech_students',
  ATTENDANCE: 'emil_edtech_attendance',
  EXAMS: 'emil_edtech_exams',
  TUITION: 'emil_edtech_tuition',
  VIDEOS: 'emil_edtech_videos',
  QUIZZES: 'emil_edtech_quizzes',
  QUIZ_ATTEMPTS: 'emil_edtech_quiz_attempts',
  FLASHCARDS: 'emil_edtech_flashcards',
  HOMEWORK: 'emil_edtech_homework',
};

// Helper to safely read from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper to safely write to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Initialize seed data if not present
export function initializeDatabase(): void {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    saveToStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    saveToStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    saveToStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TUITION)) {
    saveToStorage(STORAGE_KEYS.TUITION, INITIAL_TUITION);
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    saveToStorage(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    saveToStorage(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FLASHCARDS)) {
    saveToStorage(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARD_DECKS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOMEWORK)) {
    saveToStorage(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
  }
}

export const dbService = {
  // Reset all data back to original seed
  async resetToSeed(): Promise<void> {
    saveToStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    saveToStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    saveToStorage(STORAGE_KEYS.TUITION, INITIAL_TUITION);
    saveToStorage(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    saveToStorage(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    saveToStorage(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    saveToStorage(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARD_DECKS);
    saveToStorage(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
  },

  // STUDENTS
  async getStudents(): Promise<Student[]> {
    return getFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    const students = await this.getStudents();
    return students.find(s => s.id === id);
  },

  async getStudentByCode(code: string): Promise<Student | undefined> {
    const students = await this.getStudents();
    const cleanCode = code.trim().toUpperCase();
    return students.find(s => s.accessCode.toUpperCase() === cleanCode);
  },

  async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const students = await this.getStudents();
    const newStudent: Student = {
      ...student,
      id: `stu-${Date.now()}`
    };
    const updated = [newStudent, ...students];
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);

    // Also automatically initialize a tuition record for the current month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const tuitionList = await this.getTuition();
    const newTuition: TuitionPayment = {
      id: `tui-${Date.now()}`,
      studentId: newStudent.id,
      monthYear: currentMonth,
      amount: newStudent.monthlyFee,
      status: 'pending'
    };
    saveToStorage(STORAGE_KEYS.TUITION, [newTuition, ...tuitionList]);

    return newStudent;
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    const students = await this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Tələbə tapılmadı');
    students[index] = { ...students[index], ...updates };
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    return students[index];
  },

  async deleteStudent(id: string): Promise<void> {
    const students = await this.getStudents();
    const updated = students.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.STUDENTS, updated);
  },

  // ATTENDANCE
  async getAttendance(studentId?: string, date?: string): Promise<AttendanceRecord[]> {
    const all = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    return all.filter(item => {
      if (studentId && item.studentId !== studentId) return false;
      if (date && item.date !== date) return false;
      return true;
    });
  },

  async recordAttendance(records: AttendanceRecord[]): Promise<void> {
    const current = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    // Replace or insert records
    const updated = [...current];
    for (const rec of records) {
      const idx = updated.findIndex(r => r.date === rec.date && r.studentId === rec.studentId);
      if (idx !== -1) {
        updated[idx] = rec;
      } else {
        updated.push(rec);
      }
    }
    saveToStorage(STORAGE_KEYS.ATTENDANCE, updated);
  },

  // EXAMS
  async getExams(studentId?: string): Promise<ExamResult[]> {
    const all = getFromStorage<ExamResult[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    if (studentId) {
      return all.filter(e => e.studentId === studentId);
    }
    return all;
  },

  async createExam(exam: Omit<ExamResult, 'id'>): Promise<ExamResult> {
    const exams = await this.getExams();
    const newExam: ExamResult = {
      ...exam,
      id: `exam-${Date.now()}`
    };
    const updated = [newExam, ...exams];
    saveToStorage(STORAGE_KEYS.EXAMS, updated);
    return newExam;
  },

  async deleteExam(id: string): Promise<void> {
    const exams = await this.getExams();
    saveToStorage(STORAGE_KEYS.EXAMS, exams.filter(e => e.id !== id));
  },

  // TUITION
  async getTuition(monthYear?: string): Promise<TuitionPayment[]> {
    const all = getFromStorage<TuitionPayment[]>(STORAGE_KEYS.TUITION, INITIAL_TUITION);
    if (monthYear) {
      return all.filter(t => t.monthYear === monthYear);
    }
    return all;
  },

  async toggleTuitionPayment(id: string): Promise<TuitionPayment> {
    const list = await this.getTuition();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Ödəniş qeydi tapılmadı');

    const currentStatus = list[idx].status;
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    const now = new Date().toISOString().split('T')[0];

    list[idx] = {
      ...list[idx],
      status: newStatus,
      paymentDate: newStatus === 'paid' ? now : undefined
    };
    saveToStorage(STORAGE_KEYS.TUITION, list);
    return list[idx];
  },

  async updateTuition(id: string, updates: Partial<TuitionPayment>): Promise<TuitionPayment> {
    const list = await this.getTuition();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Ödəniş qeydi tapılmadı');
    list[idx] = { ...list[idx], ...updates };
    saveToStorage(STORAGE_KEYS.TUITION, list);
    return list[idx];
  },

  // VIDEOS
  async getVideos(): Promise<LessonVideo[]> {
    return getFromStorage<LessonVideo[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
  },

  async createVideo(video: Omit<LessonVideo, 'id'>): Promise<LessonVideo> {
    const videos = await this.getVideos();
    const newVideo: LessonVideo = {
      ...video,
      id: `vid-${Date.now()}`
    };
    saveToStorage(STORAGE_KEYS.VIDEOS, [newVideo, ...videos]);
    return newVideo;
  },

  async deleteVideo(id: string): Promise<void> {
    const videos = await this.getVideos();
    saveToStorage(STORAGE_KEYS.VIDEOS, videos.filter(v => v.id !== id));
  },

  // QUIZZES
  async getQuizzes(): Promise<Quiz[]> {
    return getFromStorage<Quiz[]>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },

  async createQuiz(quiz: Omit<Quiz, 'id'>): Promise<Quiz> {
    const quizzes = await this.getQuizzes();
    const newQuiz: Quiz = {
      ...quiz,
      id: `quiz-${Date.now()}`
    };
    saveToStorage(STORAGE_KEYS.QUIZZES, [newQuiz, ...quizzes]);
    return newQuiz;
  },

  async getQuizAttempts(studentId?: string): Promise<QuizAttempt[]> {
    const all = getFromStorage<QuizAttempt[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, []);
    if (studentId) {
      return all.filter(a => a.studentId === studentId);
    }
    return all;
  },

  async recordQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    const all = await this.getQuizAttempts();
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `att-${Date.now()}`
    };
    saveToStorage(STORAGE_KEYS.QUIZ_ATTEMPTS, [newAttempt, ...all]);
    return newAttempt;
  },

  // FLASHCARDS
  async getFlashcardDecks(): Promise<FlashcardDeck[]> {
    return getFromStorage<FlashcardDeck[]>(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARD_DECKS);
  },

  // HOMEWORK
  async getHomework(group?: string): Promise<HomeworkItem[]> {
    const all = getFromStorage<HomeworkItem[]>(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK);
    if (group && group !== 'All') {
      return all.filter(h => h.group === group || h.group === 'All');
    }
    return all;
  },

  async createHomework(hw: Omit<HomeworkItem, 'id'>): Promise<HomeworkItem> {
    const all = await this.getHomework();
    const newHw: HomeworkItem = {
      ...hw,
      id: `hw-${Date.now()}`
    };
    saveToStorage(STORAGE_KEYS.HOMEWORK, [newHw, ...all]);
    return newHw;
  }
};
