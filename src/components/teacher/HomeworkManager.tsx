import React, { useState } from 'react';
import { FileText, Plus, Download, Calendar, Users, X, CheckCircle, FileCode } from 'lucide-react';
import { HomeworkItem, EnglishLevel } from '../../types';

interface HomeworkManagerProps {
  homework: HomeworkItem[];
  onAddHomework: (hw: Omit<HomeworkItem, 'id'>) => Promise<void>;
}

export const HomeworkManager: React.FC<HomeworkManagerProps> = ({
  homework,
  onAddHomework
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState<EnglishLevel>('B1');
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [resourceName, setResourceName] = useState('Unit_Assignment.pdf');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAddHomework({
      title: title.trim(),
      description: description.trim(),
      group,
      dueDate,
      resourceName: resourceName.trim() || 'Worksheet.pdf',
      resourceUrl: '#'
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Ev Tapşırıqları və Vəsaitlər</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Qruplar üzrə təyin edilmiş ev tapşırıqları, son təhvil tarixləri və yüklənə bilən materiallar
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Tapşırıq Əlavə Et</span>
        </button>
      </div>

      {/* Homework List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homework.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-navy-100 text-navy-800">
                  {item.group} Qrupu
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Son: {item.dueDate}
                </span>
              </div>

              <h3 className="font-bold text-navy-900 text-base mb-2">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold truncate max-w-[180px]">
                <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{item.resourceName}</span>
              </div>

              <button
                onClick={() => alert(`"${item.resourceName}" vəsaiti tələbə panelindən yüklənilə bilər.`)}
                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="Materialı yüklə"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-navy-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>Yeni Ev Tapşırığı Təyin Et</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tapşırığın Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Unit 5 Passive Voice Çalışmaları"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Qrup / Səviyyə
                  </label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value as EnglishLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="A1">A1 Qrupu</option>
                    <option value="A2">A2 Qrupu</option>
                    <option value="B1">B1 Qrupu</option>
                    <option value="B2">B2 Qrupu</option>
                    <option value="All">Bütün Qruplar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Son Təhvil Tarixi
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tapşırıq Təlimatı və Təsviri
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tapşırığın şərtləri, yerinə yetirilməli olan səhifələr və ya yazı mövzusu..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yüklənəcək Vəsaitin Adı (PDF / Doc)
                </label>
                <input
                  type="text"
                  placeholder="Məs: Unit5_Grammar_Worksheet.pdf"
                  value={resourceName}
                  onChange={e => setResourceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md"
                >
                  Tapşırığı Təyin Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
