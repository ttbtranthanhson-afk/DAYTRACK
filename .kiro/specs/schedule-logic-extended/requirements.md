# Tài liệu Yêu cầu

## Giới thiệu

Tính năng **schedule-logic-extended** mở rộng logic lịch trình hiện có của ứng dụng DayTrack, bổ sung các khả năng tương tác nâng cao cho người dùng. Phạm vi bao gồm: toggle ẩn hướng dẫn how-to trong gợi ý AI, vuốt lịch qua lại bằng cử chỉ, ghi chú ngày đặc biệt, luồng Trợ lý AI gợi ý lịch cả tuần, gợi ý AI theo 3 chủ đề (Ăn uống, Học tập, Thể dục), chỉnh sửa task inline trong lịch, nút đếm thời gian chuyển sang Focus với nhạc theo chủ đề, và trang Today hiển thị lịch từ Calendar thay vì Timetable cứng.

## Bảng thuật ngữ

- **Timetable**: Trang lịch học theo tuần, hiển thị lịch trình từng ngày trong tuần.
- **Today Mode**: Chế độ xem "Hôm nay" trong Timetable, hiển thị lịch trình ngày hiện tại được AI tối ưu.
- **Calendar**: Trang lịch theo tháng, cho phép quản lý lịch trình theo từng ngày cụ thể.
- **ScheduleBlock**: Một khối lịch trình gồm tên, thời gian, màu sắc và danh sách task.
- **AIScheduleSuggestion**: Component hiển thị gợi ý AI cho một ScheduleBlock, bao gồm how-to và thông tin chi tiết.
- **CreateScheduleModal**: Modal tạo/chỉnh sửa ScheduleBlock, chứa các trường nhập liệu và toggle cài đặt.
- **HowToContent**: Phần nội dung hướng dẫn chi tiết trong AIScheduleSuggestion (gợi ý ăn gì, tập bài nào, học phương pháp nào).
- **Toggle_HieuRo**: Toggle "Hiểu rõ cách thực hiện" trong CreateScheduleModal, khi bật sẽ ẩn HowToContent.
- **SwipeGesture**: Cử chỉ vuốt ngang trên màn hình cảm ứng để chuyển ngày trong Timetable và Today Mode.
- **SpecialDayNote**: Ghi chú ngày đặc biệt hiển thị màu xanh dưới tiêu đề "Lịch trình được AI tối ưu cho bạn" trong Today Mode.
- **AIWeeklyFlow**: Luồng Trợ lý AI gợi ý lịch cả tuần, duyệt từng ngày bằng schedule box, xác nhận từng ngày rồi áp vào Calendar.
- **AITopicSuggestion**: Gợi ý AI theo 3 chủ đề: Ăn uống, Học tập, Thể dục — mỗi chủ đề có nội dung riêng biệt.
- **InlineTaskEditor**: Chức năng chỉnh sửa task trực tiếp trong ScheduleBlock, lưu vào Tasks và Calendar khi nhấn Enter.
- **StartTimerButton**: Nút "Bắt đầu đếm thời gian" màu xanh trong Today Mode, chuyển sang trang Focus và phát nhạc theo chủ đề lịch.
- **FocusPage**: Trang tập trung (Focus) hiện có, hỗ trợ đếm ngược và phát nhạc nền.
- **CalendarSchedule**: Dữ liệu lịch trình lưu trong Calendar (theo ngày cụ thể), được Today Mode đọc và hiển thị.

---

## Yêu cầu

### Yêu cầu 1: Toggle "Hiểu rõ cách thực hiện" trong CreateScheduleModal

**User Story:** Là người dùng đã hiểu cách thực hiện lịch trình, tôi muốn bật toggle để ẩn phần hướng dẫn chi tiết trong gợi ý AI, để giao diện gọn hơn và không bị phân tâm bởi thông tin tôi đã biết.

#### Tiêu chí chấp nhận

