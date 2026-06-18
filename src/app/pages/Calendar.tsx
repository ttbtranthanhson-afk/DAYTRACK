import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Plus, Trash2, Sparkles } from 'lucide-react';
import { CreateScheduleModal, type ScheduleSaveData } from '../components/CreateScheduleModal';
import { AIDayGeneratorModal } from '../components/AIDayGeneratorModal';
import type { CalendarSchedules } from '../App';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const monthNames = ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'];

const scheduleColors = ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-orange-400', 'bg-pink-400'];

const holidays: Record<number, string> = {
  1: 'Ngày Quốc tế',
  19: 'Tết Đoan Ngọ',
};

interface DaySchedule {
  id: string;
  title: string;
  time: string;
  color: string;
  tasks?: string[];
  isTimeFixed?: boolean;
  understandHowTo?: boolean;
}

const parseStartMinutes = (time: string): number => {
  const start = time.split(' - ')[0]?.trim() ?? '';
  const [h, m] = start.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

const isSchedulePast = (schedule: DaySchedule, dateKey: string): boolean => {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (dateKey < todayKey) return true;
  if (dateKey > todayKey) return false;
  const end = schedule.time.split(' - ')[1]?.trim() ?? '';
  const [eh, em] = end.split(':').map(Number);
  if (Number.isNaN(eh) || Number.isNaN(em)) return false;
  return now.getHours() * 60 + now.getMinutes() >= eh * 60 + em;
};

const sortSchedules = (schedules: DaySchedule[]): DaySchedule[] =>
  [...schedules].sort((a, b) => parseStartMinutes(a.time) - parseStartMinutes(b.time));

interface CalendarProps {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string, understandHowTo?: boolean, scheduleId?: string) => void;
  calendarSchedules?: CalendarSchedules;
  onUpdateCalendarSchedules?: (schedules: CalendarSchedules) => void;
  specialDayNotes?: Record<string, string>;
  onGenerateAchievements?: (context: { source: string; schedules?: any[]; tasks?: any[] }) => void;
  userData?: any;
  lockedDays?: Set<string>;
  onUpdateLockedDays?: (locked: Set<string>) => void;
}

