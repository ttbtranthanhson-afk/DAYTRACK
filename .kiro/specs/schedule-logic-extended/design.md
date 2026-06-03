# Tài liệu Thiết kế: schedule-logic-extended

## Overview

Tính năng **schedule-logic-extended** mở rộng logic lịch trình của ứng dụng DayTrack (React + TypeScript + Vite + Tailwind CSS + Motion/React). Thiết kế tập trung vào 9 yêu cầu chính: toggle ẩn hướng dẫn how-to, vuốt lịch bằng cử chỉ, ghi chú ngày đặc biệt, luồng AI gợi ý lịch tuần, gợi ý AI theo 3 chủ đề, chỉnh sửa task inline, nút đếm thời gian chuyển sang Focus, Today Mode đọc dữ liệu từ Calendar, và layout chuẩn cho Today Mode.

Ngôn ngữ lập trình: **TypeScript/React**. Không có backend — toàn bộ state được quản lý qua React state và localStorage.

---

## Architecture

```
App.tsx (global state: globalTasks, calendarSchedules)
├── Timetable.tsx
│   ├── Today Mode (đọc calendarSchedules từ App)
│   │   ├── StartTimerButton (component mới)
│   │   ├── SpecialDayNote (component mới)
│   │   ├── ScheduleBlock (mở rộng)
│   │   │   ├── AIScheduleSuggestion (mở rộng: understandHowTo)
│   │   │   └── InlineTaskEditor (component mới)
│   │   └── AIWeeklyFlow (component mới)
│   └── Timetable Mode (giữ nguyên + thêm SwipeGesture)
├── Calendar.tsx (chia sẻ calendarSchedules với App)
└── Focus.tsx (mở rộng: nhận initialTime + initialMusic từ navigation state)
```

---

## Data Models

### Mở rộng ScheduleBlock / DaySchedule

```typescript
interface ScheduleBlock {
  id: string;
  title: string;
  time: string;           // "HH:MM - HH:MM"
  color: string;          // "bg-xxx-50 text-xxx-600"
  tasks?: string[];
  isTimeFixed?: boolean;
  understandHowTo?: boolean; // MỚI: toggle "Hiểu rõ cách thực hiện"
}
```

### Mở rộng ScheduleSaveData

```typescript
export interface ScheduleSaveData {
  name: string;
  tasks: string[];
  timeStart: string;
  timeEnd: string;
  color: string;
  isTimeFixed: boolean;
  understandHowTo: boolean; // MỚI
}
```

### SpecialDayNote

```typescript
interface SpecialDayNote {
  date: string;   // "YYYY-MM-DD"
  content: string; // tối đa 100 ký tự
}
```

### CalendarSchedules (global state trong App)

```typescript
// Dùng chung giữa Calendar và Today Mode
type CalendarSchedules = Record<number, ScheduleBlock[]>;
// key = ngày trong tháng (1-31)
```

### AIWeeklyFlowState

```typescript
interface AIWeeklyFlowState {
  currentDayIndex: number;       // 0-6 (Thứ Hai - Chủ Nhật)
  confirmedDays: Record<number, ScheduleBlock[]>; // ngày đã xác nhận
  isComplete: boolean;
}
```

---

## Components and Interfaces

### 1. App.tsx — Mở rộng global state

**Thay đổi:**
- Thêm `calendarSchedules: CalendarSchedules` vào global state (thay thế state cục bộ trong Calendar).
- Thêm `specialDayNotes: Record<string, string>` vào global state.
- Truyền `calendarSchedules` và `onUpdateCalendarSchedules` xuống cả `Calendar` và `Timetable`.
- Truyền `specialDayNotes` và `onUpdateSpecialDayNotes` xuống `Timetable`.
- Mở rộng `handleAddTasksFromSchedule` để nhận `understandHowTo`.
- Thêm navigation state khi chuyển sang `/focus`: `{ initialSeconds, initialMusicCategory }`.

```typescript
// Trong AppContent
const [calendarSchedules, setCalendarSchedules] = useState<CalendarSchedules>({});
const [specialDayNotes, setSpecialDayNotes] = useState<Record<string, string>>({});
```

