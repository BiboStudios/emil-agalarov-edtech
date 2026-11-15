import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserRole, Student } from '../types';
import { dbService, initializeDatabase } from '../services/db';

interface AuthContextType {
  role: UserRole | null;
  currentStudent: Student | null;
  teacherName: string;
  loginAsTeacher: () => void;
  loginWithStudentCode: (code: string) => Promise<boolean>;
  loginAsDemoStudent: (studentId: string) => Promise<boolean>;
  logout: () => void;
  showBirthdayModal: boolean;
  setShowBirthdayModal: (val: boolean) => void;
  triggerBirthdayConfetti: () => void;
  hasShownBirthdayWelcome: boolean;
  dismissBirthdayWelcome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(() => {
    return (localStorage.getItem('emil_auth_role') as UserRole) || 'teacher';
  });
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [showBirthdayModal, setShowBirthdayModal] = useState<boolean>(false);
  const [hasShownBirthdayWelcome, setHasShownBirthdayWelcome] = useState<boolean>(() => {
    return localStorage.getItem('emil_bday_welcome_seen') === 'true';
  });

  const teacherName = 'Emil Ağalarov';

  useEffect(() => {
    initializeDatabase();

    // If initial role was student, restore current student
    const savedStudentId = localStorage.getItem('emil_auth_student_id');
    if (savedStudentId) {
      dbService.getStudentById(savedStudentId).then(s => {
        if (s) {
          setCurrentStudent(s);
          setRole('student');
        }
      });
    }

    // First time welcome celebration for Emil!
    const hasSeen = localStorage.getItem('emil_bday_welcome_seen') === 'true';
    if (!hasSeen && role === 'teacher') {
      setTimeout(() => {
        triggerBirthdayConfetti();
      }, 800);
    }
  }, []);

  const triggerBirthdayConfetti = () => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#10b981', '#0b1d30', '#f59e0b']
      });
      fire(0.2, {
        spread: 60,
        colors: ['#34d399', '#6366f1', '#ec4899']
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  const loginAsTeacher = () => {
    setRole('teacher');
    setCurrentStudent(null);
    localStorage.setItem('emil_auth_role', 'teacher');
    localStorage.removeItem('emil_auth_student_id');
  };

  const loginWithStudentCode = async (code: string): Promise<boolean> => {
    const student = await dbService.getStudentByCode(code);
    if (student) {
      setRole('student');
      setCurrentStudent(student);
      localStorage.setItem('emil_auth_role', 'student');
      localStorage.setItem('emil_auth_student_id', student.id);
      return true;
    }
    return false;
  };

  const loginAsDemoStudent = async (studentId: string): Promise<boolean> => {
    const student = await dbService.getStudentById(studentId);
    if (student) {
      setRole('student');
      setCurrentStudent(student);
      localStorage.setItem('emil_auth_role', 'student');
      localStorage.setItem('emil_auth_student_id', student.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    setCurrentStudent(null);
    localStorage.removeItem('emil_auth_role');
    localStorage.removeItem('emil_auth_student_id');
  };

  const dismissBirthdayWelcome = () => {
    setHasShownBirthdayWelcome(true);
    localStorage.setItem('emil_bday_welcome_seen', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        currentStudent,
        teacherName,
        loginAsTeacher,
        loginWithStudentCode,
        loginAsDemoStudent,
        logout,
        showBirthdayModal,
        setShowBirthdayModal,
        triggerBirthdayConfetti,
        hasShownBirthdayWelcome,
        dismissBirthdayWelcome
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
