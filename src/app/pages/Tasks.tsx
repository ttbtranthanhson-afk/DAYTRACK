import { useState, useEffect } from 'react';
import { Plus, Circle, CheckCircle2, Calendar as CalendarIcon, X, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { AITaskSuggestionModal } from '../components/AITaskSuggestionModal';
import type { Task } from '../App';

const priorityColors = {
  high: 'bg-rose-400',
  medium: 'bg-orange-400',
  low: 'bg-blue-400',
};

const priorityLabels = {
  high: 'Cao',
  medium: 'Vừa',
  low: 'Thấp',
};

const priorityOrder: Task['priority'][] = ['high', 'medium', 'low'];

interface TasksProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onGenerateAchievements?: (context: { source: string; tasks: Task[] }) => void;
}

const getTodayParts = () => {
  const today = new Date();
  return {
    day: today.getDate().toString(),
    month: (today.getMonth() + 1).toString(),
    iso: today.toISOString().slice(0, 10),
  };
};

const isTaskForToday = (task: Task) => {
  if (!task.dueDate) return false;
  const dueDate = task.dueDate.toLowerCase();
  const today = getTodayParts();
  const daysOfWeek = ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy'];
  const todayIndex = new Date().getDay();
  const todayDayName = daysOfWeek[todayIndex];
  return (
    dueDate.includes('hôm nay') ||
    dueDate.includes(today.iso) ||
    dueDate.includes(`${today.day} tháng ${today.month}`) ||
    dueDate.includes(`${today.day}/${today.month}`) ||
    dueDate.includes(todayDayName)
  );
};

