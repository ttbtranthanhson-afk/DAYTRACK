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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center gap-4">
          <p className="text-gray-600">Có lỗi xảy ra khi tải trang.</p>
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
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { Timetable } from './pages/Timetable';
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

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '' });
  const [globalTasks, setGlobalTasks] = useState<Task[]>([]);

  useEffect(() => {
    applyAppearanceSettings(loadAppearanceSettings());

    const savedUserData = localStorage.getItem('daytrack_user_data');
    if (savedUserData) {
      const parsedUser = JSON.parse(savedUserData);
      setUserData(parsedUser);
      setIsLoggedIn(true);

      const userKey = (suffix: string) =>
        `daytrack_${suffix}_${parsedUser.email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      const savedTasks = localStorage.getItem(userKey('tasks'));
      if (savedTasks) setGlobalTasks(JSON.parse(savedTasks));
    }
  }, []);

  const getUserKey = (email: string, suffix: string) =>
    `daytrack_${suffix}_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem('daytrack_user_data', JSON.stringify(data));

    const savedTasks = localStorage.getItem(getUserKey(data.email, 'tasks'));
    setGlobalTasks(savedTasks ? JSON.parse(savedTasks) : []);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ name: '', email: '' });
    setGlobalTasks([]);
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

  const handleUpdateTasks = (tasks: Task[]) => {
    setGlobalTasks(tasks);
    localStorage.setItem(getUserKey(userData.email, 'tasks'), JSON.stringify(tasks));
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="size-full">
      <Routes>
        <Route path="/" element={<Navigate to="/timetable" replace />} />
        <Route path="/timetable" element={<Timetable onAddTasks={handleAddTasksFromSchedule} />} />
        <Route path="/calendar" element={<Calendar onAddTasks={handleAddTasksFromSchedule} />} />
        <Route path="/tasks" element={<Tasks tasks={globalTasks} onUpdateTasks={handleUpdateTasks} />} />
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
      {isLoggedIn && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </HashRouter>
    </ThemeProvider>
  );
}
