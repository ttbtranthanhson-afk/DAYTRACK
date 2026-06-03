import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface SpecialDayNoteProps {
  dateKey: string; // "YYYY-MM-DD"
  notes: Record<string, string>;
  onUpdate: (dateKey: string, content: string) => void;
}

export function SpecialDayNote({ dateKey, notes, onUpdate }: SpecialDayNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const currentNote = notes[dateKey] || '';

  // Nếu không có ghi chú và không đang chỉnh sửa, không render
  if (!currentNote && !isEditing) {
    return null;
  }

  const handleStartEdit = () => {
    setEditValue(currentNote);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    // Validate tối đa 100 ký tự
    const finalContent = trimmed.slice(0, 100);
    onUpdate(dateKey, finalContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Cắt bớt nếu vượt quá 100 ký tự
    if (value.length <= 100) {
      setEditValue(value);
    }
  };

  return (
    <div className="bg-blue-50 rounded-xl p-3 mb-4">
      {!isEditing ? (
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-blue-600 flex-1">{currentNote}</p>
          <button
            onClick={handleStartEdit}
            className="p-1 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
            aria-label="Chỉnh sửa ghi chú"
          >
            <Pencil className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú ngày đặc biệt (tối đa 100 ký tự)"
              className="flex-1 px-3 py-2 text-sm bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-600"
              autoFocus
              maxLength={100}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-500">
              {editValue.length}/100 ký tự
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                aria-label="Hủy"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleSave}
                className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                aria-label="Lưu"
              >
                <Check className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
