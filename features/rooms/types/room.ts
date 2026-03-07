export const ROOM_STATUS = ['draft', 'scheduled', 'live', 'completed', 'cancelled'] as const;
export type RoomStatus = (typeof ROOM_STATUS)[number];

export const INTERVIEW_FIELD = ['backend', 'frontend', 'fullstack', 'app'] as const;
export type InterviewField = (typeof INTERVIEW_FIELD)[number];

export type InterviewRoom = {
  id: string;
  name: string;
  description?: string;
  status: RoomStatus;
  candidateName?: string;
  interviewerName?: string;
  scheduledAt?: Date;
  createdAt: Date;
  field: InterviewField;
};
