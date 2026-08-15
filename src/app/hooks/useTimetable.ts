import { useEffect, useState } from 'react';
import { getUserKey } from './storage';

export const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
export const dayShorts = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export interface ScheduleBlock {
  id: string;
  title: string;
  time: string;
  color: string;
  tasks?: string[];
  isTimeFixed?: boolean;
  understandHowTo?: boolean;
  need?: string;
  method?: string;
  reason?: string;
}

type WeeklySchedules = Record<string, ScheduleBlock[]>;

export const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'bg-blue-400': { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', badge: 'bg-blue-400' },
  'bg-purple-400': { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-400' },
  'bg-green-400': { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700', badge: 'bg-green-400' },
  'bg-orange-400': { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', badge: 'bg-orange-400' },
  'bg-pink-400': { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', badge: 'bg-pink-400' },
  'bg-yellow-400': { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-400' },
};

const solidColorMap: Record<string, string> = {
  'bg-blue-50 text-blue-600': 'bg-blue-400',
  'bg-purple-50 text-purple-600': 'bg-purple-400',
  'bg-green-50 text-green-600': 'bg-green-400',
  'bg-orange-50 text-orange-600': 'bg-orange-400',
  'bg-pink-50 text-pink-600': 'bg-pink-400',
  'bg-yellow-50 text-yellow-600': 'bg-yellow-400',
};

const initialWeeklySchedule: WeeklySchedules = {
  'Thứ Hai': [
    { id: '1', title: 'Toán học', time: '9:00 - 10:30', color: 'bg-blue-400' },
    { id: '2', title: 'Vật lý', time: '11:00 - 12:30', color: 'bg-purple-400' },
    { id: '3', title: 'Tự học', time: '14:00 - 16:00', color: 'bg-green-400' },
  ],
  'Thứ Ba': [
    { id: '4', title: 'Hóa học', time: '9:00 - 10:30', color: 'bg-orange-400' },
    { id: '5', title: 'Tiếng Anh', time: '11:00 - 12:30', color: 'bg-pink-400' },
  ],
};

const normalizeColor = (color: string) => solidColorMap[color] || (colorMap[color] ? color : 'bg-blue-400');

interface UseTimetableOptions {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string) => void;
}

function loadSchedules(): WeeklySchedules {
  try {
    const raw = localStorage.getItem(getUserKey('weekly_schedules'));
    if (!raw) return initialWeeklySchedule;
    const parsed = JSON.parse(raw) as WeeklySchedules;
    const normalized: WeeklySchedules = {};
    for (const [day, blocks] of Object.entries(parsed)) {
      normalized[day] = (blocks || []).map(b => ({ ...b, color: normalizeColor(b.color) }));
    }
    return normalized;
  } catch {
    return initialWeeklySchedule;
  }
}

export function useTimetable({ onAddTasks }: UseTimetableOptions) {
  const [schedules, setSchedules] = useState<WeeklySchedules>(loadSchedules);
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const today = new Date();
    const idx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return idx;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTodayMode, setIsTodayMode] = useState(() =>
    localStorage.getItem('daytrack_timetable_default_today') === 'true'
  );
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(getUserKey('weekly_schedules'), JSON.stringify(schedules));
  }, [schedules]);

  const todayDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const currentDay = days[currentDayIndex];

  const weekDates = (() => {
    const today = new Date();
    const currentIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentIdx);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.getDate();
    });
  })();

  const schedule = isTodayMode
    ? (schedules[days[todayDayIndex]] || [])
    : (schedules[currentDay] || []);

  const handleCreateSchedule = (data: {
    name: string;
    tasks: string[];
    timeStart: string;
    timeEnd: string;
    color: string;
  }) => {
    const newBlock: ScheduleBlock = {
      id: Date.now().toString(),
      title: data.name,
      time: `${data.timeStart} - ${data.timeEnd}`,
      color: normalizeColor(data.color),
      tasks: data.tasks,
    };
    setSchedules(prev => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), newBlock],
    }));
    if (data.tasks.length > 0 && onAddTasks) {
      onAddTasks(data.tasks, data.name, currentDay);
    }
  };

  const handleDelete = (id: string) => {
    setSchedules(prev => ({
      ...prev,
      [currentDay]: (prev[currentDay] || []).filter(b => b.id !== id),
    }));
  };

  return {
    currentDayIndex,
    setCurrentDayIndex,
    isModalOpen,
    setIsModalOpen,
    isTodayMode,
    setIsTodayMode,
    expandedScheduleId,
    setExpandedScheduleId,
    todayDayIndex,
    currentDay,
    weekDates,
    schedule,
    handleCreateSchedule,
    handleDelete,
  };
}
