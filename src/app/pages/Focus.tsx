import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Music, Volume2, VolumeX, SkipForward, Check } from 'lucide-react';
import { useLocation } from 'react-router';
import { PageContainer } from '../components/PageContainer';
import { motion, AnimatePresence } from 'motion/react';

const musicCategories = [
  {
    id: 'study',
    name: 'Học tập',
    color: 'from-blue-400 to-cyan-400',
    themeColor: '#60a5fa',
    themeLightColor: 'bg-blue-50/70 border-blue-200 text-blue-700 hover:bg-blue-100/50',
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
    themeColor: '#c084fc',
    themeLightColor: 'bg-purple-50/70 border-purple-200 text-purple-700 hover:bg-purple-100/50',
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
    themeColor: '#fb923c',
    themeLightColor: 'bg-orange-50/70 border-orange-200 text-orange-700 hover:bg-orange-100/50',
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
    themeColor: '#4ade80',
    themeLightColor: 'bg-green-50/70 border-green-200 text-green-700 hover:bg-green-100/50',
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
    themeColor: '#818cf8',
    themeLightColor: 'bg-indigo-50/70 border-indigo-200 text-indigo-700 hover:bg-indigo-100/50',
    tracks: [
      { id: 'focus_1', title: 'Binaural Focus Wave', artist: 'BrainWave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
      { id: 'focus_2', title: 'Minimalist Soundscape', artist: 'MinimalStudy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
      { id: 'focus_3', title: 'Cosmic Drift', artist: 'SpaceEcho', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
    ],
  },
];

const presetTimes = [
  { label: '25:00', seconds: 25 * 60 },
  { label: '45:00', seconds: 45 * 60 },
  { label: '1:00:00', seconds: 60 * 60 },
];

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const getMusicCategory = (id: string | null) =>
  musicCategories.find(category => category.id === id) ?? musicCategories[musicCategories.length - 1];

export function Focus() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<string | null>('focus');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
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
  const [isMuted, setIsMuted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const location = useLocation();
  const timerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ y: number; type: 'hours' | 'minutes' | 'seconds' } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Shuffling cycle helper
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
    const category = getMusicCategory(targetId);
    let selectedTracks = category.tracks.filter(t => selectedTrackIds.has(t.id));
    
    if (selectedTracks.length === 0) {
      selectedTracks = category.tracks;
      // Auto-select all tracks of this category in state
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
    setShowMusicPlayer(true);
  };

  const playNextTrack = () => {
    if (playingQueue.length === 0) return;
    
    if (currentTrackIndex < playingQueue.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    } else {
      const lastTrackId = playingQueue[currentTrackIndex]?.id;
      const category = getMusicCategory(selectedMusic);
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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setAudioCurrentTime(current);
      setAudioProgress(duration > 0 ? (current / duration) * 100 : 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current && audioDuration > 0) {
      const newTime = (value / 100) * audioDuration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
      setAudioProgress(value);
    }
  };

  // Synchronize audio playing state with React states
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying && isRunning && playingQueue[currentTrackIndex]?.url) {
      audio.play().catch(err => {
        console.log("Audio play error:", err);
      });
    } else {
      audio.pause();
    }
  }, [musicPlaying, isRunning, currentTrackIndex, playingQueue]);

  // Synchronize muted state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Turn off music completely when timer finishes
  useEffect(() => {
    if (currentTime === 0 && totalTime > 0) {
      setMusicPlaying(false);
      setShowMusicPlayer(false);
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, currentTime]);

  const updateTime = (type: 'hours' | 'minutes' | 'seconds', increment: number) => {
    if (type === 'hours') {
      setHours(Math.max(0, Math.min(23, hours + increment)));
    } else if (type === 'minutes') {
      setMinutes(Math.max(0, Math.min(59, minutes + increment)));
    } else {
      setSeconds(Math.max(0, Math.min(59, seconds + increment)));
    }

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

        // Check if the user changed the music category while paused
        const currentTrack = playingQueue[currentTrackIndex];
        const category = getMusicCategory(selectedMusic);
        const isSameCategory = currentTrack ? category.tracks.some(t => t.id === currentTrack.id) : false;

        if (!isSameCategory) {
          startMusic(selectedMusic);
        }
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
    setShowMusicPlayer(false);
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
  const circumference = 2 * Math.PI * 115;
  const strokeDashoffset = circumference - (progress / 100) * circumference;


  return (
    <PageContainer className="bg-gradient-to-b from-green-50/30 to-white dark:from-green-950/20 dark:to-[#1A1B1E]">
      <div className="sticky top-0 z-[100] bg-white dark:bg-[#1A1B1E] px-6 py-6 border-b border-gray-100 dark:border-[#373A40] shadow-sm transition-colors">
        <h1 className="text-2xl text-green-600 dark:text-green-400 mb-1">Tập trung</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tập trung và năng suất</p>
      </div>

      <audio
        ref={audioRef}
        src={playingQueue[currentTrackIndex]?.url}
        onEnded={playNextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="px-6 py-8 flex flex-col items-center">
        {showMusicPlayer && playingQueue[currentTrackIndex] && (
          <div className="w-full mb-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 rounded-2xl p-5 border border-pink-100 dark:border-pink-800/30 shadow-sm relative overflow-hidden transition-colors">
            {/* Background elements */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-200/20 rounded-full blur-xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl" />

            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-md shadow-pink-200/40 relative group`}>
                <Volume2 className="w-6 h-6 text-white" />
                {musicPlaying && isRunning && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-0.5">
                  Đang phát • {getMusicCategory(selectedMusic).name}
                </p>
                <h4 className="text-base font-semibold text-gray-800 dark:text-[#E9ECEF] truncate">
                  {playingQueue[currentTrackIndex]?.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {playingQueue[currentTrackIndex]?.artist}
                </p>
              </div>

              {/* Animated Equalizer */}
              <div className="flex items-end gap-1 h-6">
                <div className={`w-1 bg-pink-400 rounded-full transition-all duration-300 ${musicPlaying && isRunning ? 'h-5 animate-[pulse_1s_infinite_100ms]' : 'h-1.5'}`} />
                <div className={`w-1 bg-purple-400 rounded-full transition-all duration-300 ${musicPlaying && isRunning ? 'h-6 animate-[pulse_1s_infinite_300ms]' : 'h-1.5'}`} />
                <div className={`w-1 bg-pink-400 rounded-full transition-all duration-300 ${musicPlaying && isRunning ? 'h-4 animate-[pulse_1s_infinite_500ms]' : 'h-1.5'}`} />
              </div>
            </div>

            {/* Time progress bar */}
            <div className="mt-4 relative z-10">
              <input
                type="range"
                min="0"
                max="100"
                value={audioProgress}
                onChange={handleAudioScrub}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none"
              />
              <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                <span>{formatTime(audioCurrentTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100/50 relative z-10">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-xl transition-all"
                title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2E33] text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-[#373A40] hover:bg-gray-50 dark:hover:bg-[#373A40] flex items-center justify-center transition-all"
                  title={musicPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
                >
                  {musicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={playNextTrack}
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#2C2E33] text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-[#373A40] hover:bg-gray-50 dark:hover:bg-[#373A40] flex items-center justify-center transition-all"
                  title="Chuyển bài"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="w-9" /> {/* Spacer to balance Mute button */}
            </div>
          </div>
        )}

        <div className="relative mb-8">
          {(isRunning || currentTime > 0) && (
            <svg className="absolute top-0 left-0 w-64 h-64 -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="115"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
          )}

          <motion.div
            animate={{ scale: circleScale, rotate: isShaking ? [0, -2, 2, -2, 2, 0] : 0 }}
            transition={{ scale: { duration: 0.15 }, rotate: { duration: 0.5 } }}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 dark:border dark:border-green-800/30 flex items-center justify-center shadow-xl shadow-green-200/50 transition-colors"
          >
            <div className="text-center">
              {!isRunning && currentTime === 0 ? (
                <div className="flex gap-1 justify-center items-center mb-2">
                  {(['hours', 'minutes', 'seconds'] as const).map((type, index) => {
                    const value = type === 'hours' ? hours : type === 'minutes' ? minutes : seconds;
                    return (
                      <div key={type} className="flex items-center gap-1">
                        {index > 0 && <span className="text-6xl font-light text-gray-800 dark:text-gray-200">:</span>}
                        <div
                          onWheel={(e) => {
                            e.preventDefault();
                            handleWheel(type, e.deltaY);
                          }}
                          onTouchStart={(e) => handleTouchStart(e, type)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={() => { touchStartRef.current = null; }}
                          className="cursor-ns-resize select-none touch-none active:scale-95 transition-transform"
                        >
                          <span className="text-6xl font-light text-gray-800 dark:text-gray-200">
                            {String(value).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-6xl font-light text-gray-800 dark:text-gray-200 mb-2">
                  {displayHours > 0 && `${displayHours}:`}
                  {String(displayMinutes).padStart(displayHours > 0 ? 2 : 1, '0')}:
                  {String(displaySeconds).padStart(2, '0')}
                </div>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {!isRunning && currentTime === 0 ? 'Vuốt để điều chỉnh' : isRunning ? 'Phiên tập trung' : 'Đã tạm dừng'}
              </p>
            </div>
          </motion.div>
        </div>

        {!isRunning && (
          <div className="flex gap-3 mb-8">
            {presetTimes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPresetTime(preset.seconds)}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-12">
          <button
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg shadow-green-300/50 flex items-center justify-center"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2C2E33] text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#373A40] transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h3 className="text-lg text-gray-800 dark:text-[#E9ECEF]">Nhạc nền</h3>
          </div>

          <div className="space-y-3">
            {musicCategories.map(category => (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => setSelectedMusic(category.id)}
                  className={`w-full rounded-2xl p-4 transition-all ${
                    selectedMusic === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-50 dark:bg-[#2C2E33] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#373A40]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    {selectedMusic === category.id && (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse" />
                        <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Track list for selected category */}
                <AnimatePresence>
                  {selectedMusic === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50/50 dark:bg-[#25262B] rounded-2xl p-2 border border-gray-100/80 dark:border-[#373A40] space-y-1 transition-colors"
                    >
                      {category.tracks.map(track => {
                        const isTrackSelected = selectedTrackIds.has(track.id);
                        return (
                          <button
                            key={track.id}
                            onClick={() => toggleTrackSelection(track.id)}
                            className={`w-full text-left rounded-xl px-4 py-3 border transition-all flex items-center justify-between ${
                              isTrackSelected
                                ? `${category.themeLightColor} border-opacity-40`
                                : 'bg-white dark:bg-[#2C2E33] border-gray-100 dark:border-[#373A40] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#373A40]'
                            }`}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-sm font-medium truncate">{track.title}</p>
                              <p className="text-xs opacity-70 truncate">{track.artist}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isTrackSelected
                                ? 'bg-current border-transparent text-inherit'
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-[#373A40]'
                            }`}>
                              {isTrackSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
