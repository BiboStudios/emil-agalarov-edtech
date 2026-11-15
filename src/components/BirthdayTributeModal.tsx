import React from 'react';
import { Sparkles, Heart, Gift, X, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BirthdayTributeModal: React.FC = () => {
  const {
    showBirthdayModal,
    setShowBirthdayModal,
    triggerBirthdayConfetti,
    hasShownBirthdayWelcome,
    dismissBirthdayWelcome,
    role
  } = useAuth();

  return (
    <>
      {/* Dismissible Top Toast Banner on First Teacher Login */}
      {role === 'teacher' && !hasShownBirthdayWelcome && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-navy-800 text-white shadow-md relative overflow-hidden transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-yellow-300 shrink-0 animate-bounce">
                🎉
              </span>
              <p className="font-medium truncate">
                <span className="font-bold text-yellow-300">Xüsusi Təbrik:</span> Ad günün mübarək, Emil! 11-ci sinif buraxılış imtahanına hazırlıqda və müəllimlik fəaliyyətində bol uğurlar! — <span className="text-yellow-200 font-semibold">Hörmətlə, Həbib Ağalarzadə</span>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowBirthdayModal(true);
                  triggerBirthdayConfetti();
                }}
                className="px-2.5 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Təbriki Gör</span>
              </button>
              <button
                onClick={dismissBirthdayWelcome}
                className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Bağla"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Celebration Modal */}
      {showBirthdayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden transform transition-all">
            {/* Header Gradient */}
            <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-700 p-6 text-white text-center relative">
              <button
                onClick={() => setShowBirthdayModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-400 to-yellow-300 flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/20">
                🎂
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-yellow-300 text-xs font-semibold tracking-wider uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Xüsusi Hədiyyə və Təbrik
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Ad günün mübarək, Emil!
              </h3>
              <p className="text-emerald-100 text-sm mt-1">
                Gələcək müəllimlik fəaliyyətində bol-bol uğurlar və nailiyyətlər!
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-sm leading-relaxed">
                <p className="mb-2.5">
                  Hörmətli və sevimli <strong>Emil Ağalarov</strong>, bu portal sənin 11-ci sinif şagirdlərinə buraxılış imtahanlarına ən müasir, rahat və zövqlü şəkildə hazırlaşmağın, onların inkişafına daim bələdçilik etməyin üçün xüsusi olaraq hazırlandı.
                </p>
                <p className="text-slate-600">
                  Arzu edirik ki, yetirdiyin hər bir şagird 11-ci sinif buraxılış imtahanında ən yüksək nəticələri göstərsin, 100/100 bal toplasın və sənin adını daim qürurla çəksin! 🌟
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/80 text-right">
                  <span className="text-xs text-slate-500 block">Dərin hörmət və ən xoş arzularla,</span>
                  <span className="text-sm font-bold text-navy-950">Həbib Ağalarzadə</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Peşəkar Tədris Paneli</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-100 font-medium">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Avtomatlaşdırılmış Nəticələr</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => triggerBirthdayConfetti()}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Konfeti Uçurt! 🎊</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissBirthdayWelcome();
                    setShowBirthdayModal(false);
                  }}
                  className="py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-xl transition-colors"
                >
                  Təşəkkürlər!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
