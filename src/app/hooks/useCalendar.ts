import { useEffect, useMemo, useState } from 'react';
import { getUserKey } from './storage';

export const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const monthNames = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export const holidays: Record<number, string> = {
  1: 'Tết Dương lịch',
  8: 'Quốc tế Phụ nữ',
  30: 'Giải phóng',
  2: 'Quốc khánh',
  20: 'Phụ nữ VN',
};

export interface DaySchedule {
  id: string;
  title: string;
  time: string;
  color: string;
  tasks?: string[];
}

type CalendarSchedules = Record<string, DaySchedule[]>;

interface UseCalendarOptions {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const solidColorMap: Record<string, string> = {
  'bg-blue-50 text-blue-600': 'bg-blue-400',
  'bg-purple-50 text-purple-600': 'bg-purple-400',
  'bg-green-50 text-green-600': 'bg-green-400',
  'bg-orange-50 text-orange-600': 'bg-orange-400',
  'bg-pink-50 text-pink-600': 'bg-pink-400',
  'bg-yellow-50 text-yellow-600': 'bg-yellow-400',
};

const normalizeColor = (color: string) => solidColorMap[color] || color;

const getDateKey = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

function loadSchedules(): CalendarSchedules {
  try {
    const raw = localStorage.getItem(getUserKey('calendar_schedules'));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadLockedDays(): Set<string> {
  try {
    const raw = localStorage.getItem(getUserKey('locked_days'));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function useCalendar({ onAddTasks }: UseCalendarOptions) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<CalendarSchedules>(loadSchedules);
  const [lockedDays, setLockedDays] = useState<Set<string>>(loadLockedDays);

  useEffect(() => {
    localStorage.setItem(getUserKey('calendar_schedules'), JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(getUserKey('locked_days'), JSON.stringify([...lockedDays]));
  }, [lockedDays]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const todayDate = today.getDate();

  const selectedDateKey = getDateKey(currentYear, currentMonth, selectedDay);
  const isLocked = lockedDays.has(selectedDateKey);

  const daySchedules = useMemo(() => {
    const map: Record<number, DaySchedule[]> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      map[day] = schedules[getDateKey(currentYear, currentMonth, day)] || [];
    }
    return map;
  }, [schedules, currentYear, currentMonth, daysInMonth]);

  const currentSchedules = daySchedules[selectedDay] || [];

  const toggleLock = (day: number) => {
    const key = getDateKey(currentYear, currentMonth, day);
    setLockedDays(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleCreateSchedule = (data: {
    name: string;
    tasks: string[];
    timeStart: string;
    timeEnd: string;
    color: string;
  }) => {
    const newSchedule: DaySchedule = {
      id: Date.now().toString(),
      title: data.name,
      time: `${data.timeStart} - ${data.timeEnd}`,
      color: normalizeColor(data.color),
      tasks: data.tasks,
    };
    setSchedules(prev => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newSchedule],
    }));
    if (data.tasks.length > 0 && onAddTasks) {
      onAddTasks(data.tasks, data.name, `${selectedDay} tháng ${currentMonth + 1}`);
    }
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => ({
      ...prev,
      [selectedDateKey]: (prev[selectedDateKey] || []).filter(s => s.id !== id),
    }));
  };

  return {
    currentMonth,
    setCurrentMonth,
    currentYear,
    selectedDay,
    setSelectedDay,
    daySchedules,
    isModalOpen,
    setIsModalOpen,
    offset,
    daysInMonth,
    isLocked,
    currentSchedules,
    todayDate,
    toggleLock,
    handleCreateSchedule,
    handleDeleteSchedule,
  };
}
