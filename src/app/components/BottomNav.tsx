import { Calendar, CheckSquare, Clock, Award, CalendarDays, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { path: '/timetable', icon: CalendarDays, label: 'Lịch học', color: 'text-blue-400' },
  { path: '/calendar', icon: Calendar, label: 'Lịch', color: 'text-purple-400' },
  { path: '/tasks', icon: CheckSquare, label: 'Nhiệm vụ', color: 'text-orange-400' },
  { path: '/focus', icon: Clock, label: 'Tập trung', color: 'text-green-400' },
  { path: '/achive', icon: Award, label: 'Thành tựu', color: 'text-pink-400' },
  { path: '/settings', icon: Settings, label: 'Cài đặt', color: 'text-gray-600' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (location.pathname === '/' && item.path === '/timetable');
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all"
              >
                <Icon
                  className={`w-5 h-5 transition-all ${
                    isActive ? item.color : 'text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] transition-all ${
                    isActive ? item.color : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
