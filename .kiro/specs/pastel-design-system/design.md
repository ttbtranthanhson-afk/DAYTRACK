# Pastel Design System — Design Document

## Overview

DayTrack's Pastel Design System is a soft, calming visual language built on the philosophy of "healthy productivity without pressure." The system layers pastel color tokens, gradient combinations, rounded components, and page-specific color schemes on top of the existing shadcn/ui + Tailwind CSS v4 stack without breaking any existing component contracts.

The implementation strategy is **purely additive**: all new CSS files are appended to the import chain, all new React components live in separate files alongside (not replacing) existing shadcn originals, and all existing CSS variables in `theme.css` are preserved unchanged.

---

## Architecture

### System Layer Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  DESIGN TOKENS  (src/styles/theme.css)                               │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  :root { shadcn vars }  ← UNTOUCHED                          │    │
│  │  :root { pastel color tokens, gradient tokens,              │    │
│  │          shadow tokens, animation timing }  ← EXISTING       │    │
│  │  :root { spacing, radius, typography tokens }  ← TO ADD      │    │
│  │  @theme inline { shadcn mappings }  ← UNTOUCHED              │    │
│  │  @theme inline { pastel color mappings, shadow, radius }     │    │
│  │                                                  ← EXISTING  │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  CSS UTILITIES  (src/styles/)                                        │
│  ┌────────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │
│  │ pastel-         │  │  components.css  │  │   utilities.css       │  │
│  │ colors.css      │  │  .btn-pastel-*   │  │   .pastel-page-bg    │  │
│  │ text/bg color   │  │  .card-pastel-*  │  │   dark mode          │  │
│  │ utility classes │  │  .input-pastel   │  │   overrides          │  │
│  └────────────────┘  │  .badge-pastel-* │  └──────────────────────┘  │
│                       │  .progress-pastel│                             │
│                       │  .toggle-pastel  │                             │
│                       └─────────────────┘                             │
└──────────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  REACT COMPONENTS  (src/app/components/ui/)                          │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ PastelButton.tsx│  │PastelCard.tsx│  │PastelInput.tsx           │ │
│  │ CVA: variant ×  │  │ CVA: variant │  │ wrapper + icon slot      │ │
│  │ color × size    │  │ × color      │  │                          │ │
│  └─────────────────┘  └──────────────┘  └──────────────────────────┘ │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ PastelBadge.tsx │  │PastelProgress│  │PastelToggle.tsx          │ │
│  └─────────────────┘  └──────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  PAGES  (src/app/pages/)                                             │
│  Login ✓  Timetable  Calendar  Tasks  Focus  Achive  Settings        │
│  Each page uses Tailwind utilities + CSS vars for page scheme        │
└──────────────────────────────────────────────────────────────────────┘
              ↑
┌──────────────────────────────────────────────────────────────────────┐
│  NAVIGATION  (src/app/components/BottomNav.tsx)                      │
│  Enhanced backdrop-blur + border + shadow-up  (minor update)         │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Additive CSS files, not monolith** — Three new CSS files (`pastel-colors.css`, `components.css`, `utilities.css`) are imported after the existing chain in `index.css`. This allows individual concerns to be edited without touching other layers and mirrors the PASTEL_DESIGN_SYSTEM_SPEC.md file structure recommendation.

2. **Separate pastel components, preserved shadcn originals** — New `PastelButton`, `PastelCard`, etc. components are created alongside (not replacing) `button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`. Pages that need pastel styling import pastel components; existing modal/dialog/form usage continues using shadcn originals unmodified.

3. **Tailwind CSS v4 `@theme inline` for utility generation** — All pastel CSS variables are registered in `@theme inline` blocks so Tailwind generates the corresponding utility classes (e.g., `text-pastel-blue-600`, `bg-pastel-pink-100`, `shadow-pastel-blue`). Inline styles are only used for gradient backgrounds where Tailwind utilities don't cover arbitrary gradient values.

4. **`[data-daytrack-theme='dark']` selector for dark mode** — Consistent with the dark mode selector already used in `index.css`. Dark overrides for pastel components are defined in `utilities.css` using this selector, not the `.dark` class (which is the shadcn dark mode path).

---

## Components and Interfaces

### CSS Layer Architecture

#### `src/styles/theme.css` — Token Additions

Append to the existing second `:root` block (after the gradient/shadow tokens, before `@theme inline`):

