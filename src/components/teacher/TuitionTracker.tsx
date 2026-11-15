import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
  Search,
  Filter,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Student, TuitionPayment } from '../../types';

interface TuitionTrackerProps {
  students: Student[];
  tuition: TuitionPayment[];
  onToggleStatus: (id: string) => Promise<void>;
}

export const TuitionTracker: React.FC<TuitionTrackerProps> = ({
  students,
  tuition,
  onToggleStatus
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Summaries
  const totalAmount = tuition.reduce((acc, t) => acc + t.amount, 0);
  const paidAmount = tuition.filter(t => t.status === 'paid').reduce((acc, t) => acc + t.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = tuition.filter(t => t.status === 'paid').length;
  const totalCount = tuition.length;

  const filteredTuition = tuition.filter(t => {
    const student = students.find(s => s.id === t.studentId);
    const matchesSearch = student
      ? student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentPhone.includes(searchTerm)
      : false;

    if (filterStatus === 'paid' && t.status !== 'paid') return false;
    if (filterStatus === 'pending' && t.status === 'paid') return false;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Summary Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Aylıq Təhsil Haqqı və Ödəniş Nəzarəti</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Noyabr 2026 ayı üzrə tələbələrin ödəniş vəziyyəti və 1-kliklə qəbz qeydiyyatı
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Gözlənilən</span>
              <div className="text-2xl font-extrabold text-navy-950 mt-1">{totalAmount} AZN</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold">
              {totalCount} tələbə
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Toplanmış Məbləğ</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{paidAmount} AZN</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-bold">
              {paidCount} ödənilib
            </span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Gözlənilən Qalıq</span>
              <div className="text-2xl font-extrabold text-rose-700 mt-1">{pendingAmount} AZN</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-200 text-rose-900 font-bold">
              {totalCount - paidCount} qalıb
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Tələbə adına və ya valideyn telefonuna görə axtarın..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Hamısı
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'paid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Ödənilib
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'pending'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Ödənilməyib
          </button>
        </div>
      </div>

      {/* Tuition Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tələbə</th>
                <th className="py-3 px-4">Valideyn Nömrəsi</th>
                <th className="py-3 px-4">Dövr</th>
                <th className="py-3 px-4">Məbləğ</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ödəniş Tarixi / Qeyd</th>
                <th className="py-3 px-4 text-right">Statusu Dəyiş</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTuition.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Ödəniş qeydi tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredTuition.map(t => {
                  const student = students.find(s => s.id === t.studentId);
                  const isPaid = t.status === 'paid';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-navy-900">{student?.name || 'Tələbə'}</div>
                        <div className="text-[11px] text-slate-500">{student?.group} Qrupu</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {student?.parentPhone}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {t.monthYear}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-navy-950">
                        {t.amount} AZN
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isPaid ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Ödənilib</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Ödənilməyib</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {t.paymentDate ? (
                          <div className="font-medium text-slate-700">{t.paymentDate}</div>
                        ) : null}
                        {t.receiptNote && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{t.receiptNote}</div>
                        )}
                        {!t.paymentDate && !t.receiptNote && <span>-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onToggleStatus(t.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isPaid
                              ? 'border-slate-300 text-slate-600 hover:bg-slate-100'
                              : 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold'
                          }`}
                        >
                          {isPaid ? 'Gözlənilir et' : 'Ödənildi qeyd et'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
