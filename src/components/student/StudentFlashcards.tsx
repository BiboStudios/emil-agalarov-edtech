import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Check,
  Volume2,
  Sparkles,
  Shuffle,
  ThumbsUp,
  Bookmark
} from 'lucide-react';
import { FlashcardDeck, Flashcard } from '../../types';

interface StudentFlashcardsProps {
  decks: FlashcardDeck[];
}

export const StudentFlashcards: React.FC<StudentFlashcardsProps> = ({ decks }) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  const currentDeck = decks.find(d => d.id === selectedDeckId) || decks[0];
  const currentCard: Flashcard | undefined = currentDeck?.cards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < (currentDeck?.cards.length || 1) - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    } else {
      setCurrentCardIndex((currentDeck?.cards.length || 1) - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * (currentDeck?.cards.length || 1));
    setCurrentCardIndex(randomIndex);
  };

  const handleMarkKnown = (id: string) => {
    setKnownCards(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  if (!currentDeck || !currentCard) {
    return (
      <div className="bg-white p-8 rounded-2xl border text-center text-slate-500">
        Lüğət kartı tapılmadı.
      </div>
    );
  }

  const isKnown = knownCards.has(currentCard.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header and Deck Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>İnteraktiv Lüğət Kartları (Flashcards)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Söz ehtiyatını gücləndirmək üçün 3D çevrilən kartlar və nümunə cümlələr
          </p>
        </div>

        {/* Deck Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {decks.map(deck => (
            <button
              key={deck.id}
              onClick={() => {
                setSelectedDeckId(deck.id);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDeckId === deck.id
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {deck.title} ({deck.cards.length} söz)
            </button>
          ))}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="relative">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-8 cursor-pointer select-none transition-all duration-500 transform shadow-xl flex flex-col justify-between border ${
            isFlipped
              ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-navy-950 text-white border-emerald-700'
              : 'bg-white text-navy-900 border-slate-200/80 hover:shadow-2xl'
          }`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isFlipped ? 'bg-white/20 text-emerald-300' : 'bg-navy-100 text-navy-800'
            }`}>
              {currentCard.level} Səviyyəsi
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">
                Kart {currentCardIndex + 1} / {currentDeck.cards.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkKnown(currentCard.id);
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  isKnown
                    ? 'bg-emerald-500 text-white'
                    : isFlipped
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isKnown ? 'Öyrəndim' : 'Öyrənilir'}</span>
              </button>
            </div>
          </div>

          {/* Card Center Content */}
          <div className="my-auto text-center py-6">
            {!isFlipped ? (
              // FRONT: English Word & Pronunciation
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900">
                  {currentCard.front}
                </h3>
                {currentCard.phonetic && (
                  <p className="text-sm font-mono text-emerald-600 font-medium">
                    {currentCard.phonetic}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  (Tərcümə və nümunə cümlə üçün kartın üzərinə vurun 🔄)
                </p>
              </div>
            ) : (
              // BACK: Azerbaijani Translation & Example Sentence
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block mb-1">
                    Azərbaycanca Mənası
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white">
                    {currentCard.back}
                  </h4>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-left max-w-md mx-auto">
                  <span className="text-[11px] text-emerald-300 font-bold block mb-1">
                    Nümunə Cümlə (Example):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 italic">
                    "{currentCard.exampleSentence}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card Bottom Hint */}
          <div className="text-center text-[11px] opacity-70 flex items-center justify-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Çevirmək üçün klikləyin</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Əvvəlki</span>
        </button>

        <button
          onClick={handleShuffle}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Təsadüfi seç"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-md"
        >
          <span>Növbəti Söz</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