```css
/* --- Spacing Scale --- */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Semantic spacing */
--gap-xs: 0.5rem;
--gap-sm: 1rem;
--gap-md: 1.5rem;
--gap-lg: 2rem;
--gap-xl: 3rem;
--card-padding-sm: 0.75rem;
--card-padding-md: 1rem;
--card-padding-lg: 1.5rem;
--card-padding-xl: 2rem;

/* --- Border Radius Scale --- */
--radius-pastel-sm:   0.5rem;    /* 8px */
--radius-pastel-md:   0.75rem;   /* 12px — buttons */
--radius-pastel-lg:   1rem;      /* 16px — inputs */
--radius-pastel-xl:   1.5rem;    /* 24px — cards */
--radius-pastel-2xl:  2rem;      /* 32px — modals */
--radius-pastel-3xl:  3rem;      /* 48px — hero */
--radius-pastel-full: 9999px;    /* badges, toggles */

/* Semantic radius */
--button-radius:  var(--radius-pastel-md);
--input-radius:   var(--radius-pastel-lg);
--card-radius:    var(--radius-pastel-xl);
--modal-radius:   var(--radius-pastel-2xl);

/* --- Typography Scale --- */
--text-4xl:  2.25rem;
--text-3xl:  1.875rem;
--text-2xl:  1.5rem;
--text-xl:   1.25rem;
--text-lg:   1.125rem;
--text-base: 1rem;
--text-sm:   0.875rem;
--text-xs:   0.75rem;

--font-light:    300;
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* --- Text Color Semantic Tokens --- */
--text-heading:   #292524;
--text-heading-soft: #44403C;
--text-body-primary:   #57534E;
--text-body-secondary: #78716C;
--text-body-tertiary:  #A8A29E;
--text-blue:   #2563EB;
--text-purple: #9333EA;
--text-pink:   #DB2777;
--text-green:  #16A34A;
--text-orange: #EA580C;

/* --- Basic Shadow Scale --- */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.10), 0 10px 10px rgba(0, 0, 0, 0.04);
--shadow-inner-sm: inset 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-inner-md: inset 0 2px 4px rgba(0, 0, 0, 0.08);
```

Append to the existing `@theme inline` block:

```css
/* Radius tokens — Tailwind utilities: rounded-pastel-sm, etc. */
--radius-pastel-sm:   var(--radius-pastel-sm);
--radius-pastel-md:   var(--radius-pastel-md);
--radius-pastel-lg:   var(--radius-pastel-lg);
--radius-pastel-xl:   var(--radius-pastel-xl);
--radius-pastel-2xl:  var(--radius-pastel-2xl);
--radius-pastel-3xl:  var(--radius-pastel-3xl);
--radius-pastel-full: var(--radius-pastel-full);

/* Additional shadow tokens not yet registered */
--shadow-pastel-green-lg: var(--shadow-green-lg);
--shadow-pastel-orange-lg: var(--shadow-orange-lg);
```

#### `src/styles/pastel-colors.css` — NEW

Utility classes for pastel colors not directly covered by Tailwind's default scale. These complement the `text-pastel-*` and `bg-pastel-*` utilities generated via `@theme inline`.

```css
/* Colored text on colored background (high-contrast pairs for WCAG AA) */
.text-on-blue   { color: #1E3A8A; }   /* blue-900 on blue-100 */
.text-on-purple { color: #581C87; }
.text-on-pink   { color: #831843; }
.text-on-green  { color: #14532D; }
.text-on-orange { color: #7C2D12; }

/* Semantic text utilities */
.text-pastel-heading       { color: var(--text-heading); }
.text-pastel-body          { color: var(--text-body-primary); }
.text-pastel-body-secondary { color: var(--text-body-secondary); }
.text-pastel-muted         { color: var(--text-body-tertiary); }

/* Gradient backgrounds as utility classes */
.bg-gradient-blue-purple {
  background: var(--gradient-blue-purple);
}
.bg-gradient-purple-pink {
  background: var(--gradient-purple-pink);
}
.bg-gradient-green-cyan {
  background: var(--gradient-green-cyan);
}
.bg-gradient-orange-pink {
  background: var(--gradient-orange-pink);
}
.bg-gradient-pink-rose {
  background: var(--gradient-pink-rose);
}
.bg-gradient-sky {
  background: var(--gradient-sky);
}
.bg-gradient-sunset {
  background: var(--gradient-sunset);
}
```

#### `src/styles/components.css` — NEW

Component-level CSS classes for pastel components. These classes are used internally by the PastelButton, PastelCard, etc. React components for styles that are complex to express as Tailwind utilities (e.g., multi-property hover states with box-shadow + transform).

