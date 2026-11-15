import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Check,
  Phone,
  Mail,
  Calendar,
  X,
  CreditCard,
  Key
} from 'lucide-react';
import { Student, EnglishLevel } from '../../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  onUpdateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  isAddModalOpenInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  isAddModalOpenInitially = false,
  onCloseAddModalInitially
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<EnglishLevel>('All');
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [group, setGroup] = useState<EnglishLevel>('B1');
  const [parentPhone, setParentPhone] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(120);
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Handle open modal for create
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setGroup('B1');
    setParentPhone('+994 ');
    setStudentPhone('+994 ');
    setMonthlyFee(120);
    // Auto-generate code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setAccessCode(`ENG-${randomSuffix}`);
    setEmail('');
    setNotes('');
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setName(s.name);
    setGroup(s.group);
    setParentPhone(s.parentPhone);
    setStudentPhone(s.studentPhone || '');
    setMonthlyFee(s.monthlyFee);
    setAccessCode(s.accessCode);
    setEmail(s.email || '');
    setNotes(s.notes || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !accessCode.trim()) return;

    if (editingStudent) {
      await onUpdateStudent(editingStudent.id, {
        name: name.trim(),
        group,
        parentPhone: parentPhone.trim(),
        studentPhone: studentPhone.trim() || undefined,
        monthlyFee: Number(monthlyFee),
        accessCode: accessCode.trim().toUpperCase(),
        email: email.trim() || undefined,
        notes: notes.trim() || undefined
      });
    } else {
      await onAddStudent({
        name: name.trim(),
        group,
        parentPhone: parentPhone.trim(),
        studentPhone: studentPhone.trim() || undefined,
        monthlyFee: Number(monthlyFee),
        accessCode: accessCode.trim().toUpperCase(),
        joinedDate: new Date().toISOString().split('T')[0],
        email: email.trim() || undefined,
        notes: notes.trim() || undefined
      });
    }
    handleCloseModal();
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.accessCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentPhone.includes(searchTerm);
    const matchesGroup = selectedGroup === 'All' || s.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Tələbələrin İdarə Edilməsi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Qruplar, valideyn əlaqə nömrələri, təhsil haqqı və unikal tələbə kodları
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Tələbə Əlavə Et</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Ada, tələbə koduna və ya telefon nömrəsinə görə axtarın..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'A1', 'A2', 'B1', 'B2'] as EnglishLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedGroup(lvl)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGroup === lvl
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lvl === 'All' ? 'Bütün Qruplar' : `${lvl} Qrupu`}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tələbə</th>
                <th className="py-3 px-4">Qrup</th>
                <th className="py-3 px-4">Valideyn Nömrəsi</th>
                <th className="py-3 px-4">Aylıq Ödəniş</th>
                <th className="py-3 px-4">Şəxsi Giriş Kodu</th>
                <th className="py-3 px-4 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Axtarışa uyğun tələbə tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-navy-900">{s.name}</div>
                          {s.email && <div className="text-[11px] text-slate-400">{s.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        s.group === 'B1' || s.group === 'B2'
                          ? 'bg-purple-100 text-purple-700'
                          : s.group === 'A2'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {s.group}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.parentPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {s.monthlyFee} AZN
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-semibold text-slate-700">
                        <span>{s.accessCode}</span>
                        <button
                          onClick={() => handleCopyCode(s.accessCode, s.id)}
                          title="Kodu kopyala"
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {copiedCodeId === s.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                          title="Redaktə et"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${s.name} adlı tələbəni silmək istədiyinizə əminsiniz?`)) {
                              onDeleteStudent(s.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-navy-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{editingStudent ? 'Tələbə Məlumatlarını Yenilə' : 'Yeni Tələbə Əlavə Et'}</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tələbənin Adı və Soyadı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Kənan Quliyev"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İngilis Dili Qrupu / Səviyyə
                  </label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value as EnglishLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                  >
                    <option value="A1">A1 (Başlanğıc)</option>
                    <option value="A2">A2 (Elementar)</option>
                    <option value="B1">B1 (Orta Səviyyə)</option>
                    <option value="B2">B2 (Yuxarı Orta)</option>
                    <option value="IELTS">IELTS Hazırlıq</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aylıq Təhsil Haqqı (AZN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={monthlyFee}
                    onChange={e => setMonthlyFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valideyn Telefonu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+994 50 123 45 67"
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tələbə Giriş Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: KENA-2026"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Müəllim Qeydləri (Zəif/güclü tərəflər)
                </label>
                <textarea
                  rows={2}
                  placeholder="Məsələn: Speaking yaxşıdır, Reading zaman idarəetməsində təkmilləşmə lazımdır."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                >
                  {editingStudent ? 'Yadda Saxla' : 'Tələbəni Əlavə Et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
