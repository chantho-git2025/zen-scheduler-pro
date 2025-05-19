
// This is a simplified implementation of Google Sheets API service
// In a real application, you'd want to handle authentication properly on a server
import * as XLSX from "xlsx";

export interface ScheduleItem {
  id: string;
  taskName: string;
  date: string;
  time: string;
  assignee: string;
  status: string;
}

export interface WorkScheduleItem {
  id: string;
  name: string;
  date: string;
  shift: string;
  position: string;
}

// Define paths for file uploads
const SCHEDULE_PATH = "product/src/upload/DATA_Schedule/schedule.xlsx";

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

// Mock work schedule data based on provided example
const mockWorkScheduleData: WorkScheduleItem[] = [
  {
    id: "1",
    name: "AUN RATHA",
    date: "2025-04-12",
    shift: "8AM-5PM",
    position: "CC"
  },
  {
    id: "2",
    name: "Sun Hengly",
    date: "2025-05-10",
    shift: "9PM-3AM",
    position: "NOC"
  },
  {
    id: "3",
    name: "SEANG MENG HOUR",
    date: "2025-05-17",
    shift: "10AM-7PM",
    position: "CC"
  },
  {
    id: "4",
    name: "SEANG MENG HOUR",
    date: "2025-05-09",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "5",
    name: "SAM SOKHOM",
    date: "2025-05-02",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "6",
    name: "Ly Sopholen",
    date: "2025-04-03",
    shift: "9PM-3AM",
    position: "NOC"
  },
  {
    id: "7",
    name: "PHANG RATHA",
    date: "2025-05-02",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "8",
    name: "MAO SREYNICH",
    date: "2025-04-02",
    shift: "10AM-7PM",
    position: "CS"
  },
  {
    id: "9",
    name: "PHANG RATHA",
    date: "2025-04-14",
    shift: "Public Holiday",
    position: "CC"
  },
  {
    id: "10",
    name: "SEANG MENG HOUR",
    date: "2025-05-31",
    shift: "8AM-5PM",
    position: "CC"
  },
  {
    id: "11",
    name: "CHUM VUTHY",
    date: "2025-05-29",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "12",
    name: "SAM SOKHOM",
    date: "2025-04-13",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "13",
    name: "SAM SOKHOM",
    date: "2025-04-09",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "14",
    name: "MAO SREYNICH",
    date: "2025-05-03",
    shift: "Day Off",
    position: "CS"
  },
  {
    id: "15",
    name: "PHANG RATHA",
    date: "2025-05-20",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "16",
    name: "SAO CHANTHO",
    date: "2025-04-13",
    shift: "8AM-5PM",
    position: "Teamleader"
  },
  {
    id: "17",
    name: "PHANG RATHA",
    date: "2025-05-07",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "18", 
    name: "ANG PHEARAK",
    date: "2025-05-20",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "19",
    name: "PHANG RATHA",
    date: "2025-04-29",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "20",
    name: "MAO SREYNICH",
    date: "2025-04-24",
    shift: "10AM-7PM",
    position: "CS"
  },
  {
    id: "21",
    name: "PHANG RATHA",
    date: "2025-05-10",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "22",
    name: "PHANG RATHA",
    date: "2025-04-07",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "23",
    name: "CHEA PISEY",
    date: "2025-04-23",
    shift: "7AM-4PM",
    position: "CC"
  },
  {
    id: "24",
    name: "CHEA USA",
    date: "2025-04-14",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "25",
    name: "SOEM VEASNA",
    date: "2025-04-07",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "26",
    name: "SOEM VEASNA",
    date: "2025-04-24",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "27",
    name: "PHANG RATHA",
    date: "2025-04-29",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "28",
    name: "CHUM VUTHY",
    date: "2025-04-02",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "29",
    name: "CHUM VUTHY",
    date: "2025-04-15",
    shift: "Public Holiday",
    position: "CC"
  },
  {
    id: "30",
    name: "CHEA PISEY",
    date: "2025-05-13",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "31",
    name: "CHUM VUTHY",
    date: "2025-04-07",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "32",
    name: "CHEA USA",
    date: "2025-04-23",
    shift: "7AM-4PM",
    position: "CS"
  }
];

export async function readExcelFile(filePath: string): Promise<any[]> {
  try {
    // In a real app with a server, you'd read the Excel file here
    // For now, just return mock data
    console.log(`Reading Excel file from ${filePath}...`);
    return Promise.resolve([]);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return Promise.reject(error);
  }
}

export async function fetchScheduleData(): Promise<ScheduleItem[]> {
  // In a real implementation, this would make an API call to Google Sheets
  // or read from Excel files in the upload folder
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockScheduleData);
    }, 800);
  });
}

export async function fetchWorkScheduleData(): Promise<WorkScheduleItem[]> {
  // In a real implementation, this would read from Excel files in the upload folder
  console.log("Fetching work schedule data...");
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockWorkScheduleData);
    }, 800);
  });
}

export function getTasksForDate(data: ScheduleItem[], date: string): ScheduleItem[] {
  return data.filter(item => item.date === date);
}

export function getWorkScheduleForDate(data: WorkScheduleItem[], date: string): WorkScheduleItem[] {
  return data.filter(item => item.date === date);
}

export function getWorkScheduleForMonth(data: WorkScheduleItem[], year: number, month: number): WorkScheduleItem[] {
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const datePrefix = `${year}-${monthStr}`;
  return data.filter(item => item.date.startsWith(datePrefix));
}

export function searchWorkSchedule(data: WorkScheduleItem[], query: string): WorkScheduleItem[] {
  const lowercaseQuery = query.toLowerCase();
  return data.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.shift.toLowerCase().includes(lowercaseQuery) ||
    item.position.toLowerCase().includes(lowercaseQuery) ||
    item.date.includes(lowercaseQuery)
  );
}

export function filterWorkScheduleByShift(data: WorkScheduleItem[], shift: string): WorkScheduleItem[] {
  return data.filter(item => item.shift === shift);
}

export function filterWorkScheduleByPosition(data: WorkScheduleItem[], position: string): WorkScheduleItem[] {
  return data.filter(item => item.position === position);
}

export function getUniqueShifts(data: WorkScheduleItem[]): string[] {
  const shifts = data.map(item => item.shift);
  return [...new Set(shifts)];
}

export function getUniquePositions(data: WorkScheduleItem[]): string[] {
  const positions = data.map(item => item.position);
  return [...new Set(positions)];
}

export function getUniqueNames(data: WorkScheduleItem[]): string[] {
  const names = data.map(item => item.name);
  return [...new Set(names)];
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