```css
/* ==============================
   PASTEL BUTTON BASE
   ============================== */

.btn-pastel-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
  border-radius: var(--button-radius);
  border: none;
  white-space: nowrap;
}

.btn-pastel-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-pastel-base:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Primary variants */
.btn-pastel-primary-blue {
  background: var(--gradient-blue-purple);
  color: white;
  box-shadow: var(--shadow-blue);
}
.btn-pastel-primary-blue:hover:not(:disabled) {
  box-shadow: var(--shadow-blue-lg);
  transform: translateY(-1px);
}
.btn-pastel-primary-blue:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-blue);
}

.btn-pastel-primary-purple {
  background: var(--gradient-purple-pink);
  color: white;
  box-shadow: var(--shadow-purple);
}
.btn-pastel-primary-purple:hover:not(:disabled) {
  box-shadow: var(--shadow-purple-lg);
  transform: translateY(-1px);
}
.btn-pastel-primary-purple:active:not(:disabled) {
  transform: translateY(0);
}

.btn-pastel-primary-pink {
  background: var(--gradient-pink-rose);
  color: white;
  box-shadow: var(--shadow-pink);
}
.btn-pastel-primary-pink:hover:not(:disabled) {
  box-shadow: var(--shadow-pink-lg);
  transform: translateY(-1px);
}
.btn-pastel-primary-pink:active:not(:disabled) {
  transform: translateY(0);
}

.btn-pastel-primary-green {
  background: var(--gradient-green-cyan);
  color: white;
  box-shadow: var(--shadow-green);
}
.btn-pastel-primary-green:hover:not(:disabled) {
  box-shadow: var(--shadow-green-lg);
  transform: translateY(-1px);
}
.btn-pastel-primary-green:active:not(:disabled) {
  transform: translateY(0);
}

.btn-pastel-primary-orange {
  background: var(--gradient-orange-pink);
  color: white;
  box-shadow: var(--shadow-orange);
}
.btn-pastel-primary-orange:hover:not(:disabled) {
  box-shadow: var(--shadow-orange-lg);
  transform: translateY(-1px);
}
.btn-pastel-primary-orange:active:not(:disabled) {
  transform: translateY(0);
}

/* Button sizes */
.btn-pastel-sm  { padding: 0.5rem 1rem;    font-size: 0.875rem; }
.btn-pastel-md  { padding: 0.75rem 1.5rem; font-size: 1rem;     }
.btn-pastel-lg  { padding: 1rem 2rem;      font-size: 1.125rem; }

/* ==============================
   PASTEL CARD BASE
   ============================== */

.card-pastel-default {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-normal) ease,
              transform var(--duration-normal) ease;
}
.card-pastel-default:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-pastel-gradient-blue {
  background: linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 100%);
  border: 1px solid rgba(147, 197, 253, 0.3);
  border-radius: 2rem;
  box-shadow: var(--shadow-blue);
}

.card-pastel-gradient-purple {
  background: linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%);
  border: 1px solid rgba(216, 180, 254, 0.3);
  border-radius: 2rem;
  box-shadow: var(--shadow-purple);
}

.card-pastel-gradient-pink {
  background: linear-gradient(135deg, #FDF2F8 0%, #FFF1F2 100%);
  border: 1px solid rgba(249, 168, 212, 0.3);
  border-radius: 2rem;
  box-shadow: var(--shadow-pink);
}

.card-pastel-gradient-green {
  background: linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 100%);
  border: 1px solid rgba(134, 239, 172, 0.3);
  border-radius: 2rem;
  box-shadow: var(--shadow-green);
}

.card-pastel-gradient-orange {
  background: linear-gradient(135deg, #FFF7ED 0%, #FEFCE8 100%);
  border: 1px solid rgba(253, 186, 116, 0.3);
  border-radius: 2rem;
  box-shadow: var(--shadow-orange);
}

/* ==============================
   PASTEL INPUT
   ============================== */

.input-pastel {
  width: 100%;
  background: white;
  border: 2px solid #E2E8F0;
  border-radius: var(--input-radius);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #292524;
  outline: none;
  transition: border-color var(--duration-normal) ease,
              box-shadow var(--duration-normal) ease;
}

.input-pastel::placeholder {
  color: #94A3B8;
}

.input-pastel:focus {
  border-color: #60A5FA;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.input-pastel[aria-invalid="true"] {
  border-color: #F472B6;
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
}

.input-pastel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F8FAFC;
}

.input-pastel-with-icon {
  padding-left: 2.75rem;
}

/* ==============================
   PASTEL BADGE
   ============================== */

.badge-pastel-base {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  white-space: nowrap;
}

.badge-pastel-blue   { background: #DBEAFE; color: #1E3A8A; border-color: #93C5FD; }
.badge-pastel-purple { background: #F3E8FF; color: #581C87; border-color: #D8B4FE; }
.badge-pastel-pink   { background: #FCE7F3; color: #831843; border-color: #F9A8D4; }
.badge-pastel-green  { background: #DCFCE7; color: #14532D; border-color: #86EFAC; }
.badge-pastel-orange { background: #FFEDD5; color: #7C2D12; border-color: #FDBA74; }

/* ==============================
   PASTEL PROGRESS
   ============================== */

.progress-pastel-track {
  background: #E2E8F0;
  height: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
  width: 100%;
}

.progress-pastel-fill {
  background: var(--gradient-blue-purple);
  height: 100%;
  border-radius: 9999px;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.3);
  transition: width 300ms ease;
}

.progress-pastel-fill-complete {
  background: var(--gradient-green-emerald);
}

/* ==============================
   PASTEL TOGGLE
   ============================== */

.toggle-pastel {
  position: relative;
  display: inline-block;
  width: 3rem;    /* 48px */
  height: 1.75rem; /* 28px */
  border-radius: 9999px;
  cursor: pointer;
  background: #CBD5E1;
  transition: background 200ms ease;
  flex-shrink: 0;
}

.toggle-pastel[data-state="checked"] {
  background: var(--gradient-blue-purple);
}

.toggle-pastel-knob {
  position: absolute;
  top: 0.25rem;   /* 4px */
  left: 0.25rem;  /* 4px — off position */
  width: 1.25rem;  /* 20px */
  height: 1.25rem;
  border-radius: 9999px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: left 200ms ease;
}

.toggle-pastel[data-state="checked"] .toggle-pastel-knob {
  left: 1.5rem;   /* 24px — on position */
}

/* ==============================
   BOTTOM NAV ENHANCEMENT
   ============================== */

.bottom-nav-pastel {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.bottom-nav-pastel a {
  transition: all 150ms ease;
}

/* ==============================
   ACCESSIBILITY — Reduced Motion
   ============================== */

@media (prefers-reduced-motion: reduce) {
  .btn-pastel-base,
  .card-pastel-default,
  .input-pastel,
  .toggle-pastel,
  .toggle-pastel-knob,
  .progress-pastel-fill {
    transition-duration: 1ms !important;
    animation: none !important;
  }

  .btn-pastel-primary-blue:hover:not(:disabled),
  .btn-pastel-primary-purple:hover:not(:disabled),
  .btn-pastel-primary-pink:hover:not(:disabled),
  .btn-pastel-primary-green:hover:not(:disabled),
  .btn-pastel-primary-orange:hover:not(:disabled),
  .card-pastel-default:hover {
    transform: none !important;
  }
}

/* ==============================
   PRIORITY ICONS (Color-blind)
   ============================== */

.priority-high::before   { content: "!"; font-weight: 700; margin-right: 0.25rem; }
.priority-medium::before { content: "−"; font-weight: 700; margin-right: 0.25rem; }
.priority-low::before    { content: "·"; font-weight: 700; margin-right: 0.25rem; }
```

