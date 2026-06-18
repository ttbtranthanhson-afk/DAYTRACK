import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 pb-12">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-200">
            <Logo size={40} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">DayTrack</h1>
          <p className="text-gray-400 font-medium mt-2">Năng suất lành mạnh, không áp lực</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-2xl p-4 flex items-start gap-3 text-sm font-semibold ${message.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="w-full">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@cuaban.com"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <button type="button" className="text-sm font-semibold text-blue-500 text-right w-full block mb-6">
                Quên mật khẩu?
              </button>

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-colors mt-4"
              >
                Đăng nhập
              </button>

              <div className="text-center mt-8">
                <p className="text-sm font-semibold text-gray-500">
                  Chưa có tài khoản?{' '}
                  <button type="button" onClick={() => switchTab('signup')} className="text-blue-500 hover:underline">
                    Đăng ký
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="max-h-[65vh] overflow-y-auto pr-2 pb-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên của bạn *</label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="email@cuaban.com"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu *</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Tạo mật khẩu"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-4">Thông tin thêm (tùy chọn)</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tuổi</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Tuổi của bạn"
                      className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nghề nghiệp</label>
                    <input
                      type="text"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      placeholder="VD: Sinh viên, Lập trình viên"
                      className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Thói quen</label>
                    <textarea
                      value={habits}
                      onChange={(e) => setHabits(e.target.value)}
                      placeholder="VD: Học buổi sáng, chạy bộ..."
                      className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mục tiêu</label>
                    <textarea
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="VD: Quản lý thời gian, cân bằng..."
                      className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 font-semibold rounded-2xl border border-transparent outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-colors mt-8"
              >
                Tạo tài khoản
              </button>

              <div className="text-center mt-8">
                <p className="text-sm font-semibold text-gray-500">
                  Đã có tài khoản?{' '}
                  <button type="button" onClick={() => switchTab('login')} className="text-blue-500 hover:underline">
                    Đăng nhập
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
