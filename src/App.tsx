import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { dbService } from './services/db';
import {
  Student,
  AttendanceRecord,
  ExamResult,
  TuitionPayment,
  LessonVideo,
  Quiz,
  FlashcardDeck,
  HomeworkItem,
  QuizAttempt
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginScreen } from './components/LoginScreen';
import { BirthdayTributeModal } from './components/BirthdayTributeModal';
import { SecurityModal } from './components/teacher/SecurityModal';

// Teacher Components
import { TeacherOverview } from './components/teacher/TeacherOverview';
import { StudentManagement } from './components/teacher/StudentManagement';
import { AttendanceTracker } from './components/teacher/AttendanceTracker';
import { ExamResultsManager } from './components/teacher/ExamResultsManager';
import { TuitionTracker } from './components/teacher/TuitionTracker';
import { ContentManager } from './components/teacher/ContentManager';
import { HomeworkManager } from './components/teacher/HomeworkManager';

// Student Components
import { StudentPortalOverview } from './components/student/StudentPortalOverview';
import { StudentExamsProgress } from './components/student/StudentExamsProgress';
import { StudentAttendanceHistory } from './components/student/StudentAttendanceHistory';
import { StudentVideoLibrary } from './components/student/StudentVideoLibrary';
import { StudentInteractiveQuizzes } from './components/student/StudentInteractiveQuizzes';
import { StudentFlashcards } from './components/student/StudentFlashcards';
import { StudentHomeworkView } from './components/student/StudentHomeworkView';