export function Calendar({
  onAddTasks,
  calendarSchedules = {},
  onUpdateCalendarSchedules,
  specialDayNotes = {},
  onGenerateAchievements,
  userData,
  lockedDays: lockedDaysProp,
  onUpdateLockedDays,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(5); // Default month 6 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(16);
  const [lockedDaysInternal, setLockedDaysInternal] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DaySchedule | null>(null);

  const lockedDays = lockedDaysProp ?? lockedDaysInternal;

  const toggleLock = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const newSet = new Set(lockedDays);
    if (newSet.has(dateKey)) newSet.delete(dateKey);
    else newSet.add(dateKey);
    if (onUpdateLockedDays) onUpdateLockedDays(newSet);
    else setLockedDaysInternal(newSet);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    let newMonth = currentMonth;
    let newYear = currentYear;
    if (direction === 'prev') {
      if (currentMonth === 0) { newMonth = 11; newYear = currentYear - 1; }
      else newMonth = currentMonth - 1;
    } else {
      if (currentMonth === 11) { newMonth = 0; newYear = currentYear + 1; }
      else newMonth = currentMonth + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    const nextMonthDays = new Date(newYear, newMonth + 1, 0).getDate();
    if (selectedDay > nextMonthDays) setSelectedDay(nextMonthDays);
  };

  const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: numDays }, (_, i) => i + 1);
  const startDay = new Date(currentYear, currentMonth, 1).getDay();
  const offset = startDay === 0 ? 6 : startDay - 1;

  const pad = (n: number) => String(n).padStart(2, '0');
  const selectedDateKey = `${currentYear}-${pad(currentMonth + 1)}-${pad(selectedDay)}`;
  const today = new Date();
  const isActualCurrentMonthYear = currentYear === today.getFullYear() && currentMonth === today.getMonth();
  const actualTodayDay = today.getDate();

  const isLocked = lockedDays.has(selectedDateKey);
  const currentSchedules = sortSchedules(calendarSchedules[selectedDateKey] || []);

  const handleCreateSchedule = (data: ScheduleSaveData) => {
    const newSchedules = { ...calendarSchedules };
    if (editingSchedule) {
      newSchedules[selectedDateKey] = (newSchedules[selectedDateKey] || []).map(s =>
        s.id === editingSchedule.id
          ? { ...s, title: data.name, time: `${data.timeStart} - ${data.timeEnd}`, color: data.color, tasks: data.tasks, isTimeFixed: data.isTimeFixed, understandHowTo: data.understandHowTo }
          : s
      );
    } else {
      const scheduleCount = (newSchedules[selectedDateKey] || []).length;
      const colorIdx = scheduleCount % scheduleColors.length;
      
      const newSchedule: DaySchedule = {
        id: Date.now().toString(),
        title: data.name,
        time: `${data.timeStart} - ${data.timeEnd}`,
        color: data.color || scheduleColors[colorIdx], // Auto rotate color if not provided
        tasks: data.tasks,
        isTimeFixed: data.isTimeFixed,
        understandHowTo: data.understandHowTo,
      };
      newSchedules[selectedDateKey] = [...(newSchedules[selectedDateKey] || []), newSchedule];
      if (data.tasks.length > 0 && onAddTasks) {
        onAddTasks(data.tasks, data.name, `${selectedDay} tháng ${currentMonth + 1}`, data.understandHowTo, newSchedule.id);
      }
    }
    onUpdateCalendarSchedules?.(newSchedules);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const newSchedules = { ...calendarSchedules };
    newSchedules[selectedDateKey] = (newSchedules[selectedDateKey] || []).filter(s => s.id !== scheduleId);
    onUpdateCalendarSchedules?.(newSchedules);
  };

  const parseTime = (schedule: DaySchedule) => {
    const parts = schedule.time.split(' - ');
    return { timeStart: parts[0]?.trim() ?? '09:00', timeEnd: parts[1]?.trim() ?? '10:00' };
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{monthNames[currentMonth]}</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-5 mb-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-400 font-semibold">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
          {[...Array(offset)].map((_, i) => <div key={`empty-${i}`} />)}
          {daysArray.map(day => {
            const isSelected = day === selectedDay;
            const isToday = isActualCurrentMonthYear && day === actualTodayDay;
            const dateKey = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
            const holidayText = holidays[day];
            const daySchedules = calendarSchedules[dateKey] || [];
            const dots = daySchedules.slice(0, 3); // Max 3 dots

            return (
              <div key={day} className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDay(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isToday
                      ? 'bg-gray-900 text-white font-bold'
                      : isSelected
                      ? 'bg-purple-100 text-purple-700 font-bold'
                      : 'text-gray-800 font-medium hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
                {holidayText && (
                  <span className="text-[8px] text-rose-400 font-semibold mt-0.5 max-w-[120%] truncate text-center">
                    {holidayText}
                  </span>
                )}
                {dots.length > 0 && !holidayText && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {dots.map((s, idx) => (
                      <div key={idx} className={`w-1 h-1 rounded-full ${s.color}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Schedule */}
      <div className="px-5 border-t border-gray-100 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-bold text-gray-900">
            Ngày {selectedDay}
          </h3>
          {isLocked && (
            <span className="text-sm font-semibold text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
              · Đã khóa
            </span>
          )}
          <div className="flex-1" />
          <button
            onClick={() => toggleLock(selectedDay)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
              isLocked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {currentSchedules.map(schedule => {
            const past = isSchedulePast(schedule, selectedDateKey);
            return (
              <div
                key={schedule.id}
                className="flex items-stretch group cursor-pointer"
                onClick={() => { setEditingSchedule(schedule); setIsModalOpen(true); }}
              >
                <div className={`w-1 self-stretch rounded-full mr-4 ${schedule.color}`} />
                <div className="flex-1 py-3 border-b border-gray-50 flex items-start justify-between group-last:border-none">
                  <div>
                    <h4 className={`text-sm font-semibold ${past ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {schedule.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{schedule.time}</p>
                    {schedule.tasks && schedule.tasks.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5">{schedule.tasks.length} nhiệm vụ</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSchedule(schedule.id); }}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-rose-50 text-rose-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { setEditingSchedule(null); setIsModalOpen(true); }}
            className="w-full border border-dashed border-purple-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-purple-500 hover:bg-purple-50 transition-colors font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Thêm lịch trình</span>
          </button>

          <button
            onClick={() => {
              onGenerateAchievements?.({
                source: 'schedule',
                schedules: currentSchedules,
                tasks: currentSchedules.flatMap(s => (s.tasks ?? []).map(t => ({ title: t, scheduleName: s.title }))),
              });
              setIsAIModalOpen(true);
            }}
            className="w-full bg-yellow-50 hover:bg-yellow-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-yellow-600 transition-colors font-semibold shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI assistant</span>
          </button>
        </div>
      </div>

      {/* Create / Edit Schedule Modal */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSchedule(null); }}
        onSave={handleCreateSchedule}
        day={`${selectedDay} tháng ${currentMonth + 1}, ${currentYear}`}
        editData={
          editingSchedule
            ? {
                id: editingSchedule.id,
                name: editingSchedule.title,
                tasks: editingSchedule.tasks ?? [],
                ...parseTime(editingSchedule),
                color: editingSchedule.color,
                isTimeFixed: editingSchedule.isTimeFixed ?? false,
                understandHowTo: editingSchedule.understandHowTo ?? false,
              }
            : null
        }
      />

      <AIDayGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        dayTitle={`${selectedDay} tháng ${currentMonth + 1}, ${currentYear}`}
        userData={userData}
        existingDaySchedules={currentSchedules}
        onComplete={(newAIBlocks) => {
          const newSchedules = { ...calendarSchedules };
          newSchedules[selectedDateKey] = newAIBlocks.length > 0 ? newAIBlocks : (newSchedules[selectedDateKey] || []);
          onUpdateCalendarSchedules?.(newSchedules);
          if (onAddTasks) {
            newAIBlocks.forEach(block => {
              if (block.tasks && block.tasks.length > 0) {
                onAddTasks(block.tasks, block.title, `${selectedDay} tháng ${currentMonth + 1}`, undefined, block.id);
              }
            });
          }
          onGenerateAchievements?.({
            source: 'schedule',
            schedules: newAIBlocks,
            tasks: newAIBlocks.flatMap(block => (block.tasks ?? []).map(t => ({ title: t, scheduleName: block.title }))),
          });
        }}
      />
    </div>
  );
}