1. THE CreateScheduleModal SHALL hiển thị một toggle có nhãn "Hiểu rõ cách thực hiện" trong phần cài đặt của form, tách biệt với toggle "Cố định thời gian".
2. WHEN người dùng bật Toggle_HieuRo trong CreateScheduleModal, THE CreateScheduleModal SHALL lưu trạng thái `understandHowTo: true` vào dữ liệu ScheduleBlock khi lưu.
3. WHEN Toggle_HieuRo của một ScheduleBlock có giá trị `true`, THE AIScheduleSuggestion SHALL ẩn toàn bộ HowToContent (bao gồm gợi ý thức ăn, phương pháp học, bài tập cụ thể và phần giải thích).
4. WHILE Toggle_HieuRo của một ScheduleBlock có giá trị `true`, THE AIScheduleSuggestion SHALL vẫn hiển thị phần tiêu đề chủ đề (Ăn uống / Học tập / Thể dục) và mục tiêu người dùng.
5. WHEN Toggle_HieuRo của một ScheduleBlock có giá trị `false` hoặc không được thiết lập, THE AIScheduleSuggestion SHALL hiển thị đầy đủ HowToContent như mặc định.
6. IF người dùng chỉnh sửa một ScheduleBlock đã lưu, THEN THE CreateScheduleModal SHALL khôi phục đúng trạng thái Toggle_HieuRo đã lưu trước đó.

---

### Yêu cầu 2: Vuốt lịch qua lại bằng SwipeGesture

**User Story:** Là người dùng trên thiết bị cảm ứng, tôi muốn vuốt ngang để chuyển ngày trong Timetable và Today Mode, để điều hướng nhanh hơn mà không cần nhấn nút mũi tên.

#### Tiêu chí chấp nhận

1. WHEN người dùng thực hiện SwipeGesture sang trái (vuốt từ phải sang trái) trên vùng nội dung lịch trong Timetable, THE Timetable SHALL chuyển sang ngày tiếp theo với hiệu ứng trượt tương tự nút ChevronRight.
2. WHEN người dùng thực hiện SwipeGesture sang phải (vuốt từ trái sang phải) trên vùng nội dung lịch trong Timetable, THE Timetable SHALL chuyển sang ngày trước đó với hiệu ứng trượt tương tự nút ChevronLeft.
3. IF người dùng đang ở ngày đầu tiên (Thứ Hai) và thực hiện SwipeGesture sang phải, THEN THE Timetable SHALL không thay đổi ngày hiện tại.
4. IF người dùng đang ở ngày cuối cùng (Chủ Nhật) và thực hiện SwipeGesture sang trái, THEN THE Timetable SHALL chuyển sang màn hình Tổng kết tuần.
5. WHEN người dùng thực hiện SwipeGesture sang trái trên vùng nội dung lịch trong Today Mode, THE Today Mode SHALL chuyển sang ngày hôm sau với hiệu ứng trượt.
6. WHEN người dùng thực hiện SwipeGesture sang phải trên vùng nội dung lịch trong Today Mode, THE Today Mode SHALL chuyển sang ngày hôm trước với hiệu ứng trượt.
7. THE Timetable SHALL chỉ kích hoạt SwipeGesture khi khoảng cách vuốt ngang vượt quá 50px để tránh nhầm lẫn với cuộn dọc.

---

### Yêu cầu 3: Ghi chú ngày đặc biệt trong Today Mode

**User Story:** Là người dùng, tôi muốn xem ghi chú ngày đặc biệt được hiển thị nổi bật màu xanh ngay dưới tiêu đề "Lịch trình được AI tối ưu cho bạn" trong Today Mode, để nhận biết ngay các sự kiện quan trọng của ngày hôm nay.

#### Tiêu chí chấp nhận

