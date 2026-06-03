import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { ScheduleBlock } from '../pages/Timetable';

export interface UserProfile {
  name?: string;
  age?: string;
  job?: string;
  habits?: string;
  goals?: string;
}

const MODEL_NAME = 'gemini-1.5-flash-8b';
const CACHE_PREFIX = 'daytrack_gemini_suggestions';

const colors = [
  'bg-blue-50 text-blue-600',
  'bg-green-50 text-green-600',
  'bg-purple-50 text-purple-600',
  'bg-pink-50 text-pink-600',
  'bg-orange-50 text-orange-600',
  'bg-yellow-50 text-yellow-700',
];

const normalize = (value = '') => value.toLowerCase();

const getCategory = (title: string) => {
  const text = normalize(title);
  if (/(gym|chạy|bơi|thể dục|thể thao|tập|workout|exercise)/.test(text)) return 'Thể dục';
  if (/(toán|văn|lý|hóa|sinh|anh|học|ôn|bài tập|đọc|study)/.test(text)) return 'Học tập';
  if (/(kỹ năng|dự án|thói quen|cá nhân|sách|phát triển)/.test(text)) return 'Phát triển bản thân';
  return 'Khác';
};

const wantsMuscle = (profile: UserProfile) =>
  /tăng cơ|cơ bắp|gym|sức mạnh|muscle/.test(normalize(`${profile.goals} ${profile.habits}`));

const getCacheKey = (
  userProfile: UserProfile,
  dayName: string,
  daySchedules: ScheduleBlock[]
) => {
  const payload = JSON.stringify({
    model: MODEL_NAME,
    userProfile,
    dayName,
    daySchedules: daySchedules.map(block => ({
      id: block.id,
      title: block.title,
      time: block.time,
      tasks: block.tasks,
      isTimeFixed: block.isTimeFixed,
    })),
  });
  return `${CACHE_PREFIX}_${btoa(unescape(encodeURIComponent(payload))).slice(0, 160)}`;
};

const loadCachedSuggestions = (cacheKey: string): ScheduleBlock[] | null => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.createdAt > 1000 * 60 * 60 * 24) return null;
    return parsed.items;
  } catch {
    return null;
  }
};

const saveCachedSuggestions = (cacheKey: string, items: ScheduleBlock[]) => {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ createdAt: Date.now(), items }));
  } catch {
    // Cache is a speed boost only; ignore storage failures.
  }
};

export const generateLocalScheduleSuggestions = (
  userProfile: UserProfile,
  _dayName: string,
  daySchedules: ScheduleBlock[]
): ScheduleBlock[] => {
  return daySchedules.map((block, index) => {
    const category = getCategory(block.title);
    const suggestedTime = block.isTimeFixed
      ? block.time
      : category === 'Khác'
        ? block.time
        : ['16:00 - 17:00', '16:30 - 17:30', '17:00 - 18:00'][index % 3];

    if (category === 'Thể dục') {
      const need = wantsMuscle(userProfile) ? 'Tăng cơ' : 'Giảm cân';
      return {
        ...block,
        category,
        time: suggestedTime,
        need,
        method: need === 'Tăng cơ'
          ? 'Tập sức mạnh toàn thân: hít đất 3 hiệp x 10-15 cái, squat 3 hiệp x 15 cái, plank 3 hiệp x 30-45 giây.'
          : 'Tập giảm mỡ nhẹ: chạy bộ 2-3km, plank 3 hiệp x 30 giây, giãn cơ 5 phút cuối buổi.',
        reason: 'Gợi ý này giữ cường độ vừa phải, dễ theo lịch hiện có và giúp cơ thể quen dần mà không quá tải.',
        tasks: [
          'Khởi động 5-7 phút trước khi tập',
          need === 'Tăng cơ' ? 'Ưu tiên động tác đúng kỹ thuật hơn số lần' : 'Giữ nhịp chạy vừa sức, không tăng tốc đột ngột',
          'Nghỉ 45-60 giây giữa các hiệp',
          'Uống nước và giãn cơ sau khi tập',
        ],
      };
    }

    if (category === 'Học tập') {
      return {
        ...block,
        category,
        time: suggestedTime,
        need: '',
        method: `Học ${block.title} bằng cách chia 3 phần: ôn nhanh kiến thức cũ, làm bài chủ động, tự kiểm tra không nhìn đáp án.`,
        reason: 'Cách học chủ động giúp ghi nhớ tốt hơn học thụ động, đồng thời các khoảng nghỉ ngắn giúp giữ tập trung và bảo vệ sức khỏe.',
        tasks: [
          'Ngồi thẳng lưng, đặt màn hình hoặc vở ngang tầm mắt',
          'Tập trung 25 phút rồi nghỉ 5 phút',
          'Tự làm 3-5 câu/bài nhỏ trước khi xem lời giải',
          'Kết thúc bằng 3 dòng tóm tắt điều đã học',
        ],
      };
    }

    return {
      ...block,
      category,
      time: suggestedTime,
      need: '',
      method: 'Chia việc thành bước nhỏ, làm phần quan trọng trước, nghỉ ngắn giữa các lượt để giữ năng lượng.',
      reason: 'Cách chia nhỏ giúp giảm cảm giác quá tải và dễ bắt đầu hơn.',
      tasks: [
        'Xác định kết quả cần hoàn thành',
        'Làm bước đầu tiên trong 15-25 phút',
        'Nghỉ 5 phút rồi kiểm tra tiến độ',
      ],
    };
  });
};

