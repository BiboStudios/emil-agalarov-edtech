import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Video,
  FileQuestion,
  Layers,
  FileText,
  Lock,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Student } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  students: Student[];
  onOpenSecurityModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  students,
  onOpenSecurityModal
}) => {
  const {
    role,
    currentStudent,
    teacherName,
    loginAsDemoStudent,
    logout,
    setShowBirthdayModal,
    triggerBirthdayConfetti
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const teacherTabs = [
    { id: 'overview', label: 'İcmal', icon: BookOpen },
    { id: 'students', label: 'Tələbələr', icon: User },
    { id: 'attendance', label: 'Davamiyyət', icon: Calendar },
    { id: 'exams', label: 'Sınaq Nəticələri', icon: Award },
    { id: 'tuition', label: 'Ödəniş Nəzarəti', icon: CreditCard },
    { id: 'content', label: 'Dərslər və Quizlər', icon: Video },
    { id: 'homework', label: 'Ev Tapşırıqları', icon: FileText }
  ];

  const studentTabs = [
    { id: 'portal-overview', label: 'Mənim Kabinetim', icon: BookOpen },
    { id: 'portal-exams', label: 'Sınaq Balım və Qrafik', icon: Award },
    { id: 'portal-attendance', label: 'Davamiyyətim', icon: Calendar },
    { id: 'portal-videos', label: 'Video Dərslər', icon: Video },
    { id: 'portal-quizzes', label: 'Onlayn Quizlər', icon: FileQuestion },
    { id: 'portal-flashcards', label: 'Lüğət Kartları', icon: Layers },
    { id: 'portal-homework', label: 'Ev Tapşırıqları', icon: FileText }
  ];

  const activeTabs = role === 'teacher' ? teacherTabs : studentTabs;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Teacher Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center text-white shadow-md shadow-navy-900/10">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-900 tracking-tight text-base sm:text-lg">
                  {teacherName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  İngilis Dili
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                EdTech & Tələbə İdarəetmə Portalı
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Security, Birthday, and Role Menu */}
          <div className="flex items-center gap-2">
            {/* Security Settings Button (Only for Teacher) */}
            {role === 'teacher' && (
              <button
                onClick={onOpenSecurityModal}
                title="Kibertəhlükəsizlik və Audit Ayarları"
                className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Təhlükəsizlik</span>
              </button>
            )}

            {/* Birthday Celebration Trigger */}
            <button
              onClick={() => {
                setShowBirthdayModal(true);
                triggerBirthdayConfetti();
              }}
              title="Emil müəllim üçün xüsusi təbrik!"
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all flex items-center gap-1.5 text-xs font-medium shadow-sm hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="hidden md:inline font-semibold">Təbrik 🎂</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  role === 'teacher'
                    ? 'bg-navy-50 text-navy-900 border-navy-200 hover:bg-navy-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {role === 'teacher' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-navy-700" />
                    <span className="font-semibold hidden sm:inline">Müəllim Paneli</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold truncate max-w-[110px]">
                      {currentStudent?.name || 'Tələbə Portalı'}
                    </span>
                  </>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cari Sessiya Məlumatı
                  </div>

                  {role === 'teacher' ? (
                    <>
                      <div className="px-3 py-2 bg-navy-50/70 border-y border-navy-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-navy-950">Emil Ağalarov (Admin)</div>
                          <div className="text-[10px] text-emerald-700 font-medium">Təhlükəsiz Sessiya Aktivdir</div>
                        </div>
                      </div>

                      <button
                        onClick={onOpenSecurityModal}
                        className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Şifrəni Dəyiş və Audit Jurnalı</span>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Şagird/Valideyn Kabinetinə Baxış:
                      </div>

                      <div className="max-h-40 overflow-y-auto">
                        {students.map(s => (
                          <button
                            key={s.id}
                            onClick={() => {
                              loginAsDemoStudent(s.id);
                              setCurrentTab('portal-overview');
                            }}
                            className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-slate-50 ${
                              currentStudent?.id === s.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                            }`}
                          >
                            <span className="truncate">{s.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {s.group}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 bg-emerald-50/70 border-y border-emerald-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                          {currentStudent?.name[0] || 'T'}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-navy-950">{currentStudent?.name}</div>
                          <div className="text-[10px] text-slate-500">{currentStudent?.group} Qrupu • Kod: {currentStudent?.accessCode}</div>
                        </div>
                      </div>

                      <div className="p-2">
                        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-snug">
                          <span className="font-bold block mb-0.5">🔒 Qorunan Panel:</span>
                          Müəllim panelinə giriş yalnız Emil Ağalarovun şifrəsi ilə mümkündür.
                        </div>
                      </div>

                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs text-navy-900 hover:bg-slate-50 font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5 text-navy-700" />
                        <span>Müəllim Girişi Səhifəsinə Keç</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Təhlükəsiz Çıxış Et</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400">
            {role === 'teacher' ? 'Müəllim Bölmələri' : 'Tələbə Portalı'}
          </div>
          {activeTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          {role === 'teacher' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSecurityModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Təhlükəsizlik və Audit Jurnalı</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