---

### 2. CreateScheduleModal.tsx — Thêm Toggle_HieuRo

**Thay đổi:**
- Thêm state `understandHowTo: boolean` (mặc định `false`).
- Thêm toggle UI với nhãn "Hiểu rõ cách thực hiện" bên dưới toggle "Cố định thời gian".
- Đồng bộ `understandHowTo` từ `editData` khi mở modal chỉnh sửa.
- Truyền `understandHowTo` trong `ScheduleSaveData` khi submit.

```typescript
// Trong form, sau toggle isTimeFixed:
<div className="flex items-center justify-between py-1">
  <div className="flex items-center gap-2">
    <Eye className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-700">Hiểu rõ cách thực hiện</span>
  </div>
  <button type="button" onClick={() => setUnderstandHowTo(prev => !prev)}
    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
      understandHowTo ? 'bg-green-500' : 'bg-gray-200'
    }`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
      understandHowTo ? 'translate-x-6' : 'translate-x-0'
    }`} />
  </button>
</div>
```

---

### 3. AIScheduleSuggestion.tsx — Hỗ trợ understandHowTo

**Thay đổi:**
- Thêm prop `understandHowTo?: boolean`.
- Khi `understandHowTo = true`: ẩn HowToContent (danh sách thức ăn/bài tập/phương pháp, phần giải thích), chỉ giữ tiêu đề chủ đề và mục tiêu.
- Tách HowToContent thành phần riêng có thể ẩn/hiện.

```typescript
interface AIScheduleSuggestionProps {
  scheduleTitle: string;
  scheduleTime: string;
  isTimeFixed?: boolean;
  understandHowTo?: boolean; // MỚI
}
```

**Cấu trúc render mỗi chủ đề:**
```
[Tiêu đề chủ đề + icon]          ← luôn hiển thị
[Mục tiêu người dùng]             ← luôn hiển thị
[Thời gian gợi ý / cố định]       ← luôn hiển thị
--- HowToContent (ẩn khi understandHowTo=true) ---
[Danh sách thức ăn / bài tập / phương pháp]
[Phần giải thích (Info box)]
```

---

### 4. useSwipeGesture.ts — Custom hook mới

**Vị trí:** `src/app/hooks/useSwipeGesture.ts`

```typescript
interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // mặc định 50px
}

function useSwipeGesture(options: SwipeGestureOptions): {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}
```

**Logic:**
- Lưu `touchStartX` khi `touchstart`.
- Tính `deltaX = touchStartX - touchEndX` khi `touchend`.
- Nếu `deltaX > threshold` → `onSwipeLeft()`.
- Nếu `deltaX < -threshold` → `onSwipeRight()`.

---

### 5. Timetable.tsx — Tích hợp SwipeGesture + Today Mode mở rộng

**Thay đổi:**
- Tích hợp `useSwipeGesture` vào vùng nội dung lịch (cả Timetable Mode và Today Mode).
- Today Mode đọc `calendarSchedules[todayDayNumber]` thay vì `scheduleData[currentDay]`.
- Thêm `currentTodayDate` state để Today Mode có thể điều hướng qua lại ngày.
- Tích hợp `SpecialDayNote` component.
- Tích hợp `StartTimerButton` component.
- Tích hợp `InlineTaskEditor` trong expanded ScheduleBlock.
- Thêm nút "Trợ lý AI" mở `AIWeeklyFlow`.

**Props mới:**
```typescript
interface TimetableProps {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string) => void;
  calendarSchedules: CalendarSchedules;           // MỚI
  onUpdateCalendarSchedules: (s: CalendarSchedules) => void; // MỚI
  specialDayNotes: Record<string, string>;        // MỚI
  onUpdateSpecialDayNotes: (n: Record<string, string>) => void; // MỚI
}
```

---

### 6. Calendar.tsx — Dùng calendarSchedules từ App

