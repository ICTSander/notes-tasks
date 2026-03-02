// ---- Types ----
export interface MockNote {
  id: string;
  title: string;
  preview: string;
  body: string;
  tags: string[];
  pinned: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface MockTask {
  id: string;
  title: string;
  done: boolean;
  priority: 1 | 2 | 3 | 4 | 5;
  project: string;
  projectColor: string;
  estimateMinutes: number;
  dueDate: Date | null;
  createdAt: Date;
}

// ---- Helpers ----
function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(9, 0, 0, 0);
  return d;
}
function hoursAgo(n: number): Date {
  return new Date(Date.now() - n * 3600000);
}
function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

// ---- Mock Notes ----
export const mockNotes: MockNote[] = [
  {
    id: "n1",
    title: "Product Sprint Ideas",
    preview: "We should focus on the onboarding flow and the new AI features for the next sprint. The team agreed on...",
    body: "We should focus on the onboarding flow and the new AI features for the next sprint. The team agreed on prioritizing mobile experience. Key items: redesign welcome screen, add progress indicators, implement smart suggestions.",
    tags: ["product", "sprint"],
    pinned: true,
    updatedAt: hoursAgo(2),
    createdAt: daysAgo(3),
  },
  {
    id: "n2",
    title: "Meeting Notes - Design Review",
    preview: "Discussed the new glass UI approach. Everyone loved the gradient accents. Need to finalize the color...",
    body: "Discussed the new glass UI approach. Everyone loved the gradient accents. Need to finalize the color palette and test on different devices. Action items: create component library, update Figma files.",
    tags: ["design", "meeting"],
    pinned: true,
    updatedAt: hoursAgo(5),
    createdAt: daysAgo(1),
  },
  {
    id: "n3",
    title: "API Architecture Notes",
    preview: "REST vs GraphQL decision matrix. Performance benchmarks show that for our use case...",
    body: "REST vs GraphQL decision matrix. Performance benchmarks show that for our use case, REST with smart caching performs better. We should implement rate limiting and add proper error handling.",
    tags: ["backend", "architecture"],
    pinned: false,
    updatedAt: daysAgo(1),
    createdAt: daysAgo(5),
  },
  {
    id: "n4",
    title: "User Research Findings",
    preview: "Interviewed 12 users last week. Key insights: users want faster task creation, better...",
    body: "Interviewed 12 users last week. Key insights: users want faster task creation, better organization, and AI-powered suggestions. Most users prefer dark mode. Mobile usage is 73%.",
    tags: ["research", "ux"],
    pinned: false,
    updatedAt: daysAgo(2),
    createdAt: daysAgo(7),
  },
  {
    id: "n5",
    title: "Weekly Reflection",
    preview: "This week was productive. Shipped 3 features, fixed 8 bugs. Need to improve testing coverage...",
    body: "This week was productive. Shipped 3 features, fixed 8 bugs. Need to improve testing coverage and documentation. Team morale is high after the successful demo.",
    tags: ["personal", "reflection"],
    pinned: false,
    updatedAt: daysAgo(3),
    createdAt: daysAgo(3),
  },
  {
    id: "n6",
    title: "Deployment Checklist",
    preview: "Before deploying to production: run full test suite, check environment variables, verify...",
    body: "Before deploying to production: run full test suite, check environment variables, verify database migrations, update changelog, notify the team.",
    tags: ["devops"],
    pinned: false,
    updatedAt: daysAgo(4),
    createdAt: daysAgo(10),
  },
];

// ---- Mock Tasks ----
export const mockTasks: MockTask[] = [
  {
    id: "t1",
    title: "Finalize onboarding flow design",
    done: false,
    priority: 5,
    project: "Product",
    projectColor: "#7C3AED",
    estimateMinutes: 45,
    dueDate: daysFromNow(0),
    createdAt: daysAgo(2),
  },
  {
    id: "t2",
    title: "Review pull request #142",
    done: false,
    priority: 4,
    project: "Engineering",
    projectColor: "#06B6D4",
    estimateMinutes: 20,
    dueDate: daysFromNow(0),
    createdAt: daysAgo(1),
  },
  {
    id: "t3",
    title: "Write API documentation",
    done: false,
    priority: 3,
    project: "Engineering",
    projectColor: "#06B6D4",
    estimateMinutes: 60,
    dueDate: daysFromNow(0),
    createdAt: daysAgo(3),
  },
  {
    id: "t4",
    title: "Update component library",
    done: false,
    priority: 4,
    project: "Design",
    projectColor: "#EC4899",
    estimateMinutes: 30,
    dueDate: daysFromNow(1),
    createdAt: daysAgo(1),
  },
  {
    id: "t5",
    title: "Team standup preparation",
    done: true,
    priority: 3,
    project: "Product",
    projectColor: "#7C3AED",
    estimateMinutes: 15,
    dueDate: daysFromNow(0),
    createdAt: daysAgo(1),
  },
  {
    id: "t6",
    title: "Deploy staging environment",
    done: false,
    priority: 5,
    project: "Engineering",
    projectColor: "#06B6D4",
    estimateMinutes: 25,
    dueDate: daysFromNow(1),
    createdAt: daysAgo(2),
  },
  {
    id: "t7",
    title: "User interview session",
    done: false,
    priority: 4,
    project: "Research",
    projectColor: "#F59E0B",
    estimateMinutes: 45,
    dueDate: daysFromNow(2),
    createdAt: daysAgo(4),
  },
  {
    id: "t8",
    title: "Fix mobile responsive issues",
    done: false,
    priority: 3,
    project: "Design",
    projectColor: "#EC4899",
    estimateMinutes: 40,
    dueDate: daysFromNow(3),
    createdAt: daysAgo(2),
  },
  {
    id: "t9",
    title: "Database migration script",
    done: false,
    priority: 2,
    project: "Engineering",
    projectColor: "#06B6D4",
    estimateMinutes: 35,
    dueDate: daysFromNow(5),
    createdAt: daysAgo(6),
  },
  {
    id: "t10",
    title: "Quarterly metrics report",
    done: false,
    priority: 3,
    project: "Product",
    projectColor: "#7C3AED",
    estimateMinutes: 50,
    dueDate: daysFromNow(4),
    createdAt: daysAgo(5),
  },
];

// ---- Derived Data Helpers ----
export function getTodayTasks(tasks: MockTask[]): MockTask[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tasks.filter(
    (t) => t.dueDate && t.dueDate >= today && t.dueDate < tomorrow
  );
}

export function getTomorrowTasks(tasks: MockTask[]): MockTask[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  return tasks.filter(
    (t) => t.dueDate && t.dueDate >= tomorrow && t.dueDate < dayAfter
  );
}

export function getLaterTasks(tasks: MockTask[]): MockTask[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return tasks.filter(
    (t) => !t.dueDate || t.dueDate >= dayAfterTomorrow
  );
}

export function getTaskStats(tasks: MockTask[]) {
  const today = getTodayTasks(tasks);
  const totalToday = today.length;
  const doneToday = today.filter((t) => t.done).length;
  const openNotes = mockNotes.length;
  const dueSoon = tasks.filter((t) => {
    if (!t.dueDate || t.done) return false;
    const diff = t.dueDate.getTime() - Date.now();
    return diff > 0 && diff < 86400000;
  }).length;
  return { totalToday, doneToday, openNotes, dueSoon };
}

// Sparkline data (fake activity)
export const sparklineData = [3, 5, 2, 8, 6, 4, 7, 9, 5, 3, 6, 8, 4, 7, 5, 9, 6, 3, 7, 8, 5, 4, 6, 9, 7, 3, 5, 8];
