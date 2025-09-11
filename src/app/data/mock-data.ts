import { Emotion } from '../core/services/emotion.service';
import { MoodEntry, SuggestedActivity } from '../core/models/mood-entry.model';
import {
  ActivityCategory,
  DifficultyLevel,
} from '../core/services/suggested-activity.service';

// Mock Emotions Data
export const MOCK_EMOTIONS: Emotion[] = [
  // Root emotions
  {
    id: 1,
    key: 'joy',
    label: 'Joy',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    key: 'trust',
    label: 'Trust & Love',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    key: 'fear',
    label: 'Fear',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    key: 'surprise',
    label: 'Surprise',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    key: 'sadness',
    label: 'Sadness',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    key: 'disgust',
    label: 'Disgust',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    key: 'anger',
    label: 'Anger',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 8,
    key: 'anticipation',
    label: 'Anticipation & Curiosity',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Joy
  {
    id: 9,
    key: 'contentment',
    label: 'Contentment',
    parent: { id: 1, key: 'joy', label: 'Joy' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 10,
    key: 'pride',
    label: 'Pride',
    parent: { id: 1, key: 'joy', label: 'Joy' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 11,
    key: 'amusement',
    label: 'Amusement',
    parent: { id: 1, key: 'joy', label: 'Joy' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 12,
    key: 'optimism',
    label: 'Optimism',
    parent: { id: 1, key: 'joy', label: 'Joy' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Trust & Love
  {
    id: 13,
    key: 'affection',
    label: 'Affection',
    parent: { id: 2, key: 'trust', label: 'Trust & Love' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 14,
    key: 'compassion',
    label: 'Compassion',
    parent: { id: 2, key: 'trust', label: 'Trust & Love' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 15,
    key: 'caring',
    label: 'Caring',
    parent: { id: 2, key: 'trust', label: 'Trust & Love' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Fear
  {
    id: 16,
    key: 'anxiety',
    label: 'Anxiety',
    parent: { id: 3, key: 'fear', label: 'Fear' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 17,
    key: 'worry',
    label: 'Worry',
    parent: { id: 3, key: 'fear', label: 'Fear' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 18,
    key: 'nervousness',
    label: 'Nervousness',
    parent: { id: 3, key: 'fear', label: 'Fear' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Surprise
  {
    id: 19,
    key: 'shock',
    label: 'Shock',
    parent: { id: 4, key: 'surprise', label: 'Surprise' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 20,
    key: 'awe',
    label: 'Awe',
    parent: { id: 4, key: 'surprise', label: 'Surprise' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 21,
    key: 'confusion',
    label: 'Confusion',
    parent: { id: 4, key: 'surprise', label: 'Surprise' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Sadness
  {
    id: 22,
    key: 'grief',
    label: 'Grief',
    parent: { id: 5, key: 'sadness', label: 'Sadness' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 23,
    key: 'loneliness',
    label: 'Loneliness',
    parent: { id: 5, key: 'sadness', label: 'Sadness' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 24,
    key: 'disappointment',
    label: 'Disappointment',
    parent: { id: 5, key: 'sadness', label: 'Sadness' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 25,
    key: 'tiredness',
    label: 'Tiredness',
    parent: { id: 5, key: 'sadness', label: 'Sadness' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Disgust
  {
    id: 26,
    key: 'aversion',
    label: 'Aversion',
    parent: { id: 6, key: 'disgust', label: 'Disgust' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 27,
    key: 'contempt',
    label: 'Contempt',
    parent: { id: 6, key: 'disgust', label: 'Disgust' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 28,
    key: 'judgment',
    label: 'Judgment',
    parent: { id: 6, key: 'disgust', label: 'Disgust' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Anger
  {
    id: 29,
    key: 'frustration',
    label: 'Frustration',
    parent: { id: 7, key: 'anger', label: 'Anger' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 30,
    key: 'resentment',
    label: 'Resentment',
    parent: { id: 7, key: 'anger', label: 'Anger' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 31,
    key: 'envy',
    label: 'Envy',
    parent: { id: 7, key: 'anger', label: 'Anger' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-emotions for Anticipation
  {
    id: 32,
    key: 'interest',
    label: 'Interest',
    parent: { id: 8, key: 'anticipation', label: 'Anticipation & Curiosity' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 33,
    key: 'vigilance',
    label: 'Vigilance',
    parent: { id: 8, key: 'anticipation', label: 'Anticipation & Curiosity' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 34,
    key: 'attention',
    label: 'Attention',
    parent: { id: 8, key: 'anticipation', label: 'Anticipation & Curiosity' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Mood Entries Data
export const MOCK_MOOD_ENTRIES: MoodEntry[] = [
  {
    id: 1,
    userId: 1,
    emotionKeys: ['joy', 'contentment', 'optimism'],
    location: 'Home',
    environment: 'ALONE',
    description:
      "Had a great morning workout and feeling accomplished. The sun is shining and I'm looking forward to the day ahead.",
    energyLevel: 4,
    isVoiceInput: false,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
  {
    id: 2,
    userId: 1,
    emotionKeys: ['sadness', 'loneliness'],
    location: 'Office',
    environment: 'IN_GROUP',
    description:
      'Feeling a bit down today. Missing my family and feeling disconnected from colleagues.',
    energyLevel: 2,
    isVoiceInput: true,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
  {
    id: 3,
    userId: 1,
    emotionKeys: ['fear', 'anxiety'],
    location: 'Public Transport',
    environment: 'IN_GROUP',
    description:
      'Feeling anxious about the upcoming presentation. Worried about making mistakes in front of everyone.',
    energyLevel: 3,
    isVoiceInput: false,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
  {
    id: 4,
    userId: 1,
    emotionKeys: ['trust', 'affection'],
    location: 'Park',
    environment: 'IN_GROUP',
    description:
      'Spent time with close friends. Feeling loved and supported. Great conversation and laughter.',
    energyLevel: 5,
    isVoiceInput: false,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
  {
    id: 5,
    userId: 1,
    emotionKeys: ['anger', 'frustration'],
    location: 'Home',
    environment: 'ALONE',
    description:
      'Frustrated with work deadlines and feeling overwhelmed. Need to take a step back and breathe.',
    energyLevel: 2,
    isVoiceInput: false,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
  {
    id: 6,
    userId: 1,
    emotionKeys: ['anticipation', 'interest'],
    location: 'Coffee Shop',
    environment: 'IN_GROUP',
    description:
      'Excited about starting a new project. Feeling curious and motivated to learn new things.',
    energyLevel: 4,
    isVoiceInput: false,
    entryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    suggestedActivities: [],
  },
];

// Mock Suggested Activities Data
export const MOCK_SUGGESTED_ACTIVITIES: SuggestedActivity[] = [
  // Activities for Joy/Contentment mood
  {
    id: 1,
    userId: 1,
    moodEntryId: 1,
    title: 'Take 5 Deep Breaths',
    description:
      'Find a quiet spot and take 5 slow, deep breaths. Focus on the sensation of breathing in and out.',
    category: ActivityCategory.BREATHING,
    estimatedDurationMinutes: 2,
    difficultyLevel: DifficultyLevel.VERY_EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 1,
    moodEntryId: 1,
    title: 'Send a Positive Message',
    description:
      'Reach out to someone you care about and send them a kind, supportive message.',
    category: ActivityCategory.SOCIAL,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: 1,
    moodEntryId: 1,
    title: 'Take a 10-Minute Walk',
    description:
      'Step outside and take a short walk around your neighborhood. Notice the sights and sounds.',
    category: ActivityCategory.PHYSICAL,
    estimatedDurationMinutes: 10,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Activities for Sadness/Loneliness mood
  {
    id: 4,
    userId: 1,
    moodEntryId: 2,
    title: 'Practice Self-Compassion',
    description:
      'Write down 3 kind things you would say to a friend, then say them to yourself.',
    category: ActivityCategory.SELF_CARE,
    estimatedDurationMinutes: 8,
    difficultyLevel: DifficultyLevel.MODERATE,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    userId: 1,
    moodEntryId: 2,
    title: 'Listen to Uplifting Music',
    description:
      'Put on your favorite uplifting song and let yourself feel the positive emotions.',
    category: ActivityCategory.CREATIVE,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.VERY_EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    userId: 1,
    moodEntryId: 2,
    title: 'Text a Family Member',
    description:
      'Send a simple "thinking of you" message to a family member you miss.',
    category: ActivityCategory.SOCIAL,
    estimatedDurationMinutes: 3,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Activities for Fear/Anxiety mood
  {
    id: 7,
    userId: 1,
    moodEntryId: 3,
    title: 'Progressive Muscle Relaxation',
    description:
      'Tense and relax each muscle group for 5 seconds, starting from your toes up to your head.',
    category: ActivityCategory.MINDFULNESS,
    estimatedDurationMinutes: 15,
    difficultyLevel: DifficultyLevel.MODERATE,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    userId: 1,
    moodEntryId: 3,
    title: 'Write Down Your Worries',
    description:
      'Take 5 minutes to write down all your worries, then read them back to yourself.',
    category: ActivityCategory.CREATIVE,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    userId: 1,
    moodEntryId: 3,
    title: 'Practice Box Breathing',
    description:
      'Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5 times.',
    category: ActivityCategory.BREATHING,
    estimatedDurationMinutes: 3,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Activities for Trust/Affection mood
  {
    id: 10,
    userId: 1,
    moodEntryId: 4,
    title: 'Express Gratitude',
    description:
      "Write down 3 things you're grateful for today, especially the people in your life.",
    category: ActivityCategory.GRATITUDE,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    userId: 1,
    moodEntryId: 4,
    title: 'Share a Memory',
    description: 'Share a happy memory or story with someone close to you.',
    category: ActivityCategory.SOCIAL,
    estimatedDurationMinutes: 10,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 12,
    userId: 1,
    moodEntryId: 4,
    title: 'Create Something Beautiful',
    description:
      'Draw, paint, or create something that represents your current positive feelings.',
    category: ActivityCategory.CREATIVE,
    estimatedDurationMinutes: 20,
    difficultyLevel: DifficultyLevel.MODERATE,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Activities for Anger/Frustration mood
  {
    id: 13,
    userId: 1,
    moodEntryId: 5,
    title: 'Physical Exercise',
    description: 'Do 10 jumping jacks or push-ups to release physical tension.',
    category: ActivityCategory.PHYSICAL,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 14,
    userId: 1,
    moodEntryId: 5,
    title: 'Write a Rant Letter',
    description:
      "Write down everything that's frustrating you, then tear it up or delete it.",
    category: ActivityCategory.CREATIVE,
    estimatedDurationMinutes: 10,
    difficultyLevel: DifficultyLevel.EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 15,
    userId: 1,
    moodEntryId: 5,
    title: 'Take a 5-Minute Break',
    description:
      "Step away from what's frustrating you and do something completely different for 5 minutes.",
    category: ActivityCategory.SELF_CARE,
    estimatedDurationMinutes: 5,
    difficultyLevel: DifficultyLevel.VERY_EASY,
    isCompleted: false,
    suggestedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper functions for mock data
export const getMockEmotions = (): Emotion[] => MOCK_EMOTIONS;
export const getMockMoodEntries = (): MoodEntry[] => MOCK_MOOD_ENTRIES;
export const getMockSuggestedActivities = (): SuggestedActivity[] =>
  MOCK_SUGGESTED_ACTIVITIES;

// Get root emotions only
export const getMockRootEmotions = (): Emotion[] =>
  MOCK_EMOTIONS.filter((emotion) => !emotion.parent);

// Get sub-emotions only
export const getMockSubEmotions = (): Emotion[] =>
  MOCK_EMOTIONS.filter((emotion) => emotion.parent);

// Get emotions by parent key
export const getMockEmotionsByParentKey = (parentKey: string): Emotion[] =>
  MOCK_EMOTIONS.filter((emotion) => emotion.parent?.key === parentKey);

// Get today's mood entries
export const getMockTodayMoodEntries = (): MoodEntry[] =>
  MOCK_MOOD_ENTRIES.filter((entry) => {
    const entryDate = entry.entryDate;
    const today = new Date();
    return entryDate.toDateString() === today.toDateString();
  });

// Get pending activities for today
export const getMockPendingTodayActivities = (): SuggestedActivity[] =>
  MOCK_SUGGESTED_ACTIVITIES.filter((activity) => !activity.isCompleted);

// Get completed activities
export const getMockCompletedActivities = (): SuggestedActivity[] =>
  MOCK_SUGGESTED_ACTIVITIES.filter((activity) => activity.isCompleted);

// Get mood statistics
export const getMockMoodStatistics = () => ({
  todayEntries: getMockTodayMoodEntries().length,
  averageEnergyLevelWeek: 3.2,
  averageEnergyLevelMonth: 3.5,
});

// Get activity statistics
export const getMockActivityStatistics = () => {
  const todayActivities = MOCK_SUGGESTED_ACTIVITIES;
  const completed = todayActivities.filter((a) => a.isCompleted).length;
  const total = todayActivities.length;

  return {
    todayTotal: total,
    todayCompleted: completed,
    todayPending: total - completed,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
  };
};
