import { useState } from 'react';
import { Award, Calendar, CheckCircle, Flame, Heart, Star, Zap } from 'lucide-react';

export interface SubAchievement {
  id: string;
  title: string;
  progress: number;
  completed: boolean;
}

export interface AchievementGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  barColor: string;
  subAchievements: SubAchievement[];
}

export const achievementGroups: AchievementGroup[] = [
  {
    id: 'focus',
    title: 'Chuyên gia tập trung',
    description: 'Hoàn thành phiên tập trung',
    icon: Zap,
    barColor: 'bg-green-400',
    subAchievements: [
      { id: 'f1', title: 'Phiên đầu tiên', progress: 100, completed: true },
      { id: 'f2', title: '10 phiên tập trung', progress: 40, completed: false },
      { id: 'f3', title: 'Tổng 5 giờ tập trung', progress: 20, completed: false },
      { id: 'f4', title: 'Chuỗi 7 ngày liên tiếp', progress: 0, completed: false },
    ],
  },
  {
    id: 'tasks',
    title: 'Vua quản lý việc',
    description: 'Hoàn thành công việc hằng ngày',
    icon: CheckCircle,
    barColor: 'bg-orange-400',
    subAchievements: [
      { id: 't1', title: 'Hoàn thành 1 việc', progress: 100, completed: true },
      { id: 't2', title: 'Hoàn thành 50 việc', progress: 30, completed: false },
      { id: 't3', title: 'Hoàn thành tất cả việc trong ngày', progress: 0, completed: false },
    ],
  },
  {
    id: 'schedule',
    title: 'Bậc thầy lịch trình',
    description: 'Tạo và duy trì thời khóa biểu',
    icon: Calendar,
    barColor: 'bg-purple-400',
    subAchievements: [
      { id: 's1', title: 'Tạo lịch trình đầu tiên', progress: 100, completed: true },
      { id: 's2', title: '5 lịch trình trong tuần', progress: 60, completed: false },
      { id: 's3', title: 'Duy trì 30 ngày', progress: 10, completed: false },
    ],
  },
  {
    id: 'earlybird',
    title: 'Chim dậy sớm',
    description: 'Hoàn thành việc trước 9 giờ sáng',
    icon: Star,
    barColor: 'bg-yellow-400',
    subAchievements: [
      { id: 'e1', title: '1 lần dậy sớm', progress: 100, completed: true },
      { id: 'e2', title: '5 lần dậy sớm', progress: 0, completed: false },
      { id: 'e3', title: 'Tuần dậy sớm trọn vẹn', progress: 0, completed: false },
    ],
  },
  {
    id: 'habits',
    title: 'Xây dựng thói quen',
    description: 'Duy trì các thói quen tốt',
    icon: Heart,
    barColor: 'bg-pink-400',
    subAchievements: [
      { id: 'h1', title: '3 thói quen tích cực', progress: 100, completed: true },
      { id: 'h2', title: '10 thói quen tích cực', progress: 0, completed: false },
      { id: 'h3', title: 'Chuỗi 21 ngày', progress: 0, completed: false },
    ],
  },
  {
    id: 'streak',
    title: 'Ngọn lửa kiên trì',
    description: 'Giữ chuỗi hoạt động mỗi ngày',
    icon: Flame,
    barColor: 'bg-red-400',
    subAchievements: [
      { id: 'st1', title: 'Chuỗi 3 ngày', progress: 100, completed: true },
      { id: 'st2', title: 'Chuỗi 7 ngày', progress: 40, completed: false },
      { id: 'st3', title: 'Chuỗi 30 ngày', progress: 0, completed: false },
    ],
  },
];

export function useAchive() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalAchievements = achievementGroups.reduce(
    (sum, group) => sum + group.subAchievements.length,
    0
  );
  const completedTotal = achievementGroups.reduce(
    (sum, group) => sum + group.subAchievements.filter(s => s.completed).length,
    0
  );

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return {
    expandedId,
    totalAchievements,
    completedTotal,
    toggleExpand,
  };
}
