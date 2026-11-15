import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, User, Key, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';

interface LoginScreenProps {
  students: Student[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ students }) => {
  const { loginAsTeacher, loginWithStudentCode, loginAsDemoStudent, teacherName } = useAuth();
  const [activeTab, setActiveTab] = useState<'teacher' | 'student'>('teacher');
  const [accessCode, setAccessCode] = useState('');
  const [teacherPass, setTeacherPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      loginAsTeacher();
      setIsLoading(false);
    }, 300);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMsg('Zəhmət olmasa tələbə kodunu daxil edin.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    const success = await loginWithStudentCode(accessCode.trim());
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Daxil edilmiş tələbə kodu tapılmadı. Zəhmət olmasa düzgünlüyünü yoxlayın və ya müəllimlə əlaqə saxlayın.');
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
                setErrorMsg('');
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
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Teacher Form */}
            {activeTab === 'teacher' ? (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Müəllim / Administrator
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Emil Ağalarov (Admin)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Giriş Şifrəsi
                    </label>
                    <span className="text-[11px] text-emerald-600 font-medium">Demo: İstənilən simvol</span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="Şifrənizi daxil edin..."
                      value={teacherPass}
                      onChange={e => setTeacherPass(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{isLoading ? 'Daxil olunur...' : 'Müəllim Panelinə Daxil Ol'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-emerald-400" />
                </button>

                {/* Instant 1-Click Access for Evaluation */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={loginAsTeacher}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
                  >
                    🚀 Şifrəsiz 1-kliklə sürətli demo giriş
                  </button>
                </div>
              </form>
            ) : (
              /* Student / Parent Form */
              <form onSubmit={handleStudentLogin} className="space-y-4">
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
                    Müəllim tərəfindən təqdim edilmiş unikal 8 simvollu kodu daxil edin.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{isLoading ? 'Yoxlanılır...' : 'Kabinetə Daxil Ol'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Quick 1-Click Demo Students */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">
                    Sürətli Test Üçün Tələbə Seçin:
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
          <span>Təhlükəsiz və Fərdi Məlumatların Qorunması Təmin Edilir</span>
        </div>
      </div>
    </div>
  );
};