export function Tasks({ tasks: propTasks, onUpdateTasks, onGenerateAchievements }: TasksProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'complete'>('all');
  const [tasks, setTasks] = useState<Task[]>(propTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAITaskModalOpen, setIsAITaskModalOpen] = useState(false);
  const [showSingleAISuggestion, setShowSingleAISuggestion] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    setTasks(propTasks);
  }, [propTasks]);

  useEffect(() => {
    if (!isTaskModalOpen) {
      setShowSingleAISuggestion(false);
      return;
    }
    setTitle(editingTask?.title ?? '');
    setPriority(editingTask?.priority ?? 'medium');
    setDueDate(editingTask?.dueDate ?? (activeTab === 'today' ? 'Hôm nay' : ''));
  }, [isTaskModalOpen, editingTask, activeTab]);

  const persistTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    onUpdateTasks(updatedTasks);
  };

  const openCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    persistTasks(updatedTasks);
  };

  const deleteTask = () => {
    if (!editingTask) return;
    persistTasks(tasks.filter(task => task.id !== editingTask.id));
    closeTaskModal();
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Task = {
      id: editingTask?.id ?? `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      priority,
      dueDate: dueDate.trim() || undefined,
      completed: editingTask?.completed ?? false,
      source: editingTask?.source ?? 'manual',
      scheduleName: editingTask?.scheduleName,
    };

    const updatedTasks = editingTask
      ? tasks.map(task => task.id === editingTask.id ? taskData : task)
      : [...tasks, taskData];

    persistTasks(updatedTasks);
    closeTaskModal();
  };

  const handleAISuggestTasks = () => {
    const todayTasks = tasks.filter(isTaskForToday);
    if (todayTasks.length === 0) {
      alert('Không có nhiệm vụ nào trong "Hôm nay" để AI gợi ý.');
      return;
    }
    setIsAITaskModalOpen(true);
    onGenerateAchievements?.({ source: 'task', tasks: todayTasks });
  };

  const filteredTasks = tasks.filter(task => {
    return activeTab === 'today' ? isTaskForToday(task) :
           activeTab === 'complete' ? task.completed :
           true;
  });

  const getWeekDays = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 is Sunday, 1 is Monday
    const diff = today.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = d.getDate() === new Date().getDate() && d.getMonth() === new Date().getMonth();
      const shortName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
      days.push({
        date: d,
        dayNumber: d.getDate(),
        shortName,
        isToday
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayStr = new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(new Date());

  // Group tasks
  const groupedTasks: Record<string, Task[]> = { high: [], medium: [], low: [] };
  filteredTasks.forEach(t => groupedTasks[t.priority].push(t));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 capitalize mb-1">{todayStr.replace(',', '')}</h1>
        <p className="text-sm text-gray-400 font-medium">Quản lý nhiệm vụ của bạn</p>
      </div>

      {/* Week Strip */}
      <div className="flex gap-2 px-5 mb-6">
        {weekDays.map((d, i) => (
          <div key={i} className={`flex-1 flex flex-col items-center py-2 rounded-xl ${d.isToday ? 'bg-orange-400' : 'bg-gray-50'}`}>
            <span className={`text-[10px] uppercase font-semibold mb-1 ${d.isToday ? 'text-white/80' : 'text-gray-400'}`}>
              {d.shortName}
            </span>
            <span className={`text-base ${d.isToday ? 'text-white font-bold' : 'text-gray-600 font-bold'}`}>
              {d.dayNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 px-5 mb-4">
        {(['all', 'today', 'complete'] as const).map(tab => {
          const tabLabels = { all: 'Tất cả', today: 'Hôm nay', complete: 'Hoàn thành' };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-5 pb-2.5 text-sm font-semibold relative transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {tabLabels[tab]}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Task Rows */}
      <div className="px-5 mb-6">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-gray-300 font-semibold">
            Không có nhiệm vụ phù hợp
          </div>
        ) : (
          <div className="space-y-6">
            {priorityOrder.map(priority => {
              const groupTasks = groupedTasks[priority];
              if (groupTasks.length === 0) return null;

              return (
                <div key={priority} className="space-y-2">
                  <div className="flex items-center gap-2 px-1 py-1">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[priority]}`} />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {priorityLabels[priority]} ({groupTasks.length})
                    </span>
                  </div>
                  
                  <div className="space-y-0">
                    {groupTasks.map(task => (
                      <div key={task.id} className="flex items-stretch group cursor-pointer" onClick={() => openEditTask(task)}>
                        <div className={`w-1 self-stretch rounded-full my-1 mr-3 ${task.completed ? 'bg-gray-200' : priorityColors[task.priority]}`} />
                        <div className="flex-1 flex items-center py-3 border-b border-gray-50 group-last:border-none">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                            className="mr-3"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-semibold ${task.completed ? 'text-gray-300 line-through' : 'text-gray-800'}`}>
                              {task.title}
                            </h3>
                            {(task.dueDate || task.scheduleName) && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {task.dueDate && <span className="text-xs text-gray-400">{task.dueDate}</span>}
                                {task.dueDate && task.scheduleName && <span className="text-xs text-gray-400">·</span>}
                                {task.scheduleName && <span className="text-xs text-gray-400">{task.scheduleName}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeTab !== 'complete' && (
        <div className="px-5 space-y-3 mt-4">
          <button
            onClick={openCreateTask}
            className="w-full border border-dashed border-gray-300 rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 hover:border-orange-200 hover:text-orange-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-semibold">Tạo nhiệm vụ mới</span>
          </button>
          <button
            onClick={handleAISuggestTasks}
            className="w-full bg-yellow-50 hover:bg-yellow-100 rounded-2xl py-3.5 px-6 flex items-center justify-center gap-2 text-yellow-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI gợi ý nhiệm vụ hôm nay</span>
          </button>
        </div>
      )}

      <AITaskSuggestionModal 
        isOpen={isAITaskModalOpen} 
        onClose={() => setIsAITaskModalOpen(false)} 
        tasks={tasks.filter(isTaskForToday)} 
      />

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md">
            <div className="border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingTask ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ'}</h2>
                <p className="text-sm font-medium text-gray-400">Bấm lưu để cập nhật</p>
              </div>
              <button onClick={closeTaskModal} className="p-2 rounded-full hover:bg-gray-50 transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tên nhiệm vụ</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 placeholder:text-gray-400 font-semibold rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-orange-200 transition-colors"
                  placeholder="VD: Hoàn thành bài tập toán"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ngày</label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 text-gray-800 placeholder:text-gray-400 font-semibold rounded-2xl border border-transparent outline-none focus:ring-2 focus:ring-orange-200 transition-colors"
                  placeholder="VD: Hôm nay hoặc 24 tháng 5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mức ưu tiên</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPriority(item)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        priority === item
                          ? `border-${item === 'high' ? 'rose' : item === 'medium' ? 'orange' : 'blue'}-200 bg-${item === 'high' ? 'rose' : item === 'medium' ? 'orange' : 'blue'}-50 text-${item === 'high' ? 'rose' : item === 'medium' ? 'orange' : 'blue'}-600`
                          : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {priorityLabels[item]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50">
                {editingTask && (
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="flex-1 py-3 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-400 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-500 transition-all"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
