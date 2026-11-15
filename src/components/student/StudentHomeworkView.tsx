import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  CheckCircle,
  FileCode,
  Clock,
  Sparkles
} from 'lucide-react';
import { HomeworkItem, Student } from '../../types';

interface StudentHomeworkViewProps {
  student: Student;
  homework: HomeworkItem[];
}

export const StudentHomeworkView: React.FC<StudentHomeworkViewProps> = ({
  student,
  homework
}) => {
  const [completedHw, setCompletedHw] = useState<Set<string>>(new Set());

  // Filter homework matching student's group or All
  const relevantHomework = homework.filter(
    h => h.group === student.group || h.group === 'All'
  );

  const toggleCompleted = (id: string) => {
    setCompletedHw(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const handleDownload = (hw: HomeworkItem) => {
    // Generate a downloadable text/markdown file representation of the homework worksheet!
    const content = `# ${hw.title}\nMüəllim: Emil Ağalarov\nQrup: ${hw.group}\nSon Təhvil Tarixi: ${hw.dueDate}\n\n## Təlimat:\n${hw.description}\n\n---\nTapşırığı dəftərinizdə yerinə yetirdikdən sonra növbəti dərsdə Emil müəllimə təhvil verin.`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', hw.resourceName || 'homework.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          <span>Ev Tapşırıqları və Dərs Vəsaitləri</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {student.name} ({student.group} qrupu) üçün Emil müəllim tərəfindən təyin edilmiş həftəlik tapşırıqlar
        </p>
      </div>

      {/* Homework Cards */}
      <div className="space-y-4">
        {relevantHomework.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
            Hal-hazırda bu qrup üçün aktiv ev tapşırığı yoxdur.
          </div>
        ) : (
          relevantHomework.map(item => {
            const isDone = completedHw.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                        {item.group} Qrupu
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        Son Tarix: {item.dueDate}
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold ${
                      isDone ? 'text-emerald-950 line-through' : 'text-navy-900'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <button
                      onClick={() => handleDownload(item)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
                      title="Vəsaiti yüklə"
                    >
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>{item.resourceName}</span>
                    </button>

                    <button
                      onClick={() => toggleCompleted(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'border border-slate-300 text-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isDone ? 'Tamamlandı' : 'Tamamladım'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
