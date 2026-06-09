# Implementation Plan: Pastel Design System

## Overview

Xây dựng hệ thống thiết kế pastel theo chiến lược **additive** — thêm CSS token mới vào `theme.css`, tạo 3 file CSS mới, 6 React component mới, rồi áp dụng color scheme cho 6 trang và BottomNav. Không chạm vào shadcn/ui originals.

## Tasks

- [ ] 1. Mở rộng design tokens trong `theme.css`
  - Append spacing scale (`--space-*`, `--gap-*`, `--card-padding-*`) vào `:root` block thứ hai
  - Append border radius scale (`--radius-pastel-*`, `--button-radius`, `--input-radius`, `--card-radius`, `--modal-radius`) vào `:root`
  - Append typography scale (`--text-*`, `--font-*`, `--text-heading`, `--text-body-*`) vào `:root`
  - Append basic shadow scale (`--shadow-xs` → `--shadow-xl`, `--shadow-inner-*`) vào `:root`
  - Append radius và shadow tokens vào `@theme inline` block
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Tạo CSS utility files
  - [ ] 2.1 Tạo `src/styles/pastel-colors.css`
    - Viết các class `.text-on-{color}` (high-contrast text trên colored backgrounds — WCAG AA)
    - Viết semantic text utilities: `.text-pastel-heading`, `.text-pastel-body`, `.text-pastel-body-secondary`, `.text-pastel-muted`
    - Viết gradient background utility classes: `.bg-gradient-blue-purple`, `.bg-gradient-purple-pink`, v.v.
    - _Requirements: 2.1, 2.2, 5.1_

  - [ ] 2.2 Tạo `src/styles/components.css`
    - Viết `.btn-pastel-base` với transition, border-radius, disabled/focus-visible rules
    - Viết 5 primary button variant classes (`.btn-pastel-primary-{color}`) với gradient bg, shadow, hover lift, active reset
    - Viết button size classes: `.btn-pastel-sm`, `.btn-pastel-md`, `.btn-pastel-lg`
    - Viết card classes: `.card-pastel-default`, `.card-pastel-gradient-{color}` (5 colors)
    - Viết `.input-pastel`, `.input-pastel-with-icon` với focus/error/disabled states
    - Viết `.badge-pastel-base` và 5 color variants
    - Viết `.progress-pastel-track`, `.progress-pastel-fill`, `.progress-pastel-fill-complete`
    - Viết `.toggle-pastel`, `.toggle-pastel-knob` với data-state checked animation
    - Viết `.bottom-nav-pastel` với backdrop-blur, border, shadow-up
    - Viết `@media (prefers-reduced-motion: reduce)` block — tắt transitions và transforms
    - Viết priority icon pseudo-elements `.priority-high::before`, `.priority-medium::before`, `.priority-low::before`
    - _Requirements: 3.1, 3.2, 4.1, 6.1, 7.1, 8.1, 10.1, 10.2, 18.1, 19.1_

  - [ ] 2.3 Tạo `src/styles/utilities.css`
    - Viết 6 page background utility classes: `.pastel-page-bg-{blue|purple|pink|green|orange|slate}`
    - Viết dark mode overrides dùng selector `[data-daytrack-theme='dark']` cho page backgrounds, cards, inputs, bottom nav
    - _Requirements: 5.1, 5.2, 16.1, 17.1_

- [ ] 3. Cập nhật `src/styles/index.css`
  - Thêm 3 dòng import sau `@import './animations.css'`: `pastel-colors.css`, `components.css`, `utilities.css`
  - _Requirements: 1.4_

- [ ] 4. Checkpoint — kiểm tra CSS pipeline
  - Ensure CSS builds without errors, ask the user if questions arise.