#### `src/styles/utilities.css` — NEW

Page-specific background helpers and dark mode pastel overrides.

```css
/* ==============================
   PAGE BACKGROUND UTILITIES
   ============================== */

.pastel-page-bg-blue {
  background: var(--bg-gradient-blue);
  min-height: 100vh;
}

.pastel-page-bg-purple {
  background: var(--bg-gradient-purple);
  min-height: 100vh;
}

.pastel-page-bg-pink {
  background: var(--bg-gradient-pink);
  min-height: 100vh;
}

.pastel-page-bg-green {
  background: var(--bg-gradient-green);
  min-height: 100vh;
}

.pastel-page-bg-orange {
  background: var(--bg-gradient-orange);
  min-height: 100vh;
}

.pastel-page-bg-slate {
  background: linear-gradient(180deg, #F8FAFC 0%, white 100%);
  min-height: 100vh;
}

/* ==============================
   DARK MODE — Pastel Overrides
   Uses [data-daytrack-theme='dark'] consistent with index.css
   ============================== */

[data-daytrack-theme='dark'] .pastel-page-bg-blue,
[data-daytrack-theme='dark'] .pastel-page-bg-purple,
[data-daytrack-theme='dark'] .pastel-page-bg-pink,
[data-daytrack-theme='dark'] .pastel-page-bg-green,
[data-daytrack-theme='dark'] .pastel-page-bg-orange,
[data-daytrack-theme='dark'] .pastel-page-bg-slate {
  /* Reduce gradient opacity to 50% in dark mode */
  background-blend-mode: multiply;
  filter: brightness(0.6);
}

/* Pastel cards in dark mode */
[data-daytrack-theme='dark'] .card-pastel-default {
  background: rgba(31, 41, 55, 0.92);
  border-color: rgba(75, 85, 99, 0.8);
}

[data-daytrack-theme='dark'] .card-pastel-gradient-blue,
[data-daytrack-theme='dark'] .card-pastel-gradient-purple,
[data-daytrack-theme='dark'] .card-pastel-gradient-pink,
[data-daytrack-theme='dark'] .card-pastel-gradient-green,
[data-daytrack-theme='dark'] .card-pastel-gradient-orange {
  background: rgba(31, 41, 55, 0.85);
  border-color: rgba(75, 85, 99, 0.6);
}

/* Input dark mode */
[data-daytrack-theme='dark'] .input-pastel {
  background: rgba(44, 46, 51, 0.95);
  border-color: rgba(75, 85, 99, 0.8);
  color: #E9ECEF;
}

[data-daytrack-theme='dark'] .input-pastel:focus {
  border-color: #60A5FA;
}

/* Bottom nav dark mode */
[data-daytrack-theme='dark'] .bottom-nav-pastel {
  background: rgba(26, 27, 30, 0.95);
  border-top-color: rgba(55, 58, 64, 0.8);
}
```

#### `src/styles/index.css` — MODIFICATION

Add three import lines after `animations.css`:

```css
@import './fonts.css';
@import './tailwind.css';
@import './theme.css';
@import './animations.css';
@import './pastel-colors.css';   /* NEW */
@import './components.css';      /* NEW */
@import './utilities.css';       /* NEW */

/* ... existing rules unchanged ... */
```

---

## Components and Interfaces (React)

### 4.1. PastelButton — `src/app/components/ui/pastel-button.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import * as React from 'react';

