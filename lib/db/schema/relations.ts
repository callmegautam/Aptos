import { relations } from 'drizzle-orm';
import { interviewRooms } from './interview-rooms';
import { companies } from './companies';
import { interviewers } from './interviewers';
import { candidates } from './candidates';

export const interviewRoomsRelations = relations(interviewRooms, ({ one }) => ({
  company: one(companies, {
    fields: [interviewRooms.companyId],
    references: [companies.id]
  }),

  interviewer: one(interviewers, {
    fields: [interviewRooms.interviewerId],
    references: [interviewers.id]
  }),

  candidate: one(candidates, {
    fields: [interviewRooms.candidateId],
    references: [candidates.id]
  })
}));
