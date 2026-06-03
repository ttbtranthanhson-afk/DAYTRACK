import React from 'react';
import { Play } from 'lucide-react';

interface ScheduleBlock {
  id: string;
  title: string;
  time: string;
  color: string;
  tasks?: string[];
  isTimeFixed?: boolean;
  understandHowTo?: boolean;
}

interface StartTimerButtonProps {
  selectedBlock: ScheduleBlock | null;
  activeBlock?: ScheduleBlock | null;
  onStart: (seconds: number, musicCategory: string) => void;
  onNoSelection: () => void;
}

export function parseBlockDuration(time: string): number {
  try {
    const parts = time.split(' - ');
    if (parts.length !== 2) return 0;

    const [start, end] = parts;
    const [startHour, startMinute] = start.trim().split(':').map(Number);
    const [endHour, endMinute] = end.trim().split(':').map(Number);

    if (
      Number.isNaN(startHour) || Number.isNaN(startMinute) ||
      Number.isNaN(endHour) || Number.isNaN(endMinute)
    ) {
      return 0;
    }

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;

    return durationMinutes > 0 ? durationMinutes * 60 : 0;
  } catch {
    return 0;
  }
}

export function getMusicCategory(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes('tập') ||
    lowerTitle.includes('thể dục') ||
    lowerTitle.includes('gym') ||
    lowerTitle.includes('thể thao')
  ) {
    return 'exercise';
  }

  if (
    lowerTitle.includes('ăn') ||
    lowerTitle.includes('bữa') ||
    lowerTitle.includes('sáng') ||
    lowerTitle.includes('trưa') ||
    lowerTitle.includes('tối')
  ) {
    return 'relax';
  }

  return 'study';
}

const StartTimerButton: React.FC<StartTimerButtonProps> = ({
  selectedBlock,
  activeBlock = null,
  onStart,
  onNoSelection,
}) => {
  const blockToStart = selectedBlock || activeBlock;
  const isCurrentSchedule = !!activeBlock && blockToStart?.id === activeBlock.id;

  const handleClick = () => {
    if (!blockToStart) {
      onNoSelection();
      return;
    }

    const seconds = parseBlockDuration(blockToStart.time);
    const musicCategory = getMusicCategory(blockToStart.title);

    if (seconds > 0) {
      onStart(seconds, musicCategory);
    } else {
      onNoSelection();
    }
  };

  const getButtonLabel = (): string => {
    if (!blockToStart) {
      return 'Bắt đầu đếm thời gian';
    }

    const seconds = parseBlockDuration(blockToStart.time);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `Bắt đầu: ${blockToStart.title} (${minutes} phút)`;
    }

    return `Bắt đầu: ${blockToStart.title}`;
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 shadow-md border ${
        isCurrentSchedule
          ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
          : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
      }`}
    >
      <Play className="w-5 h-5" />
      <span>{getButtonLabel()}</span>
    </button>
  );
};

export default StartTimerButton;
