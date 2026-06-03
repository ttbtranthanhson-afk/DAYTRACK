import { useState, useEffect } from 'react';
import { ChevronRight, User, Bell, Palette, Info, LogOut, Calendar, Briefcase, Target, MessageSquareCode, Key, Eye, EyeOff } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { LogoMini } from '../components/Logo';
import { useNavigate } from 'react-router';

interface UserData {
  name: string;
  email: string;
  age?: string;
  job?: string;
  habits?: string;
  goals?: string;
  isDeveloper?: boolean;
}

interface SettingsProps {
  userData: UserData;
  onLogout: () => void;
}

export function Settings({ userData, onLogout }: SettingsProps) {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const settingsItems = [
    { icon: User, label: 'Hồ sơ', color: 'text-blue-500', bg: 'bg-blue-50', path: '/profile' },
    { icon: Bell, label: 'Thông báo', color: 'text-purple-500', bg: 'bg-purple-50', path: '/notifications' },
    { icon: Palette, label: 'Giao diện', color: 'text-pink-500', bg: 'bg-pink-50', path: '/appearance' },
    { icon: Info, label: 'Giới thiệu', color: 'text-orange-500', bg: 'bg-orange-50', path: '/about' },
    ...(userData.isDeveloper
      ? [{ icon: MessageSquareCode, label: 'Ý kiến phản hồi', color: 'text-cyan-500', bg: 'bg-cyan-50', path: '/developer-feedback' }]
      : []),
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <PageContainer className="bg-gradient-to-b from-gray-50 to-white" showSettings={false}>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl text-gray-800 mb-1">Cài đặt</h1>
        <p className="text-sm text-gray-500">Quản lý tài khoản của bạn</p>
      </div>

      <div className="px-6 py-6">
        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <LogoMini size={64} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl text-gray-800">{userData.name}</h2>
                {userData.isDeveloper && (
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-lg">
                    Nhà phát triển
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{userData.email}</p>
            </div>
          </div>

          {/* User Info Details */}
          {(userData.age || userData.job || userData.goals) && (
            <div className="bg-white/60 rounded-2xl p-4 space-y-2">
              {userData.age && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Tuổi:</span>
                  <span className="text-gray-800">{userData.age} tuổi</span>
                </div>
              )}
              {userData.job && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Nghề nghiệp:</span>
                  <span className="text-gray-800">{userData.job}</span>
                </div>
              )}
              {userData.goals && (
                <div className="flex items-start gap-2 text-sm">
                  <Target className="w-4 h-4 text-pink-500 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-gray-600">Mục tiêu:</span>
                    <p className="text-gray-800 mt-1">{userData.goals}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Settings Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Key className="w-4 h-4 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">Cài đặt Trợ lý AI</h3>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-600">Google Gemini API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Nhập API Key của bạn..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-300 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              API Key được lưu cục bộ trên máy của bạn và chỉ dùng để gọi Gemini. Lấy key miễn phí tại Google AI Studio.
            </p>
          </div>
        </div>

        {/* Settings Items */}
        <div className="space-y-2 mb-6">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="flex-1 text-left text-gray-800">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-500 rounded-2xl p-4 flex items-center justify-center gap-3 hover:bg-red-100 transition-colors border border-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>

        {/* Version Info */}
        <p className="text-center text-xs text-gray-400 mt-8">
          DayTrack v1.0.0
        </p>
      </div>
    </PageContainer>
  );
}
