import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Calendar,
  X,
  TrendingUp,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { Student, ExamResult } from '../../types';

interface ExamResultsManagerProps {
  students: Student[];
  exams: ExamResult[];
  onAddExam: (exam: Omit<ExamResult, 'id'>) => Promise<void>;
  onDeleteExam: (id: string) => Promise<void>;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

export const ExamResultsManager: React.FC<ExamResultsManagerProps> = ({
  students,
  exams,
  onAddExam,
  onDeleteExam,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially
}) => {
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);

  // Form State
  const [studentId, setStudentId] = useState<string>(students[0]?.id || '');
  const [examTitle, setExamTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [readingScore, setReadingScore] = useState<number>(20);
  const [listeningScore, setListeningScore] = useState<number>(20);
  const [grammarScore, setGrammarScore] = useState<number>(20);
  const [vocabularyScore, setVocabularyScore] = useState<number>(20);
  const [teacherFeedback, setTeacherFeedback] = useState('');

  const totalScore = readingScore + listeningScore + grammarScore + vocabularyScore;

  const handleOpenAdd = () => {
    setStudentId(students[0]?.id || '');
    setExamTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setReadingScore(20);
    setListeningScore(20);
    setGrammarScore(20);
    setVocabularyScore(20);
    setTeacherFeedback('');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !examTitle.trim()) return;

    await onAddExam({
      studentId,
      examTitle: examTitle.trim(),
      date,
      readingScore: Number(readingScore),
      listeningScore: Number(listeningScore),
      grammarScore: Number(grammarScore),
      vocabularyScore: Number(vocabularyScore),
      totalScore,
      maxScore: 100,
      teacherFeedback: teacherFeedback.trim()
    });

    handleClose();
  };

  const filteredExams = exams.filter(e => {
    if (selectedStudentFilter === 'all') return true;
    return e.studentId === selectedStudentFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Sınaq və Mock İmtahan Nəticələri</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bölmələr üzrə bal bölgüsü (Reading, Listening, Grammar, Vocabulary) və rəy qeydləri
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sınaq Balı Daxil Et</span>
        </button>
      </div>

      {/* Filter by student */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <span className="font-semibold text-slate-600 whitespace-nowrap">Tələbəyə görə süzgəc:</span>
        <select
          value={selectedStudentFilter}
          onChange={e => setSelectedStudentFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Bütün Tələbələr ({exams.length} nəticə)</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.group})
            </option>
          ))}
        </select>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tələbə</th>
                <th className="py-3 px-4">Sınaq İmtahanı</th>
                <th className="py-3 px-4">Tarix</th>
                <th className="py-3 px-4 text-center">Reading (25)</th>
                <th className="py-3 px-4 text-center">Listening (25)</th>
                <th className="py-3 px-4 text-center">Grammar (25)</th>
                <th className="py-3 px-4 text-center">Vocabulary (25)</th>
                <th className="py-3 px-4 text-center">Ümumi Bal</th>
                <th className="py-3 px-4 text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Sınaq nəticəsi tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredExams.map(exam => {
                  const student = students.find(s => s.id === exam.studentId);
                  return (
                    <React.Fragment key={exam.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-navy-900">{student?.name || 'Tələbə'}</div>
                          <div className="text-[10px] text-slate-500">{student?.group}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {exam.examTitle}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {exam.date}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {exam.readingScore}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {exam.listeningScore}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {exam.grammarScore}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                          {exam.vocabularyScore}
                        </td>
                        <td className="py-3 px-4 text-center">
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
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Bu imtahan nəticəsini silmək istədiyinizə əminsiniz?')) {
                                onDeleteExam(exam.id);
                              }
                            }}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {/* Teacher Feedback Note Sub-row */}
                      {exam.teacherFeedback && (
                        <tr className="bg-slate-50/40">
                          <td colSpan={9} className="px-4 py-2 border-b border-slate-100">
                            <div className="flex items-start gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-800">Müəllim Rəyi: </span>
                                <span>{exam.teacherFeedback}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-navy-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Yeni Sınaq Nəticəsi Qeyd Et</span>
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tələbə Seçin *
                </label>
                <select
                  required
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.group} Qrupu)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sınaq Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Noyabr Monitorinqi"
                    value={examTitle}
                    onChange={e => setExamTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İmtahan Tarixi
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* 4 Score inputs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Bölmələr üzrə Ballar (Max 25 hər biri)
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Cəm: {totalScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Reading
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={readingScore}
                      onChange={e => setReadingScore(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-center font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Listening
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={listeningScore}
                      onChange={e => setListeningScore(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-center font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Grammar
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={grammarScore}
                      onChange={e => setGrammarScore(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-center font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Vocabulary
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={vocabularyScore}
                      onChange={e => setVocabularyScore(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-center font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Müəllim Rəyi və Tövsiyələri
                </label>
                <textarea
                  rows={3}
                  placeholder="Tələbənin güclü və zəif cəhətləri, növbəti mərhələ üçün tapşırıqlar..."
                  value={teacherFeedback}
                  onChange={e => setTeacherFeedback(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                >
                  Balı Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
