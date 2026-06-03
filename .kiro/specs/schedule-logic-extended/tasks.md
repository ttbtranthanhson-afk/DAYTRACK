# Implementation Plan: schedule-logic-extended

## Overview

Mở rộng logic lịch trình DayTrack theo 9 nhóm tính năng: toggle ẩn hướng dẫn how-to, vuốt lịch bằng cử chỉ, ghi chú ngày đặc biệt, luồng AI gợi ý lịch tuần, gợi ý AI theo 3 chủ đề, chỉnh sửa task inline, nút đếm thời gian chuyển sang Focus, Today Mode đọc dữ liệu từ Calendar, và layout chuẩn cho Today Mode. Ngôn ngữ: **TypeScript/React**.

---

## Tasks

- [x] 1. Mở rộng kiểu dữ liệu và global state trong App.tsx
  - [x] 1.1 Cập nhật interface `ScheduleBlock` và `ScheduleSaveData` thêm trường `understandHowTo: boolean`
    - Thêm `understandHowTo?: boolean` vào `ScheduleBlock` trong `Timetable.tsx`
    - Thêm `understandHowTo?: boolean` vào `DaySchedule` trong `Calendar.tsx`
    - Thêm `understandHowTo: boolean` vào `ScheduleSaveData` trong `CreateScheduleModal.tsx`
    - Định nghĩa type `CalendarSchedules = Record<number, ScheduleBlock[]>` và export từ file types hoặc trực tiếp trong `App.tsx`
    - _Requirements: 1.2, 8.1_

  - [x] 1.2 Thêm `calendarSchedules` và `specialDayNotes` vào global state của `App.tsx`
    - Thêm `const [calendarSchedules, setCalendarSchedules] = useState<CalendarSchedules>({})`
    - Thêm `const [specialDayNotes, setSpecialDayNotes] = useState<Record<string, string>>({})`
    - Truyền `calendarSchedules`, `onUpdateCalendarSchedules` xuống `Calendar` và `Timetable`
    - Truyền `specialDayNotes`, `onUpdateSpecialDayNotes` xuống `Timetable`
    - Cập nhật `handleAddTasksFromSchedule` để nhận và xử lý `understandHowTo`
    - Thêm navigation state `{ initialSeconds, initialMusicCategory }` khi điều hướng sang `/focus`
    - _Requirements: 8.1, 8.4, 8.5, 7.3, 7.4_

- [x] 2. Cập nhật `CreateScheduleModal.tsx` — Toggle "Hiểu rõ cách thực hiện"
  - [x] 2.1 Thêm state và UI toggle `understandHowTo` vào `CreateScheduleModal`
    - Thêm `const [understandHowTo, setUnderstandHowTo] = useState(false)`
    - Thêm toggle UI với icon `Eye` và nhãn "Hiểu rõ cách thực hiện" bên dưới toggle "Cố định thời gian"
    - Đồng bộ `understandHowTo` từ `editData` khi mở modal chỉnh sửa (trong `useEffect`)
    - Truyền `understandHowTo` trong `ScheduleSaveData` khi submit
    - Cập nhật `EditInitialData` interface để bao gồm `understandHowTo: boolean`
    - _Requirements: 1.1, 1.2, 1.6_

  - [ ]* 2.2 Viết property test cho Toggle_HieuRo round-trip (Property 1)
    - **Property 1: Toggle_HieuRo round-trip**
    - Với bất kỳ giá trị `understandHowTo` nào, khi lưu rồi mở lại modal chỉnh sửa, giá trị phải được khôi phục đúng
    - **Validates: Requirements 1.2, 1.6**

- [x] 3. Cập nhật `AIScheduleSuggestion.tsx` — Hỗ trợ `understandHowTo` và 3 chủ đề
  - [x] 3.1 Thêm prop `understandHowTo` và tách `HowToContent` thành phần có thể ẩn/hiện
    - Thêm `understandHowTo?: boolean` vào `AIScheduleSuggestionProps`
    - Tách phần danh sách thức ăn/bài tập/phương pháp và Info box thành `HowToContent` riêng
    - Khi `understandHowTo = true`: ẩn `HowToContent`, chỉ giữ tiêu đề chủ đề + mục tiêu
    - Khi `understandHowTo = false` hoặc undefined: hiển thị đầy đủ như hiện tại
    - _Requirements: 1.3, 1.4, 1.5, 5.4_

  - [ ]* 3.2 Viết property test cho ẩn/hiện HowToContent (Property 2)
    - **Property 2: Ẩn/hiện HowToContent theo understandHowTo**
    - Với bất kỳ ScheduleBlock và chủ đề nào, khi `understandHowTo=true` thì HowToContent không được render; khi `false` thì phải render đầy đủ
    - **Validates: Requirements 1.3, 1.4, 1.5, 5.4**

  - [ ]* 3.3 Viết property test cho phân loại chủ đề (Property 7)
    - **Property 7: AITopicSuggestion phân loại chủ đề đúng**
    - Với bất kỳ tên ScheduleBlock nào chứa từ khóa ăn uống/thể dục/học tập, hàm `getCategory` phải trả về đúng chủ đề
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.6**

  - [ ]* 3.4 Viết property test cho isTimeFixed ẩn thời gian gợi ý (Property 8)
    - **Property 8: isTimeFixed ẩn thời gian gợi ý**
    - Với bất kỳ ScheduleBlock nào có `isTimeFixed=true`, AIScheduleSuggestion không được render phần thời gian gợi ý
    - **Validates: Requirements 5.5**

