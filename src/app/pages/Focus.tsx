import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Music, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router';
import { PageContainer } from '../components/PageContainer';
import { motion } from 'motion/react';

const musicCategories = [
  {
    id: 'study',
    name: 'Học tập',
    color: 'from-blue-400 to-cyan-400',
    tracks: [
      { title: 'Lofi study beats', videoId: 'jfKfPfyJRdk' },
      { title: 'Calm piano for reading', videoId: 'lTRiuFIWV54' },
    ],
  },
  {
    id: 'work',
    name: 'Làm việc',
    color: 'from-purple-400 to-pink-400',
    tracks: [
      { title: 'Deep work ambient', videoId: 'WPni755-Krg' },
      { title: 'Coding focus mix', videoId: '5qap5aO4i9A' },
    ],
  },
  {
    id: 'exercise',
    name: 'Tập luyện',
    color: 'from-orange-400 to-red-400',
    tracks: [
      { title: 'Workout energy mix', videoId: 'ml6cT4AZdqI' },
      { title: 'Cardio motivation', videoId: 'q6EoRBvdVPQ' },
    ],
  },
  {
    id: 'relax',
    name: 'Thư giãn',
    color: 'from-green-400 to-emerald-400',
    tracks: [
      { title: 'Nature relaxation', videoId: 'eKFTSSKCzWA' },
      { title: 'Soft rain ambience', videoId: 'mPZkdNFkNps' },
    ],
  },
  {
    id: 'focus',
    name: 'Tập trung sâu',
    color: 'from-indigo-400 to-purple-400',
    tracks: [
      { title: 'Binaural focus', videoId: 'Sagg08DrO5U' },
      { title: 'Minimal focus soundscape', videoId: 'Dx5qFachd3A' },
    ],
  },
];

const presetTimes = [
  { label: '25:00', seconds: 25 * 60 },
  { label: '45:00', seconds: 45 * 60 },
  { label: '1:00:00', seconds: 60 * 60 },
];

const getMusicCategory = (id: string | null) =>
  musicCategories.find(category => category.id === id) ?? musicCategories[musicCategories.length - 1];

const getTrackForCategory = (categoryId: string | null) => {
  const category = getMusicCategory(categoryId);
  const track = category.tracks[Math.floor(Math.random() * category.tracks.length)];
  return {
    category,
    track,
    url: `https://www.youtube.com/embed/${track.videoId}?autoplay=1&loop=1&playlist=${track.videoId}`,
  };
};

export function Focus() {
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState<string | null>('focus');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [currentTrack, setCurrentTrack] = useState<{ title: string; categoryName: string } | null>(null);
  const [circleScale, setCircleScale] = useState(1);
  const [isShaking, setIsShaking] = useState(false);

  const location = useLocation();
  const timerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ y: number; type: 'hours' | 'minutes' | 'seconds' } | null>(null);

  const startMusic = (categoryId: string | null) => {
    const player = getTrackForCategory(categoryId);
    setVideoUrl(player.url);
    setCurrentTrack({ title: player.track.title, categoryName: player.category.name });
    setShowMusicPlayer(true);
  };

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
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total === 0) return;

      setTotalTime(total);
      setCurrentTime(total);
      setIsRunning(true);
      startMusic(selectedMusic);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else {
      setIsRunning(false);
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
    setVideoUrl('');
    setCurrentTrack(null);
  };

  const setPresetTime = (presetSeconds: number) => {
    setHours(Math.floor(presetSeconds / 3600));
    setMinutes(Math.floor((presetSeconds % 3600) / 60));
    setSeconds(presetSeconds % 60);
  };

  const displayHours = isRunning ? Math.floor(currentTime / 3600) : hours;
  const displayMinutes = isRunning ? Math.floor((currentTime % 3600) / 60) : minutes;
  const displaySeconds = isRunning ? currentTime % 60 : seconds;
  const progress = totalTime > 0 ? ((totalTime - currentTime) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 115;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <PageContainer className="bg-gradient-to-b from-green-50/30 to-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl text-green-600 mb-1">Tập trung</h1>
        <p className="text-sm text-gray-500">Tập trung và năng suất</p>
      </div>

      <div className="px-6 py-8 flex flex-col items-center">
        {showMusicPlayer && (
          <div className="w-full mb-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border border-pink-200 overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Đang phát</p>
                <p className="text-xs text-gray-600">
                  {currentTrack ? `${currentTrack.categoryName} - ${currentTrack.title}` : 'Nhạc tập trung'}
                </p>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-pink-400 rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-purple-400 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-6 bg-pink-400 rounded-full animate-pulse delay-150" />
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <iframe
                width="100%"
                height="200"
                src={videoUrl}
                allow="autoplay; encrypted-media"
                className="rounded-xl"
                title="Focus Music"
              />
            </div>
          </div>
        )}

        <div className="relative mb-8">
          {isRunning && (
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
            className="w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-xl shadow-green-200/50"
          >
            <div className="text-center">
              {!isRunning ? (
                <div className="flex gap-1 justify-center items-center mb-2">
                  {(['hours', 'minutes', 'seconds'] as const).map((type, index) => {
                    const value = type === 'hours' ? hours : type === 'minutes' ? minutes : seconds;
                    return (
                      <div key={type} className="flex items-center gap-1">
                        {index > 0 && <span className="text-6xl font-light text-gray-800">:</span>}
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
                          <span className="text-6xl font-light text-gray-800">
                            {String(value).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-6xl font-light text-gray-800 mb-2">
                  {displayHours > 0 && `${displayHours}:`}
                  {String(displayMinutes).padStart(displayHours > 0 ? 2 : 1, '0')}:
                  {String(displaySeconds).padStart(2, '0')}
                </div>
              )}
              <p className="text-sm text-gray-600">
                {!isRunning ? 'Vuốt để điều chỉnh' : 'Phiên tập trung'}
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
                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm"
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
            className="w-16 h-16 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg text-gray-800">Nhạc nền</h3>
          </div>

          <div className="space-y-3">
            {musicCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedMusic(category.id)}
                className={`w-full rounded-2xl p-4 transition-all ${
                  selectedMusic === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
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
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
