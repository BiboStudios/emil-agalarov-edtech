import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock,
  History,
  X,
  ShieldAlert,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { updatePassword, auditLogs, refreshAuditLogs } = useAuth();

  const [activeTab, setActiveTab] = useState<'password' | 'logs'>('password');

  // Change Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Password strength checks
  const hasMinLength = newPass.length >= 8;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasLower = /[a-z]/.test(newPass);
  const hasNumber = /[0-9]/.test(newPass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPass);
  const isMatch = newPass && newPass === confirmPass;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!isMatch) {
      setStatusMsg({ type: 'error', text: 'Yeni şifrə və təkrarı bir-biri ilə eyni deyil.' });
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setStatusMsg({ type: 'error', text: 'Yeni şifrə bütün təhlükəsizlik tələblərinə cavab verməlidir.' });
      return;
    }

    setIsLoading(true);
    const res = await updatePassword(currentPass, newPass);
    setIsLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Müəllim şifrəniz uğurla yeniləndi və təhlükəsiz heşləndi!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      refreshAuditLogs();
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Şifrə yenilənərkən xəta baş verdi.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-navy-900 to-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Kibertəhlükəsizlik və Giriş Qoruması</h3>
              <p className="text-[11px] text-slate-300">
                Müəllim panelinin təhlükəsizlik ayarları və audit qeydləri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'password'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Müəllim Şifrəsini Yenilə</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('logs');
              refreshAuditLogs();
            }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'logs'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Təhlükəsizlik və Giriş Jurnalı</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Status Alert */}
              {statusMsg && (
                <div className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {statusMsg.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hazırkı Şifrəniz *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    placeholder="Hazırkı şifrəni daxil edin..."
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yeni Təhlükəsiz Şifrə *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    placeholder="Yeni şifrə..."
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yeni Şifrənin Təkrarı *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    placeholder="Yeni şifrəni təkrar daxil edin..."
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 block mb-1">
                  Kibertəhlükəsizlik Şifrə Standartları:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                  <span className={hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {hasMinLength ? '✓' : '•'} Ən azı 8 simvol
                  </span>
                  <span className={hasUpper ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {hasUpper ? '✓' : '•'} Ən azı 1 böyük hərf (A-Z)
                  </span>
                  <span className={hasLower ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {hasLower ? '✓' : '•'} Ən azı 1 kiçik hərf (a-z)
                  </span>
                  <span className={hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {hasNumber ? '✓' : '•'} Ən azı 1 rəqəm (0-9)
                  </span>
                  <span className={hasSpecial ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {hasSpecial ? '✓' : '•'} Ən azı 1 xüsusi simvol (!@#$...)
                  </span>
                  <span className={isMatch ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {isMatch ? '✓' : '•'} Şifrə təkrarı uyğundur
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !isMatch || !hasMinLength}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Yenilənir...' : 'Şifrəni Təsdiqlə və Yadda Saxla'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Audit Logs View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">Giriş və Təhlükəsizlik Hadisələri</h4>
                  <p className="text-[11px] text-slate-500">
                    Sistemə olan son autentifikasiya cəhdləri və təhlükəsizlik qeydləri
                  </p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {auditLogs.length} hadisə
                </span>
              </div>

              <div className="space-y-2">
                {auditLogs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Hələ ki, təhlükəsizlik hadisəsi qeydə alınmayıb.
                  </div>
                ) : (
                  auditLogs.map(log => {
                    let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                    if (log.severity === 'warning') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    if (log.severity === 'danger') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';

                    return (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeClass}`}>
                              {log.event}
                            </span>
                            <span className="font-semibold text-slate-800">{log.details}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Monitor className="w-3 h-3 text-slate-400" />
                              {log.ipOrDevice}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-500 whitespace-nowrap font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