- [x] 4. Tạo custom hook `useSwipeGesture.ts`
  - [x] 4.1 Tạo file `src/app/hooks/useSwipeGesture.ts` với logic vuốt ngang
    - Implement interface `SwipeGestureOptions { onSwipeLeft?, onSwipeRight?, threshold? }`
    - Lưu `touchStartX` khi `touchstart`, tính `deltaX` khi `touchend`
    - Gọi `onSwipeLeft()` khi `deltaX >= threshold` (mặc định 50px)
    - Gọi `onSwipeRight()` khi `deltaX <= -threshold`
    - Không gọi callback khi `|deltaX| < threshold`
    - _Requirements: 2.7_

  - [ ]* 4.2 Viết property test cho SwipeGesture ngưỡng kích hoạt (Property 3)
    - **Property 3: SwipeGesture chỉ kích hoạt khi vượt ngưỡng**
    - Với bất kỳ `deltaX` nào, callback chỉ được gọi khi `|deltaX| >= threshold`
    - **Validates: Requirements 2.7**

  - [ ]* 4.3 Viết property test cho SwipeGesture điều hướng đúng chiều (Property 4)
    - **Property 4: SwipeGesture điều hướng đúng chiều**
    - Với bất kỳ `currentDayIndex` trong [0..6], vuốt trái tăng index, vuốt phải giảm index (với boundary check)
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [x] 5. Checkpoint — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [x] 6. Tạo component `SpecialDayNote.tsx`
  - [x] 6.1 Tạo file `src/app/components/SpecialDayNote.tsx`
    - Implement props `{ dateKey, notes, onUpdate }`
    - Nếu `notes[dateKey]` tồn tại và không rỗng: hiển thị với `bg-blue-50 text-blue-600`
    - Nếu không có ghi chú: không render (return null)
    - Thêm nút chỉnh sửa nhỏ (icon Pencil) để mở inline input
    - Validate tối đa 100 ký tự khi nhập (cắt bớt hoặc từ chối nhập thêm)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 6.2 Viết property test cho SpecialDayNote validation độ dài (Property 5)
    - **Property 5: SpecialDayNote validation độ dài**
    - Với chuỗi > 100 ký tự, hệ thống phải từ chối hoặc cắt về đúng 100 ký tự; với chuỗi <= 100 ký tự, phải chấp nhận nguyên vẹn
    - **Validates: Requirements 3.4**

- [ ] 7. Tạo component `StartTimerButton.tsx`
  - [ ] 7.1 Tạo file `src/app/components/StartTimerButton.tsx` với hàm `parseBlockDuration` và `getMusicCategory`
    - Implement `parseBlockDuration(time: string): number` — parse "HH:MM - HH:MM" → số giây
    - Implement `getMusicCategory(title: string): string` — ánh xạ từ khóa → "exercise" | "relax" | "study"
    - Implement component với props `{ selectedBlock, onStart, onNoSelection }`
    - Nút màu `bg-green-500 text-white`; nhãn động theo `selectedBlock`
    - Khi nhấn và có block: gọi `onStart(seconds, musicCategory)`
    - Khi nhấn và không có block: gọi `onNoSelection()`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 7.2 Viết property test cho `parseBlockDuration` (Property 11)
    - **Property 11: parseBlockDuration tính đúng thời lượng**
    - Với bất kỳ chuỗi "HH:MM - HH:MM" hợp lệ, kết quả phải bằng hiệu phút × 60
    - **Validates: Requirements 7.3**

  - [ ]* 7.3 Viết property test cho `getMusicCategory` (Property 12)
    - **Property 12: getMusicCategory ánh xạ đúng chủ đề sang nhạc**
    - Với bất kỳ tên block nào, hàm phải trả về "exercise", "relax", hoặc "study" đúng theo từ khóa
    - **Validates: Requirements 7.4**

