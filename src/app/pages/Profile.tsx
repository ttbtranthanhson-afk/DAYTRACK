import { ChevronLeft, User, Briefcase, Heart, Target, Award, Calendar } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router';

interface UserData {
  name: string;
  email: string;
  age?: string;
  job?: string;
  habits?: string;
  goals?: string;
}

interface ProfileProps {
  userData: UserData;
  achievements: Array<{
    id: string;
    title: string;
    icon: any;
    color: string;
  }>;
}

export function Profile({ userData, achievements }: ProfileProps) {
  const navigate = useNavigate();

  return (
    <PageContainer className="bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/20 dark:to-[#1A1B1E]" showSettings={false}>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-800 dark:text-[#E9ECEF]">Hồ sơ</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Thông tin của bạn</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* User Avatar & Name */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-6 mb-6 text-center border border-transparent dark:border-blue-800/30 transition-colors">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl shadow-xl">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl text-gray-800 dark:text-[#E9ECEF] mb-1">{userData.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{userData.email}</p>
        </div>

        {/* Personal Information */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF]">Thông tin cá nhân</h3>

          {userData.age && (
            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tuổi</p>
                  <p className="text-gray-800 dark:text-[#E9ECEF]">{userData.age} tuổi</p>
                </div>
              </div>
            </div>
          )}

          {userData.job && (
            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-500 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nghề nghiệp</p>
                  <p className="text-gray-800 dark:text-[#E9ECEF]">{userData.job}</p>
                </div>
              </div>
            </div>
          )}

          {userData.habits && (
            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-pink-500 dark:text-pink-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Thói quen & Sở thích</p>
                  <p className="text-gray-800 dark:text-[#E9ECEF]">{userData.habits}</p>
                </div>
              </div>
            </div>
          )}

          {userData.goals && (
            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-orange-500 dark:text-orange-300" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mục tiêu với DayTrack</p>
                  <p className="text-gray-800 dark:text-[#E9ECEF]">{userData.goals}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF]">Thành tựu gần đây</h3>
            <button
              onClick={() => navigate('/achive')}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.slice(0, 4).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-[#E9ECEF]">
                    {achievement.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30 rounded-3xl p-6 border border-transparent dark:border-pink-800/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-[#2C2E33]/70 flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            </div>
            <div>
              <h2 className="text-2xl text-gray-800 dark:text-[#E9ECEF]">{achievements.length}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nhóm thành tựu</p>
            </div>
          </div>
          <div className="bg-white/40 dark:bg-[#2C2E33]/70 rounded-2xl p-4 border border-transparent dark:border-[#373A40]">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Tiếp tục xây dựng thói quen năng suất lành mạnh! Bạn đang đi đúng hướng.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
