export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  members: ProjectMember[];
  tasks: string[]; // Array of task IDs
  status: 'active' | 'completed' | 'archived';
  dueDate?: Date;
  tags: string[];
  category?: string;
}

export interface ProjectMember {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
  lastActive?: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  totalTimeSpent: number; // in minutes
  activeMembers: number;
  completionRate: number;
  averageTimePerTask: number; // in minutes
} 