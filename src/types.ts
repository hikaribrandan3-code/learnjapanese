/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Screen {
  WELCOME = 'WELCOME',
  ONBOARDING = 'ONBOARDING',
  PATH = 'PATH',
  FLASHCARD = 'FLASHCARD',
  QUIZ = 'QUIZ',
  GOALS = 'GOALS',
  PROFILE = 'PROFILE',
  WRITING = 'WRITING',
}

export interface UserProfile {
  name: string;
  avatar: string;
  gender: 'female' | 'male';
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  icon: string;
}

export interface LessonNode {
  id: string;
  type: 'completed' | 'active' | 'locked' | 'treasure';
  icon?: string;
  title?: string;
}
