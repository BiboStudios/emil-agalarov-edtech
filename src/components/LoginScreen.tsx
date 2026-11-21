import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Key,
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';

interface LoginScreenProps {
  students: Student[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ students }) => {
  const { loginAsTeacher, loginWithStudentCode, loginAsDemoStudent, teacherName } = useAuth();
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');

  // Teacher Form State
  const [teacherUsername, setTeacherUsername] = useState('emil.agalarov');
  const [teacherPass, setTeacherPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Student Form State
  const [accessCode, setAccessCode] = useState('');
  const [studentErrorMsg, setStudentErrorMsg] = useState('');
  const [isStudentLoading, setIsStudentLoading] = useState(false);

  // Countdown timer for security lockout
  useEffect(() => {
    if (lockoutCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockoutCountdown(prev => {
        if (prev <= 1) {
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutCountdown]);

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutCountdown > 0) return;

    if (!teacherUsername.trim()) {
      setErrorMsg('Zəhmət olmasa istifadəçi adını və ya emailinizi daxil edin.');
      return;
    }
    if (!teacherPass) {
      setErrorMsg('Zəhmət olmasa şifrənizi daxil edin.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await loginAsTeacher(teacherUsername.trim(), teacherPass);
      if (!result.success) {
        setErrorMsg(result.errorMessage || 'Giriş uğursuz oldu.');
        if (result.lockoutSeconds) {
          setLockoutCountdown(result.lockoutSeconds);
        }
      }
    } catch {
      setErrorMsg('Autentifikasiya zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setStudentErrorMsg('Zəhmət olmasa tələbə kodunu daxil edin.');
      return;
    }
    setStudentErrorMsg('');
    setIsStudentLoading(true);
    const success = await loginWithStudentCode(accessCode.trim());
    setIsStudentLoading(false);
    if (!success) {
      setStudentErrorMsg('Daxil edilmiş tələbə kodu tapılmadı. Zəhmət olmasa düzgünlüyünü yoxlayın və ya müəllimlə əlaqə saxlayın.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-navy-700 shadow-xl shadow-emerald-500/20 mb-4 ring-4 ring-white/10">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {teacherName}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          İngilis Dili Tədris və Şəxsi Kabinet Portalı
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab('teacher');
                setErrorMsg('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'teacher'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Müəllim Girişi</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('student');
                setStudentErrorMsg('');
              }}
              className={`py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-slate-500 hover:text-navy-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Valideyn / Tələbə</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Teacher Form */}
            {activeTab === 'teacher' ? (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                {/* Security Error Alert */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Təhlükəsizlik Bildirişi</span>
                      <span>{errorMsg}</span>
                    </div>
                  </div>
                )}

                {/* Lockout Countdown Alert */}
                {lockoutCountdown > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5 font-medium">
                    <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                    <span>Təhlükəsizlik kilidi aktivdir: {lockoutCountdown} saniyə gözləyin...</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    İstifadəçi Adı və ya Rəsmi Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Məs: emil.agalarov"
                      value={teacherUsername}
                      onChange={e => setTeacherUsername(e.target.value)}
                      disabled={lockoutCountdown > 0 || isLoading}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Təhlükəsiz Şifrə
                    </label>
                    <span className="text-[11px] text-slate-400">Şifrələnmiş Giriş</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Müəllim şifrənizi daxil edin..."
                      value={teacherPass}
                      onChange={e => setTeacherPass(e.target.value)}
                      disabled={lockoutCountdown > 0 || isLoading}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                      title={showPassword ? 'Şifrəni gizlət' : 'Şifrəni göstər'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || lockoutCountdown > 0}
                  className="w-full py-3 px-4 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>{isLoading ? 'Yoxlanılır...' : lockoutCountdown > 0 ? 'Bloklanıb' : 'Təhlükəsiz Daxil Ol'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                </button>

                {/* Security Standards Badge */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SHA-256 Salt Heşləmə və Brute-Force Müdafiəsi</span>
                  </div>
                </div>
              </form>
            ) : (
              /* Student / Parent Form */
              <form onSubmit={handleStudentLogin} className="space-y-4">
                {studentErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{studentErrorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Şəxsi Tələbə Kodu (Student Access Code)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Məs: MURA-2026, AYAN-2026"
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase tracking-wider focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Müəllim tərəfindən hər şagirdə fərdi təqdim edilmiş unikal kod.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isStudentLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{isStudentLoading ? 'Yoxlanılır...' : 'Kabinetə Daxil Ol'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Sample Student Accounts */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
                    Nümunəvi Şagird Girişləri:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {students.slice(0, 4).map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => loginAsDemoStudent(s.id)}
                        className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-xs transition-all flex flex-col"
                      >
                        <span className="font-semibold text-slate-800 truncate">{s.name}</span>
                        <span className="text-[10px] text-slate-500">{s.group} • Kod: {s.accessCode}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Small Trust Note */}
        <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Fərdi Məlumatların Qorunması və SSL/TLS Şifrələmə Standartları</span>
        </div>
      </div>
    </div>
  );
};