1. THE Today Mode SHALL hiển thị khu vực SpecialDayNote ngay bên dưới dòng chữ "Lịch trình được AI tối ưu cho bạn".
2. WHEN ngày hiện tại có SpecialDayNote được thiết lập, THE Today Mode SHALL hiển thị nội dung ghi chú với nền màu xanh (blue-50) và chữ màu xanh (blue-600).
3. WHEN ngày hiện tại không có SpecialDayNote, THE Today Mode SHALL ẩn khu vực SpecialDayNote để không chiếm không gian.
4. THE SpecialDayNote SHALL hỗ trợ nội dung văn bản tối đa 100 ký tự.
5. WHERE người dùng muốn thêm ghi chú ngày đặc biệt, THE Today Mode SHALL cung cấp nút chỉnh sửa nhỏ bên cạnh khu vực SpecialDayNote để nhập và lưu nội dung ghi chú.

---

### Yêu cầu 4: Luồng Trợ lý AI gợi ý lịch cả tuần (AIWeeklyFlow)

**User Story:** Là người dùng, tôi muốn Trợ lý AI gợi ý lịch cho cả tuần, duyệt từng ngày bằng schedule box và xác nhận từng ngày trước khi áp vào Calendar, để tiết kiệm thời gian lập kế hoạch tuần.

#### Tiêu chí chấp nhận

1. WHEN người dùng nhấn nút "Trợ lý AI" trong màn hình Tổng kết tuần, THE Timetable SHALL mở giao diện AIWeeklyFlow bắt đầu từ Thứ Hai.
2. THE AIWeeklyFlow SHALL hiển thị schedule box gợi ý cho từng ngày trong tuần, bao gồm tên lịch, thời gian bắt đầu và thời gian kết thúc được AI đề xuất.
3. WHEN người dùng đang xem gợi ý cho một ngày trong AIWeeklyFlow, THE AIWeeklyFlow SHALL hiển thị nút "Xác nhận" màu xanh (green-500) để chấp nhận lịch gợi ý cho ngày đó.
4. WHEN người dùng nhấn nút "Xác nhận" cho một ngày trong AIWeeklyFlow, THE AIWeeklyFlow SHALL lưu các ScheduleBlock được gợi ý vào CalendarSchedule của ngày tương ứng và chuyển sang ngày tiếp theo.
5. WHEN người dùng đã xác nhận ngày cuối cùng (Chủ Nhật) trong AIWeeklyFlow, THE AIWeeklyFlow SHALL hiển thị thông báo xác nhận hoàn tất và đóng giao diện AIWeeklyFlow.
6. THE AIWeeklyFlow SHALL cho phép người dùng bỏ qua gợi ý của một ngày bằng nút "Bỏ qua" mà không lưu lịch cho ngày đó.
7. IF người dùng nhấn nút quay lại trong AIWeeklyFlow, THEN THE AIWeeklyFlow SHALL quay về ngày trước đó mà không mất dữ liệu đã xác nhận.

---

### Yêu cầu 5: Gợi ý AI theo 3 chủ đề (AITopicSuggestion)

**User Story:** Là người dùng, tôi muốn nhận gợi ý AI chi tiết theo 3 chủ đề Ăn uống, Học tập và Thể dục khi mở rộng một ScheduleBlock trong Today Mode, để có hướng dẫn phù hợp với từng loại hoạt động.

#### Tiêu chí chấp nhận

