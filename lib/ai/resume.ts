import { db } from '../db';
import { resumes } from '../db/schema';
import { uploadedByEnum } from '../db/schema/enums';
import { extractTextFromBuffer } from '../pdf/pdf-parser';
import { firstNWords } from './ai';

type StoreResumeParams = {
  resume: File;
  companyId: number;
  interviewerId: number;
  candidateId?: number;
  fileUrl: string;
  roomId: number;
  uploadedBy: (typeof uploadedByEnum.enumValues)[number];
  parsedTextSize: number;
};

export const storeResume = async ({
  resume,
  companyId,
  interviewerId,
  candidateId,
  fileUrl,
  roomId,
  uploadedBy,
  parsedTextSize
}: StoreResumeParams) => {
  const resumeText = await extractTextFromBuffer(Buffer.from(await resume.arrayBuffer()));
  const smallParsedData = firstNWords(resumeText, parsedTextSize);

  if (uploadedBy === 'CANDIDATE') {
    await db.insert(resumes).values({
      companyId,
      interviewerId,
      candidateId,
      fileUrl,
      roomId,
      uploadedBy,
      parsedText: smallParsedData
    });
  } else {
    await db.insert(resumes).values({
      companyId,
      interviewerId,
      fileUrl,
      roomId,
      uploadedBy,
      parsedText: smallParsedData
    });
  }
};
