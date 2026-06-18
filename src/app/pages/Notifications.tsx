import { useEffect, useState } from 'react';
import { ChevronLeft, Bell, Volume2, Moon, Clock, CheckCircle, BookOpen, Target, Send } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg px-6 py-6 border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Thông báo</h1>
            <p className="text-sm font-medium text-gray-400">Luôn được nhắc đúng lúc</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Hệ thống */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Hệ thống</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-gray-800">Quyền thông báo</h4>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{permissionLabel}</p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
              >
                Cấp quyền
              </button>
            </div>
            <button
              onClick={sendTestNotification}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <h4 className="font-semibold text-gray-800">Gửi thông báo thử</h4>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Kiểm tra xem hệ thống có hoạt động không</p>
              </div>
              <Send className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Cài đặt nhắc nhở */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Nhắc nhở</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            {reminders.map((reminder) => {
              const Icon = reminder.icon;
              return (
                <div key={reminder.id} className="p-4 border-b border-gray-50 last:border-none flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${reminder.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${reminder.color.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{reminder.title}</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{reminder.description}</p>
                  </div>
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                      reminder.enabled ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <motion.div
                      animate={{ x: reminder.enabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Âm thanh & rung */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Âm thanh & Rung</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            {[
              { key: 'sound' as const, icon: Volume2, title: 'Âm thanh thông báo', color: 'text-blue-500 bg-blue-50' },
              { key: 'vibrate' as const, icon: Bell, title: 'Rung', color: 'text-green-500 bg-green-50' },
              { key: 'silent' as const, icon: Moon, title: 'Chế độ im lặng', color: 'text-purple-500 bg-purple-50' },
            ].map((item) => {
              const Icon = item.icon;
              const isEnabled = soundSettings[item.key];
              return (
                <div key={item.key} className="p-4 border-b border-gray-50 last:border-none flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color.split(' ')[0]}`} />
                  </div>
                  <span className="flex-1 font-semibold text-gray-800">{item.title}</span>
                  <button
                    onClick={() => toggleSound(item.key)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                      isEnabled ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isEnabled ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tóm tắt lịch trình */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Tóm tắt lịch trình</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            {[
              { key: 'morning' as const, title: 'Nhắc buổi sáng', description: 'Xem trước lịch hằng ngày', color: 'orange' },
              { key: 'summary' as const, title: 'Giờ tổng kết ngày', description: 'Tóm tắt cuối ngày', color: 'pink' },
            ].map(item => (
              <div key={item.key} className="p-4 border-b border-gray-50 last:border-none flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-pink-50 text-pink-500'} flex items-center justify-center flex-shrink-0`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{item.description}</p>
                </div>
                <input
                  type="time"
                  value={scheduleTimes[item.key]}
                  onChange={(event) => setScheduleTimes(prev => ({ ...prev, [item.key]: event.target.value }))}
                  className={`px-3 py-2 rounded-xl text-sm font-bold border-none outline-none ${
                    item.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-pink-50 text-pink-600'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {savedMessage && (
          <p className="text-center text-xs font-bold text-gray-400">{savedMessage}</p>
        )}
      </div>
    </div>
  );
}
