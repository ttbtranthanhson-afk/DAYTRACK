import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles, Calendar, Sun, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { CreateScheduleModal, type ScheduleSaveData } from '../components/CreateScheduleModal';
import { AIScheduleSuggestion } from '../components/AIScheduleSuggestion';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { SpecialDayNote } from '../components/SpecialDayNote';
import { AIGeneratorModal } from '../components/AIGeneratorModal';
import StartTimerButton from '../components/StartTimerButton';

const days = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
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
  calendarSchedules = {}, 
  onApplyWeeklySchedule,
  specialDayNotes = {},
  onUpdateSpecialDayNote,
  globalTasks = [],
  onUpdateTasks,
  onGenerateAchievements,
  userData
}: TimetableProps) {
  const navigate = useNavigate();
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const todayIndex = days.indexOf(getTodayInfo().dayName);
    return todayIndex >= 0 ? todayIndex : 0;
  });
  const [direction, setDirection] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null);
  const [isTodayMode, setIsTodayMode] = useState(false);
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [swipedBlockId, setSwipedBlockId] = useState<string | null>(null);
  const swipeStartX = useRef<number>(0);

  const todayInfo = useMemo(() => getTodayInfo(now), [now]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const goToNextDay = () => {
    if (isTodayMode) return;
    if (currentDayIndex === 6) {
      if (!showSummary) {
        setDirection(1);
        setShowSummary(true);
      }
    } else {
      setDirection(1);
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  const goToPreviousDay = () => {
    if (isTodayMode) return;
    if (showSummary) {
      setDirection(-1);
      setShowSummary(false);
    } else if (currentDayIndex > 0) {
      setDirection(-1);
      setCurrentDayIndex(prev => prev - 1);
    }
  };

  const handleDragEnd = (e: any, { offset }: any) => {
    const swipe = offset.x;
    if (swipe < -50) goToNextDay();
    else if (swipe > 50) goToPreviousDay();
  };

  const currentDay = days[currentDayIndex];
  
  const todaySchedule = weeklySchedules[todayInfo.dayName] || [];
  const schedule = isTodayMode 
    ? todaySchedule 
    : (weeklySchedules[currentDay] || []);
  const activeBlock = todaySchedule.find(block => isBlockActiveNow(block, now)) || null;

  useEffect(() => {
    if (!activeBlock) return;

    const range = getTimeRangeMinutes(activeBlock.time);
    if (!range) return;

    const notificationKey = `daytrack_schedule_notified_${todayInfo.dateKey}_${activeBlock.id}_${range.startMinutes}`;
    if (localStorage.getItem(notificationKey)) return;

    const notify = () => {
      localStorage.setItem(notificationKey, 'true');
      new Notification('DayTrack', {
        body: `Đến giờ: ${activeBlock.title} (${activeBlock.time})`,
      });
    };

    if (typeof Notification === 'undefined') return;

    if (Notification.permission === 'granted') {
      notify();
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') notify();
      });
    }
  }, [activeBlock, todayInfo.dateKey]);

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
    // Không cho phép lưu trong Today mode ở đây (hoặc update vào CalendarSchedules)
    // Để đơn giản, chỉ xử lý trong Timetable mode
    if (isTodayMode) return;

    if (editingBlock) {
      const updatedBlock = { ...editingBlock, title: data.name, time: `${data.timeStart} - ${data.timeEnd}`, color: data.color, tasks: data.tasks, isTimeFixed: data.isTimeFixed };
      if (onUpdateWeeklySchedules) {
        onUpdateWeeklySchedules({
          ...weeklySchedules,
          [currentDay]: (weeklySchedules[currentDay] || []).map(b =>
            b.id === editingBlock.id
              ? updatedBlock
              : b
          ),
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
    setSwipedBlockId(null);
  };

  return (
    <PageContainer className="bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/20 dark:to-[#1A1B1E]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-blue-600 dark:text-blue-400 mb-1 transition-colors">
              {isTodayMode ? 'Hôm nay' : 'Lịch trình'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              {isTodayMode ? 'Lịch trình được AI tối ưu cho bạn' : 'Lịch trình tuần của bạn'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsTodayMode(!isTodayMode);
              setShowSummary(false);
            }}
            className={`p-3 rounded-xl transition-all ${
              isTodayMode
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-[#2C2E33] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#373A40]'
            }`}
          >
            {isTodayMode ? <Calendar className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="px-6 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={isTodayMode ? 'today' : currentDay}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Day Navigation - Only in Timetable Mode */}
              {!isTodayMode && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={goToPreviousDay}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors disabled:opacity-30"
                      disabled={currentDayIndex === 0}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="text-xl text-gray-800 dark:text-[#E9ECEF]">{currentDay}</h2>
                    <button
                      onClick={goToNextDay}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Day Indicator */}
                  <div className="flex gap-1.5 justify-center mb-8">
                    {days.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentDayIndex
                            ? 'w-8 bg-blue-400'
                            : 'w-1.5 bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Today Mode Header & Features */}
              {isTodayMode && (
                <div className="mb-6 space-y-4">
                  <div>
                    <h2 className="text-xl text-gray-800 dark:text-[#E9ECEF]">
                      {todayInfo.dayName}, {todayInfo.dayOfMonth} tháng {todayInfo.month}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lịch học hôm nay theo thời gian thực</p>
                  </div>
                  
                  {onUpdateSpecialDayNote && (
                    <SpecialDayNote 
                      dateKey={todayInfo.dateKey}
                      notes={specialDayNotes}
                      onUpdate={onUpdateSpecialDayNote}
                    />
                  )}

                  <StartTimerButton 
                    selectedBlock={expandedScheduleId ? schedule.find(s => s.id === expandedScheduleId) || null : null}
                    activeBlock={activeBlock}
                    onStart={handleStartTimer}
                    onNoSelection={() => alert('Vui lòng chọn một lịch để bắt đầu đếm giờ.')}
                  />
                </div>
              )}

              {/* Schedule Blocks */}
              <div className="space-y-3">
                {schedule.length > 0 ? (
                  schedule.map((block) => (
                    <div key={block.id} className="relative overflow-hidden rounded-2xl">
                      {/* Nút xóa phía sau (chỉ Timetable mode) */}
                      {!isTodayMode && (
                        <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-2 w-20 bg-red-500 rounded-2xl">
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="flex flex-col items-center justify-center w-14 h-full text-white"
                          >
                            <Trash2 className="w-5 h-5" />
                            <span className="text-[10px] mt-0.5">Xóa</span>
                          </button>
                        </div>
                      )}

                      {/* Block chính — vuốt trái để lộ nút xóa */}
                      <motion.div
                        drag={!isTodayMode ? "x" : false}
                        dragConstraints={{ left: -80, right: 0 }}
                        dragElastic={0.1}
                        onDragStart={(_e, info) => { swipeStartX.current = info.point.x; }}
                        onDragEnd={(_e, info) => {
                          if (info.offset.x < -40) {
                            setSwipedBlockId(block.id);
                          } else {
                            setSwipedBlockId(null);
                          }
                        }}
                        animate={{ x: swipedBlockId === block.id ? -80 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ position: 'relative', zIndex: 1 }}
                      >
                        <button
                          onClick={() => {
                            if (swipedBlockId === block.id) {
                              setSwipedBlockId(null);
                              return;
                            }
                            if (isTodayMode) {
                              setExpandedScheduleId(expandedScheduleId === block.id ? null : block.id);
                            } else {
                              handleOpenEdit(block);
                            }
                          }}
                          className={`w-full ${block.color} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h3 className="font-medium mb-1">{block.title}</h3>
                              <p className="text-sm opacity-75">{block.time}</p>
                            </div>
                            {isTodayMode && (
                              <div>
                                {expandedScheduleId === block.id ? (
                                  <ChevronUp className="w-5 h-5 opacity-60" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 opacity-60" />
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      </motion.div>

                      {/* AI Suggestions & Tasks - Only in Today Mode */}
                      {isTodayMode && (
                        <AnimatePresence>
                          {expandedScheduleId === block.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className={`${block.color} rounded-b-2xl -mt-2 pt-2 overflow-hidden`}
                            >
                              <AIScheduleSuggestion
                                scheduleTitle={block.title}
                                scheduleTime={block.time}
                                isTimeFixed={block.isTimeFixed ?? false}
                              />
                              
                              {/* Task List below AI Suggestion */}
                              <div className="px-4 pb-4">
                                <h4 className="text-sm font-medium mb-2 border-t border-black/10 pt-3">Nhiệm vụ:</h4>
                                {block.tasks && block.tasks.length > 0 ? (
                                  <ul className="space-y-2">
                                    {block.tasks.map((t, idx) => (
                                      <li key={idx} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm bg-white/40 px-3 py-2 rounded-lg">
                                          <div className="w-2 h-2 rounded-full bg-black/30" />
                                          <span className="flex-1">{t}</span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            onGenerateAchievements?.({
                                              source: 'task',
                                              schedules: [block],
                                              tasks: [{ title: t, scheduleName: block.title }],
                                            });
                                          }}
                                          className="text-[10px] text-blue-600 bg-blue-100/50 hover:bg-blue-200 self-end px-2 py-1 rounded"
                                        >
                                          ✨ Gợi ý thực hiện
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs opacity-70 italic">Không có nhiệm vụ nào</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>Không có lịch cho ngày này</p>
                  </div>
                )}
              </div>

              {/* Add Block Button - Only in Timetable Mode */}
              {!isTodayMode && (
                <button
                  onClick={handleOpenCreate}
                  className="w-full mt-6 border-2 border-dashed border-blue-200 dark:border-blue-800/50 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo khối lịch trình mới</span>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Weekly Summary */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl text-gray-800 dark:text-[#E9ECEF]">Tổng kết tuần</h2>
                <div className="w-10" />
              </div>

              <div className="bg-blue-100 dark:bg-blue-900/20 dark:border dark:border-blue-800/30 rounded-3xl p-6 mb-6 transition-colors">
                <h3 className="text-lg mb-4 text-blue-900 dark:text-blue-300">Tổng quan tuần</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-500 dark:text-blue-400">Tổng số lớp</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-500 dark:text-blue-400">Giờ học</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-500 dark:text-blue-400">Ngày rảnh</span>
                    <span className="font-medium text-blue-900 dark:text-blue-300">2</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  onGenerateAchievements?.({
                    source: 'schedule',
                    schedules: Object.values(weeklySchedules).flat(),
                    tasks: globalTasks,
                  });
                  setIsAIGeneratorOpen(true);
                }}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-300/50"
              >
                <Sparkles className="w-5 h-5" />
                <span>Trợ lý AI</span>
              </button>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 dark:border dark:border-blue-800/30 rounded-2xl p-4 transition-colors">
                <p className="text-sm text-blue-500 dark:text-blue-400">
                  <strong className="text-blue-700 dark:text-blue-300">Gợi ý AI:</strong> Lịch của bạn trông cân bằng! Hãy xem xét thêm
                  15 phút nghỉ giữa các lớp buổi sáng để tập trung tốt hơn.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          if (onApplyWeeklySchedule) {
            onApplyWeeklySchedule(weeklySchedule);
          }
          if (onUpdateWeeklySchedules) {
            onUpdateWeeklySchedules(weeklySchedule);
          }
          onGenerateAchievements?.({
            source: 'schedule',
            schedules: Object.values(weeklySchedule).flat(),
            tasks: globalTasks,
          });
          // Tự động quay về Today mode để xem kết quả
          setIsTodayMode(true);
          setShowSummary(false);
          alert('Đã áp dụng lịch trình AI tạo ra vào Calendar tổng!');
        }}
      />
    </PageContainer>
  );
}
