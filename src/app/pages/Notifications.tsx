import { useEffect, useState } from 'react';
import { ChevronLeft, Send, Volume2, Bell, Moon } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const defaultSoundSettings = {
  sound: true,
  vibrate: true,
  silent: false,
};

export function Notifications() {
  const navigate = useNavigate();
  const [soundSettings, setSoundSettings] = useState(defaultSoundSettings);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermissionStatus(Notification.permission);
    }
    try {
      const saved = localStorage.getItem('daytrack_notification_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.soundSettings) {
          setSoundSettings(parsed.soundSettings);
        }
      }
    } catch {
      localStorage.removeItem('daytrack_notification_settings');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('daytrack_notification_settings', JSON.stringify({
      soundSettings,
    }));
  }, [soundSettings]);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      setPermissionStatus('unsupported');
      return;
    }
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
  };

  const sendTestNotification = async () => {
    if (typeof Notification === 'undefined') {
      alert('Trình duyệt này chưa hỗ trợ thông báo.');
      return;
    }
    const permission = Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission;
    setPermissionStatus(permission);

    if (permission === 'granted') {
      new Notification('DayTrack – Thông báo thử ✅', {
        body: 'App sẽ nhắc bạn trước 5 phút khi lịch sắp bắt đầu!',
      });
    } else {
      alert('Bạn cần cho phép thông báo để dùng chức năng này.');
    }
  };

  const toggleSound = (key: keyof typeof defaultSoundSettings) => {
    setSoundSettings(prev => {
      if (key === 'silent') {
        return { ...prev, silent: !prev.silent, sound: prev.silent ? prev.sound : false, vibrate: prev.silent ? prev.vibrate : false };
      }
      return { ...prev, [key]: !prev[key], silent: false };
    });
  };

  const permissionLabel = {
    granted: 'Đã cho phép',
    denied: 'Đã chặn',
    default: 'Chưa cấp quyền',
    unsupported: 'Không hỗ trợ',
  }[permissionStatus] ?? 'Chưa cấp quyền';

  return (
    <PageContainer className="bg-gradient-to-b from-purple-50/30 to-white dark:from-purple-950/20 dark:to-[#1A1B1E]" showSettings={false}>
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-800 dark:text-[#E9ECEF]">Thông báo</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Luôn được nhắc đúng lúc</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quyền thông báo */}
        <section className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-[#E9ECEF]">Quyền thông báo</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{permissionLabel}</p>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              Cấp quyền
            </button>
          </div>
          <button
            onClick={sendTestNotification}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl p-3 flex items-center justify-center gap-2 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Gửi thông báo thử</span>
          </button>
        </section>

        {/* Âm thanh & rung */}
        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Âm thanh & rung</h3>
          <div className="bg-white dark:bg-[#2C2E33] rounded-2xl shadow-sm border border-gray-100 dark:border-[#373A40] divide-y divide-gray-100 dark:divide-[#373A40] transition-colors">
            {[
              { key: 'sound' as const, icon: Volume2, title: 'Âm thanh thông báo', color: 'text-blue-500 bg-blue-50' },
              { key: 'vibrate' as const, icon: Bell, title: 'Rung', color: 'text-green-500 bg-green-50' },
              { key: 'silent' as const, icon: Moon, title: 'Chế độ im lặng', color: 'text-purple-500 bg-purple-50' },
            ].map((item) => {
              const Icon = item.icon;
              const isEnabled = soundSettings[item.key];
              return (
                <div key={item.key} className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color.split(' ')[0]}`} />
                  </div>
                  <span className="flex-1 text-gray-800 dark:text-[#E9ECEF]">{item.title}</span>
                  <button
                    onClick={() => toggleSound(item.key)}
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                      isEnabled ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isEnabled ? 20 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
