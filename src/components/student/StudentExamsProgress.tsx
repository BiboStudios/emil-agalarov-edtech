import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  BarChart2,
  Calendar,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ExamResult, Student } from '../../types';

interface StudentExamsProgressProps {
  student: Student;
  exams: ExamResult[];
}

export const StudentExamsProgress: React.FC<StudentExamsProgressProps> = ({
  student,
  exams
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Sort exams chronologically for the chart
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Chart data format
  const chartData = sortedExams.map(e => ({
    name: e.examTitle.split(' ')[0] + ' (' + e.date.slice(5) + ')',
    fullTitle: e.examTitle,
    date: e.date,
    Reading: e.readingScore,
    Listening: e.listeningScore,
    Grammar: e.grammarScore,
    Vocabulary: e.vocabularyScore,
    Ümumi_Bal: e.totalScore
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Sınaq Nəticələri və İnkişaf Qrafiki</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {student.name} ({student.group} qrupu) üzrə mock imtahan dinamikası və müəllim rəyləri
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'line'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xətti Qrafik (Dinamika)</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'bar'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sütunlu Qrafik (Bölmələr)</span>
          </button>
        </div>
      </div>

      {/* Recharts Visual Progress Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-navy-900 text-base">
              {chartType === 'line' ? 'Ümumi Balın Zaman Üzrə Artım Xətti' : 'Bölmələr Üzrə Bal Paylanması (Reading, Listening, Grammar, Vocabulary)'}
            </h3>
            <p className="text-xs text-slate-500">Maksimum bal: 100 (Hər bölmə 25 bal)</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Hələ ki, sınaq nəticəsi qeydə alınmayıb.
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1d30',
                      borderColor: '#1e3e62',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="Ümumi_Bal"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                    name="Ümumi Bal (100)"
                  />
                  <Line
                    type="monotone"
                    dataKey="Grammar"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Grammar (25)"
                  />
                  <Line
                    type="monotone"
                    dataKey="Reading"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Reading (25)"
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 30]}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1d30',
                      borderColor: '#1e3e62',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Reading" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Reading" />
                  <Bar dataKey="Listening" fill="#10b981" radius={[4, 4, 0, 0]} name="Listening" />
                  <Bar dataKey="Grammar" fill="#6366f1" radius={[4, 4, 0, 0]} name="Grammar" />
                  <Bar dataKey="Vocabulary" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Vocabulary" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Past Mock Exams Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-navy-900 text-sm">
            Bütün Keçmiş Sınaq Nəticələri və Müəllim Qeydləri
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Toplam: {exams.length} sınaq
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedExams.map(exam => (
            <div key={exam.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-navy-900 text-base">{exam.examTitle}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tarix: {exam.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Ümumi Nəticə</span>
                    <span className={`inline-flex px-3 py-1 rounded-full font-extrabold text-sm ${
                      exam.totalScore >= 90
                        ? 'bg-emerald-100 text-emerald-800'
                        : exam.totalScore >= 75
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {exam.totalScore} / {exam.maxScore} Bal
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Skill Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Reading:</span>
                  <span className="font-bold text-navy-900">{exam.readingScore} / 25</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Listening:</span>
                  <span className="font-bold text-navy-900">{exam.listeningScore} / 25</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Grammar:</span>
                  <span className="font-bold text-navy-900">{exam.grammarScore} / 25</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Vocabulary:</span>
                  <span className="font-bold text-navy-900">{exam.vocabularyScore} / 25</span>
                </div>
              </div>

              {/* Teacher Feedback Note */}
              {exam.teacherFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5 leading-relaxed">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">Emil Müəllimin Şərhi: </span>
                    <span className="text-emerald-900">{exam.teacherFeedback}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
