import React from 'react';
import { Heart, Sparkles, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { teacherName, setShowBirthdayModal, triggerBirthdayConfetti } = useAuth();

  return (
    <footer className="bg-navy-950 text-slate-300 mt-20 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold text-lg">{teacherName}</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              İngilis dili tədrisində müasir metodologiya, General English (A1-B2) və IELTS hazırlıq proqramları üzrə fərdi və qrup dərsləri.
            </p>
          </div>

          {/* Quick Contacts */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Əlaqə və Məlumat
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+994 50 000 00 00 (Dərs qeydiyyatı)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>emil.agalarov.english@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bakı şəhəri, Azərbaycan</span>
              </li>
            </ul>
          </div>

          {/* Educational Goals */}
          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Tədris Standartlarımız
            </h5>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Hər bir tələbənin zəif və güclü tərəflərini fərdi monitorinq edərək, sınaq imtahanları və interaktiv quizlərlə zəmanətli nəticə əldə edirik.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 border border-navy-700 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Yeni Qruplara Qeydiyyat Açıqdır
            </div>
          </div>
        </div>

        {/* Warm Birthday Tribute & Copyright */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {teacherName} • Bütün hüquqlar qorunur.
          </div>

          {/* Warm Birthday Tribute */}
          <div className="flex items-center gap-2 bg-navy-900/80 px-4 py-2 rounded-full border border-navy-700">
            <span className="text-amber-400 animate-pulse">🎉</span>
            <span className="text-slate-300 font-medium">
              Ad günün mübarək, <strong className="text-emerald-400">Emil</strong>! Gələcək müəllimlik fəaliyyətində bol-bol uğurlar!
            </span>
            <button
              onClick={() => {
                setShowBirthdayModal(true);
                triggerBirthdayConfetti();
              }}
              className="text-amber-300 hover:text-amber-200 ml-1 underline cursor-pointer"
            >
              🎂
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
