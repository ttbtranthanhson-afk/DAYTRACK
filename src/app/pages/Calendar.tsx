import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Plus, Trash2, Sparkles } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { CreateScheduleModal, type ScheduleSaveData } from '../components/CreateScheduleModal';
import { AIDayGeneratorModal } from '../components/AIDayGeneratorModal';
import type { CalendarSchedules } from '../App';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

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
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
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
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

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
      const newSchedule: DaySchedule = {
        id: Date.now().toString(),
        title: data.name,
        time: `${data.timeStart} - ${data.timeEnd}`,
        color: data.color,
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
    <PageContainer className="bg-gradient-to-b from-purple-50/30 to-white dark:from-purple-950/20 dark:to-[#1A1B1E]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <h1 className="text-2xl text-purple-600 dark:text-purple-400 mb-1 transition-colors">Lịch</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Quản lý lịch trình hàng ngày</p>
      </div>

      <div className="px-6 py-6">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#E9ECEF]">Tháng {currentMonth + 1} {currentYear}</h2>
          <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {[...Array(offset)].map((_, i) => <div key={`empty-${i}`} />)}
          {daysArray.map(day => {
            const isSelected = day === selectedDay;
            const dateKey = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
            const isDayLocked = lockedDays.has(dateKey);
            const hasSpecialNote = !!specialDayNotes[dateKey];
            const isToday = dateKey === todayKey;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isSelected
                    ? 'bg-purple-400 text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/40'
                    : isToday
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 ring-2 ring-purple-300 dark:ring-purple-700'
                    : hasSpecialNote
                    ? 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-400 dark:border-yellow-700/50 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 font-medium'
                    : 'bg-gray-50 dark:bg-[#2C2E33] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#373A40]'
                }`}
              >
                <span className="text-sm">{day}</span>
                {hasSpecialNote && <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-yellow-600'}`} />}
                {isDayLocked && <Lock className={`w-2.5 h-2.5 absolute bottom-1 right-1 ${isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />}
              </button>
            );
          })}
        </div>

        {/* Selected Day Schedule */}
        <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/20 rounded-3xl p-6 mb-4 border border-purple-100/30 dark:border-purple-800/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-800 dark:text-[#E9ECEF]">{selectedDay} tháng {currentMonth + 1}, {currentYear}</h3>
            <button
              onClick={() => toggleLock(selectedDay)}
              className={`p-2 rounded-full transition-colors ${isLocked ? 'bg-purple-500 text-white' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'}`}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>

          {specialDayNotes[selectedDateKey] && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20 rounded-2xl p-4 mb-4 flex items-start gap-3 border border-yellow-200 dark:border-yellow-800/40 shadow-sm transition-colors">
              <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-xs text-yellow-800 dark:text-yellow-300 uppercase tracking-wider mb-0.5">Ngày đặc biệt</strong>
                <p className="text-sm text-yellow-900 dark:text-yellow-200 font-medium">{specialDayNotes[selectedDateKey]}</p>
              </div>
            </div>
          )}

          {isLocked && (
            <div className="bg-white/40 dark:bg-[#2C2E33]/70 rounded-2xl p-3 mb-4 border border-purple-200/50 dark:border-purple-800/40">
              <p className="text-xs text-purple-600 dark:text-purple-300">Ngày này đã được khóa và sẽ không bị ảnh hưởng bởi các thay đổi lịch trình</p>
            </div>
          )}

          {/* Schedules List */}
          <div className="space-y-2 mb-3">
            {currentSchedules.length > 0 ? (
              currentSchedules.map(schedule => {
                const past = isSchedulePast(schedule, selectedDateKey);
                return (
                  <div
                    key={schedule.id}
                    className={`rounded-xl p-3 group relative cursor-pointer hover:shadow-md transition-shadow border ${
                      past
                        ? 'bg-white text-gray-400 border-gray-200 dark:bg-[#2C2E33] dark:text-gray-500 dark:border-[#373A40]'
                        : `${schedule.color} border-transparent`
                    }`}
                    onClick={() => { setEditingSchedule(schedule); setIsModalOpen(true); }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${past ? 'line-through opacity-60' : ''}`}>{schedule.title}</p>
                        <p className="text-xs opacity-75">{schedule.time}</p>
                        {schedule.tasks && schedule.tasks.length > 0 && (
                          <p className="text-xs opacity-60 mt-1">{schedule.tasks.length} nhiệm vụ</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSchedule(schedule.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white/30 dark:bg-[#2C2E33]/70 rounded-xl p-6 text-center border border-purple-100/30 dark:border-[#373A40]">
                <p className="text-sm text-gray-500 dark:text-gray-400">Không có lịch cho ngày này</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => { setEditingSchedule(null); setIsModalOpen(true); }}
              className="w-full bg-white/40 dark:bg-[#2C2E33]/80 hover:bg-white/60 dark:hover:bg-[#373A40] rounded-xl p-3 flex items-center justify-center gap-2 text-purple-600 dark:text-purple-300 transition-colors border border-purple-100/30 dark:border-purple-800/30"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Thêm lịch trình</span>
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
              className="w-full bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-xl p-3 flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI assistant</span>
            </button>
          </div>
        </div>

        {/* Special Days list in this month */}
        {Object.entries(specialDayNotes).some(([key]) => key.startsWith(`${currentYear}-${pad(currentMonth + 1)}`)) && (
          <div className="mt-6 bg-white dark:bg-[#2C2E33] rounded-3xl p-6 border border-gray-100 dark:border-[#373A40] shadow-sm transition-colors">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-[#E9ECEF] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Sự kiện & Ngày đặc biệt tháng {currentMonth + 1}
            </h3>
            <div className="space-y-2">
              {Object.entries(specialDayNotes)
                .filter(([key]) => key.startsWith(`${currentYear}-${pad(currentMonth + 1)}`))
                .map(([key, value]) => {
                  const dayNum = parseInt(key.split('-')[2]);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDay(dayNum)}
                      className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#373A40] transition-colors border border-gray-50 dark:border-[#373A40]"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</span>
                      <span className="text-xs text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full font-medium">
                        Ngày {dayNum}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
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
    </PageContainer>
  );
}