1. WHEN AIScheduleSuggestion xác định chủ đề là "Ăn uống" (dựa trên tên ScheduleBlock), THE AIScheduleSuggestion SHALL hiển thị: nhu cầu dinh dưỡng (mục tiêu), thời gian gợi ý (nếu không cố định), danh sách thức ăn được đề xuất với khối lượng cụ thể, và phần giải thích lý do dinh dưỡng.
2. WHEN AIScheduleSuggestion xác định chủ đề là "Học tập" (dựa trên tên ScheduleBlock), THE AIScheduleSuggestion SHALL hiển thị: phương pháp học được đề xuất (bao gồm kỹ thuật Pomodoro), thời gian học gợi ý (nếu không cố định), mẹo tư thế và sức khỏe khi học, và phần giải thích lý do phương pháp.
3. WHEN AIScheduleSuggestion xác định chủ đề là "Thể dục" (dựa trên tên ScheduleBlock), THE AIScheduleSuggestion SHALL hiển thị: mục tiêu tập luyện, thời gian gợi ý (nếu không cố định), danh sách bài tập tùy chỉnh với số set và số lần cụ thể, và phần giải thích lý do bài tập.
4. WHILE Toggle_HieuRo của ScheduleBlock có giá trị `true`, THE AIScheduleSuggestion SHALL ẩn danh sách thức ăn, danh sách bài tập, phương pháp học và phần giải thích, nhưng vẫn hiển thị tiêu đề chủ đề và mục tiêu.
5. WHEN ScheduleBlock có `isTimeFixed: true`, THE AIScheduleSuggestion SHALL ẩn phần thời gian gợi ý và hiển thị thông báo "Thời gian đã được cố định" cho cả 3 chủ đề.
6. IF tên ScheduleBlock không khớp với từ khóa của chủ đề Ăn uống hoặc Thể dục, THEN THE AIScheduleSuggestion SHALL mặc định hiển thị gợi ý chủ đề Học tập.

---

### Yêu cầu 6: Chỉnh sửa task inline trong lịch (InlineTaskEditor)

**User Story:** Là người dùng, tôi muốn chỉnh sửa task trực tiếp trong ScheduleBlock mà không cần mở modal, và nhấn Enter để lưu ngay vào Tasks và Calendar, để thao tác nhanh hơn.

#### Tiêu chí chấp nhận

1. THE ScheduleBlock trong Today Mode SHALL hiển thị danh sách task của khối đó khi được mở rộng, với mỗi task có thể nhấn để chuyển sang chế độ chỉnh sửa inline.
2. WHEN người dùng nhấn vào một task trong ScheduleBlock đang mở rộng, THE InlineTaskEditor SHALL hiển thị ô input có sẵn nội dung task hiện tại để chỉnh sửa.
3. WHEN người dùng nhấn phím Enter trong InlineTaskEditor, THE InlineTaskEditor SHALL lưu nội dung đã chỉnh sửa vào danh sách task của ScheduleBlock, cập nhật CalendarSchedule tương ứng, và đồng bộ thay đổi vào danh sách Tasks toàn cục.
4. WHEN người dùng nhấn phím Escape trong InlineTaskEditor, THE InlineTaskEditor SHALL hủy chỉnh sửa và khôi phục nội dung task ban đầu.
5. WHEN người dùng vừa chỉnh sửa một task trong InlineTaskEditor, THE InlineTaskEditor SHALL hiển thị nút "Gợi ý thực hiện" nhỏ bên cạnh task đó trong vòng 3 giây sau khi lưu.
6. WHEN người dùng nhấn nút "Gợi ý thực hiện", THE AIScheduleSuggestion SHALL hiển thị gợi ý cụ thể liên quan đến nội dung task vừa được chỉnh sửa.
7. IF nội dung task sau khi chỉnh sửa là chuỗi rỗng, THEN THE InlineTaskEditor SHALL không lưu và hiển thị viền đỏ trên ô input để báo lỗi.

---

### Yêu cầu 7: Nút "Bắt đầu đếm thời gian" trong Today Mode (StartTimerButton)

**User Story:** Là người dùng, tôi muốn nhấn nút "Bắt đầu đếm thời gian" màu xanh trong Today Mode để chuyển sang trang Focus với thời lượng và nhạc theo chủ đề của lịch đang chọn, để bắt đầu phiên tập trung ngay lập tức.

#### Tiêu chí chấp nhận

