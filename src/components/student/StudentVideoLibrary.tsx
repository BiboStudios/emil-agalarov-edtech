import React, { useState } from 'react';
import {
  Video,
  Play,
  Search,
  Filter,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { LessonVideo, LessonTopic, EnglishLevel } from '../../types';

interface StudentVideoLibraryProps {
  videos: LessonVideo[];
}

export const StudentVideoLibrary: React.FC<StudentVideoLibraryProps> = ({ videos }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeVideo, setActiveVideo] = useState<LessonVideo | null>(null);

  const filteredVideos = videos.filter(v => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || v.topic === selectedTopic;
    const matchesLevel = selectedLevel === 'All' || v.level === selectedLevel || v.level === 'All';
    return matchesSearch && matchesTopic && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-600" />
            <span>Emil Müəllimin Video Dərslər Kitabxanası</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Qrammatika, lüğət və dinləmə mövzuları üzrə izahlı video dərsləri istənilən vaxt təkrar izləyin
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Dərs mövzusu və ya açar söz axtarın..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">Bütün Mövzular</option>
              <option value="Tenses">Tenses (Zamanlar)</option>
              <option value="Modal Verbs">Modal Verbs</option>
              <option value="Vocabulary">Vocabulary (Lüğət)</option>
              <option value="Listening">Listening (Dinləmə)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">Bütün Səviyyələr</option>
              <option value="A1">A1 Səviyyəsi</option>
              <option value="A2">A2 Səviyyəsi</option>
              <option value="B1">B1 Səviyyəsi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div
            key={video.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
          >
            {/* Thumbnail */}
            <div
              onClick={() => setActiveVideo(video)}
              className="relative aspect-video bg-navy-950 cursor-pointer overflow-hidden"
            >
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-navy-950/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-0.5 fill-white" />
                </div>
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-mono">
                {video.duration}
              </div>
            </div>

            {/* Video Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-100 text-navy-800">
                    {video.level}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {video.topic}
                  </span>
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
                  onClick={() => setActiveVideo(video)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Dərsi İzlə</span>
                </button>
                <span className="text-[11px] text-slate-400">{video.uploadDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-navy-900 text-white">
              <h3 className="font-bold text-sm sm:text-base truncate max-w-xl">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-slate-50 text-xs text-slate-600 flex justify-between items-center">
              <span>Mövzu: <strong>{activeVideo.topic}</strong> • Səviyyə: <strong>{activeVideo.level}</strong></span>
              <a
                href={activeVideo.youtubeUrl}
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
    </div>
  );
};
