import { useEffect, useState } from 'react';
import { Award, Star, Zap, Target, Heart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loadAIAchievements, type GeneratedAchievementsByGroup } from '../utils/aiAchievements';

interface SubAchievement {
  id: string;
  title: string;
  date: string;
  progress: number;
  completed: boolean;
}

interface AchievementGroup {
  id: string;
  title: string;
  description: string;
  icon: any;
  barColor: string;
  count: number;
  subAchievements: SubAchievement[];
}

const achievementGroups: AchievementGroup[] = [
  {
    id: '1',
    title: 'Bậc thầy học tập',
    description: 'Thành tựu phiên học',
    icon: Star,
    barColor: 'bg-yellow-400',
    count: 12,
    subAchievements: [
      { id: '1-1', title: 'Hoàn thành 50 phiên học', date: '15/5/2026', progress: 100, completed: true },
      { id: '1-2', title: 'Học 7 ngày liên tiếp', date: '12/5/2026', progress: 100, completed: true },
      { id: '1-3', title: 'Tuần học đầu tiên 10 tiếng', date: '8/5/2026', progress: 80, completed: false },
      { id: '1-4', title: 'Hoàn thành thói quen học buổi sáng', date: '5/5/2026', progress: 45, completed: false },
    ],
  },
  {
    id: '2',
    title: 'Nhà vô địch kiên trì',
    description: 'Thành tựu chuỗi và thói quen',
    icon: Zap,
    barColor: 'bg-purple-400',
    count: 8,
    subAchievements: [
      { id: '2-1', title: 'Chuỗi 30 ngày', date: '14/5/2026', progress: 100, completed: true },
      { id: '2-2', title: 'Chuỗi 14 ngày', date: '10/5/2026', progress: 100, completed: true },
      { id: '2-3', title: 'Chuỗi 7 ngày', date: '6/5/2026', progress: 100, completed: true },
      { id: '2-4', title: 'Không bỏ lỡ thứ Hai nào', date: '1/5/2026', progress: 60, completed: false },
    ],
  },
  {
    id: '3',
    title: 'Cuộc sống cân bằng',
    description: 'Thành tựu cân bằng công việc-cuộc sống',
    icon: Heart,
    barColor: 'bg-rose-400',
    count: 6,
    subAchievements: [
      { id: '3-1', title: 'Nghỉ giải lao mỗi 2 giờ', date: '13/5/2026', progress: 100, completed: true },
      { id: '3-2', title: 'Cân bằng học tập và tập luyện', date: '9/5/2026', progress: 70, completed: false },
      { id: '3-3', title: 'Duy trì lịch ngủ', date: '4/5/2026', progress: 50, completed: false },
    ],
  },
  {
    id: '4',
    title: 'Kẻ nghiền nát nhiệm vụ',
    description: 'Thành tựu hoàn thành nhiệm vụ',
    icon: Target,
    barColor: 'bg-blue-400',
    count: 15,
    subAchievements: [
      { id: '4-1', title: 'Hoàn thành 100 nhiệm vụ', date: '11/5/2026', progress: 100, completed: true },
      { id: '4-2', title: 'Xóa hết nhiệm vụ 5 ngày liên tiếp', date: '7/5/2026', progress: 100, completed: true },
      { id: '4-3', title: 'Không có nhiệm vụ quá hạn 1 tháng', date: '3/5/2026', progress: 90, completed: false },
      { id: '4-4', title: '10 nhiệm vụ đầu tiên hoàn thành', date: '28/4/2026', progress: 100, completed: true },
    ],
  },
  {
    id: '5',
    title: 'Bậc thầy tập trung',
    description: 'Thành tựu phiên tập trung',
    icon: TrendingUp,
    barColor: 'bg-green-400',
    count: 10,
    subAchievements: [
      { id: '5-1', title: '100 giờ làm việc tập trung', date: '16/5/2026', progress: 85, completed: false },
      { id: '5-2', title: '50 phiên tập trung hoàn thành', date: '10/5/2026', progress: 100, completed: true },
      { id: '5-3', title: 'Tập trung lâu nhất: 2 giờ', date: '5/5/2026', progress: 100, completed: true },
    ],
  },
];

export function Achive() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiAchievements, setAiAchievements] = useState<GeneratedAchievementsByGroup>({});

  useEffect(() => {
    const load = () => setAiAchievements(loadAIAchievements());
    load();
    window.addEventListener('daytrack_ai_achievements_updated', load);
    return () => window.removeEventListener('daytrack_ai_achievements_updated', load);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const groupsWithAI = achievementGroups.map(group => {
    const generated = aiAchievements[group.id] ?? [];
    return {
      ...group,
      count: group.count + generated.length,
      subAchievements: [...generated, ...group.subAchievements],
    };
  });

  const totalAchievements = groupsWithAI.reduce((sum, group) => sum + group.count, 0);
  const totalCompleted = groupsWithAI.reduce((sum, group) => sum + group.subAchievements.filter(s => s.completed).length, 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Thành tựu</h1>
          <p className="text-sm text-gray-400 font-medium">Bảng theo dõi thành tựu</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
          <Award className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{totalCompleted} / {totalAchievements}</h2>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Thành tựu đã mở khóa</p>
        </div>
      </div>

      {/* Achievement Groups */}
      <div className="px-5 space-y-0">
        {groupsWithAI.map((group) => {
          const Icon = group.icon;
          const isExpanded = expandedId === group.id;
          const completedCount = group.subAchievements.filter(sub => sub.completed).length;
          const totalCount = group.subAchievements.length;

          return (
            <div key={group.id}>
              {/* Group Header */}
              <button
                onClick={() => toggleExpand(group.id)}
                className="w-full flex items-stretch group cursor-pointer py-4 border-b border-gray-50 text-left"
              >
                <div className={`w-1 self-stretch rounded-full ${group.barColor} mr-4`} />
                <div className={`w-10 h-10 rounded-xl ${group.barColor} flex items-center justify-center mr-4 flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {group.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500">
                      {completedCount}/{totalCount}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Sub-achievements */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-[4.5rem] mt-2 mb-4 space-y-3 pr-2">
                      {group.subAchievements.map((subAchievement) => (
                        <div key={subAchievement.id} className="bg-gray-50 rounded-xl px-4 py-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${subAchievement.completed ? 'bg-green-400' : 'bg-gray-300'}`} />
                              <p className={`text-sm font-semibold ${subAchievement.completed ? 'text-gray-800' : 'text-gray-600'}`}>
                                {subAchievement.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400">{subAchievement.progress}%</span>
                            </div>
                          </div>

                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                subAchievement.completed ? 'bg-green-400' : group.barColor
                              }`}
                              style={{ width: `${subAchievement.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
