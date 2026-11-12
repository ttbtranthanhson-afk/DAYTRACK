const MARGIN = 8;

export interface TourBounds {
  top: number;
  bottom: number;
}

/**
 * Vertical band of the viewport that is not covered by fixed UI (e.g. the
 * bottom nav), so the tour never aims the spotlight or the guide panel at a
 * spot that a floating bar hides. Elements marked `data-tour-occluder` count
 * as blockers, except when the caller itself lives inside one (nav targets).
 */
export function tourSafeBounds(vh: number, insideEl?: Element | null): TourBounds {
  let top = 0;
  let bottom = vh;
  const occluders = document.querySelectorAll<HTMLElement>('[data-tour-occluder]');
  for (const occ of occluders) {
    if (insideEl && occ.contains(insideEl)) continue;
    const r = occ.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.top > vh / 2) bottom = Math.min(bottom, r.top - MARGIN);
    else if (r.bottom < vh / 2) top = Math.max(top, r.bottom + MARGIN);
  }
  return { top, bottom };
}