- [ ] 8. Tạo component `InlineTaskEditor.tsx`
  - [~] 8.1 Tạo file `src/app/components/InlineTaskEditor.tsx`
    - Implement props `{ tasks, onUpdateTasks, onSyncGlobalTasks }`
    - State nội bộ: `editingIndex`, `editValue`, `recentlySavedIndex`, `hasError`
    - Nhấn vào task → mở input với nội dung hiện tại
    - Enter: validate không rỗng/whitespace → lưu, đồng bộ, hiện nút "Gợi ý thực hiện" 3 giây
    - Escape: hủy, khôi phục nội dung ban đầu
    - Nội dung rỗng/whitespace: `hasError = true`, viền đỏ, không lưu
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 8.2 Viết property test cho InlineTaskEditor không lưu nội dung rỗng (Property 9)
    - **Property 9: InlineTaskEditor không lưu nội dung rỗng**
    - Với bất kỳ chuỗi whitespace hoặc rỗng, danh sách task không được thay đổi và phải hiển thị lỗi
    - **Validates: Requirements 6.7**

  - [ ]* 8.3 Viết property test cho InlineTaskEditor round-trip Escape (Property 10)
    - **Property 10: InlineTaskEditor round-trip Escape**
    - Với bất kỳ task và nội dung chỉnh sửa nào, nhấn Escape phải khôi phục đúng giá trị ban đầu
    - **Validates: Requirements 6.4**

- [ ] 9. Tạo component `AIWeeklyFlow.tsx`
  - [~] 9.1 Tạo file `src/app/components/AIWeeklyFlow.tsx` với mock data và luồng xác nhận từng ngày
    - Implement props `{ isOpen, onClose, onApplyWeek }`
    - State nội bộ: `currentDayIndex`, `confirmedDays`, `isComplete`
    - Định nghĩa `AI_WEEKLY_SUGGESTIONS` mock data cho 7 ngày
    - Hiển thị schedule box gợi ý cho `days[currentDayIndex]`
    - Nút "Xác nhận" (green-500): lưu vào `confirmedDays`, tăng index
    - Nút "Bỏ qua": tăng index, không lưu
    - Nút "Quay lại": giảm index, giữ nguyên `confirmedDays`
    - Sau ngày cuối: `isComplete = true`, hiển thị thông báo, gọi `onApplyWeek`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 9.2 Viết property test cho AIWeeklyFlow xác nhận không mất dữ liệu (Property 6)
    - **Property 6: AIWeeklyFlow xác nhận không mất dữ liệu**
    - Với bất kỳ tập hợp ngày đã xác nhận nào, khi nhấn "Quay lại", `confirmedDays` của các ngày trước phải giữ nguyên
    - **Validates: Requirements 4.6**

- [~] 10. Checkpoint — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [ ] 11. Cập nhật `Calendar.tsx` — Dùng `calendarSchedules` từ App
  - [~] 11.1 Refactor `Calendar.tsx` để nhận `calendarSchedules` và `onUpdateCalendarSchedules` từ props
    - Xóa `daySchedules` state cục bộ, thay bằng props `calendarSchedules` và `onUpdateCalendarSchedules`
    - Cập nhật `CalendarProps` interface: thêm `calendarSchedules`, `onUpdateCalendarSchedules`
    - Cập nhật `DaySchedule` interface để bao gồm `understandHowTo?: boolean`
    - Cập nhật `handleCreateSchedule` để gọi `onUpdateCalendarSchedules` thay vì `setDaySchedules`
    - Cập nhật `handleDeleteSchedule` tương tự
    - Truyền `understandHowTo` trong `ScheduleSaveData` khi save
    - _Requirements: 8.1, 8.4, 8.5_

- [ ] 12. Cập nhật `Focus.tsx` — Nhận `initialTime` và `initialMusic` từ navigation state
  - [~] 12.1 Đọc `location.state` và tự động khởi động timer + chọn nhạc
    - Import `useLocation` từ `react-router`
    - Đọc `initialSeconds` và `initialMusicCategory` từ `location.state`
    - Trong `useEffect`: nếu có `initialSeconds > 0`, set giờ/phút/giây, `setTotalTime`, `setCurrentTime`, `setIsRunning(true)`
    - Nếu có `initialMusicCategory`: gọi `setSelectedMusic(initialMusicCategory)`
    - _Requirements: 7.3, 7.4, 7.5_

