import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock, Plus, Trash2, Sparkles, Info } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { CreateScheduleModal, type ScheduleSaveData } from '../components/CreateScheduleModal';
import { AIDayGeneratorModal } from '../components/AIDayGeneratorModal';

const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
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

const sampleSchedules: Record<number, DaySchedule[]> = {
  17: [
    { id: '1', title: 'Toán học', time: '9:00 - 10:30', color: 'bg-blue-50 text-blue-600' },
    { id: '2', title: 'Vật lý', time: '11:00 - 12:30', color: 'bg-purple-50 text-purple-600' },
  ],
};

import type { CalendarSchedules } from '../App';

interface CalendarProps {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string) => void;
  calendarSchedules?: CalendarSchedules;
  onUpdateCalendarSchedules?: (schedules: CalendarSchedules) => void;
  specialDayNotes: Record<string, string>;
  onGenerateAchievements?: (context: { source: string; schedules?: any[] }) => void;
  userData?: any;
}

export function Calendar({ 
  onAddTasks, 
  calendarSchedules = {}, 
  onUpdateCalendarSchedules,
  specialDayNotes = {},
  onGenerateAchievements,
  userData
}: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState(17);
  const [lockedDays, setLockedDays] = useState<Set<number>>(new Set([15, 20]));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<DaySchedule | null>(null);

  const toggleLock = (day: number) => {
    setLockedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const handleCreateSchedule = (data: ScheduleSaveData) => {
    let newSchedules = { ...calendarSchedules };
    
    if (editingSchedule) {
      // Edit mode: update existing schedule
      newSchedules[selectedDay] = (newSchedules[selectedDay] || []).map(s =>
        s.id === editingSchedule.id
          ? {
              ...s,
              title: data.name,
              time: `${data.timeStart} - ${data.timeEnd}`,
              color: data.color,
              tasks: data.tasks,
              isTimeFixed: data.isTimeFixed,
            }
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
      };
      newSchedules[selectedDay] = [...(newSchedules[selectedDay] || []), newSchedule];
      if (data.tasks.length > 0 && onAddTasks) {
        onAddTasks(data.tasks, data.name, `${selectedDay} tháng 5`);
      }
    }
    
    if (onUpdateCalendarSchedules) {
      onUpdateCalendarSchedules(newSchedules);
    }
  };

  const handleOpenCreate = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (schedule: DaySchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const parseTime = (schedule: DaySchedule) => {
    const parts = schedule.time.split(' - ');
    return { timeStart: parts[0]?.trim() ?? '09:00', timeEnd: parts[1]?.trim() ?? '10:00' };
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    let newSchedules = { ...calendarSchedules };
    newSchedules[selectedDay] = (newSchedules[selectedDay] || []).filter(s => s.id !== scheduleId);
    if (onUpdateCalendarSchedules) {
      onUpdateCalendarSchedules(newSchedules);
    }
  };

  const isLocked = lockedDays.has(selectedDay);
  const currentSchedules = calendarSchedules[selectedDay] || [];

  return (
    <PageContainer className="bg-gradient-to-b from-purple-50/30 to-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl text-purple-600 mb-1">Lịch</h1>
        <p className="text-sm text-gray-500">Quản lý lịch trình hàng ngày</p>
      </div>

      <div className="px-6 py-6">
        {/* Month Header */}
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg text-gray-800">Tháng 5 2026</h2>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Empty cells for offset */}
          {[...Array(4)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {daysInMonth.map(day => {
            const isSelected = day === selectedDay;
            const isLocked = lockedDays.has(day);
            const dateKey = `2026-05-${String(day).padStart(2, '0')}`;
            const hasSpecialNote = !!specialDayNotes[dateKey];

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all relative ${
                  isSelected
                    ? 'bg-purple-400 text-white shadow-lg shadow-purple-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } ${hasSpecialNote ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}
              >
                <span className="text-sm">{day}</span>
                {isLocked && (
                  <Lock className="w-2.5 h-2.5 absolute bottom-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Schedule */}
        <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl p-6 mb-4 border border-purple-100/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-800">{selectedDay} tháng 5, 2026</h3>
            <button
              onClick={() => toggleLock(selectedDay)}
              className={`p-2 rounded-full transition-colors ${
                isLocked
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-1000 text-purple-600'
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
          </div>

          {/* Yellow Special Day Note */}
          {specialDayNotes[`2026-05-${String(selectedDay).padStart(2, '0')}`] && (
            <div className="bg-yellow-50 rounded-xl p-3 mb-4 flex items-start gap-2 border border-yellow-200/50">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                {specialDayNotes[`2026-05-${String(selectedDay).padStart(2, '0')}`]}
              </p>
            </div>
          )}

          {isLocked && (
            <div className="bg-white/40 rounded-2xl p-3 mb-4 border border-purple-200/50">
              <p className="text-xs text-purple-600">
                Ngày này đã được khóa và sẽ không bị ảnh hưởng bởi các thay đổi lịch trình
              </p>
            </div>
          )}

          {/* Schedules List */}
          <div className="space-y-2 mb-3">
            {currentSchedules.length > 0 ? (
              currentSchedules.map(schedule => (
                <div
                  key={schedule.id}
                  className={`${schedule.color} rounded-xl p-3 group relative cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => handleOpenEdit(schedule)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{schedule.title}</p>
                      <p className="text-xs opacity-75">{schedule.time}</p>
                      {schedule.tasks && schedule.tasks.length > 0 && (
                        <p className="text-xs opacity-60 mt-1">
                          {schedule.tasks.length} nhiệm vụ
                        </p>
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
              ))
            ) : (
              <div className="bg-white/30 rounded-xl p-6 text-center border border-purple-100/30">
                <p className="text-sm text-gray-500">Không có lịch cho ngày này</p>
              </div>
            )}
          </div>

          {/* Add Schedule Button */}
          <div className="space-y-3">
            <button
              onClick={handleOpenCreate}
              className="w-full bg-white/40 hover:bg-white/60 rounded-xl p-3 flex items-center justify-center gap-2 text-purple-600 transition-colors border border-purple-100/30"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Thêm lịch trình</span>
            </button>
            
            {/* AI Assistant Button */}
            <button
              onClick={() => {
                onGenerateAchievements?.({
                  source: 'schedule',
                  schedules: currentSchedules,
                  tasks: currentSchedules.flatMap(schedule =>
                    (schedule.tasks ?? []).map(taskTitle => ({
                      title: taskTitle,
                      scheduleName: schedule.title,
                    }))
                  ),
                });
                setIsAIModalOpen(true);
              }}
              className="w-full bg-yellow-100 hover:bg-yellow-200 rounded-xl p-3 flex items-center justify-center gap-2 text-yellow-700 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Schedule Modal */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateSchedule}
        day={`${selectedDay} tháng 5, 2026`}
        editData={
          editingSchedule
            ? {
                id: editingSchedule.id,
                name: editingSchedule.title,
                tasks: editingSchedule.tasks ?? [],
                ...parseTime(editingSchedule),
                color: editingSchedule.color,
                isTimeFixed: editingSchedule.isTimeFixed ?? false,
              }
            : null
        }
      />

      <AIDayGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        dayTitle={`${selectedDay} tháng 5, 2026`}
        userData={userData}
        existingDaySchedules={currentSchedules}
        onComplete={(newAIBlocks) => {
          let newSchedules = { ...calendarSchedules };
          newSchedules[selectedDay] = newAIBlocks.length > 0 ? newAIBlocks : (newSchedules[selectedDay] || []);
          if (onUpdateCalendarSchedules) {
            onUpdateCalendarSchedules(newSchedules);
          }
          onGenerateAchievements?.({
            source: 'schedule',
            schedules: newAIBlocks,
            tasks: newAIBlocks.flatMap(block =>
              (block.tasks ?? []).map(taskTitle => ({ title: taskTitle, scheduleName: block.title }))
            ),
          });
        }}
      />
    </PageContainer>
  );
}
