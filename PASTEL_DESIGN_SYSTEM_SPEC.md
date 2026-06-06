# DayTrack - Pastel Design System - Specification Chi tiết

## 1. Philosophy & Principles (Triết lý thiết kế)

### 1.1. Core Values
**"Healthy productivity without pressure"**
- Màu sắc nhẹ nhàng, không gây áp lực thị giác
- Soft, dreamy, calming aesthetic
- Minimal nhưng vẫn cheerful và friendly
- Tạo cảm giác peaceful, balanced, và organized

### 1.2. Pastel Color Psychology
- **Blue Pastel**: Calm, focus, trust, productivity
- **Purple Pastel**: Creativity, balance, spirituality
- **Pink Pastel**: Gentleness, care, warmth
- **Green Pastel**: Growth, health, freshness
- **Orange Pastel**: Energy, enthusiasm (soft version)
- **Yellow Pastel**: Happiness, optimism (very subtle)

### 1.3. Design Principles
1. **Low saturation, high lightness**: S: 40-60%, L: 70-85%
2. **Harmonious combinations**: Analogous & complementary colors
3. **Soft gradients**: Multi-stop gradients với smooth transitions
4. **Layering with opacity**: Sử dụng /10, /20, /30, /50 opacity
5. **White space**: Generous spacing để colors có thể "breathe"

---

## 2. Complete Pastel Color Palette

### 2.1. Primary Pastel Colors (Core Palette)

#### Soft Blue (Xanh dương nhẹ)
```css
/* Base Colors */
--pastel-blue-50:  #EFF6FF  /* Very light, for backgrounds */
--pastel-blue-100: #DBEAFE  /* Light, for hover states */
--pastel-blue-200: #BFDBFE  /* Medium light, for borders */
--pastel-blue-300: #93C5FD  /* Soft blue, for icons/accents */
--pastel-blue-400: #60A5FA  /* Main blue, for primary elements */
--pastel-blue-500: #3B82F6  /* Slightly darker, for emphasis */
--pastel-blue-600: #2563EB  /* Dark blue, for text on light bg */

/* Usage */
Timetable page: backgrounds, schedule blocks, headers
Focus timer: Progress indicators
Icons: Study-related features
```

#### Soft Purple (Tím nhẹ)
```css
--pastel-purple-50:  #FAF5FF
--pastel-purple-100: #F3E8FF
--pastel-purple-200: #E9D5FF
--pastel-purple-300: #D8B4FE
--pastel-purple-400: #C084FC
--pastel-purple-500: #A855F7
--pastel-purple-600: #9333EA

/* Usage */
Calendar page: backgrounds, day selections
Settings: UI elements
Notifications: Reminder cards
```

#### Soft Pink (Hồng nhẹ)
```css
--pastel-pink-50:  #FDF2F8
--pastel-pink-100: #FCE7F3
--pastel-pink-200: #FBCFE8
--pastel-pink-300: #F9A8D4
--pastel-pink-400: #F472B6
--pastel-pink-500: #EC4899
--pastel-pink-600: #DB2777

/* Usage */
Achive page: backgrounds, achievement cards
Profile: User info sections
Love/care themed elements
```

#### Soft Green (Xanh lá nhẹ)
```css
--pastel-green-50:  #F0FDF4
--pastel-green-100: #DCFCE7
--pastel-green-200: #BBF7D0
--pastel-green-300: #86EFAC
--pastel-green-400: #4ADE80
--pastel-green-500: #22C55E
--pastel-green-600: #16A34A

/* Usage */
Focus page: Timer backgrounds, success states
Completed tasks: Checkmarks, progress bars
Health/wellness indicators
```

#### Soft Orange (Cam nhẹ)
```css
--pastel-orange-50:  #FFF7ED
--pastel-orange-100: #FFEDD5
--pastel-orange-200: #FED7AA
--pastel-orange-300: #FDBA74
--pastel-orange-400: #FB923C
--pastel-orange-500: #F97316
--pastel-orange-600: #EA580C

/* Usage */
Tasks page: backgrounds, priority indicators
Deadlines: Warning states (soft)
Energy-related features
```

#### Soft Yellow (Vàng nhẹ - Accent)
```css
--pastel-yellow-50:  #FEFCE8
--pastel-yellow-100: #FEF9C3
--pastel-yellow-200: #FEF08A
--pastel-yellow-300: #FDE047
--pastel-yellow-400: #FACC15
--pastel-yellow-500: #EAB308
--pastel-yellow-600: #CA8A04

/* Usage */
Highlights: Important information
Stars: Achievement icons
Sunshine: Morning reminders
```

