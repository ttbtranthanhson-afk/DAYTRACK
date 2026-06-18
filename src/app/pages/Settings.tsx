import { useState, useEffect } from 'react';
import { ChevronRight, User, Bell, Palette, Info, LogOut, MessageSquareCode, Key, Eye, EyeOff } from 'lucide-react';
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

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const accountItems = [
    { icon: User, label: 'Hồ sơ', path: '/profile', color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const appItems = [
    { icon: Bell, label: 'Thông báo', path: '/notifications', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Palette, label: 'Giao diện', path: '/appearance', color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  const helpItems = [
    { icon: Info, label: 'Giới thiệu', path: '/about', color: 'text-green-500', bg: 'bg-green-50' },
    ...(userData.isDeveloper
      ? [{ icon: MessageSquareCode, label: 'Ý kiến phản hồi', path: '/developer-feedback', color: 'text-cyan-500', bg: 'bg-cyan-50' }]
      : []),
  ];

  const renderGroup = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{title}</h3>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg || 'bg-gray-50'} flex items-center justify-center mr-4`}>
                <Icon className={`w-5 h-5 ${item.color || 'text-gray-600'}`} />
              </div>
              <span className="flex-1 text-left font-semibold text-gray-800">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg px-6 py-6 border-b border-gray-100 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Cài đặt</h1>
        <p className="text-sm text-gray-400 font-medium">Quản lý tài khoản của bạn</p>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6 mt-6 px-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 font-bold text-2xl flex items-center justify-center flex-shrink-0">
          {userData.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
            {userData.isDeveloper && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">
                DEV
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">{userData.email}</p>
        </div>
      </div>

      <div className="px-6">
        {renderGroup('Tài khoản', accountItems)}
        
        {/* App Group including AI Key */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Ứng dụng</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 mb-4">
            {appItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors`}
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mr-4`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="flex-1 text-left font-semibold text-gray-800">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Key className="w-5 h-5 text-yellow-500" />
              </div>
              <h4 className="font-semibold text-gray-800">Cài đặt Trợ lý AI</h4>
            </div>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="Nhập Google Gemini API Key"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 text-gray-900 font-medium placeholder:text-gray-400 rounded-xl border border-transparent outline-none focus:border-yellow-400 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {renderGroup('Hỗ trợ', helpItems)}
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 mx-6 w-[calc(100%-3rem)] bg-rose-50 text-rose-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Đăng xuất</span>
      </button>

      <p className="text-center text-xs font-bold text-gray-300 mt-8 uppercase tracking-wider">
        DayTrack v1.0.0
      </p>
    </div>
  );
}