1. THE Today Mode SHALL hiển thị nút StartTimerButton màu xanh (green-500) ở vị trí đầu tiên trong layout, trước phần lịch AI gợi ý và danh sách task.
2. WHEN người dùng chọn một ScheduleBlock trong Today Mode, THE StartTimerButton SHALL cập nhật nhãn để hiển thị tên và thời lượng của ScheduleBlock đang được chọn.
3. WHEN người dùng nhấn StartTimerButton và một ScheduleBlock đang được chọn, THE Today Mode SHALL điều hướng đến FocusPage với thời lượng được tính từ thời gian bắt đầu và kết thúc của ScheduleBlock đó.
4. WHEN người dùng điều hướng đến FocusPage từ StartTimerButton, THE FocusPage SHALL tự động chọn danh mục nhạc tương ứng với chủ đề của ScheduleBlock (Học tập → "Học tập", Thể dục → "Tập luyện", Ăn uống → "Thư giãn").
5. WHEN người dùng điều hướng đến FocusPage từ StartTimerButton, THE FocusPage SHALL tự động bắt đầu đếm ngược với thời lượng đã được thiết lập mà không cần người dùng nhấn nút Play thêm lần nữa.
6. IF không có ScheduleBlock nào được chọn khi người dùng nhấn StartTimerButton, THEN THE Today Mode SHALL hiển thị thông báo hướng dẫn người dùng chọn một lịch trình trước.

---

### Yêu cầu 8: Today Mode hiển thị lịch từ Calendar

**User Story:** Là người dùng, tôi muốn Today Mode hiển thị lịch trình từ dữ liệu Calendar (theo ngày thực tế) thay vì dữ liệu Timetable cứng, để lịch hôm nay phản ánh đúng những gì tôi đã lên kế hoạch trong Calendar.

#### Tiêu chí chấp nhận

1. WHEN người dùng mở Today Mode, THE Today Mode SHALL đọc và hiển thị CalendarSchedule của ngày hiện tại (ngày thực tế theo hệ thống) thay vì dữ liệu scheduleData của Timetable.
2. WHEN CalendarSchedule của ngày hiện tại có ít nhất một ScheduleBlock, THE Today Mode SHALL hiển thị các ScheduleBlock đó theo thứ tự thời gian tăng dần.
3. WHEN CalendarSchedule của ngày hiện tại không có ScheduleBlock nào, THE Today Mode SHALL hiển thị thông báo "Không có lịch hôm nay" và gợi ý người dùng thêm lịch trong Calendar.
4. THE Today Mode SHALL tự động làm mới dữ liệu CalendarSchedule mỗi khi người dùng chuyển sang Today Mode từ Timetable Mode.
5. WHEN người dùng thêm hoặc xóa ScheduleBlock trong Calendar cho ngày hiện tại, THE Today Mode SHALL phản ánh thay đổi đó ngay lập tức khi được mở lại.

---

### Yêu cầu 9: Layout Today Mode theo thứ tự chuẩn

**User Story:** Là người dùng, tôi muốn Today Mode có layout theo thứ tự: nút đếm giờ → lịch AI gợi ý → tasks theo trình tự, để trải nghiệm sử dụng trực quan và nhất quán.

#### Tiêu chí chấp nhận

1. THE Today Mode SHALL hiển thị các thành phần theo thứ tự từ trên xuống dưới: (1) StartTimerButton, (2) tiêu đề ngày và SpecialDayNote, (3) danh sách ScheduleBlock từ CalendarSchedule, (4) danh sách task theo trình tự thời gian.
2. THE StartTimerButton SHALL luôn hiển thị ở vị trí cố định đầu trang trong Today Mode, không bị cuộn ra khỏi màn hình khi người dùng cuộn xuống.
3. WHEN danh sách ScheduleBlock được hiển thị trong Today Mode, THE Today Mode SHALL sắp xếp các ScheduleBlock theo thứ tự thời gian bắt đầu tăng dần.
4. WHEN người dùng mở rộng một ScheduleBlock trong Today Mode, THE Today Mode SHALL hiển thị AITopicSuggestion và InlineTaskEditor ngay bên dưới ScheduleBlock đó, đẩy các phần tử phía dưới xuống.
5. THE Today Mode SHALL hiển thị tổng số task chưa hoàn thành của ngày hôm nay ở phần cuối layout, dưới dạng badge hoặc dòng tóm tắt.
