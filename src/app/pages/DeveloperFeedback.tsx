import { useEffect, useState } from 'react';
import { ChevronLeft, MessageSquare, User, Mail, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageContainer } from '../components/PageContainer';

interface FeedbackSubmission {
  helps_planning?: string;
  favorite?: string;
  dislike?: string;
  improvements?: string;
  createdAt?: string;
  userName?: string;
  userEmail?: string;
}

const formatDate = (date?: string) => {
  if (!date) return 'Không rõ thời gian';
  return new Date(date).toLocaleString('vi-VN');
};

export function DeveloperFeedback() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);

  const loadFeedbacks = () => {
    try {
      setFeedbacks(JSON.parse(localStorage.getItem('daytrack_feedback_submissions') ?? '[]').reverse());
    } catch {
      setFeedbacks([]);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <PageContainer className="bg-gradient-to-b from-slate-50 to-white" showSettings={false}>
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-800">Ý kiến phản hồi</h1>
            <p className="text-sm text-gray-500">Chế độ nhà phát triển</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-5 mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl text-gray-800">{feedbacks.length}</h2>
                <p className="text-sm text-gray-600">phản hồi đã gửi</p>
              </div>
            </div>
            <button
              onClick={loadFeedbacks}
              className="p-3 bg-white/70 rounded-xl text-gray-600 hover:bg-white transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-20">
          {feedbacks.length > 0 ? feedbacks.map((feedback, index) => (
            <div key={`${feedback.createdAt}-${index}`} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{feedback.userName || 'Người dùng chưa rõ tên'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{feedback.userEmail || 'Không có email'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(feedback.createdAt)}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-500 mb-1">App có giúp lập thời khóa biểu và làm task dễ hơn?</p>
                  <p className="text-gray-800">{feedback.helps_planning || 'Chưa trả lời'}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-600 mb-1">Điều thích khi dùng app</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.favorite || 'Chưa trả lời'}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs text-red-500 mb-1">Điều không thích</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.dislike || 'Chưa trả lời'}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-500 mb-1">Điều cần cải thiện</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.improvements || 'Chưa trả lời'}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Chưa có phản hồi nào từ người dùng.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
