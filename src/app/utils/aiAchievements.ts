import achievementAssets from '../data/achievementAssets.json';
import achievementBlueprints from '../data/achievementBlueprints.json';

export interface AISubAchievement {
  id: string;
  title: string;
  date: string;
  progress: number;
  completed: boolean;
  logoId?: string;
  componentIds?: string[];
  source?: string;
}

export type GeneratedAchievementsByGroup = Record<string, AISubAchievement[]>;

interface AchievementContext {
  source: string;
  schedules?: Array<{ title: string; tasks?: string[] }>;
  tasks?: Array<{ title: string; dueDate?: string; scheduleName?: string }>;
}

const STORAGE_KEY = 'daytrack_ai_achievements';

const normalize = (value: string) => value.toLowerCase();

const getTodayLabel = () => {
  const now = new Date();
  return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
};

const getGroupIdForTopic = (topic: string, fallbackGroupId = '4') => {
  const normalized = normalize(topic);
  const group = achievementBlueprints.groups.find(item =>
    item.keywords.some(keyword => normalized.includes(keyword))
  );
  return group?.id ?? fallbackGroupId;
};

const getTemplateForGroup = (groupId: string) =>
  achievementBlueprints.templates.find(template => template.groupId === groupId) ??
  achievementBlueprints.templates.find(template => template.groupId === '4')!;

const buildAchievement = (topic: string, source: string, fallbackGroupId?: string) => {
  const groupId = getGroupIdForTopic(topic, fallbackGroupId);
  const template = getTemplateForGroup(groupId);
  const logo = achievementAssets.logos.find(item => item.groupId === groupId);
  const componentIds = achievementAssets.components
    .filter(component => component.useFor.includes(source) || component.useFor.includes('ai-generated'))
    .map(component => component.id);

  return {
    groupId,
    achievement: {
      id: `ai-${source}-${groupId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: template.title.replace('{topic}', topic),
      date: getTodayLabel(),
      progress: template.progress,
      completed: false,
      logoId: logo?.id,
      componentIds,
      source,
    },
  };
};

const uniqueByTitle = (items: AISubAchievement[]) => {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const loadAIAchievements = (): GeneratedAchievementsByGroup => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const saveAIAchievements = (achievements: GeneratedAchievementsByGroup) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  window.dispatchEvent(new Event('daytrack_ai_achievements_updated'));
};

export const generateAIAchievements = (context: AchievementContext) => {
  const existing = loadAIAchievements();
  const topics = [
    ...(context.schedules ?? []).map(schedule => schedule.title),
    ...(context.schedules ?? []).flatMap(schedule => schedule.tasks ?? []),
    ...(context.tasks ?? []).map(task => task.title),
  ].filter(Boolean);

  const generated = topics.slice(0, 6).map(topic =>
    buildAchievement(topic, context.source, context.tasks?.length ? '4' : undefined)
  );

  if (generated.length === 0) return existing;

  const next = { ...existing };
  generated.forEach(({ groupId, achievement }) => {
    next[groupId] = uniqueByTitle([...(next[groupId] ?? []), achievement]);
  });

  saveAIAchievements(next);
  return next;
};