**Thay đổi:**
- Nhận `calendarSchedules` và `onUpdateCalendarSchedules` từ App thay vì dùng state cục bộ.
- Xóa `daySchedules` state cục bộ, thay bằng props.

```typescript
interface CalendarProps {
  onAddTasks?: (tasks: string[], scheduleName: string, day: string) => void;
  calendarSchedules: CalendarSchedules;           // MỚI (thay daySchedules)
  onUpdateCalendarSchedules: (s: CalendarSchedules) => void; // MỚI
}
```

---

### 7. SpecialDayNote.tsx — Component mới

**Vị trí:** `src/app/components/SpecialDayNote.tsx`

```typescript
interface SpecialDayNoteProps {
  dateKey: string;           // "YYYY-MM-DD"
  notes: Record<string, string>;
  onUpdate: (dateKey: string, content: string) => void;
}
```

**Hành vi:**
- Nếu `notes[dateKey]` tồn tại và không rỗng: hiển thị nội dung với `bg-blue-50 text-blue-600`.
- Nếu không có ghi chú: ẩn khu vực (không render).
- Nút chỉnh sửa nhỏ (icon Pencil) bên cạnh để mở inline input.
- Validate tối đa 100 ký tự khi nhập.

---

### 8. StartTimerButton.tsx — Component mới

**Vị trí:** `src/app/components/StartTimerButton.tsx`

```typescript
interface StartTimerButtonProps {
  selectedBlock: ScheduleBlock | null;
  onStart: (seconds: number, musicCategory: string) => void;
  onNoSelection: () => void;
}
```

**Logic tính thời lượng:**
```typescript
function parseBlockDuration(time: string): number {
  // "HH:MM - HH:MM" → số giây
  const [start, end] = time.split(' - ');
  const [sh, sm] = start.trim().split(':').map(Number);
  const [eh, em] = end.trim().split(':').map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) * 60;
}
```

**Logic chọn nhạc theo chủ đề:**
```typescript
function getMusicCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('tập') || t.includes('thể dục') || t.includes('gym')) return 'exercise';
  if (t.includes('ăn') || t.includes('bữa')) return 'relax';
  return 'study';
}
```

**Hiển thị:**
- Nút màu `bg-green-500 text-white` ở đầu layout Today Mode.
- Khi có block được chọn: nhãn = "Bắt đầu: {tên block} ({thời lượng} phút)".
- Khi không có block: nhãn = "Bắt đầu đếm thời gian".

---

### 9. InlineTaskEditor.tsx — Component mới

**Vị trí:** `src/app/components/InlineTaskEditor.tsx`

```typescript
interface InlineTaskEditorProps {
  tasks: string[];
  onUpdateTasks: (tasks: string[]) => void;
  onSyncGlobalTasks: (tasks: string[]) => void;
}
```

**State nội bộ:**
```typescript
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editValue, setEditValue] = useState('');
const [recentlySavedIndex, setRecentlySavedIndex] = useState<number | null>(null);
const [hasError, setHasError] = useState(false);
```

**Hành vi:**
- Nhấn vào task → `editingIndex = index`, `editValue = task`.
- Enter: validate không rỗng → lưu, đồng bộ, hiện nút "Gợi ý thực hiện" 3 giây.
- Escape: hủy, khôi phục.
- Nội dung rỗng/whitespace: `hasError = true`, viền đỏ, không lưu.

---

### 10. AIWeeklyFlow.tsx — Component mới

**Vị trí:** `src/app/components/AIWeeklyFlow.tsx`

```typescript
interface AIWeeklyFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWeek: (weekSchedule: Record<string, ScheduleBlock[]>) => void;
}
```

**State nội bộ:**
```typescript
const [currentDayIndex, setCurrentDayIndex] = useState(0);
const [confirmedDays, setConfirmedDays] = useState<Record<number, ScheduleBlock[]>>({});
const [isComplete, setIsComplete] = useState(false);
```

