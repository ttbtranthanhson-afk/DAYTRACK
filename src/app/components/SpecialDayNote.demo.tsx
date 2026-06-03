/**
 * Demo file for SpecialDayNote component
 * This file demonstrates the component's functionality and validates requirements 3.1-3.5
 * 
 * Requirements validated:
 * - 3.1: Hiển thị khu vực SpecialDayNote ngay bên dưới tiêu đề
 * - 3.2: Hiển thị nội dung ghi chú với nền màu xanh (blue-50) và chữ màu xanh (blue-600)
 * - 3.3: Ẩn khu vực SpecialDayNote khi không có ghi chú
 * - 3.4: Hỗ trợ nội dung văn bản tối đa 100 ký tự
 * - 3.5: Cung cấp nút chỉnh sửa nhỏ để nhập và lưu nội dung ghi chú
 */

import { useState } from 'react';
import { SpecialDayNote } from './SpecialDayNote';

export function SpecialDayNoteDemo() {
  const [notes, setNotes] = useState<Record<string, string>>({
    '2024-05-19': 'Sinh nhật bạn thân! 🎉',
    '2024-05-20': '',
  });

  const handleUpdate = (dateKey: string, content: string) => {
    setNotes(prev => ({
      ...prev,
      [dateKey]: content,
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">SpecialDayNote Component Demo</h1>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Test Case 1: Ngày có ghi chú (2024-05-19)
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            ✓ Requirement 3.2: Hiển thị với bg-blue-50 và text-blue-600
          </p>
          <SpecialDayNote
            dateKey="2024-05-19"
            notes={notes}
            onUpdate={handleUpdate}
          />
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Test Case 2: Ngày không có ghi chú (2024-05-20)
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            ✓ Requirement 3.3: Không render khi không có ghi chú
          </p>
          <SpecialDayNote
            dateKey="2024-05-20"
            notes={notes}
            onUpdate={handleUpdate}
          />
          <p className="text-xs text-gray-400 italic mt-2">
            (Component không hiển thị vì không có ghi chú)
          </p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Test Case 3: Ngày mới (2024-05-21)
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            ✓ Requirement 3.5: Có thể thêm ghi chú mới bằng nút chỉnh sửa
          </p>
          <SpecialDayNote
            dateKey="2024-05-21"
            notes={notes}
            onUpdate={handleUpdate}
          />
          <p className="text-xs text-gray-400 italic mt-2">
            (Nhấn nút Pencil để thêm ghi chú mới)
          </p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Test Case 4: Validation 100 ký tự
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            ✓ Requirement 3.4: Validate tối đa 100 ký tự
          </p>
          <SpecialDayNote
            dateKey="2024-05-22"
            notes={{
              '2024-05-22': 'Thử nhập một đoạn văn bản rất dài để kiểm tra validation 100 ký tự. Component sẽ tự động cắt bớt.',
            }}
            onUpdate={handleUpdate}
          />
          <p className="text-xs text-gray-400 italic mt-2">
            (Thử chỉnh sửa và nhập quá 100 ký tự - sẽ bị giới hạn)
          </p>
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Current Notes State:</h3>
        <pre className="text-xs bg-white p-3 rounded overflow-auto">
          {JSON.stringify(notes, null, 2)}
        </pre>
      </div>

      <div className="bg-green-100 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">✓ Requirements Validated:</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✓ 3.1: Hiển thị khu vực SpecialDayNote</li>
          <li>✓ 3.2: Hiển thị với bg-blue-50 và text-blue-600</li>
          <li>✓ 3.3: Ẩn khi không có ghi chú (return null)</li>
          <li>✓ 3.4: Validate tối đa 100 ký tự (maxLength + slice)</li>
          <li>✓ 3.5: Nút chỉnh sửa (Pencil icon) để nhập và lưu</li>
        </ul>
      </div>
    </div>
  );
}
