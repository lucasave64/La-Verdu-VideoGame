/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CaricatureConfig {
  skinColor: string;      // Color hex: '#ffdbac' | '#f1c27d' | '#e0ac69' | '#c68642' | '#8d5524'
  hairStyle: string;      // 'short' | 'curly' | 'long' | 'bald' | 'spiky' | 'wavy'
  hairColor: string;      // 'black' | 'brown' | 'blonde' | 'red' | 'gray'
  eyeColor: string;       // 'black' | 'blue' | 'green' | 'brown'
  glasses: boolean;
  beard: boolean;
  expression: string;     // 'happy' | 'neutral' | 'smiling' | 'surprised'
  hasApron: boolean;      // True if wearing La Verdu apron
}

export interface User {
  email: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl?: string;     // Standard uploaded photo
  caricature: CaricatureConfig;
  totalScore: number;
  currentLevel: number;   // 1, 2, 3
  currentSteps: number;   // Total questions answered historically (every 10 steps = 1 recipe gift)
  completedLessons: string[]; // List of lesson IDs completed
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'sorting';
  questionText: string;
  options: string[];      // Multiple choices, or sorting items, or pair lists
  correctAnswer: string | string[]; // Correct answer text or sequence
  explanation: string;    // Fact / awareness sentence from La Verdu
  rewardExp: number;
}

export interface LessonSummary {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  colorClass: string;     // e.g. 'bg-emerald-500'
  accentColor: string;    // e.g. 'text-emerald-600'
  lessons: LessonSummary[];
}

export interface LeaderboardEntry {
  name: string;
  email: string;
  caricature: CaricatureConfig;
  totalScore: number;
  currentLevel: number;
  currentSteps: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  category: 'fruits-veg' | 'mate-honey' | 'garden';
}

export interface OrderDetails {
  recipeTitle: string;
  ingredients: string[];
  clientPhone: string;
  clientAddress: string;
}
