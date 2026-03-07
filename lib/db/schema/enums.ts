import { pgEnum } from 'drizzle-orm/pg-core';

export const interviewStatusEnum = pgEnum('interview_status', ['created', 'started', 'completed']);

export const questionTypeEnum = pgEnum('question_type', ['theoretical', 'coding', 'mcq']);

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

export const hiringRecommendationEnum = pgEnum('hiring_recommendation', [
  'strong_yes',
  'yes',
  'no',
  'strong_no'
]);

export const uploadedByEnum = pgEnum('uploaded_by', ['candidate', 'company']);