const pastelButtonVariants = cva(
  'btn-pastel-base inline-flex items-center justify-center gap-2',
  {
    variants: {
      variant: {
        primary: '',   // color-specific class applied below
        secondary: '', // color-specific class applied below
        ghost: '',
      },
      color: {
        blue:   '',
        purple: '',
        pink:   '',
        green:  '',
        orange: '',
      },
      size: {
        sm: 'btn-pastel-sm',
        md: 'btn-pastel-md',
        lg: 'btn-pastel-lg',
      },
    },
    compoundVariants: [
      // Primary
      { variant: 'primary', color: 'blue',   class: 'btn-pastel-primary-blue'   },
      { variant: 'primary', color: 'purple', class: 'btn-pastel-primary-purple' },
      { variant: 'primary', color: 'pink',   class: 'btn-pastel-primary-pink'   },
      { variant: 'primary', color: 'green',  class: 'btn-pastel-primary-green'  },
      { variant: 'primary', color: 'orange', class: 'btn-pastel-primary-orange' },
      // Secondary — pastel-100 bg, pastel-900 text, pastel-200 border
      { variant: 'secondary', color: 'blue',   class: 'bg-pastel-blue-100   text-blue-900   border border-pastel-blue-200   hover:bg-pastel-blue-200   hover:border-pastel-blue-300'   },
      { variant: 'secondary', color: 'purple', class: 'bg-pastel-purple-100 text-purple-900 border border-pastel-purple-200 hover:bg-pastel-purple-200 hover:border-pastel-purple-300' },
      { variant: 'secondary', color: 'pink',   class: 'bg-pastel-pink-100   text-pink-900   border border-pastel-pink-200   hover:bg-pastel-pink-200   hover:border-pastel-pink-300'   },
      { variant: 'secondary', color: 'green',  class: 'bg-pastel-green-100  text-green-900  border border-pastel-green-200  hover:bg-pastel-green-200  hover:border-pastel-green-300'  },
      { variant: 'secondary', color: 'orange', class: 'bg-pastel-orange-100 text-orange-900 border border-pastel-orange-200 hover:bg-pastel-orange-200 hover:border-pastel-orange-300' },
      // Ghost
      { variant: 'ghost', color: 'blue',   class: 'text-blue-600   hover:bg-pastel-blue-50'   },
      { variant: 'ghost', color: 'purple', class: 'text-purple-600 hover:bg-pastel-purple-50' },
      { variant: 'ghost', color: 'pink',   class: 'text-pink-600   hover:bg-pastel-pink-50'   },
      { variant: 'ghost', color: 'green',  class: 'text-green-600  hover:bg-pastel-green-50'  },
      { variant: 'ghost', color: 'orange', class: 'text-orange-600 hover:bg-pastel-orange-50' },
    ],
    defaultVariants: {
      variant: 'primary',
      color: 'blue',
      size: 'md',
    },
  }
);

export interface PastelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pastelButtonVariants> {}

export function PastelButton({
  className,
  variant,
  color,
  size,
  ...props
}: PastelButtonProps) {
  return (
    <button
      className={cn(pastelButtonVariants({ variant, color, size }), className)}
      {...props}
    />
  );
}
```

**Behavior:**
- `primary`: gradient background → white text → colored shadow; hover lifts 1px, active returns
- `secondary`: soft pastel-100 bg → pastel-900 text → pastel-200 border; hover deepens background
- `ghost`: transparent → pastel-600 text → hover shows pastel-50 bg
- `disabled`: `opacity-50 cursor-not-allowed` via `.btn-pastel-base:disabled`
- Focus: `outline: 2px solid currentColor; outline-offset: 2px` via `.btn-pastel-base:focus-visible`

### 4.2. PastelCard — `src/app/components/ui/pastel-card.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import * as React from 'react';

const pastelCardVariants = cva('', {
  variants: {
    variant: {
      default:  'card-pastel-default p-6',
      gradient: 'p-8',       // color-specific gradient class applied via compoundVariants
      colored:  'rounded-2xl p-4 border', // color-specific class via compoundVariants
    },
    color: {
      blue:   '',
      purple: '',
      pink:   '',
      green:  '',
      orange: '',
    },
  },
  compoundVariants: [
    { variant: 'gradient', color: 'blue',   class: 'card-pastel-gradient-blue'   },
    { variant: 'gradient', color: 'purple', class: 'card-pastel-gradient-purple' },
    { variant: 'gradient', color: 'pink',   class: 'card-pastel-gradient-pink'   },
    { variant: 'gradient', color: 'green',  class: 'card-pastel-gradient-green'  },
    { variant: 'gradient', color: 'orange', class: 'card-pastel-gradient-orange' },
    { variant: 'colored',  color: 'blue',   class: 'bg-pastel-blue-100   text-on-blue   border-pastel-blue-300'   },
    { variant: 'colored',  color: 'purple', class: 'bg-pastel-purple-100 text-on-purple border-pastel-purple-300' },
    { variant: 'colored',  color: 'pink',   class: 'bg-pastel-pink-100   text-on-pink   border-pastel-pink-300'   },
    { variant: 'colored',  color: 'green',  class: 'bg-pastel-green-100  text-on-green  border-pastel-green-300'  },
    { variant: 'colored',  color: 'orange', class: 'bg-pastel-orange-100 text-on-orange border-pastel-orange-300' },
  ],
  defaultVariants: {
    variant: 'default',
    color: 'blue',
  },
});

