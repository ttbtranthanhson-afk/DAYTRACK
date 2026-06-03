import React from 'react';
import { motion } from 'motion/react';
import { X, Check, Sparkles } from 'lucide-react';
import type { Task } from '../App';

interface AITaskSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function AITaskSuggestionModal({ isOpen, onClose, tasks }: AITaskSuggestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-yellow-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800">AI Gợi ý Nhiệm vụ</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
          <p className="text-sm text-gray-600 mb-6">
            Dưới đây là chi tiết cách thực hiện, thời gian và lý do cho từng nhiệm vụ hôm nay của bạn:
          </p>

          <div className="space-y-6">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">Không có nhiệm vụ nào hôm nay để gợi ý.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
                  <h4 className="font-semibold text-lg text-gray-800 mb-4 pb-3 border-b border-gray-100">
                    {task.title}
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                      <strong className="block mb-1 text-orange-800 opacity-90">Thời gian thực hiện:</strong>
                      <p className="text-orange-900/80">Nên hoàn thành vào buổi sáng (09:00 - 11:00) khi năng lượng cao nhất.</p>
                    </div>
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <strong className="block mb-1 text-blue-800 opacity-90">Cách thực hiện:</strong>
                      <p className="text-blue-900/80">Chia nhỏ "{task.title}" thành 3 bước nhỏ. Làm liên tục 25 phút, nghỉ 5 phút.</p>
                    </div>
                    <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                      <strong className="block mb-1 text-green-800 opacity-90">Lý do:</strong>
                      <p className="text-green-900/80">Việc chia nhỏ giúp giảm cảm giác choáng ngợp và duy trì động lực hoàn thành tốt hơn.</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-yellow-500 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30 hover:bg-yellow-600 transition-colors"
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Đã hiểu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
