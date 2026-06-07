import { useEffect, useState } from 'react';
import { ChevronLeft, Bell, Volume2, Moon, Clock, CheckCircle, BookOpen, Target, Send } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

interface NotificationSetting {
  id: string;
  icon: any;
  title: string;
  description: string;
  enabled: boolean;
  color: string;
}

const defaultReminders: NotificationSetting[] = [
  { id: 'study', icon: BookOpen, title: 'Nhắc học tập', description: 'Nhận thông báo trước phiên học', enabled: true, color: 'text-blue-500 bg-blue-50' },
  { id: 'task', icon: CheckCircle, title: 'Nhắc hạn nhiệm vụ', description: 'Cảnh báo hạn sắp đến', enabled: true, color: 'text-orange-500 bg-orange-50' },
  { id: 'focus', icon: Target, title: 'Nhắc phiên tập trung', description: 'Đến giờ bắt đầu phiên tập trung', enabled: false, color: 'text-green-500 bg-green-50' },
  { id: 'summary', icon: Bell, title: 'Nhắc tổng kết ngày', description: 'Tóm tắt buổi tối về ngày của bạn', enabled: true, color: 'text-purple-500 bg-purple-50' },
];

const defaultSoundSettings = {
  sound: true,
  vibrate: true,
  silent: false,
};

const defaultSchedule = {
  morning: '08:00',
  summary: '21:00',
};

export function Notifications() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<NotificationSetting[]>(defaultReminders);
  const [soundSettings, setSoundSettings] = useState(defaultSoundSettings);
  const [scheduleTimes, setScheduleTimes] = useState(defaultSchedule);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('daytrack_notification_settings');
      if (!saved) return;

      const parsed = JSON.parse(saved);
      // Chỉ restore enabled state theo id, không restore icon (icon không serialize được)
      if (parsed.reminders) {
        setReminders(defaultReminders.map(r => {
          const savedReminder = parsed.reminders.find((sr: any) => sr.id === r.id);
          return savedReminder ? { ...r, enabled: savedReminder.enabled } : r;
        }));
      }
      setSoundSettings(parsed.soundSettings ?? defaultSoundSettings);
      setScheduleTimes(parsed.scheduleTimes ?? defaultSchedule);
    } catch {
      localStorage.removeItem('daytrack_notification_settings');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('daytrack_notification_settings', JSON.stringify({
      // Chỉ lưu id + enabled, không lưu icon (function không serialize được)
      reminders: reminders.map(({ id, enabled }) => ({ id, enabled })),
      soundSettings,
      scheduleTimes,
    }));
    setSavedMessage('Đã lưu cài đặt thông báo');
    const timer = window.setTimeout(() => setSavedMessage(''), 1200);
    return () => window.clearTimeout(timer);
  }, [reminders, soundSettings, scheduleTimes]);

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
      new Notification('DayTrack', {
        body: 'Thông báo thử đã sẵn sàng. Bạn có thể dùng các nhắc nhở trong app.',
      });
    } else {
      alert('Bạn cần cho phép thông báo để dùng chức năng này.');
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
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

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Cài đặt nhắc nhở</h3>
          <div className="space-y-3">
            {reminders.map((reminder) => {
              const Icon = reminder.icon;
              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-all ${
                    reminder.enabled ? 'ring-2 ring-purple-200/50 dark:ring-purple-800/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${reminder.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${reminder.color.split(' ')[0]}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-[#E9ECEF]">{reminder.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{reminder.description}</p>
                    </div>
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                        reminder.enabled ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <motion.div
                        animate={{ x: reminder.enabled ? 20 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

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

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Tóm tắt lịch trình</h3>
          <div className="space-y-3">
            {[
              { key: 'morning' as const, title: 'Nhắc buổi sáng', description: 'Xem trước lịch hằng ngày', color: 'orange' },
              { key: 'summary' as const, title: 'Giờ tổng kết ngày', description: 'Tóm tắt cuối ngày', color: 'pink' },
            ].map(item => (
              <div key={item.key} className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-pink-50 dark:bg-pink-900/20'} flex items-center justify-center flex-shrink-0`}>
                    <Clock className={`w-6 h-6 ${item.color === 'orange' ? 'text-orange-500' : 'text-pink-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-[#E9ECEF]">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <input
                    type="time"
                    value={scheduleTimes[item.key]}
                    onChange={(event) => setScheduleTimes(prev => ({ ...prev, [item.key]: event.target.value }))}
                    className={`px-3 py-2 rounded-xl text-sm font-medium border-none outline-none dark:bg-[#373A40] dark:text-[#E9ECEF] ${
                      item.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-pink-50 text-pink-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {savedMessage && (
          <p className="text-center text-xs text-purple-500 dark:text-purple-400">{savedMessage}</p>
        )}
      </div>
    </PageContainer>
  );
}
