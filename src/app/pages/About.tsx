import { useState } from 'react';
import { ChevronLeft, Globe, MessageCircle, Mail, Instagram, FileText, Shield, ExternalLink, Send, X } from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { Logo } from '../components/Logo';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const team = [
  { name: 'Trần Thanh Sơn', role: 'Trưởng nhóm', avatar: 'S', color: 'from-blue-400 to-purple-400' },
  { name: 'Lương Hà Quân', role: 'Lập trình viên', avatar: 'Q', color: 'from-green-400 to-emerald-400' },
];

const social = [
  { icon: Globe, label: 'Website', value: 'daytrack.app', color: 'text-blue-500 bg-blue-50' },
  { icon: MessageCircle, label: 'Discord', value: 'Tham gia cộng đồng', color: 'text-purple-500 bg-purple-50' },
  { icon: Mail, label: 'Email', value: 'hello@daytrack.app', color: 'text-orange-500 bg-orange-50' },
  { icon: Instagram, label: 'Instagram', value: '@daytrack', color: 'text-pink-500 bg-pink-50' },
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
    placeholder: 'VD: thêm đồng bộ, sửa giao diện, tối ưu thông báo...',
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
    <PageContainer className="bg-gradient-to-b from-blue-50/30 to-white" showSettings={false}>
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-800">Giới thiệu</h1>
            <p className="text-sm text-gray-500">Về DayTrack</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex justify-center mb-6">
            <Logo size={120} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">DayTrack</h2>
          <p className="text-lg text-gray-600 italic">Xây dựng ngày hoàn hảo của bạn.</p>
        </motion.div>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin ứng dụng</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {[
              { label: 'Phiên bản', value: '1.0.0' },
              { label: 'Cập nhật gần nhất', value: '24/5/2026' },
              { label: 'Số bản dựng', value: '2026.05.002' },
            ].map((item) => (
              <div key={item.label} className="p-4 flex items-center justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span className="text-gray-800 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Đội ngũ</h3>
          <div className="grid grid-cols-2 gap-3">
            {team.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {member.avatar}
                </div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">{member.name}</h4>
                <p className="text-xs text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Mạng xã hội & liên hệ</h3>
          <div className="space-y-3">
            {social.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color.split(' ')[0]}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-800 font-medium">{item.value}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </motion.button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Pháp lý</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {[
              { icon: Shield, label: 'Chính sách bảo mật' },
              { icon: FileText, label: 'Điều khoản dịch vụ' },
              { icon: FileText, label: 'Giấy phép mã nguồn mở' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="flex-1 text-left text-gray-800">{item.label}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Hỗ trợ</h3>
          <motion.button
            onClick={() => setIsFeedbackOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white rounded-2xl p-5 shadow-xl shadow-purple-300/50 flex items-center justify-center gap-3"
          >
            <Send className="w-5 h-5" />
            <span className="font-medium">Gửi phản hồi</span>
          </motion.button>
          {submittedMessage && (
            <p className="text-center text-sm text-purple-500 mt-3">{submittedMessage}</p>
          )}
        </section>

        <div className="text-center py-6">
          <p className="text-xs text-gray-400">
            Được tạo ra cho những người muốn quản lý ngày hiệu quả hơn.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2026 DayTrack. Mọi quyền được bảo lưu.
          </p>
        </div>
      </div>

      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <div>
                <h2 className="text-xl text-gray-800">Khảo sát phản hồi</h2>
                <p className="text-sm text-gray-500">Chia sẻ trải nghiệm của bạn</p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-5">
              {feedbackQuestions.map(question => (
                <div key={question.id}>
                  <label className="block text-sm text-gray-700 mb-2">{question.label}</label>
                  {question.type === 'choice' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {question.options?.map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFeedback(prev => ({ ...prev, [question.id]: option }))}
                          className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                            feedback[question.id] === option
                              ? 'bg-purple-100 text-purple-700 border-purple-300'
                              : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
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
                      className="w-full min-h-24 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  Gửi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
}