export async function generateDaySchedule(
  apiKey: string,
  userProfile: UserProfile,
  dayName: string,
  existingSchedules: Record<string, ScheduleBlock[]>,
  daySchedules: ScheduleBlock[] = existingSchedules[dayName] || []
): Promise<ScheduleBlock[]> {
  if (!apiKey) {
    throw new Error('Missing Gemini API Key');
  }

  const cacheKey = getCacheKey(userProfile, dayName, daySchedules);
  const cached = loadCachedSuggestions(cacheKey);
  if (cached) return cached;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 1200,
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            sourceIndex: { type: SchemaType.NUMBER },
            category: { type: SchemaType.STRING },
            title: { type: SchemaType.STRING },
            time: { type: SchemaType.STRING },
            isTimeFixed: { type: SchemaType.BOOLEAN },
            need: { type: SchemaType.STRING },
            method: { type: SchemaType.STRING },
            reason: { type: SchemaType.STRING },
            tasks: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: ['sourceIndex', 'category', 'title', 'time', 'isTimeFixed', 'method', 'reason', 'tasks'],
        },
      },
    },
  });

  const dayScheduleContext = daySchedules.map((block, index) => (
    `${index}. ${block.title}; ${block.time}; fixed=${block.isTimeFixed ? 'yes' : 'no'}; tasks=${(block.tasks || []).join(' | ') || 'none'}`
  )).join('\n');

  const prompt = `
Đọc lịch ĐÃ CÓ và trả JSON gợi ý tối ưu. Không tạo hoạt động mới. Nếu không có lịch, trả [].

Người dùng: tuổi=${userProfile.age || 'unknown'}; nghề=${userProfile.job || 'unknown'}; thói quen/sở thích=${userProfile.habits || 'unknown'}; nhu cầu=${userProfile.goals || 'unknown'}.
Ngày: ${dayName}
Lịch hiện có:
${dayScheduleContext || 'none'}

Luật:
- Mỗi item ứng với một lịch gốc qua sourceIndex.
- category: Học tập | Thể dục | Phát triển bản thân | Khác.
- Học tập: method nêu phương pháp riêng theo môn; tasks có tư thế học, 25 phút tập trung, 5 phút nghỉ; reason giải thích vì sao.
- Thể dục: need là "Giảm cân" hoặc "Tăng cơ"; method có bài tập định lượng như chạy 2-3km, hít đất số cái, plank số giây; reason giải thích vì sao.
- Nếu lịch không fixed, time có thể giữ giờ cũ hoặc chọn 16:00 - 17:00 / 16:30 - 17:30 / 17:00 - 18:00.
- Viết tiếng Việt ngắn, thực tế.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const rawData = JSON.parse(text);
    const items = rawData
      .map((item: any, index: number) => {
        const source = daySchedules[item.sourceIndex] || daySchedules[index];
        if (!source && daySchedules.length > 0) return null;

        return {
          ...(source || {}),
          ...item,
          id: source?.id || `ai-suggestion-${dayName}-${Date.now()}-${index}`,
          title: source?.title || item.title,
          color: source?.color || colors[Math.floor(Math.random() * colors.length)],
          isTimeFixed: source?.isTimeFixed ?? item.isTimeFixed,
        };
      })
      .filter(Boolean);

    saveCachedSuggestions(cacheKey, items);
    return items;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return generateLocalScheduleSuggestions(userProfile, dayName, daySchedules);
  }
}
