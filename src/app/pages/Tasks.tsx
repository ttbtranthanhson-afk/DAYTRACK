import { useState, useEffect } from 'react';
import { Plus, Search, Circle, CheckCircle2, Calendar as CalendarIcon, X, Sparkles, Trash2, ChevronDown } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { AITaskSuggestionModal } from '../components/AITaskSuggestionModal';
import type { Task } from '../App';

const priorityColors = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-orange-50 text-orange-600',
  low: 'bg-blue-50 text-blue-600',
};

const priorityLabels = {
  high: 'Cao',
  medium: 'Vừa',
  low: 'Thấp',
};

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
  return (
    dueDate.includes('hôm nay') ||
    dueDate.includes(today.iso) ||
    dueDate.includes(`${today.day} tháng ${today.month}`) ||
    dueDate.includes(`${today.day}/${today.month}`)
  );
};

export function Tasks({ tasks: propTasks, onUpdateTasks, onGenerateAchievements }: TasksProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'complete'>('all');
  const [tasks, setTasks] = useState<Task[]>(propTasks);
  const [searchQuery, setSearchQuery] = useState('');
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
    setDueDate(editingTask?.dueDate ?? '');
  }, [isTaskModalOpen, editingTask]);

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
    const matchesTab =
      activeTab === 'today' ? isTaskForToday(task) :
      activeTab === 'complete' ? task.completed :
      true;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <PageContainer className="bg-gradient-to-b from-orange-50/30 to-white">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl text-orange-600 mb-1">Nhiệm vụ</h1>
        <p className="text-sm text-gray-500">Quản lý nhiệm vụ của bạn</p>
      </div>

      <div className="px-6 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhiệm vụ..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'today', 'complete'] as const).map(tab => {
            const tabLabels = {
              all: 'Tất cả',
              today: 'Hôm nay',
              complete: 'Hoàn thành',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-xl transition-all ${
                  activeTab === tab
                    ? 'bg-orange-400 text-white shadow-lg shadow-orange-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tabLabels[tab]}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 mb-6">
          {filteredTasks.length > 0 ? filteredTasks.map(task => (
            <button
              type="button"
              key={task.id}
              onClick={() => openEditTask(task)}
              className={`w-full text-left rounded-2xl p-4 ${priorityColors[task.priority]} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-3">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleTask(task.id);
                    }
                  }}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 opacity-60" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium mb-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 opacity-60" />
                        <p className="text-xs opacity-75">{task.dueDate}</p>
                      </div>
                    )}
                    {task.scheduleName && (
                      <span className="text-xs bg-white/50 px-2 py-0.5 rounded-lg opacity-75">
                        {task.scheduleName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-500">
              Không có nhiệm vụ phù hợp
            </div>
          )}
        </div>

        <div className="space-y-3 mb-20">
          <button
            onClick={openCreateTask}
            className="w-full mt-6 border-2 border-dashed border-orange-300 rounded-2xl py-4 px-6 flex items-center justify-center gap-2 text-orange-500 hover:bg-orange-50/50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Tạo nhiệm vụ mới</span>
          </button>
          <button
            onClick={handleAISuggestTasks}
            className="w-full mt-2 bg-yellow-100 hover:bg-yellow-200 rounded-xl p-4 flex items-center justify-center gap-2 text-yellow-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI gợi ý nhiệm vụ hôm nay</span>
          </button>
        </div>
      </div>

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
                <h2 className="text-xl text-gray-800">{editingTask ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ'}</h2>
                <p className="text-sm text-gray-500">Bấm lưu để cập nhật danh sách</p>
              </div>
              <button onClick={closeTaskModal} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tên nhiệm vụ</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="VD: Hoàn thành bài tập toán"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Ngày</label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="VD: Hôm nay hoặc 24 tháng 5"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Mức ưu tiên</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPriority(item)}
                      className={`py-2 rounded-xl text-sm transition-all ${
                        priority === item
                          ? `${priorityColors[item]} ring-2 ring-orange-300`
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {priorityLabels[item]}
                    </button>
                  ))}
                </div>
              </div>

              {editingTask && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSingleAISuggestion(!showSingleAISuggestion)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-100"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      Gợi ý thực hiện (AI)
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showSingleAISuggestion ? 'rotate-180' : ''}`} />
                  </button>
                  {showSingleAISuggestion && (
                    <div className="mt-2 p-4 rounded-xl bg-yellow-50/50 border border-yellow-100 space-y-3 text-sm">
                      <div>
                        <strong className="block text-yellow-900/80 mb-1">Thời gian thực hiện:</strong>
                        <p className="text-yellow-800">14:00 - 15:00 (Năng lượng ổn định)</p>
                      </div>
                      <div>
                        <strong className="block text-yellow-900/80 mb-1">Cách thực hiện:</strong>
                        <p className="text-yellow-800">Tập trung làm phần quan trọng nhất trước. Tránh mạng xã hội.</p>
                      </div>
                      <div>
                        <strong className="block text-yellow-900/80 mb-1">Lý do:</strong>
                        <p className="text-yellow-800">Thời gian buổi chiều thích hợp cho các việc cần sự tỉ mỉ.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {editingTask && (
                  <button
                    type="button"
                    onClick={deleteTask}
                    className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
