# Requirements Document

## Introduction

Tính năng này hoàn thiện logic lịch trình trong ứng dụng DayTrack, bao gồm ba cải tiến chính:

1. **Chỉnh sửa lịch trình (Edit Schedule)**: Cho phép người dùng bấm vào một khối lịch trong trang Thời khóa biểu (Timetable mode) để mở modal chỉnh sửa nội dung (tên, thời gian, tasks, màu sắc). Hiện tại, bấm vào lịch trong Timetable mode không có tác dụng chỉnh sửa.

2. **Chọn màu có visual feedback**: Trong `CreateScheduleModal`, khi người dùng chọn một màu chủ đề, màu được chọn phải hiển thị viền đậm hơn để biểu thị trạng thái đã chọn. Màu đó sẽ được áp dụng cho khối lịch khi tạo/lưu. Hiện tại, color selection không có state, không có visual feedback, và màu luôn là `bg-blue-50 text-blue-600` cứng.

3. **Cố định thời gian (Fixed Time Toggle)**: Thêm tùy chọn "Cố định thời gian" với nút toggle trong modal tạo/sửa lịch. Khi bật, `AIScheduleSuggestion` sẽ không hiển thị gợi ý thay đổi thời gian cho lịch đó.

## Glossary

- **ScheduleBlock**: Một khối lịch trình chứa id, tên, thời gian, màu sắc, danh sách tasks, và cờ `isTimeFixed`.
- **CreateScheduleModal**: Component modal dùng để tạo mới hoặc chỉnh sửa một `ScheduleBlock`.
- **EditScheduleModal**: Tên gọi chức năng của `CreateScheduleModal` khi được dùng để chỉnh sửa (cùng component, khác mode).
- **Timetable**: Trang hiển thị lịch trình theo tuần (Timetable mode) và theo ngày hôm nay (Today mode).
- **AIScheduleSuggestion**: Component hiển thị gợi ý AI cho một `ScheduleBlock` trong Today mode.
- **isTimeFixed**: Thuộc tính boolean của `ScheduleBlock`, khi `true` thì AI không gợi ý thay đổi thời gian.
- **selectedColor**: State lưu màu chủ đề đang được chọn trong `CreateScheduleModal`.
- **ColorOption**: Một tùy chọn màu sắc trong danh sách màu của modal, bao gồm class màu nền và class màu chữ tương ứng.

---

## Requirements

### Requirement 1: Chỉnh sửa lịch trình trong Timetable

**User Story:** Là người dùng, tôi muốn bấm vào một khối lịch trong trang Thời khóa biểu để chỉnh sửa nội dung, để tôi có thể cập nhật thông tin lịch học mà không cần xóa và tạo lại.

#### Acceptance Criteria

1. WHEN người dùng bấm vào một `ScheduleBlock` trong Timetable mode (không phải Today mode), THE `Timetable` SHALL mở `CreateScheduleModal` ở chế độ chỉnh sửa với dữ liệu hiện tại của `ScheduleBlock` đó được điền sẵn vào form.
2. WHEN `CreateScheduleModal` được mở ở chế độ chỉnh sửa, THE `CreateScheduleModal` SHALL hiển thị tiêu đề "Chỉnh sửa lịch trình" và nút "Lưu" đồng thời, đảm bảo tiêu đề và nút luôn khớp với chế độ hiện tại.
3. WHEN `CreateScheduleModal` được mở ở chế độ tạo mới, THE `CreateScheduleModal` SHALL hiển thị tiêu đề "Tạo khối lịch trình" và nút "Tạo" đồng thời, đảm bảo tiêu đề và nút luôn khớp với chế độ hiện tại.
4. WHEN người dùng thay đổi dữ liệu và bấm "Lưu" trong chế độ chỉnh sửa, THE `Timetable` SHALL cập nhật `ScheduleBlock` tương ứng trong `scheduleData` với dữ liệu mới mà không tạo thêm block mới.
5. WHEN người dùng bấm vào một `ScheduleBlock` trong Today mode, THE `Timetable` SHALL expand/collapse `AIScheduleSuggestion` như hành vi hiện tại (không mở modal chỉnh sửa).
6. IF người dùng bấm "Hủy" hoặc đóng modal trong chế độ chỉnh sửa, THEN THE `CreateScheduleModal` SHALL đóng lại mà không thay đổi dữ liệu của `ScheduleBlock`.