export const App: React.FC = () => {
  const { role, currentStudent } = useAuth();

  // App-level state
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [tuition, setTuition] = useState<TuitionPayment[]>([]);
  const [videos, setVideos] = useState<LessonVideo[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardDeck[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial trigger modal helpers
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAddExamModal, setOpenAddExamModal] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Load all initial data from DB service
  const loadData = async () => {
    try {
      const [s, a, e, t, v, q, f, h] = await Promise.all([
        dbService.getStudents(),
        dbService.getAttendance(),
        dbService.getExams(),
        dbService.getTuition(),
        dbService.getVideos(),
        dbService.getQuizzes(),
        dbService.getFlashcardDecks(),
        dbService.getHomework()
      ]);
      setStudents(s);
      setAttendance(a);
      setExams(e);
      setTuition(t);
      setVideos(v);
      setQuizzes(q);
      setFlashcards(f);
      setHomework(h);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync tab with role
  useEffect(() => {
    if (role === 'teacher') {
      if (currentTab.startsWith('portal-')) {
        setCurrentTab('overview');
      }
    } else if (role === 'student') {
      if (!currentTab.startsWith('portal-')) {
        setCurrentTab('portal-overview');
      }
    }
  }, [role]);

  // CRUD Handlers for Teacher
  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent = await dbService.createStudent(studentData);
    setStudents(prev => [newStudent, ...prev]);
    // Refresh tuition list too
    const updatedTuition = await dbService.getTuition();
    setTuition(updatedTuition);
  };

  const handleUpdateStudent = async (id: string, updates: Partial<Student>) => {
    const updated = await dbService.updateStudent(id, updates);
    setStudents(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const handleDeleteStudent = async (id: string) => {
    await dbService.deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveAttendance = async (records: AttendanceRecord[]) => {
    await dbService.recordAttendance(records);
    const updated = await dbService.getAttendance();
    setAttendance(updated);
  };

  const handleAddExam = async (examData: Omit<ExamResult, 'id'>) => {
    const newExam = await dbService.createExam(examData);
    setExams(prev => [newExam, ...prev]);
  };

  const handleDeleteExam = async (id: string) => {
    await dbService.deleteExam(id);
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleTuition = async (id: string) => {
    const updated = await dbService.toggleTuitionPayment(id);
    setTuition(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  const handleAddVideo = async (videoData: Omit<LessonVideo, 'id'>) => {
    const newVideo = await dbService.createVideo(videoData);
    setVideos(prev => [newVideo, ...prev]);
  };

  const handleDeleteVideo = async (id: string) => {
    await dbService.deleteVideo(id);
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const handleAddQuiz = async (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz = await dbService.createQuiz(quizData);
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const handleAddHomework = async (hwData: Omit<HomeworkItem, 'id'>) => {
    const newHw = await dbService.createHomework(hwData);
    setHomework(prev => [newHw, ...prev]);
  };

  const handleRecordQuizAttempt = async (attemptData: Omit<QuizAttempt, 'id'>) => {
    await dbService.recordQuizAttempt(attemptData);
  };

  const handleResetSeedData = async () => {
    await dbService.resetToSeed();
    await loadData();
  };

  // If not logged in, show Login Screen
  if (!role) {
    return <LoginScreen students={students} />;
  }

  // Active student object if in student role
  const activeStudent = currentStudent || students[0];
  const activeStudentAttendance = attendance.filter(a => a.studentId === activeStudent?.id);
  const activeStudentExams = exams.filter(e => e.studentId === activeStudent?.id);
  const activeStudentTuition = tuition.find(t => t.studentId === activeStudent?.id && t.monthYear === '2026-11');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Birthday Celebration Banner and Modal */}
      <BirthdayTributeModal />

      {/* Security and Password Management Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        students={students}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-slate-500">Məlumatlar yüklənir...</p>
          </div>
        ) : role === 'teacher' ? (
          /* ================= TEACHER DASHBOARD ================= */
          <div className="space-y-6">
            {currentTab === 'overview' && (
              <TeacherOverview
                students={students}
                attendance={attendance}
                exams={exams}
                tuition={tuition}
                onNavigateTab={setCurrentTab}
                onResetSeedData={handleResetSeedData}
                onOpenAddStudent={() => {
                  setCurrentTab('students');
                  setOpenAddStudentModal(true);
                }}
                onOpenAddExam={() => {
                  setCurrentTab('exams');
                  setOpenAddExamModal(true);
                }}
                onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
              />
            )}

            {currentTab === 'students' && (
              <StudentManagement
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                isAddModalOpenInitially={openAddStudentModal}
                onCloseAddModalInitially={() => setOpenAddStudentModal(false)}
              />
            )}

            {currentTab === 'attendance' && (
              <AttendanceTracker
                students={students}
                attendance={attendance}
                onSaveAttendance={handleSaveAttendance}
              />
            )}

            {currentTab === 'exams' && (
              <ExamResultsManager
                students={students}
                exams={exams}
                onAddExam={handleAddExam}
                onDeleteExam={handleDeleteExam}
                isAddModalOpenInitially={openAddExamModal}
                onCloseAddModalInitially={() => setOpenAddExamModal(false)}
              />
            )}

            {currentTab === 'tuition' && (
              <TuitionTracker
                students={students}
                tuition={tuition}
                onToggleStatus={handleToggleTuition}
              />
            )}

            {currentTab === 'content' && (
              <ContentManager
                videos={videos}
                quizzes={quizzes}
                onAddVideo={handleAddVideo}
                onDeleteVideo={handleDeleteVideo}
                onAddQuiz={handleAddQuiz}
              />
            )}

            {currentTab === 'homework' && (
              <HomeworkManager
                homework={homework}
                onAddHomework={handleAddHomework}
              />
            )}
          </div>
        ) : (
          /* ================= STUDENT / PARENT PORTAL ================= */
          <div className="space-y-6">
            {activeStudent ? (
              <>
                {currentTab === 'portal-overview' && (
                  <StudentPortalOverview
                    student={activeStudent}
                    attendance={activeStudentAttendance}
                    exams={activeStudentExams}
                    tuition={activeStudentTuition}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'portal-exams' && (
                  <StudentExamsProgress
                    student={activeStudent}
                    exams={activeStudentExams}
                  />
                )}

                {currentTab === 'portal-attendance' && (
                  <StudentAttendanceHistory
                    student={activeStudent}
                    attendance={activeStudentAttendance}
                  />
                )}

                {currentTab === 'portal-videos' && (
                  <StudentVideoLibrary videos={videos} />
                )}

                {currentTab === 'portal-quizzes' && (
                  <StudentInteractiveQuizzes
                    student={activeStudent}
                    quizzes={quizzes}
                    onSaveAttempt={handleRecordQuizAttempt}
                  />
                )}

                {currentTab === 'portal-flashcards' && (
                  <StudentFlashcards decks={flashcards} />
                )}

                {currentTab === 'portal-homework' && (
                  <StudentHomeworkView
                    student={activeStudent}
                    homework={homework}
                  />
                )}
              </>
            ) : (
              <div className="py-24 text-center text-slate-500">
                Tələbə məlumatı tapılmadı.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer with Birthday Tribute */}
      <Footer />
    </div>
  );
};
