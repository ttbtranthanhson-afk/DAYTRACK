import { days, type ScheduleBlock } from '../hooks/scheduleData';
import {
  getAccountItem,
  setAccountItem,
  removeAccountItem,
  refreshStores,
} from '../hooks/accountStorage';

const WEEKDAY_KEY = 'daytrack_weekday_schedules';
const CALENDAR_KEY = 'daytrack_calendar_schedules';
const AI_DAYS_KEY = 'daytrack_calendar_ai_days';
const BUSY_KEY = 'daytrack_busy_hours';
const TASKS_KEY = 'daytrack_tasks';
const ACHIEVEMENTS_KEY = 'daytrack_achievements';
const STATS_KEY = 'daytrack_achievement_stats';
// Persisted copy of the pre-tour data. It survives reloads so sample data can
// always be undone, even when the tour is abandoned instead of finished.
const BACKUP_KEY = 'daytrack_tutorial_backup';

const DATA_REFRESH_EVENT = 'daytrack:data-refresh';

const SEED_KEYS = [
  WEEKDAY_KEY,
  CALENDAR_KEY,
  AI_DAYS_KEY,
  BUSY_KEY,
  TASKS_KEY,
  ACHIEVEMENTS_KEY,
  STATS_KEY,
];

let snapshot: Record<string, string | null> | null = null;

function todayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function todayDay(): string {
  return days[todayIndex()];
}

function todayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function sampleWeekdaySchedules(): Record<string, ScheduleBlock[]> {
  const day = todayDay();
  return {
    [day]: [
      { id: 'tour-wake', title: 'Dậy sớm', time: '05:30 - 06:00', color: 'bg-yellow-400', tasks: [] },
      { id: 'tour-breakfast', title: 'Ăn sáng', time: '06:00 - 06:30', color: 'bg-orange-400', tasks: [] },
      {
        id: 'tour-school',
        title: 'Đi học',
        time: '07:00 - 11:00',
        color: 'bg-blue-400',
        tasks: [{ id: 'tour-school-task', title: 'Ghi chép bài', priority: 'high' }],
      },
    ],
  };
}

function sampleCalendar(): Record<string, ScheduleBlock[]> {
  return {
    [todayDateKey()]: [
      { id: 'tour-group', title: 'Học nhóm', time: '14:00 - 16:00', color: 'bg-purple-400', tasks: [] },
    ],
  };
}

function sampleTasks() {
  const weekday = todayIndex();
  return [
    { id: 'tour-task-wake', title: 'Dậy sớm', priority: 'high', completed: false, weekday },
    { id: 'tour-task-breakfast', title: 'Ăn sáng', priority: 'medium', completed: false, weekday },
    { id: 'tour-task-school', title: 'Đi học', priority: 'high', completed: false, weekday },
    { id: 'tour-task-water', title: 'Uống đủ nước', priority: 'low', completed: false, recurrence: 'daily' },
  ];
}

function sampleValues(): Record<string, string> {
  return {
    [WEEKDAY_KEY]: JSON.stringify(sampleWeekdaySchedules()),
    [CALENDAR_KEY]: JSON.stringify(sampleCalendar()),
    [AI_DAYS_KEY]: JSON.stringify([]),
    [BUSY_KEY]: JSON.stringify({}),
    [TASKS_KEY]: JSON.stringify(sampleTasks()),
    [ACHIEVEMENTS_KEY]: JSON.stringify([]),
  };
}

function blankValue(key: string): string {
  if (key === TASKS_KEY || key === AI_DAYS_KEY || key === ACHIEVEMENTS_KEY) return '[]';
  return '{}';
}

export function refreshTutorialData(): void {
  refreshStores();
  try {
    window.dispatchEvent(new CustomEvent(DATA_REFRESH_EVENT));
  } catch {
    // ignore environments without window
  }
}

export function seedTutorialData(): void {
  if (snapshot) return;
  // A previous run that never finished (page reload mid-tour) can leave its
  // sample data behind; undo that first so we never snapshot sample data as
  // if it were the user's real data.
  const stranded = readBackup();
  if (stranded) {
    applySnapshot(stranded);
    removeAccountItem(BACKUP_KEY);
  }
  snapshot = {};
  for (const key of SEED_KEYS) {
    snapshot[key] = getAccountItem(key);
  }
  setAccountItem(BACKUP_KEY, JSON.stringify(snapshot));
  const values = sampleValues();
  for (const key of SEED_KEYS) {
    setAccountItem(key, values[key]);
  }
  refreshTutorialData();
}

function readBackup(): Record<string, string | null> | null {
  try {
    const raw = getAccountItem(BACKUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, string | null>)
      : null;
  } catch {
    return null;
  }
}

function applySnapshot(snap: Record<string, string | null>): void {
  for (const key of SEED_KEYS) {
    const original = snap[key];
    if (original !== null && original !== undefined) setAccountItem(key, original);
    else setAccountItem(key, blankValue(key));
  }
}

export function restoreTutorialData(): void {
  const snap = snapshot ?? readBackup();
  if (!snap) return;
  applySnapshot(snap);
  snapshot = null;
  removeAccountItem(BACKUP_KEY);
  refreshTutorialData();
}

// Called on app start (and right after login): if the tour was left midway,
// put the user's real data back so sample schedules never outlive the tour.
export function cleanupTutorialSampleData(): void {
  if (readBackup()) restoreTutorialData();
}

export function clearTutorialDataIfActive(): void {
  if (snapshot) restoreTutorialData();
}