---

### Requirement 2: Chọn màu có visual feedback

**User Story:** Là người dùng, tôi muốn thấy rõ màu nào đang được chọn khi tạo hoặc chỉnh sửa lịch trình, để tôi có thể dễ dàng phân biệt và lựa chọn màu sắc phù hợp.

#### Acceptance Criteria

1. THE `CreateScheduleModal` SHALL duy trì state `selectedColor` để lưu `ColorOption` đang được chọn.
2. WHEN `CreateScheduleModal` được mở lần đầu (chế độ tạo mới), THE `CreateScheduleModal` SHALL đặt `selectedColor` mặc định là màu xanh dương (blue).
3. WHEN người dùng bấm vào một `ColorOption`, THE `CreateScheduleModal` SHALL cập nhật `selectedColor` thành `ColorOption` đó.
4. WHEN người dùng bấm vào một `ColorOption`, THE `CreateScheduleModal` SHALL cập nhật `selectedColor` thành `ColorOption` đó và hiển thị viền đậm hơn ngay lập tức trên ô màu đó.
5. WHEN người dùng bấm "Tạo" hoặc "Lưu", THE `CreateScheduleModal` SHALL truyền `selectedColor` vào dữ liệu lịch trình được lưu, thay vì dùng màu cứng `bg-blue-50 text-blue-600`.
6. WHEN `CreateScheduleModal` được mở ở chế độ chỉnh sửa, THE `CreateScheduleModal` SHALL đặt `selectedColor` ban đầu bằng màu hiện tại của `ScheduleBlock` đang được chỉnh sửa.

---

### Requirement 3: Cố định thời gian (Fixed Time Toggle)

**User Story:** Là người dùng, tôi muốn có thể đánh dấu một lịch trình là "cố định thời gian", để AI không gợi ý thay đổi thời gian của lịch đó khi tôi không muốn thay đổi.

#### Acceptance Criteria

1. THE `CreateScheduleModal` SHALL hiển thị một toggle switch với nhãn "Cố định thời gian" trong form tạo/chỉnh sửa lịch.
2. WHEN `CreateScheduleModal` được mở lần đầu (chế độ tạo mới), THE `CreateScheduleModal` SHALL đặt toggle "Cố định thời gian" ở trạng thái tắt (false) mặc định.
3. WHEN người dùng bật toggle "Cố định thời gian" và lưu lịch, THE `CreateScheduleModal` SHALL truyền `isTimeFixed: true` vào dữ liệu lịch trình được lưu.
4. WHEN người dùng tắt toggle "Cố định thời gian" và lưu lịch, THE `CreateScheduleModal` SHALL truyền `isTimeFixed: false` vào dữ liệu lịch trình được lưu.
5. WHILE `isTimeFixed` của một `ScheduleBlock` là `true`, THE `AIScheduleSuggestion` SHALL ẩn phần "Thời gian gợi ý" (suggested time section) trong gợi ý AI của block đó.
6. WHILE `isTimeFixed` của một `ScheduleBlock` là `false`, THE `AIScheduleSuggestion` SHALL hiển thị phần "Thời gian gợi ý" như bình thường.
7. WHEN `CreateScheduleModal` được mở ở chế độ chỉnh sửa, THE `CreateScheduleModal` SHALL đặt toggle "Cố định thời gian" theo giá trị `isTimeFixed` hiện tại của `ScheduleBlock` đang được chỉnh sửa.
8. WHILE `isTimeFixed` của một `ScheduleBlock` là `true`, THE `AIScheduleSuggestion` SHALL hiển thị thông báo ngắn gọn cho người dùng biết thời gian đã được cố định và không hiển thị phần "Thời gian gợi ý".
