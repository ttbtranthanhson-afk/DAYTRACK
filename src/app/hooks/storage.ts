export function getUserKey(suffix: string): string {
  try {
    const raw = localStorage.getItem('daytrack_user_data');
    const email = raw ? (JSON.parse(raw).email || '') : '';
    const normalized = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `daytrack_${suffix}${normalized ? `_${normalized}` : ''}`;
  } catch {
    return `daytrack_${suffix}`;
  }
}
