export interface MoodEntry {
  id: number;
  userId: number;
  emotionKeys: string[];
  location?: string;
  environment: 'ALONE' | 'IN_GROUP';
  description?: string;
  energyLevel: number; // 1-5 scale
  entryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isVoiceInput: boolean;
  passion?: string;
  suggestedActivities?: SuggestedActivity[];
  suggestedActivitiesCount?: number;
}

export interface SuggestedActivity {
  id: number;
  userId: number;
  moodEntryId: number;
  title: string;
  description?: string;
  category:
    | 'BREATHING'
    | 'PHYSICAL'
    | 'SOCIAL'
    | 'CREATIVE'
    | 'MINDFULNESS'
    | 'SELF_CARE'
    | 'PRODUCTIVITY'
    | 'NATURE'
    | 'LEARNING'
    | 'GRATITUDE';
  estimatedDurationMinutes?: number;
  difficultyLevel?:
    | 'VERY_EASY'
    | 'EASY'
    | 'MODERATE'
    | 'CHALLENGING'
    | 'INTENSIVE';
  isCompleted: boolean;
  completedAt?: Date;
  suggestedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionCategory {
  id: number;
  name: string;
  emotions: Emotion[];
}

export interface Emotion {
  id: number;
  name: string;
  category: string;
  color: string;
}

export interface Activity {
  id: number;
  userId: number;
  moodEntryId: number;
  title: string;
  description: string;
  category:
    | 'breathing'
    | 'movement'
    | 'social'
    | 'mindfulness'
    | 'creative'
    | 'self-care';
  estimatedDuration: number; // in minutes
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIActivitySuggestion {
  activities: Activity[];
  reasoning: string;
}