#### Soft Cyan (Xanh cyan nhẹ)
```css
--pastel-cyan-50:  #ECFEFF
--pastel-cyan-100: #CFFAFE
--pastel-cyan-200: #A5F3FC
--pastel-cyan-300: #67E8F9
--pastel-cyan-400: #22D3EE
--pastel-cyan-500: #06B6D4
--pastel-cyan-600: #0891B2

/* Usage */
Gradient combinations with blue
Water/refresh related features
Cool accents
```

#### Soft Rose (Hồng đào nhẹ)
```css
--pastel-rose-50:  #FFF1F2
--pastel-rose-100: #FFE4E6
--pastel-rose-200: #FECDD3
--pastel-rose-300: #FDA4AF
--pastel-rose-400: #FB7185
--pastel-rose-500: #F43F5E
--pastel-rose-600: #E11D48

/* Usage */
Gradient combinations with pink
Love/care features
Gentle warnings
```

### 2.2. Neutral Pastels (Grays with warmth)

```css
/* Warm Grays - slight hint of color */
--pastel-gray-50:  #FAFAF9  /* Almost white, warm tint */
--pastel-gray-100: #F5F5F4  /* Very light gray */
--pastel-gray-200: #E7E5E4  /* Light gray, for borders */
--pastel-gray-300: #D6D3D1  /* Medium gray */
--pastel-gray-400: #A8A29E  /* Text gray, secondary */
--pastel-gray-500: #78716C  /* Text gray, tertiary */
--pastel-gray-600: #57534E  /* Dark gray, headings */
--pastel-gray-700: #44403C  /* Very dark gray */
--pastel-gray-800: #292524  /* Near black */

/* Cool Grays - slight blue tint */
--pastel-slate-50:  #F8FAFC
--pastel-slate-100: #F1F5F9
--pastel-slate-200: #E2E8F0
--pastel-slate-300: #CBD5E1
--pastel-slate-400: #94A3B8
--pastel-slate-500: #64748B
--pastel-slate-600: #475569
```

### 2.3. Gradient Combinations (Pre-defined)

#### Two-Color Gradients
```css
/* Blue Family */
--gradient-blue-purple: linear-gradient(135deg, #60A5FA 0%, #A855F7 100%)
--gradient-blue-cyan:   linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)
--gradient-blue-pink:   linear-gradient(135deg, #60A5FA 0%, #F472B6 100%)

/* Purple Family */
--gradient-purple-pink:  linear-gradient(135deg, #A855F7 0%, #F472B6 100%)
--gradient-purple-blue:  linear-gradient(135deg, #C084FC 0%, #93C5FD 100%)
--gradient-purple-rose:  linear-gradient(135deg, #C084FC 0%, #FDA4AF 100%)

/* Pink Family */
--gradient-pink-rose:    linear-gradient(135deg, #F472B6 0%, #FB7185 100%)
--gradient-pink-orange:  linear-gradient(135deg, #F472B6 0%, #FB923C 100%)

/* Green Family */
--gradient-green-cyan:   linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)
--gradient-green-emerald: linear-gradient(135deg, #4ADE80 0%, #34D399 100%)

/* Orange Family */
--gradient-orange-pink:  linear-gradient(135deg, #FB923C 0%, #F472B6 100%)
--gradient-orange-yellow: linear-gradient(135deg, #FB923C 0%, #FACC15 100%)

/* Warm Sunset */
--gradient-sunset:       linear-gradient(135deg, #FACC15 0%, #FB923C 50%, #F472B6 100%)

/* Cool Sky */
--gradient-sky:          linear-gradient(135deg, #93C5FD 0%, #C084FC 50%, #F9A8D4 100%)
```

#### Three-Color Gradients (Special)
```css
/* Rainbow Pastels */
--gradient-rainbow-soft: linear-gradient(135deg, 
  #93C5FD 0%,    /* Soft Blue */
  #C084FC 33%,   /* Soft Purple */
  #F9A8D4 66%,   /* Soft Pink */
  #FDBA74 100%   /* Soft Orange */
)

/* Morning Glow */
--gradient-morning: linear-gradient(135deg,
  #FEF08A 0%,    /* Soft Yellow */
  #FDBA74 50%,   /* Soft Orange */
  #F9A8D4 100%   /* Soft Pink */
)

/* Ocean Dream */
--gradient-ocean: linear-gradient(135deg,
  #67E8F9 0%,    /* Cyan */
  #60A5FA 50%,   /* Blue */
  #C084FC 100%   /* Purple */
)

/* Garden Fresh */
--gradient-garden: linear-gradient(135deg,
  #FEF08A 0%,    /* Yellow */
  #86EFAC 50%,   /* Green */
  #67E8F9 100%   /* Cyan */
)
```