**Dữ liệu gợi ý AI (mock):**
```typescript
const AI_WEEKLY_SUGGESTIONS: Record<string, ScheduleBlock[]> = {
  'Thứ Hai': [
    { id: 'ai-mon-1', title: 'Học tập buổi sáng', time: '08:00 - 10:00', color: 'bg-blue-50 text-blue-600' },
    { id: 'ai-mon-2', title: 'Bữa trưa', time: '12:00 - 13:00', color: 'bg-orange-50 text-orange-600' },
    { id: 'ai-mon-3', title: 'Thể dục', time: '17:00 - 18:00', color: 'bg-green-50 text-green-600' },
  ],
  // ... các ngày khác
};
```

**Luồng:**
1. Hiển thị schedule box gợi ý cho `days[currentDayIndex]`.
2. "Xác nhận" → lưu vào `confirmedDays[currentDayIndex]`, tăng index.
3. "Bỏ qua" → tăng index, không lưu.
4. "Quay lại" → giảm index, giữ `confirmedDays`.
5. Sau ngày cuối → `isComplete = true`, hiển thị thông báo, gọi `onApplyWeek`.

---

### 11. Focus.tsx — Nhận initialTime và initialMusic

**Thay đổi:**
- Đọc `location.state` từ React Router để nhận `initialSeconds` và `initialMusicCategory`.
- Nếu có `initialSeconds`: tự động set thời gian và bắt đầu đếm ngược.
- Nếu có `initialMusicCategory`: tự động chọn danh mục nhạc tương ứng.

```typescript
// Trong Focus.tsx
import { useLocation } from 'react-router';

const location = useLocation();
const { initialSeconds, initialMusicCategory } = (location.state ?? {}) as {
  initialSeconds?: number;
  initialMusicCategory?: string;
};

useEffect(() => {
  if (initialSeconds && initialSeconds > 0) {
    const h = Math.floor(initialSeconds / 3600);
    const m = Math.floor((initialSeconds % 3600) / 60);
    const s = initialSeconds % 60;
    setHours(h); setMinutes(m); setSeconds(s);
    setTotalTime(initialSeconds);
    setCurrentTime(initialSeconds);
    setIsRunning(true);
  }
  if (initialMusicCategory) {
    setSelectedMusic(initialMusicCategory);
  }
}, []);
```

---

## Luồng dữ liệu (Data Flow)

### Luồng chia sẻ CalendarSchedules

```
App.tsx
  calendarSchedules (state)
  ├── → Calendar.tsx (props: calendarSchedules, onUpdateCalendarSchedules)
  │     Người dùng thêm/xóa/sửa lịch → gọi onUpdateCalendarSchedules
  └── → Timetable.tsx (props: calendarSchedules)
        Today Mode đọc calendarSchedules[todayDay]
```

### Luồng StartTimerButton → Focus

```
Today Mode (Timetable.tsx)
  selectedBlock → StartTimerButton
  Nhấn nút → tính seconds + musicCategory
  → navigate('/focus', { state: { initialSeconds, initialMusicCategory } })
  → Focus.tsx đọc location.state → tự động start
```

### Luồng InlineTaskEditor → Global Sync

```
InlineTaskEditor
  Nhấn Enter với nội dung hợp lệ
  → cập nhật tasks trong ScheduleBlock (local)
  → gọi onUpdateCalendarSchedules (cập nhật Calendar)
  → gọi onSyncGlobalTasks (cập nhật globalTasks trong App)
```

### Luồng AIWeeklyFlow → Calendar

```
AIWeeklyFlow
  Người dùng xác nhận từng ngày
  → confirmedDays tích lũy
  Hoàn tất → gọi onApplyWeek(confirmedDays)
  → App.tsx merge vào calendarSchedules
  → Calendar.tsx tự động cập nhật
```

---

## Error Handling

| Tình huống | Xử lý |
|---|---|
| `parseBlockDuration` nhận chuỗi sai định dạng | Trả về 0, StartTimerButton không điều hướng |
| `InlineTaskEditor` nhận chuỗi rỗng/whitespace | Không lưu, hiển thị viền đỏ |
| `SpecialDayNote` vượt 100 ký tự | Cắt bớt tại 100 ký tự, không cho nhập thêm |
| `useSwipeGesture` delta < threshold | Không kích hoạt callback |
| `AIWeeklyFlow` không có gợi ý cho ngày | Hiển thị thông báo "Không có gợi ý" và cho phép bỏ qua |
| Today Mode không có CalendarSchedule | Hiển thị "Không có lịch hôm nay" |

