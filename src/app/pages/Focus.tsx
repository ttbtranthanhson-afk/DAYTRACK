import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, MoreHorizontal, Check } from 'lucide-react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const musicCategories = [
  {
    id: 'study',
    name: 'Học tập',
    color: 'from-blue-400 to-cyan-400',
    dotColor: 'bg-blue-400',
    tracks: [
      { id: 'study_1', title: 'Lofi Study Chill', artist: 'FASSounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'study_2', title: 'Deep Focus Ambient', artist: 'CalmSounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'study_3', title: 'Late Night Coding', artist: 'CodeBeats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ],
  },
  {
    id: 'work',
    name: 'Làm việc',
    color: 'from-purple-400 to-pink-400',
    dotColor: 'bg-purple-400',
    tracks: [
      { id: 'work_1', title: 'Productive Day', artist: 'AmbientGuy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 'work_2', title: 'Coffee Shop Vibes', artist: 'LofiCafe', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'work_3', title: 'Keyboard Click & Beats', artist: 'TechFocus', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    ],
  },
  {
    id: 'exercise',
    name: 'Tập luyện',
    color: 'from-orange-400 to-red-400',
    dotColor: 'bg-orange-400',
    tracks: [
      { id: 'exercise_1', title: 'Energy Booster', artist: 'WorkoutBeats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 'exercise_2', title: 'Cardio Rhythm', artist: 'RunMusic', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      { id: 'exercise_3', title: 'Power Session', artist: 'GymMotivation', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    ],
  },
  {
    id: 'relax',
    name: 'Thư giãn',
    color: 'from-green-400 to-emerald-400',
    dotColor: 'bg-green-400',
    tracks: [
      { id: 'relax_1', title: 'Soft Rain Ambience', artist: 'Rainmaker', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      { id: 'relax_2', title: 'Forest Meditation', artist: 'NatureSounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { id: 'relax_3', title: 'Zen Garden', artist: 'ZenMind', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
    ],
  },
  {
    id: 'focus',
    name: 'Tập trung sâu',
    color: 'from-indigo-400 to-purple-400',
    dotColor: 'bg-indigo-400',
    tracks: [
      { id: 'focus_1', title: 'Binaural Focus Wave', artist: 'BrainWave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
      { id: 'focus_2', title: 'Minimalist Soundscape', artist: 'MinimalStudy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
      { id: 'focus_3', title: 'Cosmic Drift', artist: 'SpaceEcho', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
    ],
  },
];

const presetTimes = [
  { label: '25 phút', seconds: 25 * 60 },
  { label: '45 phút', seconds: 45 * 60 },
  { label: '60 phút', seconds: 60 * 60 },
];

const formatTimeStr = (time: number) => {
  if (isNaN(time)) return '00:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function Focus() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<string | null>('focus');
  const [activeTab, setActiveTab] = useState<'timer' | 'music'>('timer');
  const [circleScale, setCircleScale] = useState(1);
  const [isShaking, setIsShaking] = useState(false);

  // Audio Player States
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    musicCategories.forEach(cat => {
      cat.tracks.forEach(track => ids.add(track.id));
    });
    return ids;
  });
  const [playingQueue, setPlayingQueue] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const location = useLocation();
  const timerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ y: number; type: 'hours' | 'minutes' | 'seconds' } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startNewCycle = (tracks: any[], lastTrackId?: string) => {
    let shuffled = [...tracks].sort(() => Math.random() - 0.5);
    if (tracks.length > 1 && lastTrackId && shuffled[0].id === lastTrackId) {
      const swapIdx = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
      const temp = shuffled[0];
      shuffled[0] = shuffled[swapIdx];
      shuffled[swapIdx] = temp;
    }
    return shuffled;
  };

  const startMusic = (categoryId: string | null) => {
    const targetId = categoryId ?? selectedMusic ?? 'focus';
    const category = musicCategories.find(c => c.id === targetId) ?? musicCategories[0];
    let selectedTracks = category.tracks.filter(t => selectedTrackIds.has(t.id));
    
    if (selectedTracks.length === 0) {
      selectedTracks = category.tracks;
      setSelectedTrackIds(prev => {
        const newSet = new Set(prev);
        category.tracks.forEach(t => newSet.add(t.id));
        return newSet;
      });
    }

    const shuffled = startNewCycle(selectedTracks);
    setPlayingQueue(shuffled);
    setCurrentTrackIndex(0);
    setMusicPlaying(true);
  };

  const playNextTrack = () => {
    if (playingQueue.length === 0) return;
    
    if (currentTrackIndex < playingQueue.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      const lastTrackId = playingQueue[currentTrackIndex]?.id;
      const category = musicCategories.find(c => c.id === selectedMusic) ?? musicCategories[0];
      let selectedTracks = category.tracks.filter(t => selectedTrackIds.has(t.id));
      if (selectedTracks.length === 0) selectedTracks = category.tracks;
      
      const shuffled = startNewCycle(selectedTracks, lastTrackId);
      setPlayingQueue(shuffled);
      setCurrentTrackIndex(0);
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTrackIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying && isRunning && playingQueue[currentTrackIndex]?.url) {
      audio.play().catch(err => console.log("Audio play error:", err));
    } else {
      audio.pause();
    }
  }, [musicPlaying, isRunning, currentTrackIndex, playingQueue]);

  useEffect(() => {
    if (currentTime === 0 && totalTime > 0) {
      setMusicPlaying(false);
      setPlayingQueue([]);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTime, totalTime]);

  useEffect(() => {
    if (!location.state) return;
    const { initialSeconds, initialMusicCategory } = location.state;
    const category = initialMusicCategory ?? selectedMusic;
    setSelectedMusic(category);

    if (initialSeconds) {
      const h = Math.floor(initialSeconds / 3600);
      const m = Math.floor((initialSeconds % 3600) / 60);
      const s = initialSeconds % 60;
      setHours(h);
      setMinutes(m);
      setSeconds(s);
      setTotalTime(initialSeconds);
      setCurrentTime(initialSeconds);
      setIsRunning(true);
      startMusic(category);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  useEffect(() => {
    if (isRunning && currentTime > 0) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentTime]);

  const updateTime = (type: 'hours' | 'minutes' | 'seconds', increment: number) => {
    if (type === 'hours') setHours(Math.max(0, Math.min(23, hours + increment)));
    else if (type === 'minutes') setMinutes(Math.max(0, Math.min(59, minutes + increment)));
    else setSeconds(Math.max(0, Math.min(59, seconds + increment)));

    setCircleScale(increment > 0 ? 1.05 : 0.95);
    setTimeout(() => setCircleScale(1), 150);
  };

  const handleWheel = (type: 'hours' | 'minutes' | 'seconds', delta: number) => {
    updateTime(type, delta > 0 ? -1 : 1);
  };

  const handleTouchStart = (e: React.TouchEvent, type: 'hours' | 'minutes' | 'seconds') => {
    e.preventDefault();
    touchStartRef.current = { y: e.touches[0].clientY, type };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchStartRef.current) return;
    const deltaY = touchStartRef.current.y - e.touches[0].clientY;
    if (Math.abs(deltaY) > 20) {
      updateTime(touchStartRef.current.type, deltaY > 0 ? 1 : -1);
      touchStartRef.current.y = e.touches[0].clientY;
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      if (currentTime > 0) {
        setIsRunning(true);
        setMusicPlaying(true);
        const currentTrack = playingQueue[currentTrackIndex];
        const category = musicCategories.find(c => c.id === selectedMusic) ?? musicCategories[0];
        const isSameCategory = currentTrack ? category.tracks.some(t => t.id === currentTrack.id) : false;
        if (!isSameCategory) startMusic(selectedMusic);
      } else {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total === 0) return;
        setTotalTime(total);
        setCurrentTime(total);
        setIsRunning(true);
        startMusic(selectedMusic);
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      setIsRunning(false);
      setMusicPlaying(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setTotalTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setMusicPlaying(false);
    setPlayingQueue([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setPresetTime = (presetSeconds: number) => {
    setHours(Math.floor(presetSeconds / 3600));
    setMinutes(Math.floor((presetSeconds % 3600) / 60));
    setSeconds(presetSeconds % 60);
  };

  const displayHours = (isRunning || currentTime > 0) ? Math.floor(currentTime / 3600) : hours;
  const displayMinutes = (isRunning || currentTime > 0) ? Math.floor((currentTime % 3600) / 60) : minutes;
  const displaySeconds = (isRunning || currentTime > 0) ? currentTime % 60 : seconds;
  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  
  const circleSize = 208; // 52 * 4 (w-52 = 13rem = 208px)
  const radius = (circleSize / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const todayStr = new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date());

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-400 to-green-500 px-6 pt-12 pb-8 relative overflow-hidden flex flex-col items-center">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        {/* Top bar */}
        <div className="w-full flex justify-between items-center relative z-10 mb-6">
          <span className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full">DayTrack</span>
          <span className="text-sm font-semibold text-white/90 capitalize">{todayStr.replace(',', '')}</span>
          <button className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Circle */}
        <div className="relative mb-6 z-10 flex flex-col items-center">
          <div className="relative w-52 h-52">
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
              <circle
                cx="104"
                cy="104"
                r={radius}
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
              />
              {(isRunning || currentTime > 0) && (
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              )}
            </svg>

            <motion.div
              animate={{ scale: circleScale, rotate: isShaking ? [0, -2, 2, -2, 2, 0] : 0 }}
              transition={{ scale: { duration: 0.15 }, rotate: { duration: 0.5 } }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {!isRunning && currentTime === 0 ? (
                <div className="flex gap-1 justify-center items-center">
                  {(['hours', 'minutes', 'seconds'] as const).map((type, index) => {
                    const value = type === 'hours' ? hours : type === 'minutes' ? minutes : seconds;
                    if (type === 'hours' && value === 0) return null; // hide hours if 0 to save space if wanted, but keep for now
                    return (
                      <div key={type} className="flex items-center gap-0.5">
                        {index > 0 && (type === 'seconds' || hours > 0) && <span className="text-4xl font-bold text-white">:</span>}
                        <div
                          onWheel={(e) => { e.preventDefault(); handleWheel(type, e.deltaY); }}
                          onTouchStart={(e) => handleTouchStart(e, type)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={() => { touchStartRef.current = null; }}
                          className="cursor-ns-resize select-none touch-none active:scale-95 transition-transform"
                        >
                          <span className="text-4xl font-bold text-white">
                            {String(value).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-4xl font-bold text-white">
                  {displayHours > 0 && `${displayHours}:`}
                  {String(displayMinutes).padStart(displayHours > 0 ? 2 : 1, '0')}:
                  {String(displaySeconds).padStart(2, '0')}
                </div>
              )}
              <p className="text-xs text-white/70 font-medium mt-1">
                {!isRunning && currentTime === 0 ? 'Vuốt chỉnh giờ' : isRunning ? 'Đang tập trung' : 'Đã tạm dừng'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Presets */}
        {!isRunning && currentTime === 0 && (
          <div className="flex gap-2 mb-6 z-10 relative">
            {presetTimes.map(preset => (
              <button
                key={preset.label}
                onClick={() => setPresetTime(preset.seconds)}
                className="text-xs font-semibold bg-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4 z-10 relative mt-2">
          <button
            onClick={toggleTimer}
            className="w-14 h-14 bg-white text-green-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          {(isRunning || currentTime > 0) && (
            <button
              onClick={resetTimer}
              className="w-11 h-11 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10 px-6">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-4 text-sm font-semibold relative ${activeTab === 'timer' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          Bộ đếm
          {activeTab === 'timer' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-500 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('music')}
          className={`flex-1 py-4 text-sm font-semibold relative ${activeTab === 'music' ? 'text-gray-900' : 'text-gray-400'}`}
        >
          Nhạc nền
          {activeTab === 'music' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-500 rounded-full" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'timer' ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-100">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Lofi & Chill ☕</h3>
              <iframe 
                width="100%" 
                height="180" 
                src="https://www.youtube.com/embed/jfKfPfyJRdk" 
                title="Lofi Hip Hop" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-xl bg-gray-100"
              />
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-green-800 mb-1">Tips tập trung</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                Thử áp dụng kỹ thuật Pomodoro: Tập trung 25 phút, nghỉ 5 phút. Sau 4 chu kỳ thì nghỉ dài 15-30 phút.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {musicCategories.map(category => {
              const isActive = selectedMusic === category.id;
              return (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => setSelectedMusic(category.id)}
                    className={`w-full rounded-2xl p-4 border transition-all flex justify-between items-center ${
                      isActive
                        ? 'border-green-200 bg-green-50'
                        : 'border-transparent bg-gray-50 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.dotColor}`} />
                      <span className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                    </div>
                    {isActive && musicPlaying && (
                      <div className="flex items-end gap-0.5 h-4">
                        <div className="w-0.5 h-3 bg-green-500 rounded-full animate-[pulse_1s_infinite_100ms]" />
                        <div className="w-0.5 h-4 bg-green-500 rounded-full animate-[pulse_1s_infinite_300ms]" />
                        <div className="w-0.5 h-2 bg-green-500 rounded-full animate-[pulse_1s_infinite_500ms]" />
                      </div>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 pl-6"
                      >
                        {category.tracks.map(track => {
                          const isSelected = selectedTrackIds.has(track.id);
                          return (
                            <button
                              key={track.id}
                              onClick={() => toggleTrackSelection(track.id)}
                              className={`w-full text-left rounded-xl px-4 py-2 flex items-center justify-between ${
                                isSelected ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs font-medium truncate">{track.title}</p>
                              </div>
                              <div className={`w-4 h-4 flex items-center justify-center rounded border ${
                                isSelected ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={playingQueue[currentTrackIndex]?.url}
        onEnded={playNextTrack}
      />
    </div>
  );
}
