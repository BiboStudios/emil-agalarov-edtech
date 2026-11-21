import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserRole, Student } from '../types';
import { dbService, initializeDatabase } from '../services/db';
import {
  initializeSecurity,
  verifyTeacherCredentials,
  changeTeacherPassword,
  isSessionValid,
  terminateSession,
  getSecurityAuditLogs,
  SecurityAuditLog,
  AuthResult
} from '../services/security';

interface AuthContextType {
  role: UserRole | null;
  currentStudent: Student | null;
  teacherName: string;
  loginAsTeacher: (username: string, password: string) => Promise<AuthResult>;
  loginWithStudentCode: (code: string) => Promise<boolean>;
  loginAsDemoStudent: (studentId: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  auditLogs: SecurityAuditLog[];
  refreshAuditLogs: () => void;
  showBirthdayModal: boolean;
  setShowBirthdayModal: (val: boolean) => void;
  triggerBirthdayConfetti: () => void;
  hasShownBirthdayWelcome: boolean;
  dismissBirthdayWelcome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // CRITICAL SECURITY FIX: Never default to 'teacher'! Only authenticated sessions can have 'teacher' role
  const [role, setRole] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('emil_auth_role') as UserRole;
    if (savedRole === 'teacher') {
      // Validate session token and expiration
      if (isSessionValid()) {
        return 'teacher';
      } else {
        localStorage.removeItem('emil_auth_role');
        return null;
      }
    } else if (savedRole === 'student') {
      return 'student';
    }
    return null;
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [showBirthdayModal, setShowBirthdayModal] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [hasShownBirthdayWelcome, setHasShownBirthdayWelcome] = useState<boolean>(() => {
    return localStorage.getItem('emil_bday_welcome_seen') === 'true';
  });

  const teacherName = 'Emil Ağalarov';

  useEffect(() => {
    initializeDatabase();
    initializeSecurity().then(() => {
      setAuditLogs(getSecurityAuditLogs());
    });

    // If initial role was student, restore current student
    const savedStudentId = localStorage.getItem('emil_auth_student_id');
    if (savedStudentId) {
      dbService.getStudentById(savedStudentId).then(s => {
        if (s) {
          setCurrentStudent(s);
          setRole('student');
        } else {
          setRole(null);
        }
      });
    }

    // First time welcome celebration for Emil (only if securely authenticated as teacher)!
    const hasSeen = localStorage.getItem('emil_bday_welcome_seen') === 'true';
    if (!hasSeen && role === 'teacher' && isSessionValid()) {
      setTimeout(() => {
        triggerBirthdayConfetti();
      }, 800);
    }
  }, []);

  const refreshAuditLogs = () => {
    setAuditLogs(getSecurityAuditLogs());
  };

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

  const loginAsTeacher = async (username: string, password: string): Promise<AuthResult> => {
    const result = await verifyTeacherCredentials(username, password);
    if (result.success) {
      setRole('teacher');
      setCurrentStudent(null);
      localStorage.setItem('emil_auth_role', 'teacher');
      localStorage.removeItem('emil_auth_student_id');
      refreshAuditLogs();
    } else {
      refreshAuditLogs();
    }
    return result;
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await changeTeacherPassword(currentPass, newPass);
    if (res.success) {
      refreshAuditLogs();
    }
    return res;
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
    terminateSession();
    setRole(null);
    setCurrentStudent(null);
    localStorage.removeItem('emil_auth_role');
    localStorage.removeItem('emil_auth_student_id');
    refreshAuditLogs();
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
        updatePassword,
        auditLogs,
        refreshAuditLogs,
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
