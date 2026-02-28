export interface RewriteRequest {
  text: string;
  projectName?: string;
}

export interface SuggestedTask {
  title: string;
  details?: string;
  priority?: number;
  estimateMinutes?: number;
  dueDate?: string | null;
}

export interface RewriteResponse {
  tasks: SuggestedTask[];
}

export interface ProjectWithCount {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  _count: { tasks: number };
}

export interface TaskWithProject {
  id: string;
  title: string;
  details: string | null;
  projectId: string | null;
  sourceNoteId: string | null;
  priority: number;
  estimateMinutes: number;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  project: { id: string; name: string; color: string | null } | null;
}

export interface Settings {
  mockAi: boolean;
  dailyMinutes: number;
  workdays: boolean[];
}

export const DEFAULT_SETTINGS: Settings = {
  mockAi: false,
  dailyMinutes: 120,
  workdays: [false, true, true, true, true, true, false], // Sun=0 .. Sat=6
};