#### Background Gradients (Subtle, for page backgrounds)
```css
/* Very subtle, almost invisible */
--bg-gradient-blue: linear-gradient(180deg, 
  rgba(219, 234, 254, 0.3) 0%,   /* blue-100 with 30% opacity */
  rgba(255, 255, 255, 1) 100%
)

--bg-gradient-purple: linear-gradient(180deg,
  rgba(243, 232, 255, 0.3) 0%,   /* purple-100 */
  rgba(255, 255, 255, 1) 100%
)

--bg-gradient-pink: linear-gradient(180deg,
  rgba(252, 231, 243, 0.3) 0%,   /* pink-100 */
  rgba(255, 255, 255, 1) 100%
)

--bg-gradient-multi: linear-gradient(180deg,
  rgba(219, 234, 254, 0.2) 0%,   /* blue */
  rgba(243, 232, 255, 0.2) 50%,  /* purple */
  rgba(252, 231, 243, 0.2) 100%  /* pink */
)
```

---

## 3. Typography with Pastel Colors

### 3.1. Text Color Scale

```css
/* Primary Text - Headings */
--text-heading: #292524          /* Gray-800, strong contrast */
--text-heading-soft: #44403C     /* Gray-700, slightly softer */

/* Body Text */
--text-body-primary: #57534E     /* Gray-600, readable */
--text-body-secondary: #78716C   /* Gray-500, less emphasis */
--text-body-tertiary: #A8A29E    /* Gray-400, subtle */

/* Colored Text (on white bg) */
--text-blue: #2563EB     /* Blue-600, readable */
--text-purple: #9333EA   /* Purple-600 */
--text-pink: #DB2777     /* Pink-600 */
--text-green: #16A34A    /* Green-600 */
--text-orange: #EA580C   /* Orange-600 */

/* Colored Text (on colored bg) */
--text-on-blue: #1E3A8A      /* Blue-900 */
--text-on-purple: #581C87    /* Purple-900 */
--text-on-pink: #831843      /* Pink-900 */
--text-on-green: #14532D     /* Green-900 */
--text-on-orange: #7C2D12    /* Orange-900 */
```

### 3.2. Font Size Scale (for Pastel Design)

```css
/* Display - For landing/welcome screens */
--text-4xl: 2.25rem  /* 36px - Large headings */
--text-3xl: 1.875rem /* 30px - Page titles */
--text-2xl: 1.5rem   /* 24px - Section headings */
--text-xl:  1.25rem  /* 20px - Card titles */
--text-lg:  1.125rem /* 18px - Emphasized text */

/* Body */
--text-base: 1rem    /* 16px - Normal text */
--text-sm:   0.875rem /* 14px - Secondary text */
--text-xs:   0.75rem  /* 12px - Captions, labels */

/* Font Weights */
--font-light:  300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold:   700
```

---

## 4. Spacing & Layout (Pastel Design System)

### 4.1. Spacing Scale

```css
/* Base unit: 4px */
--space-1:  0.25rem  /* 4px  - Tiny gaps */
--space-2:  0.5rem   /* 8px  - Small gaps */
--space-3:  0.75rem  /* 12px - Default small */
--space-4:  1rem     /* 16px - Default medium */
--space-5:  1.25rem  /* 20px - Default large */
--space-6:  1.5rem   /* 24px - Section gaps */
--space-8:  2rem     /* 32px - Large sections */
--space-10: 2.5rem   /* 40px - Very large */
--space-12: 3rem     /* 48px - Extra large */
--space-16: 4rem     /* 64px - Huge */

/* Semantic Spacing */
--gap-xs:   0.5rem   /* 8px  - Between small elements */
--gap-sm:   1rem     /* 16px - Between medium elements */
--gap-md:   1.5rem   /* 24px - Between cards */
--gap-lg:   2rem     /* 32px - Between sections */
--gap-xl:   3rem     /* 48px - Between major sections */

/* Padding for Cards */
--card-padding-sm: 0.75rem  /* 12px - Compact cards */
--card-padding-md: 1rem     /* 16px - Normal cards */
--card-padding-lg: 1.5rem   /* 24px - Spacious cards */
--card-padding-xl: 2rem     /* 32px - Hero cards */
```

### 4.2. Border Radius (Soft, Rounded)

```css
/* Pastel design đặc trưng: rounded corners */
--radius-sm:   0.5rem   /* 8px  - Small elements */
--radius-md:   0.75rem  /* 12px - Buttons, inputs */
--radius-lg:   1rem     /* 16px - Cards */
--radius-xl:   1.5rem   /* 24px - Large cards */
--radius-2xl:  2rem     /* 32px - Special cards */
--radius-3xl:  3rem     /* 48px - Hero elements */
--radius-full: 9999px   /* Full circle - Avatars, badges */

/* Semantic Radius */
--button-radius:  0.75rem  /* 12px */
--input-radius:   1rem     /* 16px */
--card-radius:    1.5rem   /* 24px */
--modal-radius:   2rem     /* 32px */
```