- [ ] 5. Tạo React components
  - [ ] 5.1 Tạo `src/app/components/ui/pastel-button.tsx`
    - Định nghĩa CVA `pastelButtonVariants` với variants: `variant` (primary/secondary/ghost), `color` (5 colors), `size` (sm/md/lg)
    - Định nghĩa đủ 15 compound variants cho primary + 10 cho secondary + 5 cho ghost
    - Export `PastelButton` component forward-spreading `React.ButtonHTMLAttributes`
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 5.2 Viết property test cho PastelButton (Property 1 — class resolution exhaustive)
    - **Property 1: PastelButton class resolution is exhaustive and non-empty**
    - **Validates: Requirements 6.1**
    - Dùng `fc.record({ variant, color, size })` để generate tất cả combinations
    - Assert kết quả chứa `btn-pastel-base` và không rỗng

  - [ ]* 5.3 Viết property test cho PastelButton (Property 2 — disabled state)
    - **Property 2: PastelButton disabled state is independent of variant/color**
    - **Validates: Requirements 6.3**
    - Dùng `fc.record({ variant, color, size })` với disabled=true
    - Assert rendered button có `pointer-events-none` và `opacity-50`

  - [ ] 5.4 Tạo `src/app/components/ui/pastel-card.tsx`
    - Định nghĩa CVA `pastelCardVariants` với variants: `variant` (default/gradient/colored), `color` (5 colors)
    - Định nghĩa compound variants cho gradient (5) và colored (5)
    - Export `PastelCard` component forward-spreading `React.HTMLAttributes<HTMLDivElement>`
    - _Requirements: 8.1, 8.2_

  - [ ]* 5.5 Viết property test cho PastelCard (Property 3 — class resolution exhaustive)
    - **Property 3: PastelCard class resolution is exhaustive and non-empty**
    - **Validates: Requirements 8.1**
    - Dùng `fc.record({ variant, color })` để generate tất cả combinations
    - Assert kết quả class string không rỗng

  - [ ] 5.6 Tạo `src/app/components/ui/pastel-input.tsx`
    - Export `PastelInput` với props `icon?: React.ReactNode` và `error?: boolean`
    - Wrap native `<input>` với relative `<div>` cho icon slot
    - Apply `input-pastel-with-icon` class khi có icon prop
    - Set `aria-invalid="true"` khi `error={true}`
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 5.7 Viết property test cho PastelInput (Property 7 — aria-invalid propagation)
    - **Property 7: PastelInput error state propagates to aria-invalid**
    - **Validates: Requirements 7.2, 20.1**
    - Dùng `fc.boolean()` cho error value
    - Assert `aria-invalid` presence khớp với error prop

  - [ ]* 5.8 Viết property test cho PastelInput (Property 8 — icon class)
    - **Property 8: PastelInput icon slot positioning**
    - **Validates: Requirements 7.1**
    - Dùng `fc.option(fc.string())` cho icon
    - Assert `input-pastel-with-icon` present iff icon được cung cấp

  - [ ] 5.9 Tạo `src/app/components/ui/pastel-badge.tsx`
    - Định nghĩa CVA `pastelBadgeVariants` với color variant (5 colors)
    - Export `PastelBadge` forward-spreading `React.HTMLAttributes<HTMLSpanElement>`
    - _Requirements: 10.3_

  - [ ]* 5.10 Viết property test cho PastelBadge (Property 4 — colors distinct)
    - **Property 4: PastelBadge color variants are visually distinct**
    - **Validates: Requirements 10.3**
    - Generate 2 màu khác nhau từ enum; assert class strings differ

  - [ ] 5.11 Tạo `src/app/components/ui/pastel-progress.tsx`
    - Export `PastelProgress` với props `value: number`, `complete?: boolean`
    - Clamp value vào `[0, 100]` trước khi set `width` style
    - Apply `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `role="progressbar"`
    - Apply `progress-pastel-fill-complete` class khi `complete={true}`
    - _Requirements: 10.4, 20.1_

  - [ ]* 5.12 Viết property test cho PastelProgress (Property 5 — value clamping)
    - **Property 5: PastelProgress value clamping**
    - **Validates: Requirements 10.4**
    - Dùng `fc.float()` covering `(-∞, 200)` range
    - Assert `width%` luôn nằm trong `[0%, 100%]`

  - [ ] 5.13 Tạo `src/app/components/ui/pastel-toggle.tsx`
    - Export `PastelToggle` với props `checked`, `onChange`, `disabled?`
    - Render `<button role="switch">` với `aria-checked`, `data-state` attribute
    - Render `<span className="toggle-pastel-knob">` bên trong
    - Gọi `onChange(!checked)` khi click; disabled ngăn click
    - _Requirements: 10.5, 20.1_

  - [ ]* 5.14 Viết property test cho PastelToggle (Property 6 — round-trip)
    - **Property 6: PastelToggle state round-trip**
    - **Validates: Requirements 10.5**
    - Dùng `fc.boolean()` cho initial state
    - Assert hai lần toggle trở về state ban đầu; `aria-checked` phản ánh prop

- [ ] 6. Checkpoint — kiểm tra tất cả components
  - Ensure all component tests pass, ask the user if questions arise.

- [ ] 7. Cập nhật `src/app/components/BottomNav.tsx`
  - Thêm class `bottom-nav-pastel` vào container element của BottomNav
  - Đảm bảo transition timing links là `150ms ease`
  - _Requirements: 11.1, 11.2_

- [ ] 8. Áp dụng page color schemes
  - [ ] 8.1 Cập nhật `src/app/pages/Timetable.tsx` — Blue scheme
    - Thêm `pastel-page-bg-blue` vào root container
    - Áp dụng `text-blue-600` cho page title
    - Áp dụng blue accent colors cho schedule blocks và interactive elements
    - _Requirements: 12.1, 13.1_

  - [ ] 8.2 Cập nhật `src/app/pages/Calendar.tsx` — Purple scheme
    - Thêm `pastel-page-bg-purple` vào root container
    - Áp dụng `text-purple-600` cho page title
    - Áp dụng `#C084FC` cho day selection và purple accents
    - _Requirements: 12.2, 13.1_

  - [ ] 8.3 Cập nhật `src/app/pages/Tasks.tsx` — Orange scheme
    - Thêm `pastel-page-bg-orange` vào root container
    - Áp dụng `text-orange-600` cho page title
    - Áp dụng `#FB923C` cho priority và task accent colors
    - _Requirements: 12.3, 13.1_

  - [ ] 8.4 Cập nhật `src/app/pages/Focus.tsx` — Green scheme
    - Thêm `pastel-page-bg-green` vào root container
    - Áp dụng `text-green-600` cho page title
    - Áp dụng `--gradient-green-cyan` cho timer và focus elements
    - _Requirements: 12.4, 13.1_

  - [ ] 8.5 Cập nhật `src/app/pages/Achive.tsx` — Pink scheme
    - Thêm `pastel-page-bg-pink` vào root container
    - Áp dụng `text-pink-600` cho page title
    - Áp dụng `--gradient-purple-pink` cho achievement cards
    - _Requirements: 12.5, 13.1_

  - [ ] 8.6 Cập nhật `src/app/pages/Settings.tsx` — Slate/Multi scheme
    - Thêm `pastel-page-bg-slate` vào root container
    - Áp dụng `text-pastel-gray-700` cho page title
    - Áp dụng `--gradient-blue-purple` cho profile card gradient
    - _Requirements: 12.6, 13.1_

- [ ] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks đánh dấu `*` là optional và có thể bỏ qua khi cần MVP nhanh
- Mỗi task đều tham chiếu requirements cụ thể để traceability
- Không sửa bất kỳ file nào trong danh sách NO CHANGE (shadcn originals, animations.css, fonts.css, tailwind.css, Login.tsx)
- Dark mode dùng selector `[data-daytrack-theme='dark']` nhất quán với `index.css` hiện tại — không dùng `.dark`
- Property tests dùng `fast-check` với minimum 100 iterations: `fc.assert(fc.property(...), { numRuns: 100 })`
- CSS token naming convention: `--pastel-{color}-{shade}` và `--radius-pastel-{size}`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["5.1", "5.4", "5.6", "5.9", "5.11", "5.13"] },
    { "id": 3, "tasks": ["5.2", "5.3", "5.5", "5.7", "5.8", "5.10", "5.12", "5.14"] },
    { "id": 4, "tasks": ["7.1", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] }
  ]
}
```
