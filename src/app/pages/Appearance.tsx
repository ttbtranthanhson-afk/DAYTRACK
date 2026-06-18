import { useEffect, useState } from 'react';
import { ChevronLeft, Sun, Moon, Sparkles, Check, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../contexts/ThemeContext';
import { Logo } from '../components/Logo';

const themes = [
  { id: 'light', name: 'Chế độ sáng', icon: Sun },
  { id: 'dark', name: 'Chế độ tối', icon: Moon },
  { id: 'auto', name: 'Tự động', icon: Sparkles },
];

const accentColors = [
  { id: 'blue', color: 'bg-blue-400', name: 'Xanh dương', hex: '#60a5fa' },
  { id: 'purple', color: 'bg-purple-400', name: 'Tím', hex: '#c084fc' },
  { id: 'pink', color: 'bg-pink-400', name: 'Hồng', hex: '#f472b6' },
  { id: 'orange', color: 'bg-orange-400', name: 'Cam', hex: '#fb923c' },
  { id: 'green', color: 'bg-green-400', name: 'Xanh lá', hex: '#4ade80' },
];

const appIcons = [
  { id: 'default', color: 'bg-blue-500', name: 'Mặc định' },
  { id: 'dark', color: 'bg-gray-900', name: 'Tối giản' },
  { id: 'pastel', color: 'bg-purple-400', name: 'Mộng mơ' },
];

const defaultAppearance = {
  selectedTheme: 'light',
  selectedColor: 'blue',
  selectedAppIcon: 'default',
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
    if (key === 'selectedTheme') {
      setTheme(value as Theme);
    }
  };

  const resetAppearance = () => {
    setSettings(defaultAppearance);
    setTheme('light');
  };

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
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Giao diện</h1>
            <p className="text-sm font-medium text-gray-400">Tùy chỉnh trải nghiệm của bạn</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Chế độ hiển thị */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Chế độ hiển thị</h3>
            <button
              onClick={resetAppearance}
              className="p-1.5 rounded-xl bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 p-2 space-y-2">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => updateSetting('selectedTheme', theme.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 shadow-sm'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Màu chủ đạo */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Màu chủ đạo</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
            <div className="flex flex-wrap justify-between gap-2">
              {accentColors.map((color) => {
                const isSelected = settings.selectedColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => updateSetting('selectedColor', color.id)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-12 h-12 rounded-full ${color.color} flex items-center justify-center transition-all ${
                      isSelected ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' : 'hover:scale-105'
                    }`}>
                      {isSelected && <Check className="w-6 h-6 text-white" />}
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Biểu tượng ứng dụng */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Biểu tượng ứng dụng</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-5">
            <div className="grid grid-cols-3 gap-4">
              {appIcons.map((icon) => {
                const isSelected = settings.selectedAppIcon === icon.id;
                return (
                  <button
                    key={icon.id}
                    onClick={() => updateSetting('selectedAppIcon', icon.id)}
                    className={`flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl ${icon.color} flex items-center justify-center shadow-md relative`}>
                      <Logo size={32} className="text-white drop-shadow-md" />
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-600'}`}>
                      {icon.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Font & Bố cục */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Font & Bố cục</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Kích thước chữ</span>
                <span className="text-sm font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="20"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                <span>Nhỏ</span>
                <span>Lớn</span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Độ bo góc</span>
                <span className="text-sm font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">{settings.cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.cornerRadius}
                onChange={(e) => updateSetting('cornerRadius', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                <span>Vuông</span>
                <span>Tròn</span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Chế độ gọn</h4>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Giảm khoảng cách padding</p>
              </div>
              <button
                onClick={() => updateSetting('compactMode', !settings.compactMode)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  settings.compactMode ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  animate={{ x: settings.compactMode ? 20 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {savedMessage && <p className="text-center text-xs font-bold text-blue-500">{savedMessage}</p>}
      </div>
    </div>
  );
}
