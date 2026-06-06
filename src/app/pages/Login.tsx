import { useState } from 'react';
import { LogIn, Mail, Lock, User, Briefcase, Calendar, Target, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';

interface UserData {
  name: string;
  email: string;
  age?: string;
  job?: string;
  habits?: string;
  goals?: string;
  isDeveloper?: boolean;
}

interface RegisteredUser extends UserData {
  password: string;
  createdAt: string;
}

interface LoginProps {
  onLogin: (userData: UserData) => void;
}

const REGISTERED_USERS_KEY = 'daytrack_registered_users';

const developerAccounts = [
  { email: 'luonghaquan0106@gmail.com', password: 'NhaPhatTrien123', name: 'Lương Hà Quân' },
  { email: 'ttbtranthanhson@gmail.com', password: 'NhaPhatTrien123', name: 'Trần Thanh Sơn' },
];

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users: RegisteredUser[]) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export function Login({ onLogin }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [habits, setHabits] = useState('');
  const [goals, setGoals] = useState('');

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = normalizeEmail(loginEmail);
    const developer = developerAccounts.find(account => account.email === email);

    if (developer) {
      if (developer.password !== loginPassword) {
        setMessage({ type: 'error', text: 'Mật khẩu nhà phát triển không đúng.' });
        return;
      }
      onLogin({ name: developer.name, email: developer.email, isDeveloper: true, job: 'Nhà phát triển DayTrack' });
      return;
    }

    const user = getRegisteredUsers().find(account => normalizeEmail(account.email) === email);
    if (!user) {
      setMessage({ type: 'error', text: 'Tài khoản này chưa đăng ký. Vui lòng đăng ký trước khi đăng nhập.' });
      return;
    }

    if (user.password !== loginPassword) {
      setMessage({ type: 'error', text: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    const { password: _password, createdAt: _createdAt, ...userData } = user;
    onLogin(userData);
  };

  const handleSignupSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = normalizeEmail(signupEmail);
    const users = getRegisteredUsers();

    if (developerAccounts.some(account => account.email === email)) {
      setMessage({ type: 'error', text: 'Email này thuộc tài khoản nhà phát triển. Hãy đăng nhập bằng chế độ nhà phát triển.' });
      return;
    }

    if (users.some(user => normalizeEmail(user.email) === email)) {
      setMessage({ type: 'error', text: 'Email này đã được đăng ký. Hãy chuyển sang đăng nhập.' });
      return;
    }

    if (signupPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu cần có ít nhất 6 ký tự.' });
      return;
    }

    if (signupPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận chưa khớp.' });
      return;
    }

    const newUser: RegisteredUser = {
      name: signupName.trim(),
      email,
      password: signupPassword,
      age,
      job,
      habits,
      goals,
      createdAt: new Date().toISOString(),
    };

    saveRegisteredUsers([...users, newUser]);
    setMessage({ type: 'success', text: 'Đăng ký thành công. Bạn đã được đăng nhập.' });
    const { password: _password, createdAt: _createdAt, ...userData } = newUser;
    onLogin(userData);
  };

  const switchTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 flex items-center justify-center px-6 py-10 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size={100} />
          </div>
          <h1 className="text-3xl text-gray-800 dark:text-[#E9ECEF] mb-2">DayTrack</h1>
          <p className="text-sm text-gray-500 dark:text-[#ADB5BD]">Năng suất lành mạnh, không áp lực</p>
        </div>

        <div className="flex gap-2 mb-4 bg-white dark:bg-[#25262B] rounded-2xl p-1 shadow-sm transition-colors">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#373A40]'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => switchTab('signup')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#373A40]'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {message && (
          <div className={`mb-4 rounded-2xl p-3 flex items-start gap-2 text-sm ${
            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@cuaban.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-blue-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-purple-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#25262B] rounded-2xl p-3 text-xs text-gray-500 dark:text-[#868E96] border border-blue-100 dark:border-[#373A40] transition-colors">
              Tài khoản nhà phát triển có thể đăng nhập trực tiếp bằng email và mật khẩu được cấp.
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow-xl shadow-purple-300/50 hover:shadow-2xl transition-all mt-6 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Đăng nhập</span>
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Tên của bạn *</label>
              <div className="relative">
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-blue-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="email@cuaban.com"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-purple-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Mật khẩu *</label>
              <div className="relative">
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Tạo mật khẩu"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-pink-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Xác nhận mật khẩu *</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-pink-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-3">Chia sẻ về bản thân (tùy chọn)</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Tuổi</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Tuổi của bạn"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-blue-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Nghề nghiệp / Học tập</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      placeholder="VD: Sinh viên, Lập trình viên"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-purple-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all"
                    />
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Thói quen hiện tại</label>
                  <textarea
                    value={habits}
                    onChange={(e) => setHabits(e.target.value)}
                    placeholder="VD: Học buổi sáng, tập thể dục 3 lần/tuần"
                    className="w-full px-4 py-3 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-pink-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Mục tiêu với DayTrack</label>
                  <div className="relative">
                    <textarea
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="VD: Quản lý thời gian tốt hơn, giảm stress, cân bằng công việc và cuộc sống"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#2C2E33] rounded-2xl border border-gray-200 dark:border-[#373A40] outline-none focus:ring-2 focus:ring-orange-300 dark:text-[#E9ECEF] dark:placeholder:text-[#868E96] transition-all resize-none"
                      rows={3}
                    />
                    <Target className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow-xl shadow-purple-300/50 hover:shadow-2xl transition-all mt-6"
            >
              Tạo tài khoản
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Được tạo ra cho những người muốn quản lý ngày hiệu quả hơn
        </p>
      </div>
    </div>
  );
}
