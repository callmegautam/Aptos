import { openrouter } from '@/lib/ai/openrouter';

export async function getResumeAnalysis({
  resumeText,
  jobTitle,
  jobDescription
}: {
  resumeText: string;
  jobTitle: string;
  jobDescription: string;
}) {
  const oldprompt = `
You are a technical interviewer.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Return ONLY valid JSON in this format:

{
 "theoryQuestions": ["q1","q2","q3"],
 "practicalQuestions": ["q1","q2","q3"],
 "resumeScore": number
}

Rules:
- 10 theoryQuestions: conceptual questions that are relevant to the job title and job description
- 10 practicalQuestions: coding or real-world tasks that are relevant to the job title and job description
- resumeScore: number between 0 and 10
`;

  const prompt = `
You are a senior technical interviewer generating interview questions.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Return ONLY valid JSON in this format:

{
 "theoryQuestions": [],
 "practicalQuestions": [],
 "resumeScore": number
}

Rules:

THEORY QUESTIONS
- Generate exactly 10 conceptual questions.
- Questions must relate to the job title, job description, or technologies in the resume.
- Questions should test understanding of concepts, architecture, or best practices.

PRACTICAL QUESTIONS
- Generate exactly 10 coding tasks.
- Each task MUST be solvable in a single file.
- Tasks MUST run in an online compiler environment.
- Tasks MUST NOT require:
  - external libraries
  - frameworks
  - databases
  - APIs
  - multiple files
  - system design
- Tasks should focus on:
  - algorithms
  - data structures
  - string manipulation
  - array/object processing
  - small logic problems
  - basic implementations of concepts
- Each question should be solvable within 10–25 minutes.

Examples of acceptable practical tasks:
- Implement a debounce function in JavaScript.
- Reverse words in a sentence.
- Implement a simple LRU cache using a class.
- Write a function to group an array of objects by a key.

Examples of unacceptable tasks:
- Build a full REST API.
- Create a React application.
- Design a microservice architecture.

RESUME SCORE
- Score from 0 to 10.
- Score should represent how well the resume matches the job requirements.
- Consider skills, experience, and projects.

Return ONLY JSON.
No explanation.
No markdown.
`;

  const completion = await openrouter.chat.completions.create({
    model: 'deepseek/deepseek-chat', // cheap model
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000,
    response_format: { type: 'json_object' }
  });

  const data = JSON.parse(completion.choices[0].message.content ?? '{}');
  return data;
}

export async function compressResume(resumeText: string) {
  const completion = await openrouter.chat.completions.create({
    model: 'deepseek/deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'Extract key information from resumes.'
      },
      {
        role: 'user',
        content: `
Extract the essential information from this resume.

Return JSON:

{
  "skills": [],
  "experience": [],
  "projects": [],
  "education": "",
  "summary": ""
}

Resume:
${resumeText}
`
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content!);
}

export function firstNWords(text: string, limit = 1000): string {
  return text.trim().split(/\s+/).slice(0, limit).join(' ');
}
