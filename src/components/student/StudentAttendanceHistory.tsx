import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Calendar,
  BookOpen
} from 'lucide-react';
import { AttendanceRecord, Student } from '../../types';

interface StudentAttendanceHistoryProps {
  student: Student;
  attendance: AttendanceRecord[];
}

export const StudentAttendanceHistory: React.FC<StudentAttendanceHistoryProps> = ({
  student,
  attendance
}) => {
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  const total = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;

  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  const filteredAttendance = attendance.filter(a => {
    if (filter === 'present') return a.status === 'present' || a.status === 'late';
    if (filter === 'absent') return a.status === 'absent' || a.status === 'excused';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            <span>Davamiyyət Tarixçəsi və İntizam</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {student.name} üçün qeydə alınmış dərslər, mövzular və iştirak dərəcəsi
          </p>
        </div>

        {/* Progress Bar & KPI Cards */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Ümumi Davamiyyət Göstəricisi:</span>
            <span className="font-extrabold text-emerald-700 text-sm">{attendanceRate}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                İştirak:
              </span>
              <span className="font-bold text-navy-900">{presentCount}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Gecikib:
              </span>
              <span className="font-bold text-navy-900">{lateCount}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                İcazəli:
              </span>
              <span className="font-bold text-navy-900">{excusedCount}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Gəlməyib:
              </span>
              <span className="font-bold text-navy-900">{absentCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-navy-900 text-sm">
            Dərs Qeydiyyatı Jurnalı ({filteredAttendance.length} dərs)
          </h3>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-navy-900 text-white' : 'bg-white text-slate-600 border'
              }`}
            >
              Hamısı
            </button>
            <button
              onClick={() => setFilter('present')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'present' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border'
              }`}
            >
              İştirak Edilənlər
            </button>
            <button
              onClick={() => setFilter('absent')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                filter === 'absent' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border'
              }`}
            >
              Gəlmədiyi / İcazəli
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAttendance.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
              Bu kateqoriya üzrə qeyd tapılmadı.
            </div>
          ) : (
            filteredAttendance.map(item => {
              const isPresent = item.status === 'present';
              const isLate = item.status === 'late';
              const isExcused = item.status === 'excused';
              const isAbsent = item.status === 'absent';

              return (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-bold text-navy-900 text-sm">
                        {item.date}
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mövzu: <strong>{item.topic || 'Ümumi Qrammatika və Praktika'}</strong></span>
                      </div>
                      {item.note && (
                        <div className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                          Qeyd: {item.note}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {isPresent && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>İştirak edib</span>
                      </span>
                    )}
                    {isLate && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Gecikib</span>
                      </span>
                    )}
                    {isExcused && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>İcazəli</span>
                      </span>
                    )}
                    {isAbsent && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Gəlməyib</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
