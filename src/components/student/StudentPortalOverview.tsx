import React from 'react';
import {
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  CalendarCheck,
  Award,
  Video,
  FileQuestion,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Student, AttendanceRecord, ExamResult, TuitionPayment } from '../../types';

interface StudentPortalOverviewProps {
  student: Student;
  attendance: AttendanceRecord[];
  exams: ExamResult[];
  tuition?: TuitionPayment;
  onNavigateTab: (tab: string) => void;
}

export const StudentPortalOverview: React.FC<StudentPortalOverviewProps> = ({
  student,
  attendance,
  exams,
  tuition,
  onNavigateTab
}) => {
  // Attendance calculation
  const totalAtt = attendance.length;
  const presentAtt = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attRate = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 100;

  // Latest Exam
  const sortedExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestExam = sortedExams[0];

  const isPaid = tuition?.status === 'paid';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Student Welcome Card */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 skew-x-12 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-navy-950 font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10">
              {student.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {student.group} Səviyyəsi
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Tələbə Kodu: <strong className="font-mono text-emerald-300">{student.accessCode}</strong> • Müəllim: Emil Ağalarov
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('portal-quizzes')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <FileQuestion className="w-4 h-4" />
              <span>Quizə Başla</span>
            </button>
            <button
              onClick={() => onNavigateTab('portal-videos')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Dərsləri İzlə</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Status Banner */}
      <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
        isPaid
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-amber-50/80 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {isPaid ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold">
              {isPaid
                ? 'Noyabr 2026 ayı təhsil haqqı ödənilib'
                : 'Noyabr 2026 ayı təhsil haqqı qeydiyyatı'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isPaid
                ? `Məbləğ: ${student.monthlyFee} AZN. Ödənişiniz qeydə alınıb, təşəkkür edirik!`
                : `Aylıq ödəniş: ${student.monthlyFee} AZN. Zəhmət olmasa ayın sonunadək ödənişi tamamlayın.`}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
          isPaid ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
        }`}>
          {isPaid ? 'Ödənilib' : 'Gözlənilir'}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Attendance */}
        <div
          onClick={() => onNavigateTab('portal-attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Davamiyyətim</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{attRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">yüksək nəticə</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{presentAtt} dərsdə iştirak</span>
            <span className="text-emerald-700 font-semibold group-hover:underline">Detallara bax →</span>
          </div>
        </div>

        {/* Metric 2: Latest Mock Exam */}
        <div
          onClick={() => onNavigateTab('portal-exams')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Son Sınaq Nəticəsi</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">
              {latestExam ? latestExam.totalScore : '-'}
            </span>
            <span className="text-xs text-slate-400">/ 100 bal</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate max-w-[140px]">{latestExam?.examTitle || 'Sınaq yoxdur'}</span>
            <span className="text-emerald-700 font-semibold group-hover:underline">İnkişaf qrafiki →</span>
          </div>
        </div>

        {/* Metric 3: Group & Study Materials */}
        <div
          onClick={() => onNavigateTab('portal-flashcards')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lüğət Kartları</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">B1 & A2</span>
            <span className="text-xs text-slate-500 font-medium">Lüğət dəstləri</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Phrasal Verbs & Oxford 3000</span>
            <span className="text-emerald-700 font-semibold group-hover:underline">Kartları aç →</span>
          </div>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Teacher Feedback */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Emil Müəllimdən Son Rəy</span>
            </h3>
            <span className="text-xs text-slate-400">{latestExam?.date}</span>
          </div>

          {latestExam?.teacherFeedback ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p className="font-medium text-slate-800 mb-1">
                "{latestExam.examTitle}" üzrə:
              </p>
              <p className="italic text-slate-600">
                {latestExam.teacherFeedback}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">
              Hələ ki, sınaq rəyi daxil edilməyib.
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Zəif və güclü bölmələrinizi qrafikdə görün</span>
            <button
              onClick={() => onNavigateTab('portal-exams')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Qrafikə bax</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module 2: Homework & Activities */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Cari Ev Tapşırıqları</span>
            </h3>
            <button
              onClick={() => onNavigateTab('portal-homework')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Hamısına bax
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-navy-900">Unit 4: Present Perfect vs Past Simple</h4>
                <p className="text-[11px] text-slate-500">Testlər və 100 sözlük inşa yazısı</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Son: 18 Noyabr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-navy-900">Reading Passage: "The Digital Era"</h4>
                <p className="text-[11px] text-slate-500">Mətn oxusu və 10 yeni sözün tapılması</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                Son: 20 Noyabr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