export interface PastelCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pastelCardVariants> {}

export function PastelCard({ className, variant, color, ...props }: PastelCardProps) {
  return (
    <div className={cn(pastelCardVariants({ variant, color }), className)} {...props} />
  );
}
```

### 4.3. PastelInput — `src/app/components/ui/pastel-input.tsx`

```typescript
import * as React from 'react';
import { cn } from './utils';

export interface PastelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
}

export function PastelInput({ className, icon, error, ...props }: PastelInputProps) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={cn(
          'input-pastel',
          icon && 'input-pastel-with-icon',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    </div>
  );
}
```

### 4.4. PastelBadge — `src/app/components/ui/pastel-badge.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import * as React from 'react';

const pastelBadgeVariants = cva('badge-pastel-base', {
  variants: {
    color: {
      blue:   'badge-pastel-blue',
      purple: 'badge-pastel-purple',
      pink:   'badge-pastel-pink',
      green:  'badge-pastel-green',
      orange: 'badge-pastel-orange',
    },
  },
  defaultVariants: { color: 'blue' },
});

export interface PastelBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pastelBadgeVariants> {}

export function PastelBadge({ className, color, ...props }: PastelBadgeProps) {
  return (
    <span className={cn(pastelBadgeVariants({ color }), className)} {...props} />
  );
}
```

### 4.5. PastelProgress — `src/app/components/ui/pastel-progress.tsx`

```typescript
import * as React from 'react';
import { cn } from './utils';

export interface PastelProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;          // 0–100
  complete?: boolean;     // switches to green gradient when true
  'aria-label'?: string;
}

export function PastelProgress({
  value,
  complete = false,
  className,
  ...props
}: PastelProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('progress-pastel-track', className)}
      {...props}
    >
      <div
        className={cn(
          'progress-pastel-fill',
          complete && 'progress-pastel-fill-complete'
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
```

### 4.6. PastelToggle — `src/app/components/ui/pastel-toggle.tsx`

```typescript
import * as React from 'react';
import { cn } from './utils';

export interface PastelToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function PastelToggle({
  checked,
  onChange,
  disabled = false,
  className,
  ...props
}: PastelToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn('toggle-pastel', disabled && 'opacity-50 cursor-not-allowed', className)}
      {...props}
    >
      <span className="toggle-pastel-knob" />
    </button>
  );
}
```

---

## Data Models

### Token Taxonomy

```
Design Token
  ├── Color Token        — CSS var --pastel-{color}-{shade}  (50–600)
  ├── Gradient Token     — CSS var --gradient-{color1}-{color2}
  ├── Background Token   — CSS var --bg-gradient-{color}
  ├── Shadow Token       — CSS var --shadow-{color}[-lg]
  ├── Spacing Token      — CSS var --space-{n} / --gap-{size} / --card-padding-{size}
  ├── Radius Token       — CSS var --radius-pastel-{size}
  └── Typography Token   — CSS var --text-{size} / --font-{weight}
```

### Component Variant Matrix

| Component | Variants | Colors | Sizes |
|---|---|---|---|
| PastelButton | primary, secondary, ghost | blue, purple, pink, green, orange | sm, md, lg |
| PastelCard | default, gradient, colored | blue, purple, pink, green, orange | — (padding in variant) |
| PastelInput | — | — (focus always blue) | — (full-width) |
| PastelBadge | — | blue, purple, pink, green, orange | — (fixed sm) |
| PastelProgress | — | — (blue-purple gradient; green when complete) | — |
| PastelToggle | — | — (slate off / blue-purple on) | — (fixed 48×28px) |

### Page Color Scheme Mapping

| Page | Color Scheme | Page Background Token | Title Color | Key Accent |
|---|---|---|---|---|
| Login | multi (blue+purple+pink) | custom inline gradient | `text-pastel-gray-800` | `--gradient-blue-purple` |
| Timetable | Blue | `--bg-gradient-blue` | `text-blue-600` | `--gradient-blue-purple` |
| Calendar | Purple | `--bg-gradient-purple` | `text-purple-600` | `#C084FC` |
| Tasks | Orange | `--bg-gradient-orange` | `text-orange-600` | `#FB923C` |
| Focus | Green | `--bg-gradient-green` | `text-green-600` | `--gradient-green-cyan` |
| Achive | Pink | `--bg-gradient-pink` | `text-pink-600` | `--gradient-purple-pink` |
| Settings | Slate | `--pastel-slate-50` → white | `text-pastel-gray-700` | `--gradient-blue-purple` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature is a design system composed primarily of CSS tokens, visual utility classes, and thin wrapper React components. The main logic subject to property-based testing is the **CVA variant resolution** — the function that maps `(variant, color, size)` → CSS class string. Most other acceptance criteria concern visual rendering, CSS variables, or infrastructure wiring, which are better verified by snapshot tests, visual regression tests, and smoke tests.

