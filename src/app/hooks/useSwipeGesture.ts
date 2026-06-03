import { useRef } from 'react';

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // default 50px
}

/**
 * Custom hook for detecting horizontal swipe gestures on touch devices.
 *
 * - Swipe left  (finger moves right→left, deltaX > threshold)  → calls onSwipeLeft()
 * - Swipe right (finger moves left→right, deltaX < -threshold) → calls onSwipeRight()
 * - No callback is fired when |deltaX| < threshold
 *
 * Validates: Requirements 2.7
 */
function useSwipeGesture(options: SwipeGestureOptions): {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
} {
  const { onSwipeLeft, onSwipeRight, threshold = 50 } = options;
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (deltaX > threshold) {
      // Finger moved right→left: swipe left
      onSwipeLeft?.();
    } else if (deltaX < -threshold) {
      // Finger moved left→right: swipe right
      onSwipeRight?.();
    }
    // |deltaX| <= threshold: no callback fired

    touchStartX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}

export default useSwipeGesture;
