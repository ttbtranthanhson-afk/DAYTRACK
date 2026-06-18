import { useState } from 'react';
import { ChevronLeft, Globe, MessageCircle, Mail, Instagram, FileText, Shield, ExternalLink, Send, X, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Logo } from '../components/Logo';

const social = [
  { icon: Globe, label: 'Website', value: 'daytrack.app' },
  { icon: MessageCircle, label: 'Discord', value: 'Tham gia nhóm' },
  { icon: Mail, label: 'Email', value: 'hello@daytrack' },
  { icon: Instagram, label: 'Instagram', value: '@daytrack' },
];

const feedbackQuestions = [
  {
    id: 'helps_planning',
    label: 'APP có giúp bạn lập thời khóa biểu và thực hiện tasks dễ dàng hơn không?',
    type: 'choice',
    options: ['Có, rất nhiều', 'Có một phần', 'Chưa rõ', 'Chưa giúp được'],
  },
  {
    id: 'favorite',
    label: 'Bạn thích thú điều gì khi dùng app?',
    type: 'text',
    placeholder: 'VD: giao diện, AI gợi ý, bộ đếm tập trung...',
  },
  {
    id: 'dislike',
    label: 'Bạn không thích điều gì khi dùng app?',
    type: 'text',
    placeholder: 'Góp ý thẳng thắn giúp app tốt hơn',
  },
  {
    id: 'improvements',
    label: 'Bạn thấy app cần cải thiện những gì?',
    type: 'text',
    placeholder: 'VD: thêm đồng bộ, sửa giao diện...',
  },
];

export function About() {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, string>>({
    helps_planning: 'Có, rất nhiều',
    favorite: '',
    dislike: '',
    improvements: '',
  });
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleFeedbackSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const submissions = JSON.parse(localStorage.getItem('daytrack_feedback_submissions') ?? '[]');
    const currentUser = JSON.parse(localStorage.getItem('daytrack_user_data') ?? '{}');
    localStorage.setItem('daytrack_feedback_submissions', JSON.stringify([
      ...submissions,
      {
        ...feedback,
        userName: currentUser.name ?? 'Người dùng',
        userEmail: currentUser.email ?? 'Không có email',
        createdAt: new Date().toISOString(),
      },
    ]));
    setSubmittedMessage('Cảm ơn bạn đã gửi phản hồi!');
    setIsFeedbackOpen(false);
    window.setTimeout(() => setSubmittedMessage(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg px-6 py-6 border-b border-gray-100 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Giới thiệu</h1>
            <p className="text-sm font-medium text-gray-400">Về DayTrack</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* App Info Header */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Logo size={48} className="text-white drop-shadow-sm" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">DayTrack</h2>
          <p className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-3">v1.0.0</p>
          <p className="text-sm font-medium text-gray-400">Năng suất lành mạnh, không áp lực</p>
        </div>

        {/* Thông tin & Pháp lý */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Thông tin & Pháp lý</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            {[
              { icon: Shield, label: 'Chính sách bảo mật', iconColor: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: FileText, label: 'Điều khoản dịch vụ', iconColor: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Users, label: 'Đội ngũ phát triển', iconColor: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="w-full flex items-center p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${item.bg}`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <span className="flex-1 text-left font-semibold text-gray-800">{item.label}</span>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Cộng đồng</h3>
          <div className="grid grid-cols-2 gap-3">
            {social.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-50 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-800 text-center">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phản hồi */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Đóng góp</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center mr-4">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Gửi phản hồi</h4>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Giúp chúng tôi cải thiện DayTrack</p>
              </div>
              <Send className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {submittedMessage && (
            <p className="text-center text-sm font-bold text-green-500 mt-3">{submittedMessage}</p>
          )}
        </div>

        <div className="text-center pt-8 pb-4">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            © 2026 DayTrack. All rights reserved.
          </p>
        </div>
      </div>

      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:w-[28rem] rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Khảo sát phản hồi</h2>
                <p className="text-sm font-medium text-gray-500">Chia sẻ trải nghiệm của bạn</p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="p-6 overflow-y-auto space-y-5">
              {feedbackQuestions.map(question => (
                <div key={question.id}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{question.label}</label>
                  {question.type === 'choice' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {question.options?.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFeedback(prev => ({ ...prev, [question.id]: option }))}
                          className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors border-2 ${
                            feedback[question.id] === option
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={feedback[question.id] ?? ''}
                      onChange={(event) => setFeedback(prev => ({ ...prev, [question.id]: event.target.value }))}
                      placeholder={question.placeholder}
                      className="w-full min-h-[80px] px-4 py-3 bg-gray-50 text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal rounded-2xl border border-transparent outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none text-sm"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors mt-2"
              >
                Gửi phản hồi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
