// Initial Mock Data for AcademiaSync Scheduler

export const DEFAULT_SYSTEM_DATE = '2026-09-01';

export const INITIAL_SUBJECTS = [
  { id: 'subj-1', name: 'Data Structures & Algorithms', code: 'CS201', priority: 'High', color: '#6366f1', targetWeeklyHours: 12, completedHours: 4 },
  { id: 'subj-2', name: 'AI & Machine Learning', code: 'CS405', priority: 'High', color: '#8b5cf6', targetWeeklyHours: 10, completedHours: 3 },
  { id: 'subj-3', name: 'Web Systems Architecture', code: 'CS302', priority: 'Medium', color: '#06b6d4', targetWeeklyHours: 8, completedHours: 2 },
  { id: 'subj-4', name: 'Database Systems', code: 'CS204', priority: 'Medium', color: '#10b981', targetWeeklyHours: 6, completedHours: 2 }
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    title: 'Mid-Term Machine Learning Exam',
    subjectId: 'subj-2',
    date: '2026-09-25',
    totalTopics: 12,
    completedTopics: 4,
    status: 'active',
    dailyRequiredMins: 90
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'assign-1',
    title: 'Distributed Database Lab Report',
    subjectId: 'subj-4',
    dueDate: '2026-09-03',
    dueTime: '23:59',
    estimatedHours: 4,
    priority: 'Urgent',
    status: 'pending'
  }
];

export const INITIAL_TENTATIVE_EVENTS = [
  {
    id: 'tent-1',
    title: 'Regional AI & Coding Contest',
    date: '2026-09-04',
    startTime: '10:00',
    endTime: '15:00',
    status: 'tentative', // 'tentative' | 'attending' | 'skipped'
    location: 'Auditorium / Online',
    backupTasks: [
      { id: 'b-1', title: 'Graph Algorithms Intensive (LeetCode 75)', durationMins: 120, subjectId: 'subj-1' },
      { id: 'b-2', title: 'PyTorch Model Optimization Reading', durationMins: 90, subjectId: 'subj-2' }
    ]
  }
];

export const INITIAL_SCHEDULE_BLOCKS = [
  // Day 1: 2026-09-01
  {
    id: 'b-101',
    date: '2026-09-01',
    startTime: '09:00',
    endTime: '16:00',
    title: 'Standard College Hours',
    type: 'college', // 'college' | 'study' | 'reclaimed' | 'assignment' | 'exam' | 'tentative' | 'cascaded'
    subjectId: null,
    status: 'scheduled', // 'scheduled' | 'completed' | 'missed' | 'reclaimed' | 'skipped'
    isFixed: true
  },
  {
    id: 'b-102',
    date: '2026-09-01',
    startTime: '17:00',
    endTime: '18:30',
    title: 'DSA: Dynamic Programming & Trees',
    type: 'study',
    subjectId: 'subj-1',
    status: 'completed',
    isFixed: false
  },
  {
    id: 'b-103',
    date: '2026-09-01',
    startTime: '19:30',
    endTime: '21:00',
    title: 'AI/ML: Neural Networks & Backprop',
    type: 'study',
    subjectId: 'subj-2',
    status: 'completed',
    isFixed: false
  },

  // Day 2: 2026-09-02
  {
    id: 'b-104',
    date: '2026-09-02',
    startTime: '09:00',
    endTime: '16:00',
    title: 'Standard College Hours',
    type: 'college',
    subjectId: null,
    status: 'scheduled',
    isFixed: true
  },
  {
    id: 'b-105',
    date: '2026-09-02',
    startTime: '17:00',
    endTime: '19:00',
    title: 'Web Systems: REST & GraphQL API Design',
    type: 'study',
    subjectId: 'subj-3',
    status: 'scheduled',
    isFixed: false
  },
  {
    id: 'b-106',
    date: '2026-09-02',
    startTime: '20:00',
    endTime: '21:30',
    title: 'Database: Indexing & B-Trees',
    type: 'study',
    subjectId: 'subj-4',
    status: 'scheduled',
    isFixed: false
  },

  // Day 3: 2026-09-03
  {
    id: 'b-107',
    date: '2026-09-03',
    startTime: '09:00',
    endTime: '16:00',
    title: 'Standard College Hours',
    type: 'college',
    subjectId: null,
    status: 'scheduled',
    isFixed: true
  },
  {
    id: 'b-108',
    date: '2026-09-03',
    startTime: '17:00',
    endTime: '19:00',
    title: 'DSA: Graph Algorithms & Dijkstra',
    type: 'study',
    subjectId: 'subj-1',
    status: 'scheduled',
    isFixed: false
  },

  // Day 4: 2026-09-04 (Tentative contest day)
  {
    id: 'b-109',
    date: '2026-09-04',
    startTime: '10:00',
    endTime: '15:00',
    title: 'Tentative: Inter-College AI Hackathon',
    type: 'tentative',
    subjectId: 'subj-2',
    tentativeId: 'tent-1',
    status: 'scheduled',
    isFixed: false
  },

  // Day 5: 2026-09-05
  {
    id: 'b-110',
    date: '2026-09-05',
    startTime: '09:00',
    endTime: '16:00',
    title: 'Standard College Hours',
    type: 'college',
    subjectId: null,
    status: 'scheduled',
    isFixed: true
  },
  {
    id: 'b-111',
    date: '2026-09-05',
    startTime: '17:00',
    endTime: '18:30',
    title: 'AI/ML Exam Prep: Convex Optimization',
    type: 'exam',
    subjectId: 'subj-2',
    examId: 'exam-1',
    status: 'scheduled',
    isFixed: false
  }
];

export const INITIAL_BLACKOUTS = [];