- [ ] 13. Cập nhật `Timetable.tsx` — Tích hợp tất cả tính năng mới
  - [~] 13.1 Cập nhật props và tích hợp `useSwipeGesture` vào vùng nội dung lịch
    - Cập nhật `TimetableProps`: thêm `calendarSchedules`, `onUpdateCalendarSchedules`, `specialDayNotes`, `onUpdateSpecialDayNotes`
    - Import và tích hợp `useSwipeGesture` vào container nội dung (cả Timetable Mode và Today Mode)
    - Gắn `onTouchStart` và `onTouchEnd` vào div bao ngoài nội dung
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [~] 13.2 Cập nhật Today Mode để đọc dữ liệu từ `calendarSchedules`
    - Thêm `currentTodayDate` state (ngày thực tế theo hệ thống)
    - Today Mode đọc `calendarSchedules[todayDayNumber]` thay vì `scheduleData[currentDay]`
    - Sắp xếp ScheduleBlock theo thời gian bắt đầu tăng dần trước khi render
    - Hiển thị "Không có lịch hôm nay" khi không có block
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.3_

  - [~] 13.3 Tích hợp `StartTimerButton`, `SpecialDayNote`, `InlineTaskEditor` vào Today Mode
    - Thêm `selectedBlock` state để theo dõi block đang được chọn
    - Render `StartTimerButton` ở vị trí đầu tiên trong Today Mode layout (sticky)
    - Render `SpecialDayNote` ngay dưới tiêu đề ngày
    - Render `InlineTaskEditor` bên trong expanded ScheduleBlock
    - Khi nhấn `StartTimerButton.onStart`: navigate('/focus', { state: { initialSeconds, initialMusicCategory } })
    - Hiển thị tổng số task chưa hoàn thành ở cuối layout
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 3.1, 3.2, 3.3, 3.5, 6.1, 9.1, 9.2, 9.4, 9.5_

  - [~] 13.4 Tích hợp `AIWeeklyFlow` vào màn hình Tổng kết tuần
    - Thêm state `isAIWeeklyFlowOpen`
    - Kết nối nút "Trợ lý AI" trong Tổng kết tuần để mở `AIWeeklyFlow`
    - Implement `handleApplyWeek`: merge `confirmedDays` vào `calendarSchedules` qua `onUpdateCalendarSchedules`
    - _Requirements: 4.1, 4.4, 4.5_

  - [ ]* 13.5 Viết property test cho Today Mode sắp xếp ScheduleBlock theo thời gian (Property 13)
    - **Property 13: Today Mode sắp xếp ScheduleBlock theo thời gian tăng dần**
    - Với bất kỳ danh sách ScheduleBlock nào, Today Mode phải hiển thị theo thứ tự giờ bắt đầu tăng dần
    - **Validates: Requirements 8.2, 9.3**

  - [ ]* 13.6 Viết property test cho Today Mode đọc đúng dữ liệu Calendar (Property 14)
    - **Property 14: Today Mode đọc đúng dữ liệu Calendar**
    - Với bất kỳ `calendarSchedules` nào, Today Mode chỉ hiển thị block của ngày hiện tại
    - **Validates: Requirements 8.1, 8.5**

  - [ ]* 13.7 Viết property test cho đếm task chưa hoàn thành (Property 15)
    - **Property 15: Đếm task chưa hoàn thành chính xác**
    - Với bất kỳ danh sách task nào, số hiển thị phải bằng đúng số task có `completed = false`
    - **Validates: Requirements 9.5**

- [~] 14. Checkpoint cuối — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

---

## Notes

- Tasks đánh dấu `*` là tùy chọn và có thể bỏ qua để triển khai MVP nhanh hơn
- Mỗi task tham chiếu yêu cầu cụ thể để đảm bảo traceability
- Các checkpoint đảm bảo kiểm tra tăng dần
- Property tests kiểm tra tính đúng đắn phổ quát (dùng fast-check)
- Unit tests kiểm tra các ví dụ cụ thể và edge case
- Thứ tự triển khai: kiểu dữ liệu → modal → AI suggestion → hook → components nhỏ → Calendar → Focus → Timetable (tích hợp cuối)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4", "4.2", "4.3", "6.1", "7.1"] },
    { "id": 4, "tasks": ["6.2", "7.2", "7.3", "8.1", "9.1"] },
    { "id": 5, "tasks": ["8.2", "8.3", "9.2", "11.1", "12.1"] },
    { "id": 6, "tasks": ["13.1"] },
    { "id": 7, "tasks": ["13.2", "13.3", "13.4"] },
    { "id": 8, "tasks": ["13.5", "13.6", "13.7"] }
  ]
}
```