---

## 5. Shadows & Elevation (Soft & Subtle)

### 5.1. Shadow Scale

```css
/* Pastel shadows: soft, colored, subtle */

/* Basic Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08),
             0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07),
             0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08),
             0 4px 6px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1),
             0 10px 10px rgba(0, 0, 0, 0.04)

/* Colored Shadows (for pastel elements) */
--shadow-blue:   0 4px 14px rgba(96, 165, 250, 0.25)   /* blue-400 */
--shadow-purple: 0 4px 14px rgba(168, 85, 247, 0.25)   /* purple-400 */
--shadow-pink:   0 4px 14px rgba(244, 114, 182, 0.25)  /* pink-400 */
--shadow-green:  0 4px 14px rgba(74, 222, 128, 0.25)   /* green-400 */
--shadow-orange: 0 4px 14px rgba(251, 146, 60, 0.25)   /* orange-400 */

/* Layered Colored Shadows (extra soft) */
--shadow-blue-lg: 0 10px 20px rgba(96, 165, 250, 0.15),
                  0 3px 6px rgba(96, 165, 250, 0.1)

--shadow-purple-lg: 0 10px 20px rgba(168, 85, 247, 0.15),
                    0 3px 6px rgba(168, 85, 247, 0.1)

--shadow-pink-lg: 0 10px 20px rgba(244, 114, 182, 0.15),
                  0 3px 6px rgba(244, 114, 182, 0.1)

/* Gradient Shadows */
--shadow-gradient-blue-purple: 0 8px 16px rgba(96, 165, 250, 0.2),
                                0 4px 8px rgba(168, 85, 247, 0.15)
```

### 5.2. Inner Shadows (Subtle Depth)

```css
/* For inputs, pressed states */
--shadow-inner-sm: inset 0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-inner-md: inset 0 2px 4px rgba(0, 0, 0, 0.08)

/* Colored inner shadows */
--shadow-inner-blue: inset 0 2px 4px rgba(96, 165, 250, 0.15)
```

---

## 6. Component-Specific Pastel Specifications

### 6.1. Buttons

#### Primary Button (Gradient)
```css
/* Normal State */
background: linear-gradient(135deg, #60A5FA 0%, #A855F7 100%)
color: white
padding: 0.75rem 1.5rem (12px 24px)
border-radius: 0.75rem (12px)
box-shadow: 0 4px 14px rgba(96, 165, 250, 0.25)
font-weight: 500
transition: all 200ms ease

/* Hover State */
background: linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)
box-shadow: 0 6px 20px rgba(96, 165, 250, 0.35)
transform: translateY(-1px)

/* Active/Pressed State */
box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2)
transform: translateY(0)
```

#### Secondary Button (Soft Background)
```css
background: #DBEAFE (blue-100)
color: #2563EB (blue-600)
border: 1px solid #BFDBFE (blue-200)
padding: 0.75rem 1.5rem
border-radius: 0.75rem
transition: all 200ms ease

/* Hover */
background: #BFDBFE (blue-200)
border-color: #93C5FD (blue-300)
```

#### Ghost Button (Minimal)
```css
background: transparent
color: #2563EB (blue-600)
border: none
padding: 0.75rem 1.5rem
border-radius: 0.75rem
transition: all 200ms ease

/* Hover */
background: #EFF6FF (blue-50)
```

### 6.2. Input Fields

```css
/* Text Input */
background: white
border: 2px solid #E2E8F0 (slate-200)
border-radius: 1rem (16px)
padding: 0.75rem 1rem (12px 16px)
color: #292524 (gray-800)
font-size: 1rem
transition: all 200ms ease

/* Focus State */
border-color: #60A5FA (blue-400)
box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1)
outline: none

/* With Icon */
padding-left: 2.5rem (40px) /* space for icon */

/* Placeholder */
color: #94A3B8 (slate-400)
```

### 6.3. Cards

#### Basic Card
```css
background: white
border: 1px solid #E2E8F0 (slate-200)
border-radius: 1.5rem (24px)
padding: 1.5rem (24px)
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08)
transition: all 200ms ease

/* Hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
transform: translateY(-2px)
```

#### Gradient Card (Hero/Featured)
```css
background: linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 100%)
border: 1px solid rgba(147, 197, 253, 0.3)
border-radius: 2rem (32px)
padding: 2rem (32px)
box-shadow: 0 4px 14px rgba(96, 165, 250, 0.15)
```

#### Colored Card (Schedule Block, Task)
```css
/* Blue variant */
background: #DBEAFE (blue-100)
color: #1E3A8A (blue-900)
border: 1px solid #93C5FD (blue-300)
border-radius: 1rem (16px)
padding: 1rem (16px)
box-shadow: 0 2px 8px rgba(96, 165, 250, 0.15)
```

