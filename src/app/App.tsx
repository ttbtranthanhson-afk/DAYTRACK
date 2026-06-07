import { useState, useEffect, Component, type ReactNode } from 'react';

// ErrorBoundary: bắt lỗi runtime để tránh màn hình trắng
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#1A1B1E] px-6 text-center gap-4">
          <p className="text-gray-600 dark:text-gray-300">Có lỗi xảy ra khi tải trang.</p>
          <p className="text-xs text-gray-400 break-all">{this.state.error}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: '' }); window.history.back(); }}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm"
          >
            Quay lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { ThemeProvider } from './contexts/ThemeContext';
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

// Shared type for calendar schedules keyed by date string (YYYY-MM-DD)
export type CalendarSchedules = Record<string, ScheduleBlock[]>;

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
  const [lockedDays, setLockedDays] = useState<Set<string>>(new Set<string>());
  const [specialDayNotes, setSpecialDayNotes] = useState<Record<string, string>>({});
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

  const getUserKey = (email: string, suffix: string) =>
    `daytrack_${suffix}_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem('daytrack_user_data', JSON.stringify(data));

    // Load per-user data
    const email = data.email;
    const savedTasks = localStorage.getItem(getUserKey(email, 'tasks'));
    if (savedTasks) setGlobalTasks(JSON.parse(savedTasks));
    else setGlobalTasks([]);

    const savedWeekly = localStorage.getItem(getUserKey(email, 'weekly_schedules'));
    if (savedWeekly) setWeeklySchedules(JSON.parse(savedWeekly));
    else setWeeklySchedules(initialWeeklySchedule);

    const savedCalendar = localStorage.getItem(getUserKey(email, 'calendar_schedules'));
    if (savedCalendar) setCalendarSchedules(JSON.parse(savedCalendar));
    else setCalendarSchedules({});

    const savedNotes = localStorage.getItem(getUserKey(email, 'special_day_notes'));
    if (savedNotes) setSpecialDayNotes(JSON.parse(savedNotes));
    else setSpecialDayNotes({});

    const savedLockedDays = localStorage.getItem(getUserKey(email, 'locked_days'));
    if (savedLockedDays) setLockedDays(new Set(JSON.parse(savedLockedDays)));
    else setLockedDays(new Set<string>());
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ name: '', email: '' });
    setGlobalTasks([]);
    setWeeklySchedules(initialWeeklySchedule);
    setCalendarSchedules({});
    setSpecialDayNotes({});
    setLockedDays(new Set());
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
    localStorage.setItem(getUserKey(userData.email, 'tasks'), JSON.stringify(updatedTasks));
  };

  const handleUpdateWeeklySchedules = (schedules: Record<string, ScheduleBlock[]>) => {
    setWeeklySchedules(schedules);
    localStorage.setItem(getUserKey(userData.email, 'weekly_schedules'), JSON.stringify(schedules));
  };

  const handleUpdateCalendarSchedules = (schedules: CalendarSchedules) => {
    setCalendarSchedules(schedules);
    localStorage.setItem(getUserKey(userData.email, 'calendar_schedules'), JSON.stringify(schedules));
  };

  const handleUpdateSpecialDayNotes = (notes: Record<string, string>) => {
    setSpecialDayNotes(notes);
    localStorage.setItem(getUserKey(userData.email, 'special_day_notes'), JSON.stringify(notes));
  };

  const handleUpdateLockedDays = (locked: Set<string>) => {
    setLockedDays(locked);
    localStorage.setItem(getUserKey(userData.email, 'locked_days'), JSON.stringify([...locked]));
  };

  const handleUpdateTasks = (tasks: Task[]) => {
    setGlobalTasks(tasks);
    localStorage.setItem(getUserKey(userData.email, 'tasks'), JSON.stringify(tasks));
  };

  const handleGenerateAIAchievements = (context: Parameters<typeof generateAIAchievements>[0]) => {
    generateAIAchievements(context);
  };

  const handleApplyWeeklySchedule = (weeklySchedule: Record<string, ScheduleBlock[]>) => {
    const newSchedules = { ...calendarSchedules };
    const dayMap: Record<string, number> = {
      'Chủ Nhật': 0, 'Thứ Hai': 1, 'Thứ Ba': 2, 'Thứ Tư': 3,
      'Thứ Năm': 4, 'Thứ Sáu': 5, 'Thứ Bảy': 6,
    };
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const numDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numDays; day++) {
      const date = new Date(year, month, day);
      const weekDayIndex = date.getDay();
      const weekDayStr = Object.keys(dayMap).find(k => dayMap[k] === weekDayIndex);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Skip locked days
      if (lockedDays.has(dateKey)) continue;

      if (weekDayStr && weeklySchedule[weekDayStr]) {
        newSchedules[dateKey] = [...weeklySchedule[weekDayStr]];
      }
    }
    handleUpdateCalendarSchedules(newSchedules);

    // Sync all tasks from the weekly schedule to globalTasks
    const newTasks: Task[] = [];
    Object.entries(weeklySchedule).forEach(([dayName, blocks]) => {
      blocks.forEach(block => {
        if (block.tasks && block.tasks.length > 0) {
          const taskScheduleId = block.id || `${dayName}-${block.title}`;
          block.tasks.forEach(taskTitle => {
            newTasks.push({
              id: `${taskScheduleId}-${Date.now()}-${Math.random()}`,
              title: taskTitle,
              priority: 'medium',
              completed: false,
              dueDate: dayName,
              source: 'schedule',
              scheduleName: block.title,
              scheduleId: taskScheduleId,
            });
          });
        }
      });
    });

    if (newTasks.length > 0) {
      const scheduleIdsToOverwrite = new Set(newTasks.map(t => t.scheduleId));
      const updatedTasks = [
        ...globalTasks.filter(task => !task.scheduleId || !scheduleIdsToOverwrite.has(task.scheduleId)),
        ...newTasks,
      ];
      setGlobalTasks(updatedTasks);
      localStorage.setItem(getUserKey(userData.email, 'tasks'), JSON.stringify(updatedTasks));
    }
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
          lockedDays={lockedDays}
          onUpdateLockedDays={handleUpdateLockedDays}
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
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