---

## Testing Strategy

### Chiến lược kiểm thử tổng thể

**Unit tests (example-based):**
- Kiểm tra render UI cụ thể: toggle hiển thị đúng nhãn, StartTimerButton ở đúng vị trí, layout Today Mode đúng thứ tự.
- Kiểm tra edge case: không có ScheduleBlock, ghi chú rỗng, không có block được chọn khi nhấn StartTimerButton.
- Kiểm tra tích hợp giữa các component: InlineTaskEditor đồng bộ với globalTasks, AIWeeklyFlow áp vào Calendar.

**Property-based tests (dùng fast-check):**
- Mỗi property trong phần Correctness Properties bên dưới được implement thành property test với tối thiểu 100 iterations.
- Các pure function (`parseBlockDuration`, `getMusicCategory`, `getCategory`, `useSwipeGesture` logic) là ứng viên chính cho PBT.
- Các component logic (ẩn/hiện HowToContent, sắp xếp ScheduleBlock, đếm task) được test qua PBT với dữ liệu sinh ngẫu nhiên.

**Không dùng PBT cho:**
- Kiểm tra render UI thuần túy (dùng snapshot test hoặc example-based).
- Kiểm tra điều hướng React Router (dùng integration test).
- Kiểm tra localStorage persistence (dùng example-based với mock).

## Correctness Properties

*Một property là đặc tính hoặc hành vi phải đúng trong mọi lần thực thi hợp lệ của hệ thống — về cơ bản là một phát biểu hình thức về những gì hệ thống phải làm. Properties là cầu nối giữa đặc tả dạng văn bản và đảm bảo tính đúng đắn có thể kiểm chứng tự động.*

### Property 1: Toggle_HieuRo round-trip

*Với bất kỳ* giá trị `understandHowTo` nào (true hoặc false) được lưu vào một ScheduleBlock, khi mở lại CreateScheduleModal để chỉnh sửa ScheduleBlock đó, giá trị `understandHowTo` được khôi phục phải bằng đúng giá trị đã lưu.

**Validates: Requirements 1.2, 1.6**

---

### Property 2: Ẩn/hiện HowToContent theo understandHowTo

*Với bất kỳ* ScheduleBlock nào và bất kỳ chủ đề nào (Ăn uống / Học tập / Thể dục), khi `understandHowTo = true` thì AIScheduleSuggestion không được render HowToContent (danh sách thức ăn/bài tập/phương pháp và phần giải thích), nhưng vẫn phải render tiêu đề chủ đề và mục tiêu; khi `understandHowTo = false` thì HowToContent phải được render đầy đủ.

**Validates: Requirements 1.3, 1.4, 1.5, 5.4**

---

### Property 3: SwipeGesture chỉ kích hoạt khi vượt ngưỡng

*Với bất kỳ* khoảng cách vuốt ngang `deltaX` nào, `useSwipeGesture` chỉ gọi callback khi `|deltaX| >= threshold` (mặc định 50px); với `|deltaX| < threshold`, không có callback nào được gọi.

**Validates: Requirements 2.7**

---

### Property 4: SwipeGesture điều hướng đúng chiều

*Với bất kỳ* `currentDayIndex` nào trong khoảng [0..6], vuốt trái (deltaX >= 50) phải tăng index (hoặc chuyển sang Tổng kết tuần nếu index = 6), vuốt phải (deltaX <= -50) phải giảm index (hoặc không thay đổi nếu index = 0).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

---

### Property 5: SpecialDayNote validation độ dài

*Với bất kỳ* chuỗi ghi chú nào có độ dài > 100 ký tự, hệ thống phải từ chối hoặc cắt bớt về đúng 100 ký tự; với chuỗi có độ dài <= 100 ký tự, hệ thống phải chấp nhận và lưu nguyên vẹn.