### 6.4. Modals & Overlays

```css
/* Backdrop */
background: rgba(0, 0, 0, 0.4)
backdrop-filter: blur(8px)

/* Modal Container */
background: white
border-radius: 2rem (32px)
padding: 2rem (32px)
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
max-width: 90vw
max-height: 90vh
```

### 6.5. Badges & Tags

```css
/* Small Badge */
background: #DBEAFE (blue-100)
color: #1E3A8A (blue-900)
padding: 0.25rem 0.75rem (4px 12px)
border-radius: 9999px (full)
font-size: 0.75rem (12px)
font-weight: 500
border: 1px solid #93C5FD (blue-300)
```

### 6.6. Progress Bars

```css
/* Container */
background: #E2E8F0 (slate-200)
height: 0.5rem (8px)
border-radius: 9999px (full)
overflow: hidden

/* Fill */
background: linear-gradient(90deg, #60A5FA 0%, #A855F7 100%)
height: 100%
border-radius: 9999px
transition: width 300ms ease
box-shadow: 0 0 8px rgba(96, 165, 250, 0.3)
```

### 6.7. Toggle Switches

```css
/* Container (off) */
background: #CBD5E1 (slate-300)
width: 3rem (48px)
height: 1.75rem (28px)
border-radius: 9999px
position: relative
transition: background 200ms ease

/* Container (on) */
background: linear-gradient(90deg, #60A5FA 0%, #A855F7 100%)

/* Knob */
background: white
width: 1.25rem (20px)
height: 1.25rem (20px)
border-radius: 9999px
position: absolute
top: 0.25rem (4px)
left: 0.25rem (4px) /* off */
left: 1.5rem (24px) /* on */
transition: left 200ms ease
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
```

### 6.8. Navigation Bar (Bottom)

```css
background: rgba(255, 255, 255, 0.8)
backdrop-filter: blur(16px)
border-top: 1px solid rgba(226, 232, 240, 0.5)
padding: 0.75rem 0 (12px 0)
box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05)

/* Icon (inactive) */
color: #94A3B8 (slate-400)

/* Icon (active) */
color: #60A5FA (blue-400) /* or respective page color */
```

---

## 7. Page-Specific Color Schemes

### 7.1. Login Page

```css
/* Background Gradient */
background: linear-gradient(135deg,
  rgba(219, 234, 254, 0.3) 0%,   /* blue-100 */
  rgba(243, 232, 255, 0.3) 50%,  /* purple-100 */
  rgba(252, 231, 243, 0.3) 100%  /* pink-100 */
)

/* Logo Container */
background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #F472B6 100%)
border-radius: 2rem

/* Input Cards */
background: white
box-shadow: 0 4px 12px rgba(96, 165, 250, 0.1)
```

### 7.2. Timetable Page (Lịch học - Blue Theme)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(219, 234, 254, 0.3) 0%,
  white 100%
)

/* Header */
color-title: #2563EB (blue-600)
color-subtitle: #64748B (slate-500)

/* Schedule Blocks - Color Variations */
/* Monday */ background: #DBEAFE, text: #1E3A8A, border: #93C5FD
/* Tuesday */ background: #E9D5FF, text: #581C87, border: #D8B4FE
/* Wednesday */ background: #DCFCE7, text: #14532D, border: #86EFAC
/* Thursday */ background: #FFEDD5, text: #7C2D12, border: #FDBA74
/* Friday */ background: #FCE7F3, text: #831843, border: #F9A8D4

/* Week Overview Card */
background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)
border: 1px solid #93C5FD
text-primary: #1E3A8A
text-secondary: #2563EB

/* AI Assistant Card */
background: linear-gradient(135deg, #DBEAFE 0%, #E9D5FF 100%)
border: 1px solid #93C5FD
```

### 7.3. Calendar Page (Lịch - Purple Theme)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(243, 232, 255, 0.3) 0%,
  white 100%
)

/* Header */
color-title: #9333EA (purple-600)

/* Calendar Grid */
/* Unselected Day */
background: #F5F5F4 (gray-100)
color: #44403C (gray-700)

/* Selected Day */
background: #C084FC (purple-400)
color: white
box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3)

/* Lock Icon */
color: rgba(192, 132, 252, 0.6)

/* Day Schedule Card */
background: linear-gradient(135deg,
  rgba(243, 232, 255, 0.5) 0%,
  rgba(252, 231, 243, 0.5) 100%
)
border: 1px solid rgba(216, 180, 254, 0.3)
```

### 7.4. Tasks Page (Nhiệm vụ - Orange Theme)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(255, 237, 213, 0.3) 0%,
  white 100%
)

/* Header */
color-title: #EA580C (orange-600)

/* Search Bar */
background: #FFF7ED (orange-50)
border: 1px solid #FED7AA (orange-200)

