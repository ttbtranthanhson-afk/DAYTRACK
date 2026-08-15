import { useEffect, useRef, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  source?: string;
  scheduleName?: string;
  scheduleId?: string;
}

export const priorityConfig: Record<Task['priority'], { label: string; bar: string; badge: string }> = {
  high: { label: 'Ưu tiên cao', bar: 'bg-red-400', badge: 'bg-red-100 text-red-500' },
  medium: { label: 'Ưu tiên trung bình', bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-500' },
  low: { label: 'Ưu tiên thấp', bar: 'bg-blue-400', badge: 'bg-blue-100 text-blue-500' },
};

const priorityOrder: Task['priority'][] = ['high', 'medium', 'low'];

interface UseTasksOptions {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

const weekdayShorts = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const isToday = date.toDateString() === today.toDateString();
    return {
      date: String(date.getDate()),
      dayShort: weekdayShorts[date.getDay()],
      isToday,
    };
  });
}

const getTodayString = () => {
  const today = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return `${daysOfWeek[today.getDay()]}, ${today.getDate()} tháng ${today.getMonth() + 1}`;
};

export function useTasks({ tasks, onUpdateTasks }: UseTasksOptions) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'complete'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const inputRef = useRef<HTMLInputElement>(null);

  const todayStr = getTodayString();
  const weekDays = getWeekDays();

  useEffect(() => {
    if (showAddModal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showAddModal]);

  const toggleTask = (id: string) => {
    onUpdateTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: newTitle.trim(),
      priority: newPriority,
      completed: false,
      source: 'manual',
    };
    onUpdateTasks([...tasks, newTask]);
    setNewTitle('');
    setNewPriority('medium');
    setShowAddModal(false);
  };

  const visibleTasks = tasks.filter(t =>
    activeTab === 'all' ? true : activeTab === 'active' ? !t.completed : t.completed
  );

  const groupedByPriority = priorityOrder
    .map(priority => ({ priority, tasks: visibleTasks.filter(t => t.priority === priority) }))
    .filter(group => group.tasks.length > 0);

  return {
    activeTab,
    setActiveTab,
    showAddModal,
    setShowAddModal,
    newTitle,
    setNewTitle,
    newPriority,
    setNewPriority,
    inputRef,
    todayStr,
    weekDays,
    groupedByPriority,
    toggleTask,
    handleAddTask,
  };
}
