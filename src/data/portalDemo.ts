export type DemoMatterStatus = "open" | "closed";

export interface DemoMatter {
  id: string;
  caseNumber: string;
  name: string;
  practiceArea: string;
  stage: string;
  status: DemoMatterStatus;
  openedDate: string;
  updatedAt: string;
}

export interface DemoClient {
  id: string;
  name: string;
  maskedEmail: string;
  maskedPhone: string;
  safeChannelNote: string;
  updatedAt: string;
  matters: DemoMatter[];
}

export type DemoAssignmentStatus =
  | "not-started"
  | "in-progress"
  | "submitted"
  | "needs-attention";

export interface DemoFormAssignment {
  formId: string;
  status: DemoAssignmentStatus;
  progress: number;
  due: string;
  lastSaved: string;
  revision?: number;
}

export interface DemoPortalMatter {
  id: string;
  label: string;
  caseNumber: string;
  status: DemoMatterStatus;
  assignments: DemoFormAssignment[];
}

export const portalDemoClients: DemoClient[] = [
  {
    id: "mc-client-4182",
    name: "Jordan Ellis",
    maskedEmail: "j•••••@example.com",
    maskedPhone: "(***) ***-0148",
    safeChannelNote: "Email and text permitted; do not include matter details.",
    updatedAt: "2026-08-02T16:42:00Z",
    matters: [
      {
        id: "mc-case-1042",
        caseNumber: "24-1042",
        name: "Ellis dissolution",
        practiceArea: "Dissolution",
        stage: "Discovery and disclosures",
        status: "open",
        openedDate: "2024-11-18",
        updatedAt: "2026-08-02T16:42:00Z",
      },
      {
        id: "mc-case-0911",
        caseNumber: "23-0911",
        name: "Support modification",
        practiceArea: "Spousal support",
        stage: "Closed",
        status: "closed",
        openedDate: "2023-07-06",
        updatedAt: "2026-05-22T19:10:00Z",
      },
    ],
  },
  {
    id: "mc-client-3920",
    name: "Morgan Chen",
    maskedEmail: "m•••••@example.com",
    maskedPhone: "(***) ***-0116",
    safeChannelNote: "Email only. No voicemail or text messages.",
    updatedAt: "2026-08-01T21:18:00Z",
    matters: [
      {
        id: "mc-case-1178",
        caseNumber: "25-1178",
        name: "Chen custody matter",
        practiceArea: "Child custody",
        stage: "Pre-mediation",
        status: "open",
        openedDate: "2025-09-03",
        updatedAt: "2026-08-01T21:18:00Z",
      },
    ],
  },
  {
    id: "mc-client-3664",
    name: "Avery Patel",
    maskedEmail: "a•••••@example.com",
    maskedPhone: "(***) ***-0183",
    safeChannelNote: "Text permitted between 8 a.m. and 6 p.m.",
    updatedAt: "2026-07-30T17:05:00Z",
    matters: [
      {
        id: "mc-case-1281",
        caseNumber: "26-1281",
        name: "Patel property division",
        practiceArea: "Property division",
        stage: "Initial disclosures",
        status: "open",
        openedDate: "2026-03-12",
        updatedAt: "2026-07-30T17:05:00Z",
      },
      {
        id: "mc-case-0627",
        caseNumber: "22-0627",
        name: "Patel dissolution",
        practiceArea: "Dissolution",
        stage: "Closed",
        status: "closed",
        openedDate: "2022-05-19",
        updatedAt: "2024-01-16T20:30:00Z",
      },
    ],
  },
  {
    id: "mc-client-3408",
    name: "Casey Rivera",
    maskedEmail: "c•••••@example.com",
    maskedPhone: "(***) ***-0192",
    safeChannelNote: "Call first before sending any written notification.",
    updatedAt: "2026-07-28T14:20:00Z",
    matters: [
      {
        id: "mc-case-1324",
        caseNumber: "26-1324",
        name: "Rivera legal coaching",
        practiceArea: "Legal coaching",
        stage: "Active coaching",
        status: "open",
        openedDate: "2026-06-04",
        updatedAt: "2026-07-28T14:20:00Z",
      },
    ],
  },
];

export const clientPortalMatters: DemoPortalMatter[] = [
  {
    id: "mc-case-1042",
    label: "Dissolution matter",
    caseNumber: "24-1042",
    status: "open",
    assignments: [
      {
        formId: "general-intake",
        status: "in-progress",
        progress: 64,
        due: "Aug 9, 2026",
        lastSaved: "2 minutes ago",
        revision: 18,
      },
      {
        formId: "dissolution",
        status: "in-progress",
        progress: 28,
        due: "Aug 12, 2026",
        lastSaved: "Yesterday at 7:14 p.m.",
        revision: 7,
      },
      {
        formId: "privacy-communications",
        status: "submitted",
        progress: 100,
        due: "Completed",
        lastSaved: "Submitted Aug 1, 2026",
        revision: 4,
      },
      {
        formId: "document-collection",
        status: "not-started",
        progress: 0,
        due: "Available after staff review",
        lastSaved: "Not started",
      },
    ],
  },
  {
    id: "mc-case-0911",
    label: "Support modification",
    caseNumber: "23-0911",
    status: "closed",
    assignments: [
      {
        formId: "spousal-support-modification",
        status: "submitted",
        progress: 100,
        due: "Completed",
        lastSaved: "Submitted May 18, 2026",
        revision: 11,
      },
    ],
  },
];

export const portalJourney = [
  {
    number: "01",
    title: "Find the correct person",
    detail: "Staff searches the MyCase-backed directory and confirms the intended client.",
  },
  {
    number: "02",
    title: "Choose the matter",
    detail: "Open and closed matters are shown separately, with recent activity first.",
  },
  {
    number: "03",
    title: "Assign versioned forms",
    detail: "Staff chooses the recipient, forms, due dates, and approved notification channel.",
  },
  {
    number: "04",
    title: "Verify each new session",
    detail: "The portal address is only an entry point; a short-lived verification step unlocks access.",
  },
  {
    number: "05",
    title: "Autosave and resume",
    detail: "Encrypted server drafts preserve progress across phones, tablets, and computers.",
  },
  {
    number: "06",
    title: "Review before MyCase",
    detail: "Staff reviews submissions; only approved records or documents move to MyCase.",
  },
];

export const designQuestions = [
  "Which MyCase records should appear: active clients only, former clients, leads, or all three?",
  "Which staff role may assign, revoke, reopen, or accept each form, and when must Heather approve?",
  "Which email and phone fields are considered verified and safe, and how are communication restrictions recorded?",
  "Will clients enroll a passkey after initial verification, or will the firm accept email/SMS for repeat access?",
  "Which functions stay in the native MyCase portal: messages, documents, billing, e-signature, and calendar?",
  "How long should unsubmitted drafts, submitted snapshots, audit events, and expired invitations be retained?",
  "How should guardians, interpreters, authorized representatives, and matters with multiple clients receive separate access?",
  "What reminders are appropriate, through which safe channels, and when should staff intervene instead of resending?",
];
