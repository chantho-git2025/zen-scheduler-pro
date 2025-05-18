
// This is a simplified implementation of Google Sheets API service
// In a real application, you'd want to handle authentication properly on a server

interface ScheduleItem {
  id: string;
  taskName: string;
  date: string;
  time: string;
  assignee: string;
  status: string;
}

// Mock data for development
const mockScheduleData: ScheduleItem[] = [
  {
    id: "1",
    taskName: "Morning Check-in",
    date: "2025-05-18",
    time: "09:00",
    assignee: "John Smith",
    status: "completed"
  },
  {
    id: "2",
    taskName: "Client Meeting",
    date: "2025-05-18",
    time: "11:30",
    assignee: "Sarah Johnson",
    status: "ongoing"
  },
  {
    id: "3",
    taskName: "Project Review",
    date: "2025-05-18",
    time: "14:00",
    assignee: "John Smith",
    status: "pending"
  },
  {
    id: "4",
    taskName: "Team Standup",
    date: "2025-05-18",
    time: "16:30",
    assignee: "Michael Brown",
    status: "pending"
  },
  {
    id: "5",
    taskName: "Client Call",
    date: "2025-05-19",
    time: "10:00",
    assignee: "John Smith",
    status: "pending"
  },
  {
    id: "6",
    taskName: "Project Planning",
    date: "2025-05-19",
    time: "13:00",
    assignee: "Sarah Johnson",
    status: "pending"
  },
  {
    id: "7",
    taskName: "Team Meeting",
    date: "2025-05-19",
    time: "15:00",
    assignee: "Michael Brown",
    status: "pending"
  },
  {
    id: "8",
    taskName: "End of Day Report",
    date: "2025-05-19",
    time: "17:00",
    assignee: "John Smith",
    status: "pending"
  }
];

export async function fetchScheduleData(): Promise<ScheduleItem[]> {
  // In a real implementation, this would make an API call to Google Sheets
  // For now, we'll return mock data
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockScheduleData);
    }, 800);
  });
}

export function getTasksForDate(data: ScheduleItem[], date: string): ScheduleItem[] {
  return data.filter(item => item.date === date);
}

export function searchTasks(data: ScheduleItem[], query: string): ScheduleItem[] {
  const lowercaseQuery = query.toLowerCase();
  return data.filter(item => 
    item.taskName.toLowerCase().includes(lowercaseQuery) ||
    item.assignee.toLowerCase().includes(lowercaseQuery) ||
    item.date.includes(lowercaseQuery)
  );
}

export function filterTasksByStatus(data: ScheduleItem[], status: string): ScheduleItem[] {
  return data.filter(item => item.status === status);
}

export function filterTasksByAssignee(data: ScheduleItem[], assignee: string): ScheduleItem[] {
  return data.filter(item => item.assignee === assignee);
}

export function getUniqueAssignees(data: ScheduleItem[]): string[] {
  const assignees = data.map(item => item.assignee);
  return [...new Set(assignees)];
}

export function getUniqueStatuses(data: ScheduleItem[]): string[] {
  const statuses = data.map(item => item.status);
  return [...new Set(statuses)];
}
