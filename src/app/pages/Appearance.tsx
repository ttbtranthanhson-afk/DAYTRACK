import { useEffect, useState } from 'react';
import { ChevronLeft, Sun, Moon, Palette, Sparkles, Check, RotateCcw } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../contexts/ThemeContext';

const themes = [
  { id: 'light', name: 'Chế độ sáng', icon: Sun, gradient: 'from-blue-100 to-purple-100', page: 'from-pink-50/30 to-white' },
  { id: 'dark', name: 'Chế độ tối', icon: Moon, gradient: 'from-gray-700 to-gray-900', page: 'from-gray-900 to-gray-800' },
  { id: 'pastel', name: 'Pastel nhẹ nhàng', icon: Sparkles, gradient: 'from-pink-100 via-purple-100 to-blue-100', page: 'from-pink-50 via-purple-50 to-blue-50' },
  { id: 'auto', name: 'Tự động', icon: Palette, gradient: 'from-orange-100 to-pink-100', page: 'from-orange-50/40 to-white' },
];

const accentColors = [
  { id: 'blue', color: 'bg-blue-400', name: 'Xanh dương', hex: '#60a5fa' },
  { id: 'purple', color: 'bg-purple-400', name: 'Tím', hex: '#a78bfa' },
  { id: 'pink', color: 'bg-pink-400', name: 'Hồng', hex: '#f472b6' },
  { id: 'green', color: 'bg-green-400', name: 'Xanh lá', hex: '#4ade80' },
  { id: 'orange', color: 'bg-orange-400', name: 'Cam', hex: '#fb923c' },
];

const defaultAppearance = {
  selectedTheme: 'light',
  selectedColor: 'blue',
  fontSize: 16,
  cornerRadius: 16,
  compactMode: false,
};

export type AppearanceSettings = typeof defaultAppearance;

export const applyAppearanceSettings = (settings: AppearanceSettings) => {
  const accent = accentColors.find(color => color.id === settings.selectedColor) ?? accentColors[0];
  const root = document.documentElement;
  root.style.setProperty('--daytrack-accent', accent.hex);
  root.style.setProperty('--daytrack-radius', `${settings.cornerRadius}px`);
  root.style.setProperty('--daytrack-font-size', `${settings.fontSize}px`);
  root.style.fontSize = `${settings.fontSize}px`;
  root.dataset.daytrackCompact = String(settings.compactMode);
  // Theme (dark/light class) is handled by ThemeContext
};

export const loadAppearanceSettings = (): AppearanceSettings => {
  try {
    const saved = localStorage.getItem('daytrack_appearance_settings');
    return saved ? { ...defaultAppearance, ...JSON.parse(saved) } : defaultAppearance;
  } catch {
    return defaultAppearance;
  }
};

export function Appearance() {
  const navigate = useNavigate();
  const { theme: currentTheme, setTheme } = useTheme();
  const [settings, setSettings] = useState<AppearanceSettings>(defaultAppearance);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const loaded = loadAppearanceSettings();
    setSettings(loaded);
  }, []);

  // Sync selectedTheme in settings with ThemeContext
  useEffect(() => {
    setSettings(prev => ({ ...prev, selectedTheme: currentTheme }));
  }, [currentTheme]);

  useEffect(() => {
    applyAppearanceSettings(settings);
    localStorage.setItem('daytrack_appearance_settings', JSON.stringify(settings));
    setSavedMessage('Đã áp dụng giao diện');
    const timer = window.setTimeout(() => setSavedMessage(''), 1200);
    return () => window.clearTimeout(timer);
  }, [settings]);

  const updateSetting = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Also update ThemeContext when theme selection changes
    if (key === 'selectedTheme') {
      setTheme(value as Theme);
    }
  };

  const resetAppearance = () => {
    setSettings(defaultAppearance);
    setTheme('light');
  };

  const pageTheme = themes.find(theme => theme.id === settings.selectedTheme)?.page ?? themes[0].page;

  return (
    <PageContainer className="bg-gradient-to-b from-pink-50/30 to-white dark:from-[#1A1B1E] dark:to-[#1A1B1E]" showSettings={false}>
      <div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#373A40] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-800 dark:text-[#E9ECEF]">Giao diện</h1>
            <p className="text-sm text-gray-500 dark:text-[#ADB5BD]">Tùy chỉnh trải nghiệm của bạn</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF]">Chọn chủ đề</h3>
            <button
              onClick={resetAppearance}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#2C2E33] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#373A40] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.selectedTheme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => updateSetting('selectedTheme', theme.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border-2 transition-all ${
                    isSelected ? 'border-purple-400 dark:border-purple-500' : 'border-gray-100 dark:border-[#373A40]'
                  }`}
                >
                  <div className={`h-20 rounded-xl bg-gradient-to-br ${theme.gradient} mb-3 flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${theme.id === 'dark' ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-[#E9ECEF]">{theme.name}</p>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-purple-400 dark:bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Màu nhấn</h3>
          <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
            <div className="flex justify-around">
              {accentColors.map((color) => {
                const isSelected = settings.selectedColor === color.id;
                return (
                  <motion.button
                    key={color.id}
                    onClick={() => updateSetting('selectedColor', color.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div className={`w-14 h-14 rounded-full ${color.color} shadow-lg ${
                      isSelected ? 'ring-4 ring-offset-2 ring-gray-300' : ''
                    }`}>
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{color.name}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Font & giao diện</h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700 dark:text-gray-300">Kích thước chữ</span>
                <span className="text-sm text-purple-500 font-medium">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="20"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                className="w-full h-2 bg-purple-100 rounded-full appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                <span>Nhỏ</span>
                <span>Lớn</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700 dark:text-gray-300">Độ bo góc</span>
                <span className="text-sm text-pink-500 font-medium">{settings.cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.cornerRadius}
                onChange={(e) => updateSetting('cornerRadius', Number(e.target.value))}
                className="w-full h-2 bg-pink-100 rounded-full appearance-none cursor-pointer accent-pink-400"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
                <span>Vuông</span>
                <span>Tròn</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Tùy chọn bố cục</h3>
          <div className="bg-white dark:bg-[#2C2E33] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#373A40] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-[#E9ECEF]">Chế độ gọn</h4>
                <p className="text-xs text-gray-500 dark:text-[#868E96] mt-0.5">Giảm khoảng cách để có thêm nội dung</p>
              </div>
              <button
                onClick={() => updateSetting('compactMode', !settings.compactMode)}
                className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
                  settings.compactMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  animate={{ x: settings.compactMode ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 dark:text-[#E9ECEF] mb-4">Xem trước</h3>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 transition-colors">
            <div
              className={`bg-white dark:bg-[#2C2E33] shadow-sm ${settings.compactMode ? 'p-3 mb-2' : 'p-4 mb-3'} transition-colors`}
              style={{ borderRadius: `${settings.cornerRadius}px` }}
            >
              <h4 className="font-medium text-gray-800 dark:text-[#E9ECEF]" style={{ fontSize: `${settings.fontSize}px` }}>
                Văn bản mẫu
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Đây là cách ứng dụng của bạn sẽ trông như thế nào</p>
            </div>
            <div
              className="h-12 shadow-lg"
              style={{ borderRadius: `${settings.cornerRadius}px`, backgroundColor: accentColors.find(c => c.id === settings.selectedColor)?.hex }}
            />
          </div>
        </section>

        {savedMessage && <p className="text-center text-xs text-purple-500">{savedMessage}</p>}
      </div>
    </PageContainer>
  );
}
