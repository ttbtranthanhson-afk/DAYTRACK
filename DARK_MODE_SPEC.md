# DayTrack - Chế độ tối (Dark Mode) - Specification Chi tiết

## 1. Tổng quan

### 1.1. Mục tiêu
- Tạo chế độ tối với aesthetic minimal, soft, pastel phù hợp với triết lý "Healthy productivity without pressure"
- Giảm áp lực mắt khi sử dụng vào buổi tối
- Giữ nguyên tính thẩm mỹ và màu sắc nhẹ nhàng của light mode
- Smooth transition giữa light và dark mode
- Lưu preference của user trong localStorage

### 1.2. Nguyên tắc thiết kế Dark Mode
- **Không quá tối**: Background không nên là màu đen thuần (#000000) mà là dark gray nhẹ nhàng
- **Giữ pastel colors**: Các accent colors vẫn giữ tính pastel nhưng điều chỉnh saturation/brightness
- **Contrast đủ rõ**: Đảm bảo text readable nhưng không harsh
- **Soft shadows**: Sử dụng lighter shadows thay vì darker shadows

---

## 2. Color Palette Chi tiết

### 2.1. Background Colors

```css
/* Light Mode (hiện tại) */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB (gray-50)
--bg-tertiary: #F3F4F6 (gray-100)

/* Dark Mode (đề xuất) */
--dark-bg-primary: #1A1B1E (dark gray, không phải đen thuần)
--dark-bg-secondary: #25262B (slightly lighter)
--dark-bg-tertiary: #2C2E33 (lighter for cards)
```

### 2.2. Text Colors

```css
/* Light Mode */
--text-primary: #1F2937 (gray-800)
--text-secondary: #6B7280 (gray-500)
--text-tertiary: #9CA3AF (gray-400)

/* Dark Mode */
--dark-text-primary: #E9ECEF (light gray, high contrast)
--dark-text-secondary: #ADB5BD (medium gray)
--dark-text-tertiary: #868E96 (low contrast for subtle text)
```

### 2.3. Accent Colors (Pastel - Adjusted for Dark Mode)

**Blue (Timetable/Lịch học):**
```css
Light: from-blue-400 to-cyan-400
Dark: from-blue-500 to-cyan-500 (slightly more vibrant)

Light bg: bg-blue-50, text: text-blue-600
Dark bg: bg-blue-900/30, text: text-blue-300
```

**Purple (Calendar/Lịch):**
```css
Light: from-purple-400 to-pink-400
Dark: from-purple-500 to-pink-500

Light bg: bg-purple-50, text: text-purple-600
Dark bg: bg-purple-900/30, text: text-purple-300
```

**Orange (Tasks/Nhiệm vụ):**
```css
Light: from-orange-400 to-pink-400
Dark: from-orange-500 to-pink-500

Light bg: bg-orange-50, text: text-orange-600
Dark bg: bg-orange-900/30, text: text-orange-300
```

**Green (Focus/Tập trung):**
```css
Light: from-green-400 to-emerald-400
Dark: from-green-500 to-emerald-500

Light bg: bg-green-50, text: text-green-600
Dark bg: bg-green-900/30, text: text-green-300
```

**Pink (Achive/Thành tựu):**
```css
Light: from-pink-400 to-rose-400
Dark: from-pink-500 to-rose-500

Light bg: bg-pink-50, text: text-pink-600
Dark bg: bg-pink-900/30, text: text-pink-300
```

### 2.4. Border & Shadow

```css
/* Light Mode */
--border-color: #E5E7EB (gray-200)
--border-light: #F3F4F6 (gray-100)
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

/* Dark Mode */
--dark-border-color: #373A40 (lighter than bg)
--dark-border-light: #2C2E33
--dark-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) (stronger shadow)
```

### 2.5. Gradient Backgrounds (cho các card đặc biệt)

```css
/* Light Mode */
from-blue-100 to-purple-100
from-pink-100 to-purple-100
from-blue-50/30 to-white

/* Dark Mode */
from-blue-900/20 to-purple-900/20
from-pink-900/20 to-purple-900/20
from-blue-900/10 to-dark-bg-primary
```

---

## 3. Implementation Strategy

### 3.1. State Management

**Tạo Context cho Theme:**
```typescript
// src/app/contexts/ThemeContext.tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  effectiveTheme: 'light' | 'dark'; // actual theme being used
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

// Lưu vào localStorage với key: 'daytrack_theme'
// Auto mode: detect system preference với window.matchMedia('(prefers-color-scheme: dark)')
```

**Tailwind Dark Mode Strategy:**
```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // sử dụng class-based dark mode
  // hoặc 'media' nếu chỉ dùng system preference
}
```

### 3.2. CSS Classes Structure

**Cách sử dụng:**
```tsx
// Thay vì:
<div className="bg-white text-gray-800">

// Sử dụng:
<div className="bg-white dark:bg-dark-bg-tertiary text-gray-800 dark:text-dark-text-primary">
```

**Tạo custom Tailwind classes:**
```css
/* src/styles/theme.css - Thêm vào */
.bg-primary {
  @apply bg-white dark:bg-[#1A1B1E];
}

.bg-secondary {
  @apply bg-gray-50 dark:bg-[#25262B];
}

.bg-card {
  @apply bg-white dark:bg-[#2C2E33];
}

.text-primary {
  @apply text-gray-800 dark:text-[#E9ECEF];
}

.text-secondary {
  @apply text-gray-500 dark:text-[#ADB5BD];
}

.border-default {
  @apply border-gray-200 dark:border-[#373A40];
}
```

---

## 4. Component-by-Component Specifications

### 4.1. Login.tsx

**Background gradient:**
```tsx
// Hiện tại:
bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50

// Dark mode:
dark:bg-gradient-to-br dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30
```

**Input fields:**
```tsx
// Hiện tại:
bg-white border-gray-200

// Dark mode:
dark:bg-dark-bg-tertiary dark:border-dark-border-color dark:text-dark-text-primary
dark:placeholder:text-dark-text-tertiary
```

**Buttons:**
```tsx
// Gradient buttons giữ nguyên vì đã có màu rõ ràng
// Nhưng có thể tăng opacity một chút:
bg-gradient-to-r from-blue-400 to-purple-400
dark:from-blue-500 dark:to-purple-500
```

### 4.2. BottomNav.tsx

**Background:**
```tsx
// Hiện tại:
bg-white/80 backdrop-blur-lg border-t border-gray-100

// Dark mode:
dark:bg-[#1A1B1E]/95 dark:backdrop-blur-lg dark:border-t dark:border-[#373A40]
```

**Icons:**
```tsx
// Active state giữ màu pastel
// Inactive state:
text-gray-400 dark:text-gray-500
```

### 4.3. Timetable.tsx

**Page background:**
```tsx
bg-gradient-to-b from-blue-50/30 to-white
dark:bg-gradient-to-b dark:from-blue-950/20 dark:to-[#1A1B1E]
```

**Header sticky:**
```tsx
bg-white/80 backdrop-blur-lg border-b border-gray-100
dark:bg-[#1A1B1E]/90 dark:border-[#373A40]
```

**Schedule blocks:**
```tsx
// Hiện tại: bg-blue-50 text-blue-600
// Dark mode: dark:bg-blue-900/30 dark:text-blue-300
// Border thêm để rõ hơn: dark:border dark:border-blue-800/50
```

**Week Overview card:**
```tsx
bg-blue-100
dark:bg-blue-900/20 dark:border dark:border-blue-800/30
```

**AI Assistant card:**
```tsx
bg-blue-50
dark:bg-blue-900/20 dark:border dark:border-blue-800/30
```

### 4.4. Calendar.tsx

**Calendar grid cells:**
```tsx
// Unselected:
bg-gray-50 text-gray-700
dark:bg-[#2C2E33] dark:text-gray-300

// Selected:
bg-purple-400 text-white
dark:bg-purple-500 dark:text-white

// Lock icon:
<Lock className="dark:text-purple-200" />
```

**Day schedule card:**
```tsx
bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/30
dark:bg-gradient-to-br dark:from-purple-950/20 dark:to-pink-950/20 
dark:border dark:border-purple-800/30
```

### 4.5. Tasks.tsx

**Search bar:**
```tsx
bg-gray-50 
dark:bg-[#2C2E33] dark:text-dark-text-primary
```

**Tab buttons:**
```tsx
// Active:
bg-orange-400 text-white
dark:bg-orange-500 dark:text-white

// Inactive:
bg-gray-50 text-gray-600
dark:bg-[#2C2E33] dark:text-gray-400
```

**Task cards:**
```tsx
bg-orange-50 text-orange-600
dark:bg-orange-900/30 dark:text-orange-300 dark:border dark:border-orange-800/50
```

### 4.6. Focus.tsx

**Timer circle:**
```tsx
bg-gradient-to-br from-green-100 to-emerald-100
dark:bg-gradient-to-br dark:from-green-950/30 dark:to-emerald-950/30
dark:border dark:border-green-800/30
```

**Progress circle stroke:**
```tsx
stroke="#10b981" (green-500)
dark:stroke="#34d399" (green-400 - brighter for dark bg)
```

**Music player:**
```tsx
bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200
dark:bg-gradient-to-r dark:from-pink-950/30 dark:to-purple-950/30 
dark:border dark:border-pink-800/30
```

**Music category buttons:**
```tsx
// Inactive:
bg-gray-50 text-gray-700
dark:bg-[#2C2E33] dark:text-gray-300

// Active (giữ gradient):
bg-gradient-to-r from-blue-400 to-cyan-400 text-white
dark:from-blue-500 dark:to-cyan-500
```

### 4.7. Achive.tsx

**Stats card:**
```tsx
bg-gradient-to-br from-pink-100 to-purple-100
dark:bg-gradient-to-br dark:from-pink-950/20 dark:to-purple-950/20
dark:border dark:border-pink-800/30
```

**Achievement group card:**
```tsx
bg-white border border-gray-100
dark:bg-[#2C2E33] dark:border dark:border-[#373A40]
```

**Sub-achievement items:**
```tsx
bg-gray-50
dark:bg-[#25262B]
```

**Progress bar:**
```tsx
// Background:
bg-gray-200 dark:bg-gray-700

// Fill (completed):
bg-gradient-to-r from-green-400 to-emerald-400
dark:from-green-500 dark:to-emerald-500

// Fill (in progress):
bg-gradient-to-r from-blue-400 to-purple-400
dark:from-blue-500 dark:to-purple-500
```

### 4.8. Settings & Sub-pages

**Settings.tsx:**
```tsx
// User profile card:
bg-gradient-to-br from-blue-100 to-purple-100
dark:bg-gradient-to-br dark:from-blue-950/20 dark:to-purple-950/20

// Settings items:
bg-white border border-gray-100
dark:bg-[#2C2E33] dark:border dark:border-[#373A40]

// Logout button:
bg-red-50 text-red-500 border border-red-100
dark:bg-red-950/30 dark:text-red-400 dark:border dark:border-red-900/50
```

**Notifications.tsx:**
```tsx
// Reminder cards với ring khi enabled:
ring-2 ring-purple-200/50
dark:ring-purple-800/50

// Toggle switch background (enabled):
bg-gradient-to-r from-purple-400 to-pink-400
dark:from-purple-500 dark:to-pink-500

// Toggle switch background (disabled):
bg-gray-200 dark:bg-gray-600
```

**Appearance.tsx:**
```tsx
// Theme preview cards:
border-2 border-gray-100 (unselected)
dark:border-[#373A40]

border-2 border-purple-400 (selected)
dark:border-purple-500

// Preview area:
bg-gradient-to-br from-blue-100 to-purple-100
dark:bg-gradient-to-br dark:from-blue-950/20 dark:to-purple-950/20
```

**About.tsx:**
```tsx
// Team member avatars (giữ gradient vì đã vibrant)

// Social contact cards:
bg-white border border-gray-100
dark:bg-[#2C2E33] dark:border dark:border-[#373A40]
```

### 4.9. Modal Components

**CreateScheduleModal.tsx:**
```tsx
// Backdrop:
bg-black/50 backdrop-blur-sm
dark:bg-black/70

// Modal content:
bg-white
dark:bg-[#2C2E33]

// Input fields:
bg-gray-50 border border-gray-200
dark:bg-[#25262B] dark:border dark:border-[#373A40]

// Color theme buttons (giữ màu gốc để user nhìn được màu thật):
bg-blue-100 border-blue-200
(không cần dark mode cho color picker)
```

---

## 5. Transition & Animation

### 5.1. Smooth Color Transition

**Thêm vào tất cả components:**
```tsx
className="... transition-colors duration-200"
```

**Root element:**
```tsx
// App.tsx hoặc index.html <html>
<html className={theme === 'dark' ? 'dark' : ''}>
  <body className="transition-colors duration-300">
```

### 5.2. Toggle Animation

**Appearance.tsx - Theme selector:**
```tsx
// Khi user click vào theme:
- Visual feedback với scale animation
- Smooth transition cho background color change
- Toast notification: "Đã chuyển sang chế độ tối" / "Đã chuyển sang chế độ sáng"
```

---

## 6. Implementation Steps (Thứ tự thực hiện)

### Bước 1: Setup Foundation
```typescript
1. Tạo ThemeContext.tsx với state management
2. Thêm ThemeProvider vào App.tsx
3. Setup localStorage persistence
4. Config Tailwind darkMode: 'class'
5. Thêm custom CSS variables vào theme.css
```

### Bước 2: Update Core Components
```typescript
6. Update App.tsx để apply dark class vào root
7. Update BottomNav.tsx (navigation bar)
8. Update PageContainer.tsx (wrapper component)
9. Update Logo.tsx nếu cần adjust cho dark bg
```

### Bước 3: Update Main Pages (theo thứ tự ưu tiên)
```typescript
10. Login.tsx & Profile.tsx
11. Timetable.tsx
12. Calendar.tsx
13. Tasks.tsx
14. Focus.tsx
15. Achive.tsx
```

### Bước 4: Update Settings
```typescript
16. Settings.tsx
17. Appearance.tsx (thêm theme toggle functionality)
18. Notifications.tsx
19. About.tsx
```

### Bước 5: Update Shared Components
```typescript
20. CreateScheduleModal.tsx
21. AIScheduleSuggestion.tsx
22. Các UI components khác nếu có
```

### Bước 6: Testing & Polish
```typescript
23. Test tất cả pages ở cả 2 modes
24. Check contrast ratios (accessibility)
25. Test transitions
26. Test auto mode với system preference
27. Fix any visual bugs
```

---

## 7. Code Snippets Mẫu

### 7.1. ThemeContext.tsx (Simplified)

```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('daytrack_theme') as Theme;
    if (saved) setThemeState(saved);
  }, []);

  // Listen to system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effectiveTheme = theme === 'auto' ? systemTheme : theme;

  // Apply theme to document
  useEffect(() => {
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('daytrack_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### 7.2. Appearance.tsx - Theme Toggle Integration

```typescript
import { useTheme } from '../contexts/ThemeContext';

export function Appearance() {
  const { theme, setTheme } = useTheme();
  
  // Existing themes array thêm functionality:
  const themes = [
    { 
      id: 'light' as const, 
      name: 'Chế độ sáng', 
      icon: Sun, 
      gradient: 'from-blue-100 to-purple-100' 
    },
    { 
      id: 'dark' as const, 
      name: 'Chế độ tối', 
      icon: Moon, 
      gradient: 'from-gray-700 to-gray-900' 
    },
    // ... other themes
  ];

  return (
    // ... existing code
    <button onClick={() => setTheme(theme.id)}>
      {/* ... */}
    </button>
  );
}
```

### 7.3. Example Component Update (Timetable.tsx header)

```typescript
// BEFORE:
<div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100">
  <h1 className="text-2xl text-blue-600 mb-1">
    {isTodayMode ? 'Hôm nay' : 'Lịch học'}
  </h1>
  <p className="text-sm text-gray-500">
    {isTodayMode ? 'Gợi ý AI hàng ngày' : 'Lịch trình tuần của bạn'}
  </p>
</div>

// AFTER:
<div className="sticky top-0 bg-white/80 dark:bg-[#1A1B1E]/90 backdrop-blur-lg z-10 px-6 py-6 border-b border-gray-100 dark:border-[#373A40] transition-colors">
  <h1 className="text-2xl text-blue-600 dark:text-blue-400 mb-1 transition-colors">
    {isTodayMode ? 'Hôm nay' : 'Lịch học'}
  </h1>
  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
    {isTodayMode ? 'Gợi ý AI hàng ngày' : 'Lịch trình tuần của bạn'}
  </p>
</div>
```

---

## 8. Accessibility Considerations

### 8.1. Contrast Ratios
- Text primary: minimum 7:1 (AAA level)
- Text secondary: minimum 4.5:1 (AA level)
- Interactive elements: minimum 3:1

### 8.2. Testing Tools
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker
- WAVE Browser Extension

### 8.3. User Preferences
- Respect system prefers-reduced-motion
- Provide manual theme toggle
- Remember user choice

---

## 9. Testing Checklist

### Visual Testing
- [ ] All pages render correctly in dark mode
- [ ] No white flashes during transition
- [ ] Gradient backgrounds look good
- [ ] Icons are visible and properly colored
- [ ] Shadows are visible but not harsh
- [ ] Input fields are clearly visible
- [ ] Modals have proper backdrop

### Functional Testing
- [ ] Theme persists after refresh
- [ ] Auto mode detects system preference
- [ ] Manual toggle works immediately
- [ ] No console errors
- [ ] Performance is not affected

### Accessibility Testing
- [ ] All text meets contrast requirements
- [ ] Focus indicators are visible
- [ ] Screen readers work properly
- [ ] Keyboard navigation works

---

## 10. Future Enhancements

### Phase 2 (Optional)
1. **Animated theme transition**: Smooth color morphing animation
2. **Scheduled dark mode**: Auto switch at sunset/sunrise
3. **OLED black mode**: True black (#000) for OLED screens
4. **Custom theme colors**: Let user pick their own accent colors
5. **High contrast mode**: For users with visual impairments

---

## 11. Notes & Best Practices

### Do's ✅
- Use semantic color names (`bg-primary`, not `bg-[#1A1B1E]`)
- Test on multiple screens (bright/dim lighting)
- Keep pastel aesthetic in dark mode
- Use CSS transitions for smooth changes
- Respect user's system preference

### Don'ts ❌
- Don't use pure black (#000000) for background
- Don't make colors too vibrant/harsh
- Don't forget to update shadows
- Don't ignore border colors
- Don't break the soft, minimal aesthetic

### Performance Tips
- Use CSS variables for theme colors
- Avoid inline styles when possible
- Use `transition-colors` only on necessary elements
- Consider using `will-change` for frequently changing elements

---

**Kết luận**: Dark mode của DayTrack cần giữ được tinh thần "Healthy productivity without pressure" với màu sắc soft, không gây áp lực mắt, và transition mượt mà. Focus vào user experience và accessibility.