The following properties cover the testable logic layer.

### Property 1: PastelButton class resolution is exhaustive and non-empty

*For any* valid combination of `variant` ∈ {primary, secondary, ghost}, `color` ∈ {blue, purple, pink, green, orange}, and `size` ∈ {sm, md, lg}, the CVA variant resolver SHALL return a non-empty, non-null class string that contains the base class `btn-pastel-base`.

**Validates: Requirements 6 (Button component — 3 variants × 5 colors)**

### Property 2: PastelButton disabled state is independent of variant/color

*For any* valid `(variant, color, size)` combination, a PastelButton rendered with `disabled={true}` SHALL have `pointer-events: none` and `opacity: 0.5` applied, regardless of which variant or color is selected.

**Validates: Requirements 6 (Button — disabled state)**

### Property 3: PastelCard class resolution is exhaustive and non-empty

*For any* valid combination of `variant` ∈ {default, gradient, colored} and `color` ∈ {blue, purple, pink, green, orange}, the CVA variant resolver SHALL return a non-empty class string.

**Validates: Requirements 8 (Card component — 3 variants)**

### Property 4: PastelBadge color variants are visually distinct

*For any* two distinct colors `c1 ≠ c2` from {blue, purple, pink, green, orange}, the CSS class string returned by `pastelBadgeVariants({ color: c1 })` SHALL differ from the string returned for `c2`.

**Validates: Requirements 10 (Badge — 5 color variants)**

### Property 5: PastelProgress value clamping

*For any* numeric value `v`, `PastelProgress` SHALL clamp the fill width to `[0%, 100%]` — specifically, `v ≤ 0` produces `0%` width and `v ≥ 100` produces `100%` width. Values in range produce `width = v%`.

**Validates: Requirements 10 (Progress component)**

### Property 6: PastelToggle state round-trip

*For any* initial `checked` state `s ∈ {true, false}`, calling `onChange` once SHALL flip the state to `!s`, and calling it again SHALL return to `s`. The `aria-checked` attribute SHALL always reflect the current `checked` prop.

**Validates: Requirements 10 (Toggle component)**

### Property 7: PastelInput error state propagates to aria-invalid

*For any* PastelInput rendered with `error={true}`, the underlying `<input>` element SHALL have `aria-invalid="true"`. *For any* PastelInput rendered with `error={false}` or `error` omitted, `aria-invalid` SHALL be absent or `"false"`.

**Validates: Requirements 7 (Input — error state), Requirements 20 (Accessibility)**

### Property 8: PastelInput icon slot positioning

*For any* PastelInput rendered with an `icon` prop, the input element SHALL include the class `input-pastel-with-icon` (left padding for icon). *For any* PastelInput rendered without an `icon` prop, that class SHALL be absent.

**Validates: Requirements 7 (Input — icon slot)**

---

## Error Handling

### CSS Token Resolution Failures

If a CSS variable is missing or misspelled, the browser silently falls back to the initial value (transparent for colors, `none` for shadows). To prevent silent failures:

- All new tokens appended to `:root` follow the naming convention `--pastel-{color}-{shade}` and `--radius-pastel-{size}`.
- The `@theme inline` block registers every token used in components, ensuring Tailwind generates classes at build time rather than relying on runtime var() resolution in utility names.

### CVA Compound Variant Gaps

If a `(variant, color)` pair is missing from `compoundVariants`, CVA returns an empty string for that slot — the component renders without pastel styling but doesn't throw. All 15 primary compound pairs (3 variants × 5 colors) and all 10 card compound pairs (2 non-default variants × 5 colors) must be defined.

**Detection:** Property 1 and Property 3 catch this during testing.

### Dark Mode Selector Conflicts

The project uses two dark mode mechanisms:
- `.dark` class: shadcn/ui's Radix-based dark mode (used in `theme.css`)
- `[data-daytrack-theme='dark']`: DayTrack's application-level dark mode (used in `index.css`)

**Rule:** New pastel dark overrides in `utilities.css` MUST use `[data-daytrack-theme='dark']`. Using `.dark` would create inconsistent dark mode behavior for pastel components.

### Accessibility — Focus Ring Visibility

All interactive pastel components use `focus-visible` (not `focus`) to avoid showing focus rings on mouse clicks while preserving them for keyboard navigation. The `.btn-pastel-base:focus-visible` rule provides the base focus ring; individual page elements use `focus-visible:outline-blue-600 focus-visible:ring-2` Tailwind utilities.

---

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

Unit tests cover concrete behavioral examples for each component:

- **PastelButton**: renders with correct classes for each variant/color/size combination; disabled state disables interaction; click handler fires
- **PastelCard**: renders children; applies correct variant class; default variant renders without color-specific class
- **PastelInput**: renders icon with left-padding class; sets `aria-invalid` when `error={true}`; forwards native input props
- **PastelBadge**: renders with correct color class
- **PastelProgress**: renders 0% width for value=0; 100% width for value=100; correct width for mid-range; adds `progress-pastel-fill-complete` when `complete={true}`
- **PastelToggle**: calls `onChange(!checked)` on click; reflects `aria-checked`; disabled prevents click

