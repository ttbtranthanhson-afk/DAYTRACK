import { useEffect, useRef, useState } from 'react';

export const musicCategories = [
  { id: 'focus', name: 'Tập trung', dot: 'bg-blue-400' },
  { id: 'lofi', name: 'Lofi', dot: 'bg-purple-400' },
  { id: 'piano', name: 'Piano', dot: 'bg-green-400' },
  { id: 'nature', name: 'Thiên nhiên', dot: 'bg-orange-400' },
];

export const presetTimes = [
  { label: '25:00', seconds: 25 * 60 },
  { label: '45:00', seconds: 45 * 60 },
  { label: '60:00', seconds: 60 * 60 },
];

export const tabs = ['Bộ đếm', 'Nhạc nền'] as const;

const FOCUS_VIDEOS: Record<string, string> = {
  focus: 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1',
  lofi: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
  piano: 'https://www.youtube.com/embed/4oAf-H8X6mU?autoplay=1',
  nature: 'https://www.youtube.com/embed/LMnS0YzqXZA?autoplay=1',
};

const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export function useFocus() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Bộ đếm');
  const [selectedMusic, setSelectedMusic] = useState('focus');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [circleScale, setCircleScale] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = new Date();
  const todayLabel = `${daysOfWeek[today.getDay()]}, ${today.getDate()} tháng ${today.getMonth() + 1}`;

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => {
    if (currentTime <= 0) {
      setCurrentTime(totalTime);
      setIsRunning(true);
    } else {
      setIsRunning(prev => !prev);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(totalTime);
  };

  const setPresetTime = (seconds: number) => {
    setIsRunning(false);
    setTotalTime(seconds);
    setCurrentTime(seconds);
  };

  const adjustTime = (type: 'hours' | 'minutes' | 'seconds', delta: number) => {
    const current = (c: number) => {
      if (type === 'hours') {
        const h = Math.min(23, Math.max(0, Math.floor(c / 3600) + delta));
        return h * 3600 + (c % 3600);
      }
      if (type === 'minutes') {
        const m = Math.min(59, Math.max(0, Math.floor((c % 3600) / 60) + delta));
        return Math.floor(c / 3600) * 3600 + m * 60 + (c % 60);
      }
      const s = Math.min(59, Math.max(0, (c % 60) + delta));
      return Math.floor(c / 60) * 60 + s;
    };
    setCurrentTime(prev => {
      const next = current(prev);
      setTotalTime(next);
      return next;
    });
    setCircleScale(0.95);
    setTimeout(() => setCircleScale(1), 150);
  };

  const handleWheel = (type: 'hours' | 'minutes' | 'seconds', deltaY: number) => {
    if (isRunning) return;
    adjustTime(type, deltaY > 0 ? -1 : 1);
  };

  const handleTouchStart = (e: React.TouchEvent, type: 'hours' | 'minutes' | 'seconds') => {
    if (isRunning) return;
    setCircleScale(0.95);
  };
  const handleTouchMove = () => setCircleScale(0.95);
  const handleTouchEnd = () => setCircleScale(1);

  const hours = Math.floor(currentTime / 3600);
  const minutes = Math.floor((currentTime % 3600) / 60);
  const seconds = currentTime % 60;

  const displayHours = hours;
  const displayMinutes = minutes;
  const displaySeconds = seconds;

  const circumference = 2 * Math.PI * 95;
  const progress = totalTime > 0 ? currentTime / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const videoUrl = FOCUS_VIDEOS[selectedMusic] || FOCUS_VIDEOS.focus;

  return {
    activeTab,
    setActiveTab,
    isRunning,
    hours,
    minutes,
    seconds,
    selectedMusic,
    setSelectedMusic,
    showMusicPlayer,
    setShowMusicPlayer,
    videoUrl,
    circleScale,
    isShaking,
    todayLabel,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleTimer,
    resetTimer,
    setPresetTime,
    displayHours,
    displayMinutes,
    displaySeconds,
    circumference,
    strokeDashoffset,
  };
}
