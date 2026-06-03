import { useState, useEffect } from 'react';
import { X, Clock, Plus, Tag, Trash2, Lock, Eye } from 'lucide-react';

interface ColorOption {
  bg: string;       // e.g. 'bg-blue-50'
  text: string;     // e.g. 'text-blue-600'
  swatch: string;   // e.g. 'bg-blue-100'
  border: string;   // e.g. 'border-blue-400'
}

const COLOR_OPTIONS: ColorOption[] = [
  { bg: 'bg-blue-50',   text: 'text-blue-600',   swatch: 'bg-blue-100',   border: 'border-blue-500'   },
  { bg: 'bg-purple-50', text: 'text-purple-600', swatch: 'bg-purple-100', border: 'border-purple-500' },
  { bg: 'bg-green-50',  text: 'text-green-600',  swatch: 'bg-green-100',  border: 'border-green-500'  },
  { bg: 'bg-orange-50', text: 'text-orange-600', swatch: 'bg-orange-100', border: 'border-orange-500' },
  { bg: 'bg-pink-50',   text: 'text-pink-600',   swatch: 'bg-pink-100',   border: 'border-pink-500'   },
  { bg: 'bg-yellow-50', text: 'text-yellow-600', swatch: 'bg-yellow-100', border: 'border-yellow-500' },
];

export interface ScheduleSaveData {
  name: string;
  tasks: string[];
  timeStart: string;
  timeEnd: string;
  color: string;
  isTimeFixed: boolean;
  understandHowTo: boolean;
}

interface EditInitialData {
  id: string;
  name: string;
  tasks: string[];
  timeStart: string;
  timeEnd: string;
  color: string;
  isTimeFixed: boolean;
  understandHowTo: boolean;
}

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduleSaveData) => void;
  day: string;
  editData?: EditInitialData | null;
}

export function CreateScheduleModal({ isOpen, onClose, onSave, day, editData }: CreateScheduleModalProps) {
  const isEditMode = !!editData;

  const getInitialColor = () => {
    if (editData?.color) {
      const found = COLOR_OPTIONS.find(c => `${c.bg} ${c.text}` === editData.color);
      return found ?? COLOR_OPTIONS[0];
    }
    return COLOR_OPTIONS[0];
  };

  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('10:00');
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);
  const [isTimeFixed, setIsTimeFixed] = useState(false);
  const [understandHowTo, setUnderstandHowTo] = useState(false);

  // Sync form when editData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setName(editData.name);
        setTasks(editData.tasks ?? []);
        setTimeStart(editData.timeStart);
        setTimeEnd(editData.timeEnd);
        setSelectedColor(getInitialColor());
        setIsTimeFixed(editData.isTimeFixed ?? false);
        setUnderstandHowTo(editData.understandHowTo ?? false);
      } else {
        setName('');
        setTasks([]);
        setCurrentTask('');
        setTimeStart('09:00');
        setTimeEnd('10:00');
        setSelectedColor(COLOR_OPTIONS[0]);
        setIsTimeFixed(false);
        setUnderstandHowTo(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData]);

  const handleAddTask = () => {
    if (currentTask.trim()) {
      setTasks([...tasks, currentTask.trim()]);
      setCurrentTask('');
    }
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      tasks,
      timeStart,
      timeEnd,
      color: `${selectedColor.bg} ${selectedColor.text}`,
      isTimeFixed,
      understandHowTo,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-xl text-gray-800">
              {isEditMode ? 'Chỉnh sửa lịch trình' : 'Tạo khối lịch trình'}
            </h2>
            <p className="text-sm text-gray-500">{day}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Tên <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Môn Toán"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                required
              />
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Tasks Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Nhiệm vụ</label>
            <div className="relative mb-3">
              <input
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
                placeholder="Nhập nhiệm vụ và nhấn +"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 transition-all"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-400 text-white rounded-xl flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {tasks.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-purple-50 rounded-xl p-3 group"
                  >
                    <span className="flex-1 text-sm text-gray-700">{task}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Thời gian bắt đầu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-300 transition-all"
                  required
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Thời gian kết thúc <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                  required
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm text-gray-600 mb-3">Màu chủ đề</label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((color, index) => {
                const isSelected = selectedColor.bg === color.bg;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-xl ${color.swatch} border-2 transition-all hover:scale-110 ${
                      isSelected
                        ? `${color.border} border-[3px] scale-110 shadow-md`
                        : 'border-transparent'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Fixed Time Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Cố định thời gian</span>
            </div>
            <button
              type="button"
              onClick={() => setIsTimeFixed(prev => !prev)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                isTimeFixed ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  isTimeFixed ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {isTimeFixed && (
            <p className="text-xs text-blue-500 -mt-3 pl-6">
              AI sẽ không đề xuất thay đổi thời gian của lịch này.
            </p>
          )}

          {/* Understand How-To Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">Hiểu rõ cách thực hiện</span>
            </div>
            <button type="button" onClick={() => setUnderstandHowTo(prev => !prev)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                understandHowTo ? 'bg-green-500' : 'bg-gray-200'
              }`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                understandHowTo ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {isEditMode ? 'Lưu' : 'Tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
