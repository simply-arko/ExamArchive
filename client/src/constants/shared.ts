export const LinkedIn = Object.freeze({
  Arkojeet: 'https://www.linkedin.com/in/arkojeet-bera/',
  Bismay: 'https://www.linkedin.com/in/bismay-purkayastha-4a63a6179/',
});

export const EXAM_TYPES = {
  INSTITUTIONAL: {
    MIDSEM: 'Midsem',
    ENDSEM: 'Endsem',
    'QUIZ-I': 'Quiz I',
    'QUIZ-2': 'Quiz II',
    'PRACTICAL-I': 'Practical I',
    'PRACTICAL-II': 'Practical II',
  },
  COMPETITIVE: { GATE: 'Gate' },
} as const;

export const SEMESTER = Object.freeze({
  I: 'Semester I',
  II: 'Semester II',
  III: 'Semester III',
  IV: 'Semester IV',
  V: 'Semester V',
  VI: 'Semester VI',
  VII: 'Semester VII',
  VIII: 'Semester VIII',
});

export const reportReasons = [
  { rank: 2, reason: 'Inappropriate or Offensive language' }, // -> Hate Speech
  { rank: 3, reason: 'Harassesment or Bullying' }, // -> Harassesment or Bullying
  { rank: 4, reason: 'Sexually Explicit Content' }, // -> nudity
  { rank: 5, reason: 'Misinformation or Fake news' }, // -> scam
  { rank: 6, reason: 'Violence or Graphic Content' }, // Violence
  { rank: 7, reason: 'Impersonation' }, // -> Impersonation
  { rank: 1, reason: 'Other' }, // -> Other
];

export const monthNames = [
  'Jan',
  'Feb',
  'March',
  'April',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const folderColumns = [
  { name: 'Folder name', uid: 'name', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const bookmarkFileColumns = [
  { name: 'File name', uid: 'filename', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const uploadFileColumns = [
  { name: 'File name', uid: 'filename', sortable: false },
  { name: 'Exam Type', uid: 'examType', sortable: true },
  { name: 'Status', uid: 'status', sortable: false },
  { name: 'Created at', uid: 'createdAt', sortable: true },
  { name: 'Last Modified', uid: 'updatedAt', sortable: true },
];

export const tagsBgColorMap: Array<string> = [
  'bg-danger/10',
  'bg-default/10',
  'bg-primary/10',
  'bg-secondary/10',
  'bg-success/10',
  'bg-warning/10',
] as const;

export const tagsTextColorMap: Array<string> = [
  'text-danger-500',
  'text-default-500',
  'text-primary-500',
  'text-secondary-500',
  'text-success-500',
  'text-warning-500',
] as const;

export const ALLOWED_FILE_TYPES: ReadonlyArray<string> = [
  'data:application/pdf',
];
export const INITIAL_PAGE_NUMBER = 1;
export const TEMP_JWT_TOKEN_HARDCODED_USER =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjUxZTMwZDI4MTZmYTdkMzQxNGY1YjAiLCJ1c2VybmFtZSI6IkJpc21heTU0NjciLCJlbWFpbCI6ImJpc21heXB1cmtheWFzdGhhNTQ2N0BnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyMDQwNDI5NywiZXhwIjoxNzIyOTk2Mjk3fQ.m04I7oAcrdNqkMrI_23cFoSCI0IcZHP6IJm2B24VSEc';

export const TEMP_JWT_TOKEN_HARDCODED_ADMIN =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjVkOTM1ZWIxOWJjYWVjMmQ0MjQwZDIiLCJ1c2VybmFtZSI6IkRldmlsIiwiZW1haWwiOiJhcmtvLm9mZmljaWFsbml0a0BnbWFpbC5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjA0MDQ0NDQsImV4cCI6MTcyMjk5NjQ0NH0.no8ZcxnZs4YSGhcyKH1SBqMGLVm7Dw8AUl0lT0GFe8U';

export const TEMP_JWT_TOKEN_HARDCODED_SUPERADMIN =
  'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2NjUxOTVjY2U5NWY4ZGZmNzM1YTQ1YzYiLCJ1c2VybmFtZSI6IkFya29qZWV0IiwiZW1haWwiOiJhcmtvamVldC5kZXZAZ21haWwuY29tIiwicm9sZSI6IlNVUEVSQURNSU4iLCJpYXQiOjE3MjA0MDQ1ODksImV4cCI6MTcyMjk5NjU4OX0.JY8Gt3jQe-mFh4nuRfffiZclVhAEqVG5GOaz4cv4ykU';

export const PDF_WORKER_URL =
  'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js' as const;

export const TEMP_COMMENT_ID = '974106db98afe24eb114' as const;
export const VOTE: Readonly<number> = 1;
export const RETRACE_VOTE: Readonly<number> = -1;

export const THEME = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
});

export const KEY_CODES = Object.freeze({
  ENTER: 'Enter',
});

export const newFolderInstructions = `We encourage that you adhere to the following format for folder naming:\n
<Subject-Code> (<Subject-Name>)`;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const CTA_BANNER_KEY = 'display-no-cta';