/* Tab Active */
background: #FB923C (orange-400)
color: white
box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3)

/* Task Cards by Priority */
/* High */    background: #FEE2E2, text: #991B1B, border: #FCA5A5 (red)
/* Medium */  background: #FFEDD5, text: #7C2D12, border: #FDBA74 (orange)
/* Low */     background: #DBEAFE, text: #1E3A8A, border: #93C5FD (blue)
```

### 7.5. Focus Page (Tập trung - Green Theme)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(220, 252, 231, 0.3) 0%,
  white 100%
)

/* Header */
color-title: #16A34A (green-600)

/* Timer Circle */
background: linear-gradient(135deg, #DCFCE7 0%, #A7F3D0 100%)
box-shadow: 0 8px 20px rgba(74, 222, 128, 0.2)

/* Progress Circle */
stroke: #22C55E (green-500)

/* Music Player */
background: linear-gradient(135deg,
  rgba(252, 231, 243, 0.8) 0%,
  rgba(233, 213, 255, 0.8) 100%
)
border: 1px solid rgba(244, 114, 182, 0.3)

/* Music Category - Active */
background: linear-gradient(135deg,
  /* Học tập */ #60A5FA to #22D3EE
  /* Làm việc */ #A855F7 to #F472B6
  /* Tập luyện */ #FB923C to #F43F5E
  /* Thư giãn */ #4ADE80 to #34D399
  /* Tập trung sâu */ #6366F1 to #A855F7
)
```

### 7.6. Achive Page (Thành tựu - Pink Theme)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(252, 231, 243, 0.3) 0%,
  white 100%
)

/* Header */
color-title: #DB2777 (pink-600)

/* Stats Card */
background: linear-gradient(135deg,
  rgba(252, 231, 243, 0.8) 0%,
  rgba(233, 213, 255, 0.8) 100%
)
border: 1px solid rgba(249, 168, 212, 0.3)

