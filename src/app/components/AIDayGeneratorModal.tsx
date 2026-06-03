import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, AlertCircle, Loader2, Key } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { ScheduleBlock } from '../pages/Timetable';
import { generateDaySchedule, generateLocalScheduleSuggestions, type UserProfile } from '../utils/gemini';

interface AIDayGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayTitle: string; // Tên ngày, vd: "19 tháng 5, 2026"
  onComplete: (daySchedules: ScheduleBlock[]) => void;
  userData: UserProfile;
  existingDaySchedules: ScheduleBlock[];
}

export function AIDayGeneratorModal({ isOpen, onClose, dayTitle, onComplete, userData, existingDaySchedules }: AIDayGeneratorModalProps) {
  const navigate = useNavigate();
  const [daySelections, setDaySelections] = useState<Record<string, any>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generatedSchedules, setGeneratedSchedules] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = localStorage.getItem('gemini_api_key') || '';

  useEffect(() => {
    if (isOpen && apiKey && generatedSchedules.length === 0 && !isLoading && !error) {
      fetchSchedule();
    }
  }, [isOpen, apiKey]);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);
    const fallbackBlocks = generateLocalScheduleSuggestions(userData, dayTitle, existingDaySchedules);
    setGeneratedSchedules(fallbackBlocks);
    try {
      const blocks = await generateDaySchedule(
        apiKey,
        userData,
        dayTitle,
        { [dayTitle]: existingDaySchedules },
        existingDaySchedules
      );
      setGeneratedSchedules(blocks);
    } catch (err: any) {
      setGeneratedSchedules(fallbackBlocks);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (id: string, field: string, value: string) => {
    setDaySelections(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleConfirm = () => {
    const hasTimeChange = generatedSchedules.some(block => {
      const selectedTime = daySelections[block.id]?.time;
      return selectedTime && selectedTime !== block.time;
    });

    if (hasTimeChange && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    proceedToConfirm();
  };

  const proceedToConfirm = () => {
    setShowConfirmDialog(false);

    const finalizedBlocks = generatedSchedules.map(block => {
      const selections = daySelections[block.id] || {};
      const newTime = selections.time || block.time;
      const newNeed = selections.need || block.need;

      return {
        ...block,
        time: newTime,
        need: newNeed
      };
    });

    onComplete(finalizedBlocks);
    onClose();
    setDaySelections({});
    setGeneratedSchedules([]); // reset for next open
  };

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
            <h2 className="text-xl font-semibold text-gray-800">AI Lên Lịch</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
          {!apiKey ? (
            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 text-center">
              <Key className="w-12 h-12 text-yellow-500 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-yellow-800 mb-2">Chưa cài đặt API Key</h3>
              <p className="text-sm text-yellow-700 opacity-90 mb-6">
                Bạn cần nhập Gemini API Key trong phần Cài đặt để sử dụng tính năng Trợ lý AI.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/settings');
                }}
                className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-yellow-600 transition-colors"
              >
                Đến Cài đặt
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-yellow-900">{dayTitle}</h3>
              </div>

              {error ? (
                <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm border border-red-100 text-center">
                  {error}
                  <button 
                    onClick={fetchSchedule}
                    className="block mx-auto mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {isLoading
                      ? 'Đang hiển thị gợi ý nhanh trong lúc chờ Gemini tối ưu chi tiết hơn...'
                      : 'AI đã đọc lịch hiện có, tuổi tác, nghề nghiệp, sở thích và nhu cầu để đưa ra gợi ý tối ưu. AI không tạo lịch mới.'}
                  </p>
                  {isLoading && (
                    <div className="mb-4 bg-yellow-50 text-yellow-700 rounded-xl p-3 flex items-center gap-2 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật bằng Gemini...</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {generatedSchedules.map((block) => {
                      const selectedTime = daySelections[block.id]?.time || block.time;
                      const selectedNeed = daySelections[block.id]?.need || block.need || 'Giảm cân';
                      
                      const [startH] = block.time.split(':');
                      const h = parseInt(startH) || 8;
                      const timeOptions = [
                        block.time,
                        `${String(h).padStart(2, '0')}:30 - ${String(h+1).padStart(2, '0')}:30`,
                        `${String(h+1).padStart(2, '0')}:00 - ${String(h+2).padStart(2, '0')}:00`,
                      ];

                      return (
                        <div key={block.id} className={`${block.color} rounded-2xl p-5 shadow-sm border border-black/5`}>
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
                            <h4 className="font-semibold text-lg">{block.title}</h4>
                            <select 
                              value={selectedTime}
                              onChange={(e) => handleSelectionChange(block.id, 'time', e.target.value)}
                              className="text-sm font-semibold px-2 py-1 bg-white/70 rounded-md border-none outline-none focus:ring-2 focus:ring-yellow-300"
                            >
                              {Array.from(new Set(timeOptions)).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            {(!block.isTimeFixed || block.need) && (
                              <div className="bg-white/50 p-3 rounded-xl flex items-center justify-between">
                                <strong className="opacity-80">Nhu cầu/Mục tiêu:</strong>
                                <select 
                                  value={selectedNeed}
                                  onChange={(e) => handleSelectionChange(block.id, 'need', e.target.value)}
                                  className="text-sm px-2 py-1 bg-white rounded-md border-none outline-none focus:ring-2 focus:ring-yellow-300"
                                >
                                  <option value="Giảm cân">Giảm cân</option>
                                  <option value="Tăng cơ">Tăng cơ</option>
                                  <option value="Duy trì">Duy trì</option>
                                </select>
                              </div>
                            )}

                            {block.method && (
                              <div className="bg-white/50 p-3 rounded-xl">
                                <strong className="block mb-1 opacity-80">Phương pháp / Bài tập:</strong>
                                <p>{block.method}</p>
                              </div>
                            )}

                            {block.tasks && block.tasks.length > 0 && (
                              <div className="bg-white/50 p-3 rounded-xl">
                                <strong className="block mb-1 opacity-80">Gợi ý cách thực hiện:</strong>
                                <ul className="list-disc list-inside space-y-1">
                                  {block.tasks.map((task, idx) => (
                                    <li key={idx} className="opacity-90">{task}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {block.reason && (
                              <div className="bg-white/50 p-3 rounded-xl">
                                <strong className="block mb-1 opacity-80">Giải thích:</strong>
                                <p>{block.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {apiKey && !isLoading && !error && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <AnimatePresence>
              {showConfirmDialog && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-start gap-3 border border-yellow-200"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Xác nhận thay đổi thời gian?</h4>
                    <p className="text-xs opacity-90 mb-3">Bạn đã thay đổi thời gian của một số lịch. Bạn có chắc chắn muốn áp dụng thay đổi này không?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowConfirmDialog(false)}
                        className="text-xs px-3 py-1.5 bg-yellow-100 rounded hover:bg-yellow-200 font-medium transition-colors"
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        onClick={proceedToConfirm}
                        className="text-xs px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium transition-colors shadow-sm"
                      >
                        Đồng ý
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showConfirmDialog && (
              <button
                onClick={handleConfirm}
                className="w-full bg-blue-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-300/50 hover:bg-blue-700 transition-colors"
              >
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  Xác nhận
                </span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
