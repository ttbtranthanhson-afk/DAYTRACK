import { useEffect, useMemo, useState } from 'react';
import { Plus, Sparkles, Calendar, Sun, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { CreateScheduleModal, type ScheduleSaveData } from '../components/CreateScheduleModal';
import { AIScheduleSuggestion } from '../components/AIScheduleSuggestion';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { SpecialDayNote } from '../components/SpecialDayNote';
import { AIGeneratorModal } from '../components/AIGeneratorModal';
import StartTimerButton from '../components/StartTimerButton';

const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
const shortDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const realDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const getTodayInfo = (date = new Date()) => {
  const dayName = realDays[date.getDay()];
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return {
    date,
    dayName,
    dateKey,
    dayOfMonth: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

const parseTimeToMinutes = (time: string) => {
  const [hour, minute] = time.trim().split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
};

const getTimeRangeMinutes = (timeRange: string) => {
  const [start, end] = timeRange.split(' - ');
  if (!start || !end) return null;
  const startMinutes = parseTimeToMinutes(start);
  const endMinutes = parseTimeToMinutes(end);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) return null;
  return { startMinutes, endMinutes };
};

const isBlockActiveNow = (block: ScheduleBlock, now: Date) => {
  const range = getTimeRangeMinutes(block.time);
  if (!range) return false;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= range.startMinutes && currentMinutes < range.endMinutes;
};

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

const colorMap: Record<string, { bg: string, text: string, badge: string, border: string }> = {
  'bg-blue-400': { bg: 'bg-blue-50', text: 'text-blue-900', badge: 'bg-blue-400', border: 'border-blue-100' },
  'bg-purple-400': { bg: 'bg-purple-50', text: 'text-purple-900', badge: 'bg-purple-400', border: 'border-purple-100' },
  'bg-pink-400': { bg: 'bg-pink-50', text: 'text-pink-900', badge: 'bg-pink-400', border: 'border-pink-100' },
  'bg-green-400': { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-400', border: 'border-green-100' },
  'bg-orange-400': { bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-400', border: 'border-orange-100' },
  'bg-yellow-400': { bg: 'bg-yellow-50', text: 'text-yellow-900', badge: 'bg-yellow-400', border: 'border-yellow-100' },
};

interface TimetableProps {
  weeklySchedules?: Record<string, ScheduleBlock[]>;
  onUpdateWeeklySchedules?: (schedules: Record<string, ScheduleBlock[]>) => void;
  onAddTasks?: (tasks: string[], scheduleName: string, day: string, understandHowTo?: boolean, scheduleId?: string) => void;
  calendarSchedules?: Record<string, ScheduleBlock[]>;
  onApplyWeeklySchedule?: (weeklySchedule: Record<string, ScheduleBlock[]>) => void;
  specialDayNotes?: Record<string, string>;
  onUpdateSpecialDayNote?: (dateKey: string, content: string) => void;
  globalTasks?: any[];
  onUpdateTasks?: (tasks: any[]) => void;
  onGenerateAchievements?: (context: { source: string; schedules?: ScheduleBlock[]; tasks?: any[] }) => void;
  userData: any;
}

export function Timetable({ 
  weeklySchedules = {},
  onUpdateWeeklySchedules,
  onAddTasks, 
  onApplyWeeklySchedule,
  specialDayNotes = {},
  onUpdateSpecialDayNote,
  globalTasks = [],
  onGenerateAchievements,
  userData
}: TimetableProps) {
  const navigate = useNavigate();
  const todayDayIndex = (() => {
    const todayIndex = new Date().getDay();
    return todayIndex === 0 ? 6 : todayIndex - 1; // 0 for Monday, 6 for Sunday
  })();
  
  const [currentDayIndex, setCurrentDayIndex] = useState(todayDayIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);
  const [isTodayMode, setIsTodayMode] = useState(() => {
    return localStorage.getItem('daytrack_timetable_default_today') === 'true';
  });
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  const todayInfo = useMemo(() => getTodayInfo(now), [now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentDay = days[currentDayIndex];
  
  const todaySchedule = weeklySchedules[todayInfo.dayName] || [];
  const schedule = isTodayMode 
    ? todaySchedule 
    : (weeklySchedules[currentDay] || []);
  const activeBlock = todaySchedule.find(block => isBlockActiveNow(block, now)) || null;

  const handleOpenCreate = () => {
    setEditingBlock(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (block: ScheduleBlock) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlock(null);
  };

  const handleSaveSchedule = (data: ScheduleSaveData) => {
    if (isTodayMode) return;

    if (editingBlock) {
      const updatedBlock = { ...editingBlock, title: data.name, time: `${data.timeStart} - ${data.timeEnd}`, color: data.color, tasks: data.tasks, isTimeFixed: data.isTimeFixed };
      if (onUpdateWeeklySchedules) {
        onUpdateWeeklySchedules({
          ...weeklySchedules,
          [currentDay]: (weeklySchedules[currentDay] || []).map(b => b.id === editingBlock.id ? updatedBlock : b),
        });
      }
      if (onAddTasks) {
        onAddTasks(data.tasks, data.name, currentDay, data.understandHowTo, editingBlock.id);
      }
    } else {
      const newBlock: ScheduleBlock = {
        id: Date.now().toString(),
        title: data.name,
        time: `${data.timeStart} - ${data.timeEnd}`,
        color: data.color,
        tasks: data.tasks,
        isTimeFixed: data.isTimeFixed,
      };
      if (onUpdateWeeklySchedules) {
        onUpdateWeeklySchedules({
          ...weeklySchedules,
          [currentDay]: [...(weeklySchedules[currentDay] || []), newBlock],
        });
      }
      if (data.tasks.length > 0 && onAddTasks) {
        onAddTasks(data.tasks, data.name, currentDay, data.understandHowTo, newBlock.id);
      }
    }
  };

  const parseTime = (block: ScheduleBlock) => {
    const parts = block.time.split(' - ');
    return { timeStart: parts[0]?.trim() ?? '09:00', timeEnd: parts[1]?.trim() ?? '10:00' };
  };

  const handleStartTimer = (seconds: number, musicCategory: string) => {
    navigate('/focus', { state: { initialSeconds: seconds, initialMusicCategory: musicCategory } });
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!onUpdateWeeklySchedules) return;
    onUpdateWeeklySchedules({
      ...weeklySchedules,
      [currentDay]: (weeklySchedules[currentDay] || []).filter(b => b.id !== blockId),
    });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {isTodayMode ? 'Hôm nay' : 'Lịch trình'}
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            {isTodayMode ? 'Lịch trình được AI tối ưu cho bạn' : 'Lịch trình tuần của bạn'}
          </p>
        </div>
        <button
          onClick={() => {
            const newMode = !isTodayMode;
            setIsTodayMode(newMode);
            localStorage.setItem('daytrack_timetable_default_today', String(newMode));
            if (!newMode) setCurrentDayIndex(todayDayIndex); // reset to today when switching back
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
            isTodayMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isTodayMode ? <Calendar className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      {/* Week Strip (Only in Timetable Mode) */}
      {!isTodayMode && (
        <div className="flex gap-1 px-5 mb-6">
          {shortDays.map((shortName, i) => {
            const isToday = i === todayDayIndex;
            const isActive = i === currentDayIndex;
            const dayNum = (i + 16) > 31 ? (i + 16) % 31 : (i + 16);

            return (
              <button
                key={i}
                onClick={() => setCurrentDayIndex(i)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-colors ${
                  isActive ? 'bg-blue-500' : isToday ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <span className={`text-[10px] uppercase font-semibold mb-1 ${
                  isActive ? 'text-white/80' : isToday ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {shortName}
                </span>
                {isToday && !isActive ? (
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {dayNum}
                  </div>
                ) : (
                  <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {dayNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="px-5">
        {isTodayMode && (
          <div className="mb-6 space-y-4">
            <StartTimerButton 
              selectedBlock={expandedScheduleId ? schedule.find(s => s.id === expandedScheduleId) || null : null}
              activeBlock={activeBlock}
              onStart={handleStartTimer}
              onNoSelection={() => alert('Vui lòng chọn một lịch để bắt đầu đếm giờ.')}
            />
            {onUpdateSpecialDayNote && (
              <SpecialDayNote 
                dateKey={todayInfo.dateKey}
                notes={specialDayNotes}
                onUpdate={onUpdateSpecialDayNote}
              />
            )}
            {/* AI Tips Card static replacing Weekly Summary */}
            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Gợi ý AI</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Lịch của bạn trông cân bằng! Hãy xem xét thêm 15 phút nghỉ giữa các lớp buổi sáng để tập trung tốt hơn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Cards */}
        <div className="space-y-4">
          {schedule.length > 0 ? (
            schedule.map((block) => {
              const c = colorMap[block.color] || colorMap['bg-blue-400'];
              return (
                <div key={block.id} className="relative group">
                  <div
                    onClick={() => {
                      if (isTodayMode) {
                        setExpandedScheduleId(expandedScheduleId === block.id ? null : block.id);
                      } else {
                        handleOpenEdit(block);
                      }
                    }}
                    className={`cursor-pointer ${c.bg} rounded-2xl border ${c.border} p-4 shadow-sm hover:shadow-md transition-all flex flex-col`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <div className={`w-3 h-3 rounded-full ${block.color} mt-1.5`} />
                        <h3 className={`font-bold text-base ${c.text}`}>{block.title}</h3>
                      </div>
                      {!isTodayMode && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                          className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/50 rounded-lg text-rose-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-5">
                      <span className={`${c.badge} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                        {block.time}
                      </span>
                      {block.tasks && block.tasks.length > 0 && (
                        <span className="bg-white/60 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-white">
                          {block.tasks.length} nhiệm vụ
                        </span>
                      )}
                    </div>

                    {isTodayMode && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {expandedScheduleId === block.id ? (
                          <ChevronUp className="w-5 h-5 text-blue-500/50" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-500/50" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* AI Suggestions & Tasks - Only in Today Mode */}
                  {isTodayMode && (
                    <AnimatePresence>
                      {expandedScheduleId === block.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-white border border-gray-100 rounded-2xl mt-2 px-4 py-3 shadow-sm"
                        >
                          <AIScheduleSuggestion
                            scheduleTitle={block.title}
                            scheduleTime={block.time}
                            isTimeFixed={block.isTimeFixed ?? false}
                          />
                          
                          <div className="mt-3 border-t border-gray-50 pt-3">
                            <h4 className="text-sm font-bold text-gray-800 mb-2">Nhiệm vụ:</h4>
                            {block.tasks && block.tasks.length > 0 ? (
                              <ul className="space-y-2">
                                {block.tasks.map((t, idx) => (
                                  <li key={idx} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-xl">
                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                      <span className="flex-1 text-gray-700 font-medium">{t}</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        onGenerateAchievements?.({
                                          source: 'task',
                                          schedules: [block],
                                          tasks: [{ title: t, scheduleName: block.title }],
                                        });
                                      }}
                                      className="text-[10px] text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 self-end px-2.5 py-1 rounded-lg transition-colors"
                                    >
                                      ✨ Gợi ý thực hiện
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-400 font-medium italic">Không có nhiệm vụ nào</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-400 font-semibold">
              Không có lịch trình nào
            </div>
          )}
        </div>

        {/* Add Block Button - Only in Timetable Mode */}
        {!isTodayMode && (
          <button
            onClick={handleOpenCreate}
            className="w-full mt-6 border-2 border-dashed border-blue-200 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 text-blue-500 hover:bg-blue-50 transition-colors font-bold"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo khối lịch trình mới</span>
          </button>
        )}
      </div>

      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        day={currentDay}
        editData={
          editingBlock
            ? {
                id: editingBlock.id,
                name: editingBlock.title,
                tasks: editingBlock.tasks ?? [],
                ...parseTime(editingBlock),
                color: editingBlock.color,
                isTimeFixed: editingBlock.isTimeFixed ?? false,
              }
            : null
        }
      />

      <AIGeneratorModal 
        isOpen={isAIGeneratorOpen} 
        onClose={() => setIsAIGeneratorOpen(false)} 
        userData={userData}
        weeklySchedules={weeklySchedules}
        onComplete={(weeklySchedule) => {
          if (onApplyWeeklySchedule) onApplyWeeklySchedule(weeklySchedule);
          if (onUpdateWeeklySchedules) onUpdateWeeklySchedules(weeklySchedule);
          onGenerateAchievements?.({
            source: 'schedule',
            schedules: Object.values(weeklySchedule).flat(),
            tasks: globalTasks,
          });
          setIsTodayMode(true);
          localStorage.setItem('daytrack_timetable_default_today', 'true');
        }}
      />
    </div>
  );
}
