import { useEffect, useState } from 'react';
import { Award, Star, Zap, Target, Heart, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
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
  color: string;
  count: number;
  subAchievements: SubAchievement[];
}

const achievementGroups: AchievementGroup[] = [
  {
    id: '1',
    title: 'Bậc thầy học tập',
    description: 'Thành tựu phiên học',
    icon: Star,
    color: 'from-yellow-400 to-orange-400',
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
    color: 'from-purple-400 to-pink-400',
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
    color: 'from-pink-400 to-rose-400',
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
    color: 'from-blue-400 to-cyan-400',
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
    color: 'from-green-400 to-emerald-400',
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
  return (
    <PageContainer className="bg-gradient-to-b from-pink-50/30 to-white dark:from-pink-950/20 dark:to-[#1A1B1E]">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <h1 className="text-2xl text-pink-600 dark:text-pink-400 mb-1">Thành tựu</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Thành tựu và tiến trình của bạn</p>
      </div>

      <div className="px-6 py-6">
        {/* Stats Overview */}
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/20 dark:to-purple-950/20 dark:border dark:border-pink-800/30 rounded-3xl p-6 mb-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-800 dark:text-[#E9ECEF]">{totalAchievements}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tổng số thành tựu</p>
            </div>
          </div>
          <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tiếp tục phát huy! Bạn đang xây dựng thói quen năng suất lành mạnh.
            </p>
          </div>
        </div>

        {/* Achievement Groups */}
        <div className="space-y-4">
          {groupsWithAI.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedId === group.id;
            const completedCount = group.subAchievements.filter(sub => sub.completed).length;
            const totalCount = group.subAchievements.length;

            return (
              <div key={group.id} className="bg-white dark:bg-[#2C2E33] rounded-2xl shadow-sm border border-gray-100 dark:border-[#373A40] overflow-hidden transition-colors">
                {/* Main Achievement Header */}
                <button
                  onClick={() => toggleExpand(group.id)}
                  className="w-full p-5 hover:bg-gray-50 dark:hover:bg-[#373A40] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800 dark:text-[#E9ECEF]">
                          {group.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-lg font-medium">
                            {completedCount}/{totalCount}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {group.description}
                      </p>
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
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {group.subAchievements.map((subAchievement) => (
                          <motion.div
                            key={subAchievement.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-50 dark:bg-[#25262B] rounded-xl p-3 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-2 h-2 rounded-full ${subAchievement.completed ? 'bg-green-400' : 'bg-gray-300'}`} />
                                <p className={`text-sm ${subAchievement.completed ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {subAchievement.title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">{subAchievement.progress}%</span>
                                <p className="text-xs text-gray-400">{subAchievement.date}</p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subAchievement.progress}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`h-full rounded-full ${
                                  subAchievement.completed
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                                    : 'bg-gradient-to-r from-blue-400 to-purple-400'
                                }`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        <div className="mt-6 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-5 text-center transition-colors">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            🌟 Bạn làm thật tuyệt vời! Hãy tiếp tục tập trung vào năng suất lành mạnh.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
