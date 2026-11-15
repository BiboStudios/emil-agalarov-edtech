import React from 'react';
import {
  Users,
  CreditCard,
  Award,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { Student, AttendanceRecord, ExamResult, TuitionPayment } from '../../types';

interface TeacherOverviewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  exams: ExamResult[];
  tuition: TuitionPayment[];
  onNavigateTab: (tab: string) => void;
  onResetSeedData: () => void;
  onOpenAddStudent: () => void;
  onOpenAddExam: () => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  students,
  attendance,
  exams,
  tuition,
  onNavigateTab,
  onResetSeedData,
  onOpenAddStudent,
  onOpenAddExam
}) => {
  // 1. Total Active Students
  const totalStudents = students.length;
  const countA1 = students.filter(s => s.group === 'A1').length;
  const countA2 = students.filter(s => s.group === 'A2').length;
  const countB1 = students.filter(s => s.group === 'B1').length;

  // 2. Tuition Summary
  const totalExpectedTuition = tuition.reduce((sum, item) => sum + item.amount, 0);
  const totalCollectedTuition = tuition
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const unpaidTuition = totalExpectedTuition - totalCollectedTuition;
  const collectionRate = totalExpectedTuition > 0 ? Math.round((totalCollectedTuition / totalExpectedTuition) * 100) : 0;

  // 3. Average Exam Score
  const avgScore = exams.length > 0
    ? (exams.reduce((sum, e) => sum + e.totalScore, 0) / exams.length).toFixed(1)
    : '0';

  // 4. Attendance Rate (Last recent date or overall)
  const totalAttendanceRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalAttendanceRecords > 0
    ? Math.round((presentCount / totalAttendanceRecords) * 100)
    : 100;

  // Recent 5 Exam Results
  const recentExams = [...exams].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Müəllim İdarəetmə Paneli • Emil Ağalarov
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xoş gəldiniz, Emil müəllim! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Bugünkü dərslər, sınaq nəticələri, tələbələrin davamiyyəti və təhsil haqqı ödənişlərinin cari vəziyyəti aşağıda təqdim olunur.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Tələbə Əlavə Et</span>
            </button>
            <button
              onClick={onOpenAddExam}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Sınaq Balı Daxil Et</span>
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border border-white/20"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Davamiyyəti Qeyd Et</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Students */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktiv Tələbələr</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">nəfər</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>A1: <strong className="text-navy-900">{countA1}</strong></span>
            <span>A2: <strong className="text-navy-900">{countA2}</strong></span>
            <span>B1: <strong className="text-navy-900">{countB1}</strong></span>
          </div>
        </div>

        {/* Metric 2: Tuition Paid / Unpaid */}
        <div
          onClick={() => onNavigateTab('tuition')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aylıq Ödəniş İcmalı</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{totalCollectedTuition} ₼</span>
            <span className="text-xs text-slate-400">/ {totalExpectedTuition} ₼</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold">{collectionRate}% ödənilib</span>
            <span className="text-rose-600 font-semibold">{unpaidTuition} ₼ qalıq</span>
          </div>
        </div>

        {/* Metric 3: Average Exam Score */}
        <div
          onClick={() => onNavigateTab('exams')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Orta Sınaq Balı</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{avgScore}</span>
            <span className="text-xs text-slate-400">/ 100 bal</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Yüksələn dinamika
            </span>
            <span>{exams.length} sınaq qeydi</span>
          </div>
        </div>

        {/* Metric 4: Attendance Rate */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Davamiyyət Faizi</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-navy-950">{attendanceRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">yüksək</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{presentCount} dərs iştirakı</span>
            <span className="text-navy-900 font-semibold">Aktiv nəzarət</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Exams & Quick Tuition Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Exam Results */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-navy-900 text-base">Son Sınaq Nəticələri</h3>
              <p className="text-xs text-slate-500">Tələbələrin ən son mock və monitorinq balları</p>
            </div>
            <button
              onClick={() => onNavigateTab('exams')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Hamısına bax</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Tələbə</th>
                  <th className="py-2.5 px-3">Sınaq Adı</th>
                  <th className="py-2.5 px-3">Tarix</th>
                  <th className="py-2.5 px-3">R / L / G / V</th>
                  <th className="py-2.5 px-3 text-right">Ümumi Bal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentExams.map(exam => {
                  const student = students.find(s => s.id === exam.studentId);
                  return (
                    <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{student?.name || 'Tələbə'}</div>
                        <div className="text-[10px] text-slate-500">{student?.group}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 truncate max-w-[180px]">
                        {exam.examTitle}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {exam.date}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {exam.readingScore} / {exam.listeningScore} / {exam.grammarScore} / {exam.vocabularyScore}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full font-bold text-xs ${
                          exam.totalScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : exam.totalScore >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {exam.totalScore} / {exam.maxScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Pending Tuition & Fast Help */}
        <div className="space-y-6">
          {/* Tuition Alert Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-navy-900 text-base">Ödəniş Vəziyyəti (Noyabr)</h3>
              <button
                onClick={() => onNavigateTab('tuition')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                İdarə et
              </button>
            </div>
            <div className="space-y-2.5">
              {tuition.slice(0, 4).map(t => {
                const student = students.find(s => s.id === t.studentId);
                const isPaid = t.status === 'paid';
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{student?.name}</div>
                      <div className="text-[10px] text-slate-500">{t.amount} AZN</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isPaid ? 'Ödənilib' : 'Gözlənilir'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Reset Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Sınaq Məlumatlarını Sıfırla</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Tətbiqi yenidən ilk vəziyyətdə test etmək üçün bütün dəyişiklikləri ilkin nümunə məlumatlara qaytara bilərsiniz.
            </p>
            <button
              onClick={() => {
                if (confirm('Bütün məlumatlar ilkin nümunəvi vəziyyətə qaytarılsın?')) {
                  onResetSeedData();
                }
              }}
              className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>İlkin Məlumatları Bərpa Et</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
