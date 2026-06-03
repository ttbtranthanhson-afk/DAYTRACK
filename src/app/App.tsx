import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { Timetable, type ScheduleBlock } from './pages/Timetable';
import { Calendar } from './pages/Calendar';
import { Tasks } from './pages/Tasks';
import { Focus } from './pages/Focus';
import { Achive } from './pages/Achive';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { Appearance, applyAppearanceSettings, loadAppearanceSettings } from './pages/Appearance';
import { About } from './pages/About';
import { DeveloperFeedback } from './pages/DeveloperFeedback';
import { achievementGroupsData } from './data/achievements';
import { generateAIAchievements } from './utils/aiAchievements';

interface UserData {
  name: string;
  email: string;
  age?: string;
  job?: string;
  habits?: string;
  goals?: string;
  isDeveloper?: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
  source?: string;
  scheduleName?: string;
  scheduleId?: string;
}

// Shared type for calendar schedules keyed by day-of-month (1-31)
export type CalendarSchedules = Record<number, ScheduleBlock[]>;

const initialWeeklySchedule: Record<string, ScheduleBlock[]> = {
  'Thứ Hai': [
    { id: '1', title: 'Toán học', time: '9:00 - 10:30', color: 'bg-blue-50 text-blue-600' },
    { id: '2', title: 'Vật lý', time: '11:00 - 12:30', color: 'bg-purple-50 text-purple-600' },
    { id: '3', title: 'Tự học', time: '14:00 - 16:00', color: 'bg-green-50 text-green-600' },
  ],
  'Thứ Ba': [
    { id: '4', title: 'Hóa học', time: '9:00 - 10:30', color: 'bg-orange-50 text-orange-600' },
    { id: '5', title: 'Tiếng Anh', time: '11:00 - 12:30', color: 'bg-pink-50 text-pink-600' },
  ],
};

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '' });
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<Record<string, ScheduleBlock[]>>(initialWeeklySchedule);
  const [calendarSchedules, setCalendarSchedules] = useState<CalendarSchedules>({});
  const [specialDayNotes, setSpecialDayNotes] = useState<Record<string, string>>({
    '2026-05-01': 'Quốc tế Lao động',
    '2026-05-15': 'Ngày Quốc tế Phụ nữ (Mô phỏng)',
    '2026-05-19': 'Ngày Quốc tế Thiếu nhi (Mô phỏng)',
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    applyAppearanceSettings(loadAppearanceSettings());

    const savedUserData = localStorage.getItem('daytrack_user_data');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsLoggedIn(true);
    }

    const savedTasks = localStorage.getItem('daytrack_tasks');
    if (savedTasks) {
      setGlobalTasks(JSON.parse(savedTasks));
    }

    const savedWeeklySchedules = localStorage.getItem('daytrack_weekly_schedules');
    if (savedWeeklySchedules) {
      setWeeklySchedules(JSON.parse(savedWeeklySchedules));
    }

    const savedCalendarSchedules = localStorage.getItem('daytrack_calendar_schedules');
    if (savedCalendarSchedules) {
      setCalendarSchedules(JSON.parse(savedCalendarSchedules));
    }

    const savedSpecialDayNotes = localStorage.getItem('daytrack_special_day_notes');
    if (savedSpecialDayNotes) {
      setSpecialDayNotes(JSON.parse(savedSpecialDayNotes));
    }
  }, []);

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem('daytrack_user_data', JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ name: '', email: '' });
    localStorage.removeItem('daytrack_user_data');
  };

  const handleAddTasksFromSchedule = (tasks: string[], scheduleName: string, day: string, understandHowTo?: boolean, scheduleId?: string) => {
    const taskScheduleId = scheduleId || `${day}-${scheduleName}`;
    const newTasks: Task[] = tasks.map(taskTitle => ({
      id: `${taskScheduleId}-${Date.now()}-${Math.random()}`,
      title: taskTitle,
      priority: 'medium',
      completed: false,
      dueDate: day,
      source: 'schedule',
      scheduleName: scheduleName,
      scheduleId: taskScheduleId,
    }));

    const updatedTasks = [
      ...globalTasks.filter(task => task.scheduleId !== taskScheduleId),
      ...newTasks,
    ];
    setGlobalTasks(updatedTasks);
    localStorage.setItem('daytrack_tasks', JSON.stringify(updatedTasks));
  };

  const handleUpdateWeeklySchedules = (schedules: Record<string, ScheduleBlock[]>) => {
    setWeeklySchedules(schedules);
    localStorage.setItem('daytrack_weekly_schedules', JSON.stringify(schedules));
  };

  const handleUpdateCalendarSchedules = (schedules: CalendarSchedules) => {
    setCalendarSchedules(schedules);
    localStorage.setItem('daytrack_calendar_schedules', JSON.stringify(schedules));
  };

  const handleUpdateSpecialDayNotes = (notes: Record<string, string>) => {
    setSpecialDayNotes(notes);
    localStorage.setItem('daytrack_special_day_notes', JSON.stringify(notes));
  };

  const handleNavigateToFocus = (initialSeconds: number, initialMusicCategory: string) => {
    navigate('/focus', { state: { initialSeconds, initialMusicCategory } });
  };

  const handleUpdateTasks = (tasks: Task[]) => {
    setGlobalTasks(tasks);
    localStorage.setItem('daytrack_tasks', JSON.stringify(tasks));
  };

  const handleGenerateAIAchievements = (context: Parameters<typeof generateAIAchievements>[0]) => {
    generateAIAchievements(context);
  };

  const handleApplyWeeklySchedule = (weeklySchedule: Record<string, ScheduleBlock[]>) => {
    // Generate dates for current month (May 2026 based on mock data)
    const newSchedules = { ...calendarSchedules };
    const dayMap = { 'Chủ Nhật': 0, 'Thứ Hai': 1, 'Thứ Ba': 2, 'Thứ Tư': 3, 'Thứ Năm': 4, 'Thứ Sáu': 5, 'Thứ Bảy': 6 };
    
    // Simplistic mapping: just map the current 31 days to weekdays based on 2026-05 (May 1st is Friday)
    // May 1 = Friday (5)
    for (let day = 1; day <= 31; day++) {
      const weekDayIndex = (day + 4) % 7; // May 1 is Friday (5). 1+4=5
      const weekDayStr = Object.keys(dayMap).find(k => (dayMap as any)[k] === weekDayIndex);
      if (weekDayStr && weeklySchedule[weekDayStr]) {
        newSchedules[day] = [...weeklySchedule[weekDayStr]];
      }
    }
    handleUpdateCalendarSchedules(newSchedules);
  };

  const showBottomNav = isLoggedIn;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="size-full">
      <Routes>
        <Route path="/" element={<Navigate to="/timetable" replace />} />
        <Route path="/timetable" element={<Timetable 
          weeklySchedules={weeklySchedules}
          onUpdateWeeklySchedules={handleUpdateWeeklySchedules}
          onAddTasks={handleAddTasksFromSchedule} 
          calendarSchedules={calendarSchedules}
          onApplyWeeklySchedule={handleApplyWeeklySchedule}
          specialDayNotes={specialDayNotes}
          onUpdateSpecialDayNote={(dateKey, content) => {
            const newNotes = { ...specialDayNotes, [dateKey]: content };
            handleUpdateSpecialDayNotes(newNotes);
          }}
          globalTasks={globalTasks}
          onUpdateTasks={handleUpdateTasks}
          onGenerateAchievements={handleGenerateAIAchievements}
          userData={userData}
        />} />
        <Route path="/calendar" element={<Calendar 
          onAddTasks={handleAddTasksFromSchedule} 
          calendarSchedules={calendarSchedules}
          onUpdateCalendarSchedules={handleUpdateCalendarSchedules}
          specialDayNotes={specialDayNotes}
          onGenerateAchievements={handleGenerateAIAchievements}
          userData={userData}
        />} />
        <Route path="/tasks" element={<Tasks tasks={globalTasks} onUpdateTasks={handleUpdateTasks} onGenerateAchievements={handleGenerateAIAchievements} />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/achive" element={<Achive />} />
        <Route path="/settings" element={<Settings userData={userData} onLogout={handleLogout} />} />
        <Route path="/profile" element={<Profile userData={userData} achievements={achievementGroupsData} />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/appearance" element={<Appearance />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/developer-feedback"
          element={userData.isDeveloper ? <DeveloperFeedback /> : <Navigate to="/settings" replace />}
        />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
