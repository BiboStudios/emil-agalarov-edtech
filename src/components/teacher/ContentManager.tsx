import React, { useState } from 'react';
import {
  Video,
  FileQuestion,
  Plus,
  Play,
  Trash2,
  X,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { LessonVideo, Quiz, LessonTopic, EnglishLevel, QuizQuestion } from '../../types';

interface ContentManagerProps {
  videos: LessonVideo[];
  quizzes: Quiz[];
  onAddVideo: (video: Omit<LessonVideo, 'id'>) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
  onAddQuiz: (quiz: Omit<Quiz, 'id'>) => Promise<void>;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  videos,
  quizzes,
  onAddVideo,
  onDeleteVideo,
  onAddQuiz
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'quizzes'>('videos');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<LessonVideo | null>(null);

  // Video Form
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTopic, setVideoTopic] = useState<LessonTopic>('Tenses');
  const [videoLevel, setVideoLevel] = useState<EnglishLevel>('B1');
  const [videoDuration, setVideoDuration] = useState('15:00');

  // Quiz Form
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTopic, setQuizTopic] = useState<LessonTopic>('Grammar');
  const [quizLevel, setQuizLevel] = useState<EnglishLevel>('B1');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizDuration, setQuizDuration] = useState(10);
  const [questions, setQuestions] = useState<Omit<QuizQuestion, 'id'>[]>([
    {
      question: 'Which sentence is grammatically correct?',
      options: [
        'She has went to school yesterday.',
        'She went to school yesterday.',
        'She had go to school yesterday.',
        'She is go to school yesterday.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Dəqiq keçmiş zaman zərfi ("yesterday") olduqda Past Simple ("went") istifadə olunur.'
    }
  ]);

  // Helper to extract YouTube video ID from URL
  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'kYJzZq1u65Y';
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    const videoId = extractYoutubeId(videoUrl);
    await onAddVideo({
      title: videoTitle.trim(),
      description: videoDesc.trim(),
      youtubeUrl: videoUrl.trim(),
      videoId,
      level: videoLevel,
      topic: videoTopic,
      duration: videoDuration.trim() || '12:00',
      uploadDate: new Date().toISOString().split('T')[0]
    });

    setIsVideoModalOpen(false);
    setVideoTitle('');
    setVideoDesc('');
    setVideoUrl('');
  };

  const handleAddQuestionToQuiz = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleUpdateQuestion = (idx: number, field: string, value: any) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options];
      opts[optIdx] = val;
      copy[qIdx].options = opts;
      return copy;
    });
  };

  const handleAddQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || questions.length === 0) return;

    const preparedQuestions: QuizQuestion[] = questions.map((q, idx) => ({
      ...q,
      id: `q-${Date.now()}-${idx}`
    }));

    await onAddQuiz({
      title: quizTitle.trim(),
      topic: quizTopic,
      level: quizLevel,
      description: quizDesc.trim() || `${quizTopic} mövzusu üzrə biliklərin yoxlanılması`,
      durationMinutes: Number(quizDuration),
      questions: preparedQuestions
    });

    setIsQuizModalOpen(false);
    setQuizTitle('');
    setQuizDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Tab Selection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Dərs Vəsaitləri və Quiz İdarəetməsi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            YouTube video dərsləri, mövzu kateqoriyaları və interaktiv testlərin hazırlanması
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'videos' ? (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Video Dərs Əlavə Et</span>
            </button>
          ) : (
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Quiz Testi Yarat</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('videos')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'videos'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>YouTube Video Dərsləri ({videos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'quizzes'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Onlayn Quiz Testləri ({quizzes.length})</span>
        </button>
      </div>

      {/* Tab 1: Video Lessons List */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map(video => (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Video Thumbnail Preview */}
              <div
                onClick={() => setPlayingVideo(video)}
                className="relative aspect-video bg-navy-950 cursor-pointer overflow-hidden group"
              >
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-navy-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-mono">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800">
                      {video.level}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {video.topic}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto">{video.uploadDate}</span>
                  </div>

                  <h3 className="font-bold text-navy-900 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPlayingVideo(video)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Videonu İzlə</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bu videonu silmək istədiyinizə əminsiniz?')) {
                        onDeleteVideo(video.id);
                      }
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Quizzes List */}
      {activeTab === 'quizzes' && (
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
                  <span className="text-xs text-slate-500 font-medium">
                    {quiz.durationMinutes} dəqiqə
                  </span>
                </div>

                <h3 className="font-bold text-navy-900 text-base mb-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {quiz.description}
                </p>

                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                  <div className="flex justify-between">
                    <span>Mövzu:</span>
                    <span className="font-semibold text-slate-800">{quiz.topic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sualların Sayı:</span>
                    <span className="font-semibold text-slate-800">{quiz.questions.length} sual</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">Tələbələr üçün aktivdir</span>
                <span className="text-slate-400">ID: {quiz.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-navy-900 text-white">
              <h3 className="font-bold text-sm sm:text-base truncate max-w-xl">
                {playingVideo.title}
              </h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1`}
                title={playingVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-slate-50 text-xs text-slate-600 flex justify-between items-center">
              <span>Mövzu: <strong>{playingVideo.topic}</strong> • Səviyyə: <strong>{playingVideo.level}</strong></span>
              <a
                href={playingVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>YouTube-da Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-navy-900 text-white">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                <span>Yeni YouTube Video Dərs Əlavə Et</span>
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dərsin Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Conditionals Type 1 & 2 İzahı"
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube Video Linki (URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mövzu Kateqoriyası
                  </label>
                  <select
                    value={videoTopic}
                    onChange={e => setVideoTopic(e.target.value as LessonTopic)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Tenses">Tenses (Zamanlar)</option>
                    <option value="Modal Verbs">Modal Verbs</option>
                    <option value="Vocabulary">Vocabulary (Lüğət)</option>
                    <option value="Listening">Listening (Dinləmə)</option>
                    <option value="Speaking">Speaking (Danışıq)</option>
                    <option value="Grammar">Grammar (Qrammatika)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    İngilis Dili Səviyyəsi
                  </label>
                  <select
                    value={videoLevel}
                    onChange={e => setVideoLevel(e.target.value as EnglishLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="All">Bütün Səviyyələr</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="IELTS">IELTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qısa İzah və Təsvir
                </label>
                <textarea
                  rows={2}
                  placeholder="Videoda nələrdən bəhs edilir..."
                  value={videoDesc}
                  onChange={e => setVideoDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                >
                  Videonu Əlavə Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 bg-navy-900 text-white sticky top-0 z-10">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-emerald-400" />
                <span>Yeni İngilis Dili Quiz Testi Yarat</span>
              </h3>
              <button
                onClick={() => setIsQuizModalOpen(false)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuizSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quiz Başlığı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Relative Clauses Mastery Test"
                  value={quizTitle}
                  onChange={e => setQuizTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mövzu
                  </label>
                  <select
                    value={quizTopic}
                    onChange={e => setQuizTopic(e.target.value as LessonTopic)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="Grammar">Grammar</option>
                    <option value="Tenses">Tenses</option>
                    <option value="Modal Verbs">Modal Verbs</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Listening">Listening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Səviyyə
                  </label>
                  <select
                    value={quizLevel}
                    onChange={e => setQuizLevel(e.target.value as EnglishLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Müddət (dəqiqə)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={quizDuration}
                    onChange={e => setQuizDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                    Suallar ({questions.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQuestionToQuiz}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sual Əlavə Et</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Sual {qIdx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                            className="text-rose-500 hover:text-rose-700 text-xs"
                          >
                            Sil
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Sual mətni..."
                        value={q.question}
                        onChange={e => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                      />

                      {/* 4 Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctAnswerIndex === optIdx}
                              onChange={() => handleUpdateQuestion(qIdx, 'correctAnswerIndex', optIdx)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              required
                              placeholder={`Variant ${String.fromCharCode(65 + optIdx)}`}
                              value={opt}
                              onChange={e => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <input
                          type="text"
                          placeholder="Düzgün cavabın qrammatik izahı (Azərbaycan dilində)..."
                          value={q.explanation}
                          onChange={e => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md"
                >
                  Quiz Testini Yarat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
