import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Check,
  Calendar,
  Layers,
  BookOpen
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus, EnglishLevel } from '../../types';

interface AttendanceTrackerProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => Promise<void>;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  attendance,
  onSaveAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState<EnglishLevel>('All');
  const [lessonTopic, setLessonTopic] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing records for the selected date
  useEffect(() => {
    const existingForDate = attendance.filter(a => a.date === selectedDate);
    const newMap: Record<string, { status: AttendanceStatus; note: string }> = {};

    // First load from existing records
    existingForDate.forEach(rec => {
      newMap[rec.studentId] = {
        status: rec.status,
        note: rec.note || ''
      };
      if (rec.topic && !lessonTopic) {
        setLessonTopic(rec.topic);
      }
    });

    // For students with no record on this date, default to 'present'
    students.forEach(s => {
      if (!newMap[s.id]) {
        newMap[s.id] = { status: 'present', note: '' };
      }
    });

    setAttendanceMap(newMap);
    setSavedSuccess(false);
  }, [selectedDate, attendance, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
    setSavedSuccess(false);
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
    setSavedSuccess(false);
  };

  // Bulk mark all filtered as present
  const handleMarkAllPresent = () => {
    const newMap = { ...attendanceMap };
    filteredStudents.forEach(s => {
      newMap[s.id] = { ...newMap[s.id], status: 'present' };
    });
    setAttendanceMap(newMap);
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    const recordsToSave: AttendanceRecord[] = filteredStudents.map(s => {
      const entry = attendanceMap[s.id] || { status: 'present', note: '' };
      return {
        id: `att-${selectedDate}-${s.id}`,
        date: selectedDate,
        studentId: s.id,
        status: entry.status,
        topic: lessonTopic.trim() || undefined,
        note: entry.note.trim() || undefined
      };
    });

    await onSaveAttendance(recordsToSave);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredStudents = students.filter(s => {
    if (selectedGroup === 'All') return true;
    return s.group === selectedGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-600" />
              <span>Davamiyyət Jurnalı</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Gündəlik dərslər üzrə tələbələrin iştirak, gecikmə və ya icazə statusunun qeydiyyatı
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              Hamısını İştirak Edib İşarələ
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 ${
                savedSuccess ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Yadda Saxlanıldı!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Davamiyyəti Saxla</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dərs Tarixi
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Qrup Seçimi
            </label>
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value as EnglishLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="All">Bütün Qruplar ({students.length} tələbə)</option>
              <option value="A1">A1 Qrupu</option>
              <option value="A2">A2 Qrupu</option>
              <option value="B1">B1 Qrupu</option>
              <option value="B2">B2 Qrupu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dərs Mövzusu (Topic)
            </label>
            <input
              type="text"
              placeholder="Məs: Present Perfect vs Past Simple"
              value={lessonTopic}
              onChange={e => setLessonTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Checklist per student */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
          <span>Tələbələr ({filteredStudents.length} nəfər)</span>
          <span>Davamiyyət Statusu</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map(student => {
            const currentStatus = attendanceMap[student.id]?.status || 'present';
            const currentNote = attendanceMap[student.id]?.note || '';

            return (
              <div
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {student.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-navy-900 text-sm">{student.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {student.group} Qrupu • Valideyn: {student.parentPhone}
                    </div>
                  </div>
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* İştirak edib */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'present'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>İştirak edib</span>
                  </button>

                  {/* Gəlməyib */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'absent'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Gəlməyib</span>
                  </button>

                  {/* Gecikib */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'late')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'late'
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Gecikib</span>
                  </button>

                  {/* İcazəli */}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(student.id, 'excused')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      currentStatus === 'excused'
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>İcazəli</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