### Property-Based Tests (fast-check, ≥ 100 iterations per property)

Each property from the Correctness Properties section maps to one property-based test. Tag format: `Feature: pastel-design-system, Property {N}: {title}`.

| Property | Generator | Assertion |
|---|---|---|
| P1: Button class exhaustive | `fc.record({ variant, color, size })` | `result.includes('btn-pastel-base') && result.length > 0` |
| P2: Disabled independent of variant | `fc.record({ variant, color, size })` | rendered button has `pointer-events-none opacity-50` |
| P3: Card class exhaustive | `fc.record({ variant, color })` | class string non-empty |
| P4: Badge colors distinct | two distinct colors from enum | class strings differ |
| P5: Progress clamping | `fc.float()` covering `(-∞, 200)` | `width%` ∈ `[0, 100]` |
| P6: Toggle round-trip | `fc.boolean()` initial state | two toggles return to original; aria-checked matches prop |
| P7: Input aria-invalid | `fc.boolean()` error value | aria-invalid presence matches error prop |
| P8: Input icon class | `fc.option(fc.string())` as icon | `input-pastel-with-icon` present iff icon provided |

Minimum 100 iterations per test. Configure in vitest with:

```typescript
fc.assert(fc.property(...), { numRuns: 100 });
```

### Snapshot Tests

- CSS token completeness: snapshot test verifying all expected `--pastel-*` variables exist in the compiled CSS
- Component render snapshots: one snapshot per PastelButton variant/color combination to catch unintended class regressions

### Visual Regression Tests (Manual / Storybook)

Since pastel aesthetics depend on color perception, visual acceptance must be done manually or via a visual regression tool (e.g., Chromatic). Key scenarios:

- Each page background gradient in light and dark mode
- PastelButton in all 15 primary variants across light/dark
- WCAG AA contrast check for all badge/card text-on-background pairs

### Integration / Smoke Tests

- CSS file loads without errors (check browser console)
- All 7 pages render their page background class
- BottomNav shows page-specific active colors
- Dark mode toggle switches `[data-daytrack-theme='dark']` attribute and pastel overrides apply

---

## File Change Summary

### CREATE (new files)

| File | Purpose |
|---|---|
| `src/styles/pastel-colors.css` | Text/background utility classes for pastel colors and gradients |
| `src/styles/components.css` | Component-specific CSS classes for pastel components |
| `src/styles/utilities.css` | Page background utilities + dark mode pastel overrides |
| `src/app/components/ui/pastel-button.tsx` | PastelButton component (CVA, 3 variants × 5 colors × 3 sizes) |
| `src/app/components/ui/pastel-card.tsx` | PastelCard component (CVA, 3 variants × 5 colors) |
| `src/app/components/ui/pastel-input.tsx` | PastelInput wrapper with icon slot and error state |
| `src/app/components/ui/pastel-badge.tsx` | PastelBadge with 5 color variants |
| `src/app/components/ui/pastel-progress.tsx` | PastelProgress with clamped value and completion state |
| `src/app/components/ui/pastel-toggle.tsx` | PastelToggle with controlled state and ARIA |

### MODIFY (existing files)

| File | Change |
|---|---|
| `src/styles/theme.css` | Append spacing, radius, typography, basic shadow tokens to `:root`; append radius shadow tokens to `@theme inline` |
| `src/styles/index.css` | Add 3 import lines after `animations.css` |
| `src/app/components/BottomNav.tsx` | Add `.bottom-nav-pastel` class; refine transition timing to `150ms` |
| `src/app/pages/Timetable.tsx` | Apply `pastel-page-bg-blue` class + blue scheme (title, schedule blocks) |
| `src/app/pages/Calendar.tsx` | Apply `pastel-page-bg-purple` class + purple scheme (title, day selection) |
| `src/app/pages/Tasks.tsx` | Apply `pastel-page-bg-orange` class + orange scheme (title, priority colors) |
| `src/app/pages/Focus.tsx` | Apply `pastel-page-bg-green` class + green scheme (title, timer) |
| `src/app/pages/Achive.tsx` | Apply `pastel-page-bg-pink` class + pink scheme (title, achievement cards) |
| `src/app/pages/Settings.tsx` | Apply `pastel-page-bg-slate` class + gray scheme (profile card gradient) |

### NO CHANGE (preserved files)

| File | Reason |
|---|---|
| `src/app/components/ui/button.tsx` | shadcn/ui original — must not be modified |
| `src/app/components/ui/card.tsx` | shadcn/ui original — must not be modified |
| `src/app/components/ui/badge.tsx` | shadcn/ui original — must not be modified |
| `src/app/components/ui/input.tsx` | shadcn/ui original — must not be modified |
| `src/styles/animations.css` | Already contains all 5 keyframes + reduced-motion override |
| `src/styles/fonts.css` | Font imports — no change needed |
| `src/styles/tailwind.css` | Tailwind entry point — no change needed |
| `src/app/pages/Login.tsx` | Already applies pastel gradient background and `--gradient-blue-purple` correctly |
