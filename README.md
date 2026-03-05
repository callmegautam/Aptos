```
src/
│
├── app/                          # Next.js App Router
│
│   ├── layout.tsx                # Root layout (fonts, providers, global styles)
│   ├── page.tsx                  # Landing page
│   ├── loading.tsx               # Global loading UI
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│
│
│   ├── (marketing)/              # Public marketing pages
│   │
│   │   ├── layout.tsx            # Marketing layout (navbar + footer)
│   │   │
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── features/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│
│
│   ├── (auth)/                   # Authentication routes
│   │
│   │   ├── layout.tsx            # Auth layout (centered form UI)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx
│   │   │
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   │
│   │   └── verify-email/
│   │       └── page.tsx
│
│
│   ├── (dashboard)/              # Protected SaaS dashboard
│   │
│   │   ├── layout.tsx            # Dashboard layout (sidebar + header)
│   │   │
│   │   ├── page.tsx              # Dashboard overview
│   │
│   │   ├── company/
│   │   │   ├── page.tsx          # Company profile
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │
│   │   ├── interviewers/
│   │   │   ├── page.tsx          # List interviewers
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │
│   │   ├── interviews/
│   │   │   ├── page.tsx          # Interview list
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [interviewId]/
│   │   │       └── page.tsx
│   │
│   │   ├── candidates/
│   │   │   ├── page.tsx
│   │   │   └── [candidateId]/
│   │   │       └── page.tsx
│   │
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── [reportId]/
│   │   │       └── page.tsx
│   │
│   │   └── settings/
│   │       └── page.tsx
│
│
│   ├── interview/                # Public interview room
│   │
│   │   └── [roomId]/
│   │       │
│   │       ├── layout.tsx        # Interview room layout
│   │       ├── page.tsx          # Main interview UI
│   │       ├── loading.tsx       # Room loading state
│   │       ├── error.tsx         # Room error boundary
│   │
│   │       ├── coding/
│   │       │   └── page.tsx      # Coding editor
│   │
│   │       ├── report/
│   │       │   └── page.tsx      # Interview result
│   │
│   │       └── join/
│   │           └── page.tsx      # Candidate join page
│
│
│   └── api/                      # API routes (if needed)
│
│       ├── auth/
│       │   └── route.ts
│
│       ├── upload/
│       │   └── route.ts
│
│       ├── ai/
│       │   ├── generate-questions/
│       │   │   └── route.ts
│       │   ├── evaluate-code/
│       │   │   └── route.ts
│       │   └── analyze-resume/
│       │       └── route.ts
│
│       └── interview/
│           ├── create/
│           │   └── route.ts
│           └── submit/
│               └── route.ts
│
│
├── features/                     # Business modules
│
│   ├── auth/
│   │   ├── components/
│   │   ├── actions.ts            # server actions
│   │   ├── service.ts            # auth business logic
│   │   └── types.ts
│
│   ├── company/
│   │   ├── components/
│   │   ├── service.ts
│   │   └── types.ts
│
│   ├── interview/
│   │   ├── components/
│   │   │   ├── InterviewRoom.tsx
│   │   │   ├── VideoPanel.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ScorePanel.tsx
│   │   │   └── CandidatePanel.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useInterviewRoom.ts
│   │   │
│   │   ├── actions.ts
│   │   ├── service.ts
│   │   └── types.ts
│
│   ├── candidate/
│   │   ├── components/
│   │   ├── service.ts
│   │   └── types.ts
│
│   ├── coding/
│   │   ├── editor/
│   │   │   └── CodeEditor.tsx
│   │   │
│   │   ├── execution/
│   │   │   └── runCode.ts
│   │   │
│   │   └── judge-service.ts
│
│   ├── ai/
│   │   ├── question-generator.ts
│   │   ├── resume-analyzer.ts
│   │   ├── code-evaluator.ts
│   │   └── report-generator.ts
│
│   └── report/
│       ├── components/
│       ├── generator.ts
│       └── exporter.ts
│
│
├── components/                   # Shared UI components
│
│   ├── ui/                       # shadcn style primitives
│   ├── forms/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   └── common/
│       ├── Avatar.tsx
│       ├── Button.tsx
│       └── Loader.tsx
│
│
├── lib/                          # Infrastructure layer
│
│   ├── db/
│   │   ├── client.ts             # DB connection
│   │   └── schema/               # ORM schemas
│
│   ├── auth/
│   │   └── auth.ts               # next-auth / clerk config
│
│   ├── ai/
│   │   └── openai.ts             # LLM client
│
│   ├── stream/
│   │   └── video.ts              # getstream / WebRTC setup
│
│   ├── storage/
│   │   └── upload.ts             # resume uploads
│
│   └── realtime/
│       └── socket.ts
│
│
├── hooks/                        # Global hooks
│
│   ├── useAuth.ts
│   ├── useSocket.ts
│   ├── useInterview.ts
│   └── useUpload.ts
│
│
├── types/
│   ├── interview.ts
│   ├── candidate.ts
│   ├── ai.ts
│   └── report.ts
│
│
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── format.ts
│
│
├── config/
│   ├── site.ts
│   └── interview.ts
│
│
└── styles/
    └── globals.css
```
