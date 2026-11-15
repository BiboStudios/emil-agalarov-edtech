import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
  Clock,
  BookOpen
} from 'lucide-react';
import { Quiz, Student, QuizAttempt } from '../../types';

interface StudentInteractiveQuizzesProps {
  student: Student;
  quizzes: Quiz[];
  onSaveAttempt: (attempt: Omit<QuizAttempt, 'id'>) => Promise<void>;
}

export const StudentInteractiveQuizzes: React.FC<StudentInteractiveQuizzesProps> = ({
  student,
  quizzes,
  onSaveAttempt
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Start taking a quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    let correctCount = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);

    // Confetti if score >= 70%
    if (correctCount / activeQuiz.questions.length >= 0.7) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent
      }
    }

    // Save attempt to database
    await onSaveAttempt({
      quizId: activeQuiz.id,
      studentId: student.id,
      studentName: student.name,
      score: correctCount,
      totalQuestions: activeQuiz.questions.length,
      timestamp: new Date().toISOString(),
      answers: selectedAnswers
    });
  };

  // If no quiz is selected, show list of quizzes
  if (!activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-emerald-600" />
            <span>İnteraktiv Onlayn Quizlər</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            İmtahan öncəsi qrammatika və lüğət biliklərinizi yoxlayın, dərhal düzgün cavabların izahını əldə edin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                    {quiz.level} Səviyyəsi
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {quiz.durationMinutes} dəqiqə
                  </span>
                </div>

                <h3 className="font-bold text-navy-900 text-base mb-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {quiz.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 mb-4 text-slate-600">
                  <div className="flex justify-between">
                    <span>Mövzu:</span>
                    <strong className="text-navy-900">{quiz.topic}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sualların sayı:</span>
                    <strong className="text-navy-900">{quiz.questions.length} sual</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartQuiz(quiz)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Quizə Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Quiz View (Taking test or reviewing answers)
  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const totalQuestions = activeQuiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveQuiz(null)}
            className="text-xs font-semibold text-slate-500 hover:text-navy-900 flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quizlər Siyahısına Qayıt</span>
          </button>
          <h2 className="text-base sm:text-lg font-bold text-navy-900">
            {activeQuiz.title}
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Səviyyə</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            {activeQuiz.level} • {activeQuiz.topic}
          </span>
        </div>
      </div>

      {/* Progress Bar (During taking) */}
      {!isSubmitted && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
            <span>Sual {currentQuestionIndex + 1} / {totalQuestions}</span>
            <span>Cavablandırıldı: {answeredCount} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Submission Result Screen */}
      {isSubmitted ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Result Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-navy-900">
              Quiz Tamamlandı!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Topladığınız Nəticə:
            </p>

            <div className="my-4 inline-flex items-baseline gap-1.5 px-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-4xl font-extrabold text-emerald-600">{score}</span>
              <span className="text-lg font-bold text-slate-400">/ {totalQuestions} Düzgün Cavab</span>
              <span className="text-sm font-semibold text-slate-500 ml-2">
                ({Math.round((score / totalQuestions) * 100)}%)
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setIsSubmitted(false);
                  setCurrentQuestionIndex(0);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yenidən Cəhd Et</span>
              </button>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
              >
                Digər Quizlərə Keç
              </button>
            </div>
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="space-y-4">
            <h4 className="font-bold text-navy-900 text-base">
              Sualların İzahı və Düzgün Cavablar:
            </h4>

            {activeQuiz.questions.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-500">
                      Sual {idx + 1}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Düzgün' : 'Səhv'}</span>
                    </span>
                  </div>

                  <h5 className="font-bold text-navy-900 text-sm sm:text-base mb-3">
                    {q.question}
                  </h5>

                  {/* Options */}
                  <div className="space-y-1.5 mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isActualCorrect = q.correctAnswerIndex === optIdx;

                      let optClasses = 'border-slate-200 bg-white text-slate-700';
                      if (isActualCorrect) {
                        optClasses = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-bold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        optClasses = 'border-rose-400 bg-rose-100 text-rose-950 font-semibold line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between ${optClasses}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px]">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isActualCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700">Düzgün cavab</span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-[11px] font-bold text-rose-600">Sizin seçiminiz</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grammar Explanation */}
                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-white/80 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Qrammatik İzah: </span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Question Taking Active Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Sual {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-navy-900 mt-2 leading-relaxed">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-navy-950 font-bold shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Əvvəlki Sual</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Növbəti Sual</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Quiz Nəticəsini Yoxla</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