**Validates: Requirements 3.4**

---

### Property 6: AIWeeklyFlow xác nhận không mất dữ liệu

*Với bất kỳ* tập hợp ngày đã xác nhận nào trong AIWeeklyFlow, khi người dùng nhấn "Quay lại" để xem lại ngày trước, dữ liệu `confirmedDays` của các ngày đã xác nhận trước đó phải được giữ nguyên không thay đổi.

**Validates: Requirements 4.6**

---

### Property 7: AITopicSuggestion phân loại chủ đề đúng

*Với bất kỳ* tên ScheduleBlock nào chứa từ khóa ăn uống (ăn, bữa, sáng, trưa, tối), AIScheduleSuggestion phải render gợi ý chủ đề Ăn uống; chứa từ khóa thể dục (tập, thể dục, gym, thể thao), phải render gợi ý chủ đề Thể dục; các trường hợp còn lại phải render gợi ý chủ đề Học tập.

**Validates: Requirements 5.1, 5.2, 5.3, 5.6**

---

### Property 8: isTimeFixed ẩn thời gian gợi ý

*Với bất kỳ* ScheduleBlock nào có `isTimeFixed = true` và bất kỳ chủ đề nào, AIScheduleSuggestion không được render phần thời gian gợi ý mà phải render thông báo "Thời gian đã được cố định".

**Validates: Requirements 5.5**

---

### Property 9: InlineTaskEditor không lưu nội dung rỗng

*Với bất kỳ* chuỗi nào chỉ gồm ký tự whitespace hoặc chuỗi rỗng, khi người dùng nhấn Enter trong InlineTaskEditor, danh sách task không được thay đổi và phải hiển thị trạng thái lỗi (viền đỏ).

**Validates: Requirements 6.7**

---

### Property 10: InlineTaskEditor round-trip Escape

*Với bất kỳ* task nào và bất kỳ nội dung chỉnh sửa nào, khi người dùng nhấn Escape trong InlineTaskEditor, nội dung task phải khôi phục về đúng giá trị ban đầu trước khi chỉnh sửa.

**Validates: Requirements 6.4**

---

### Property 11: parseBlockDuration tính đúng thời lượng

*Với bất kỳ* chuỗi thời gian hợp lệ dạng "HH:MM - HH:MM" nào, `parseBlockDuration` phải trả về đúng số giây bằng hiệu số phút giữa thời gian kết thúc và bắt đầu nhân với 60.

**Validates: Requirements 7.3**

---

### Property 12: getMusicCategory ánh xạ đúng chủ đề sang nhạc

*Với bất kỳ* tên ScheduleBlock nào, `getMusicCategory` phải trả về: "exercise" nếu chứa từ khóa thể dục, "relax" nếu chứa từ khóa ăn uống, "study" cho tất cả các trường hợp còn lại.

**Validates: Requirements 7.4**

---

### Property 13: Today Mode sắp xếp ScheduleBlock theo thời gian tăng dần

*Với bất kỳ* danh sách ScheduleBlock nào từ CalendarSchedule, Today Mode phải hiển thị các block theo thứ tự thời gian bắt đầu tăng dần (block có giờ bắt đầu sớm hơn phải xuất hiện trước).

**Validates: Requirements 8.2, 9.3**

---

### Property 14: Today Mode đọc đúng dữ liệu Calendar

*Với bất kỳ* tập dữ liệu `calendarSchedules` nào, Today Mode phải hiển thị đúng và chỉ các ScheduleBlock thuộc ngày hiện tại (theo ngày thực tế của hệ thống), không hiển thị block của ngày khác.

**Validates: Requirements 8.1, 8.5**

---

### Property 15: Đếm task chưa hoàn thành chính xác

*Với bất kỳ* danh sách task nào trong Today Mode, số hiển thị ở phần tóm tắt cuối layout phải bằng đúng số lượng task có `completed = false`.

**Validates: Requirements 9.5**
