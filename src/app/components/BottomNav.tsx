import { Calendar, CheckSquare, Clock, Award, CalendarDays, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { path: '/timetable', icon: CalendarDays, label: 'Lịch học' },
  { path: '/calendar', icon: Calendar, label: 'Lịch' },
  { path: '/tasks', icon: CheckSquare, label: 'Nhiệm vụ' },
  { path: '/focus', icon: Clock, label: 'Tập trung' },
  { path: '/achive', icon: Award, label: 'Thành tựu' },
  { path: '/settings', icon: Settings, label: 'Cài đặt' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50 flex justify-around items-center h-16 px-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path ||
          (location.pathname === '/' && item.path === '/timetable');
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <div className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive ? 'bg-gray-100 px-3 py-1.5 rounded-2xl' : ''}`}>
              <Icon
                className={`w-5 h-5 transition-all ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] transition-all ${
                  isActive ? 'text-gray-900 font-semibold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