/* Achievement Group Icons (Gradient Backgrounds) */
/* Study Master */      background: linear-gradient(135deg, #FACC15 0%, #FB923C 100%)
/* Consistency */       background: linear-gradient(135deg, #A855F7 0%, #F472B6 100%)
/* Balanced Life */     background: linear-gradient(135deg, #F472B6 0%, #FB7185 100%)
/* Task Crusher */      background: linear-gradient(135deg, #60A5FA 0%, #22D3EE 100%)
/* Focus Master */      background: linear-gradient(135deg, #4ADE80 0%, #34D399 100%)

/* Progress Bar */
background-track: #E2E8F0 (slate-200)
background-fill-complete: linear-gradient(90deg, #4ADE80 0%, #34D399 100%)
background-fill-progress: linear-gradient(90deg, #60A5FA 0%, #A855F7 100%)
```

### 7.7. Settings Page (Cài đặt - Gray/Multi)

```css
/* Page Background */
background: linear-gradient(180deg,
  rgba(248, 250, 252, 1) 0%,
  white 100%
)

/* User Profile Card */
background: linear-gradient(135deg,
  rgba(219, 234, 254, 0.8) 0%,
  rgba(233, 213, 255, 0.8) 100%
)

/* Settings Item Icons */
/* Profile */      background: #DBEAFE, color: #2563EB
/* Notifications */ background: #E9D5FF, color: #9333EA
/* Appearance */    background: #FCE7F3, color: #DB2777
/* About */         background: #FFEDD5, color: #EA580C

/* Logout Button */
background: rgba(254, 226, 226, 0.5) (red-100 with opacity)
color: #DC2626 (red-600)
border: 1px solid rgba(252, 165, 165, 0.5)
```

---

## 8. Animation & Transitions

### 8.1. Timing Functions

```css
/* Easing Functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)      /* Default smooth */
--ease-out: cubic-bezier(0, 0, 0.2, 1)           /* Elements appearing */
--ease-in: cubic-bezier(0.4, 0, 1, 1)            /* Elements disappearing */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Playful bounce */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275) /* Spring effect */
```

### 8.2. Transition Durations

```css
--duration-fast: 150ms    /* Quick interactions */
--duration-normal: 200ms  /* Default transitions */
--duration-slow: 300ms    /* Smooth, emphasized */
--duration-slower: 500ms  /* Very smooth */
```

### 8.3. Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: fadeIn 300ms ease-out forwards;
```

#### Scale Pop
```css
@keyframes scalePop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

animation: scalePop 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### Slide In
```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

animation: slideIn 300ms ease-out;
```

#### Gentle Pulse (for important elements)
```css
@keyframes gentlePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

animation: gentlePulse 2s ease-in-out infinite;
```

#### Gradient Shift (background animation)
```css
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

background: linear-gradient(135deg, #60A5FA, #A855F7, #F472B6);
background-size: 200% 200%;
animation: gradientShift 15s ease infinite;
```

---

## 9. Accessibility with Pastel Colors

### 9.1. Contrast Ratios

**WCAG 2.1 Requirements:**
- Normal text (< 18px): minimum 4.5:1 (AA), 7:1 (AAA)
- Large text (≥ 18px or ≥ 14px bold): minimum 3:1 (AA), 4.5:1 (AAA)
- UI components: minimum 3:1

**Pastel Color Adjustments for Accessibility:**

```css
/* ❌ Too light for text on white */
color: #93C5FD (blue-300) on white - contrast ratio ~2.1:1

/* ✅ Adjusted for readability */
color: #2563EB (blue-600) on white - contrast ratio ~7.9:1

/* For colored backgrounds */
background: #DBEAFE (blue-100)
color: #1E3A8A (blue-900) - contrast ratio ~10.4:1 ✅

/* For dark text on pastel backgrounds */
background: #FCE7F3 (pink-100)
color: #831843 (pink-900) - contrast ratio ~9.2:1 ✅
```

### 9.2. Color-Blind Friendly Combinations

```css
/* Use both color AND shape/icon */
/* Priority indicators */
High priority: Red + "!" icon
Medium priority: Orange + "-" icon
Low priority: Blue + "·" icon

/* Status indicators */
Completed: Green + checkmark ✓
In progress: Blue + arrow →
Pending: Gray + circle ○
```

### 9.3. Focus States (Keyboard Navigation)

```css
/* Focus ring - highly visible */
*:focus {
  outline: 2px solid #60A5FA;
  outline-offset: 2px;
  border-radius: inherit;
}

/* Focus ring cho từng màu */
.btn-blue:focus {
  outline-color: #2563EB;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.btn-purple:focus {
  outline-color: #9333EA;
  box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.2);
}
```

---

## 10. Implementation Guide

### 10.1. File Structure

```
src/
├── styles/
│   ├── theme.css              # CSS variables định nghĩa
│   ├── pastel-colors.css      # Pastel color classes
│   ├── components.css         # Component-specific styles
│   ├── animations.css         # Animation keyframes
│   └── utilities.css          # Utility classes
├── app/
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
```

### 10.2. CSS Variables Setup

```css
/* src/styles/theme.css */
:root {
  /* Pastel Primary Colors */
  --pastel-blue-50: #EFF6FF;
  --pastel-blue-100: #DBEAFE;
  /* ... define all colors */
  
  /* Gradients */
  --gradient-blue-purple: linear-gradient(135deg, #60A5FA 0%, #A855F7 100%);
  /* ... */
  
  /* Spacing */
  --space-1: 0.25rem;
  /* ... */
  
  /* Typography */
  --text-4xl: 2.25rem;
  /* ... */
  
  /* Shadows */
  --shadow-blue: 0 4px 14px rgba(96, 165, 250, 0.25);
  /* ... */
}
```

### 10.3. Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'pastel-blue': {
          50: '#EFF6FF',
          100: '#DBEAFE',
          // ...
        },
        'pastel-purple': {
          // ...
        },
        // ... all pastel colors
      },
      backgroundImage: {
        'gradient-blue-purple': 'linear-gradient(135deg, #60A5FA 0%, #A855F7 100%)',
        // ... all gradients
      },
      boxShadow: {
        'blue': '0 4px 14px rgba(96, 165, 250, 0.25)',
        'blue-lg': '0 10px 20px rgba(96, 165, 250, 0.15), 0 3px 6px rgba(96, 165, 250, 0.1)',
        // ... all colored shadows
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
    },
  },
}
```

### 10.4. Component Examples

#### Button Component
```typescript
// src/app/components/ui/Button.tsx
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange';

interface ButtonProps {
  variant?: ButtonVariant;
  color?: ButtonColor;
  children: React.ReactNode;
  // ...
}

export function Button({ 
  variant = 'primary', 
  color = 'blue',
  children,
  // ...
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-200";
  
  const variantStyles = {
    primary: {
      blue: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-blue hover:shadow-blue-lg",
      purple: "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-purple hover:shadow-purple-lg",
      // ...
    },
    secondary: {
      blue: "bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200",
      purple: "bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200",
      // ...
    },
    ghost: {
      blue: "text-blue-600 hover:bg-blue-50",
      purple: "text-purple-600 hover:bg-purple-50",
      // ...
    },
  };
  
  return (
    <button className={`${baseStyles} ${variantStyles[variant][color]}`}>
      {children}
    </button>
  );
}
```

#### Card Component
```typescript
// src/app/components/ui/Card.tsx
type CardVariant = 'default' | 'gradient' | 'colored';
type CardColor = 'blue' | 'purple' | 'pink' | 'green' | 'orange';

interface CardProps {
  variant?: CardVariant;
  color?: CardColor;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = 'default',
  color = 'blue',
  children,
  className = '',
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-200";
  
  const variantStyles = {
    default: "bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md",
    gradient: {
      blue: "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/30 p-8 shadow-blue",
      purple: "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/30 p-8 shadow-purple",
      // ...
    },
    colored: {
      blue: "bg-blue-100 text-blue-900 border border-blue-300 p-4 shadow-blue",
      purple: "bg-purple-100 text-purple-900 border border-purple-300 p-4 shadow-purple",
      // ...
    },
  };
  
  const styles = variant === 'default' 
    ? variantStyles.default 
    : variantStyles[variant][color];
  
  return (
    <div className={`${baseStyles} ${styles} ${className}`}>
      {children}
    </div>
  );
}
```

---

## 11. Best Practices & Guidelines

### 11.1. Do's ✅

1. **Use pastel colors for backgrounds, borders, and non-critical elements**
   - Cards, sections, page backgrounds
   - Subtle highlights and accents

2. **Use darker shades for text and important UI elements**
   - Headings: gray-800, gray-700
   - Body text: gray-600, gray-500
   - Colored text: color-600 shades

3. **Combine gradients thoughtfully**
   - Use analogous colors (blue → purple → pink)
   - Keep it subtle for backgrounds
   - Use vibrant gradients for CTAs

4. **Add colored shadows to match the element**
   - Blue button → blue shadow
   - Makes design cohesive and dreamy

5. **Use white space generously**
   - Let pastel colors breathe
   - Don't overcrowd with colors

6. **Layer with opacity**
   - /10, /20, /30 for subtle backgrounds
   - Creates depth without harshness

### 11.2. Don'ts ❌

1. **Don't use pastel colors for important text**
   - Low contrast = poor readability
   - Always check contrast ratios

2. **Don't mix too many colors at once**
   - Stick to 2-3 colors per screen
   - Create visual hierarchy

3. **Don't use pure saturation**
   - Keep saturation below 60% for pastels
   - Avoid harsh, vibrant colors

4. **Don't forget about dark mode**
   - Pastel colors need adjustment for dark backgrounds
   - Test in both modes

5. **Don't use pastel for error states**
   - Errors need attention → use stronger reds
   - But keep it softer than harsh #FF0000

6. **Don't ignore accessibility**
   - Always test contrast
   - Provide alternative indicators (icons, shapes)

### 11.3. Color Pairing Rules

**Harmonious Combinations:**
```
Blue + Purple ✅
Purple + Pink ✅
Pink + Rose ✅
Green + Cyan ✅
Orange + Pink ✅
Yellow + Orange ✅

Blue + Orange ⚠️ (use carefully, complementary - high contrast)
Purple + Green ⚠️ (can work but test first)
Pink + Green ❌ (avoid, can look muddy)
```

**Gradient Directions:**
- 135deg: Most natural, diagonal
- 180deg: Top to bottom, calm
- 90deg: Left to right, dynamic
- Radial: For spotlight effects

---

## 12. Testing Checklist

### Visual Testing
- [ ] All pastel colors render correctly
- [ ] Gradients are smooth, no banding
- [ ] Shadows are soft and subtle
- [ ] Border radius is consistent
- [ ] Spacing feels balanced

### Accessibility Testing
- [ ] Text contrast ratios meet WCAG AA (minimum)
- [ ] Focus states are clearly visible
- [ ] Color is not the only indicator
- [ ] Works with screen readers
- [ ] Keyboard navigation works

### Cross-browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Safari (WebKit)
- [ ] Firefox (Gecko)
- [ ] Mobile browsers

### Performance Testing
- [ ] Gradients don't cause jank
- [ ] Shadows don't impact scroll performance
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts

---

## 13. Future Enhancements

### Phase 2
1. **Seasonal Color Themes**
   - Spring: More greens and yellows
   - Summer: Brighter, warmer pastels
   - Autumn: Orange and warm tones
   - Winter: Cool blues and purples

2. **User-customizable Accent Color**
   - Let user pick their favorite pastel
   - Apply throughout the app

3. **Dynamic Gradients**
   - Gradients that shift based on time of day
   - Morning: warm (yellow-orange-pink)
   - Afternoon: cool (blue-purple)
   - Evening: soft (purple-pink-rose)

4. **Glassmorphism Effects**
   - Frosted glass cards
   - Backdrop blur with pastel tints

---

**Kết luận**: Pastel design system của DayTrack tạo ra một môi trường làm việc nhẹ nhàng, thư giãn, giúp người dùng cảm thấy thoải mái và motivated mà không bị overwhelmed. Tất cả các màu sắc, spacing, và effects đều được thiết kế để support "Healthy productivity without pressure".
