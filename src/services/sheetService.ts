// This is a simplified implementation of Google Sheets API service
// In a real application, you'd want to handle authentication properly on a server
import * as XLSX from "xlsx";
import { format, parse } from "date-fns";

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
const CALL_LOGS_PATH = "product/src/upload/DATA_Call/calllogs.xlsx";
const CARE_LOGS_PATH = "product/src/upload/DATA_Care/carelogs.xlsx";

// Function to format date from MM-DD-YYYY to YYYY-MM-DD for internal use
export function formatDateToISO(dateStr: string): string {
  try {
    if (!dateStr) return "";
    // Check if the date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // Parse MM-DD-YYYY to a Date object and format to YYYY-MM-DD
    const parsedDate = parse(dateStr, "MM-dd-yyyy", new Date());
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", dateStr, error);
    return dateStr; // Return original if parsing fails
  }
}

// Function to format date from YYYY-MM-DD to MM-DD-YYYY for display
export function formatDateToDisplay(dateStr: string): string {
  try {
    if (!dateStr) return "";
    // Check if the date is already in MM-DD-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    // Parse YYYY-MM-DD to a Date object and format to MM-DD-YYYY
    const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(parsedDate, "MM-dd-yyyy");
  } catch (error) {
    console.error("Error formatting date for display:", dateStr, error);
    return dateStr; // Return original if parsing fails
  }
}

// Mock data for development
const mockScheduleData: ScheduleItem[] = [
  {
    id: "1",
    taskName: "Morning Check-in",
    date: "05-18-2025",
    time: "09:00",
    assignee: "John Smith",
    status: "completed"
  },
  {
    id: "2",
    taskName: "Client Meeting",
    date: "05-18-2025",
    time: "11:30",
    assignee: "Sarah Johnson",
    status: "ongoing"
  },
  {
    id: "3",
    taskName: "Project Review",
    date: "05-18-2025",
    time: "14:00",
    assignee: "John Smith",
    status: "pending"
  },
  {
    id: "4",
    taskName: "Team Standup",
    date: "05-18-2025",
    time: "16:30",
    assignee: "Michael Brown",
    status: "pending"
  },
  {
    id: "5",
    taskName: "Client Call",
    date: "05-19-2025",
    time: "10:00",
    assignee: "John Smith",
    status: "pending"
  },
  {
    id: "6",
    taskName: "Project Planning",
    date: "05-19-2025",
    time: "13:00",
    assignee: "Sarah Johnson",
    status: "pending"
  },
  {
    id: "7",
    taskName: "Team Meeting",
    date: "05-19-2025",
    time: "15:00",
    assignee: "Michael Brown",
    status: "pending"
  },
  {
    id: "8",
    taskName: "End of Day Report",
    date: "05-19-2025",
    time: "17:00",
    assignee: "John Smith",
    status: "pending"
  }
];

// Mock work schedule data with MM-DD-YYYY format
const mockWorkScheduleData: WorkScheduleItem[] = [
  {
    id: "1",
    name: "AUN RATHA",
    date: "04-12-2025",
    shift: "8AM-5PM",
    position: "CC"
  },
  {
    id: "2",
    name: "Sun Hengly",
    date: "05-10-2025",
    shift: "9PM-3AM",
    position: "NOC"
  },
  {
    id: "3",
    name: "SEANG MENG HOUR",
    date: "05-17-2025",
    shift: "10AM-7PM",
    position: "CC"
  },
  {
    id: "4",
    name: "SEANG MENG HOUR",
    date: "05-09-2025",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "5",
    name: "SAM SOKHOM",
    date: "05-02-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "6",
    name: "Ly Sopholen",
    date: "04-03-2025",
    shift: "9PM-3AM",
    position: "NOC"
  },
  {
    id: "7",
    name: "PHANG RATHA",
    date: "05-02-2025",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "8",
    name: "MAO SREYNICH",
    date: "04-02-2025",
    shift: "10AM-7PM",
    position: "CS"
  },
  {
    id: "9",
    name: "PHANG RATHA",
    date: "04-14-2025",
    shift: "Public Holiday",
    position: "CC"
  },
  {
    id: "10",
    name: "SEANG MENG HOUR",
    date: "05-31-2025",
    shift: "8AM-5PM",
    position: "CC"
  },
  {
    id: "11",
    name: "CHUM VUTHY",
    date: "05-29-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "12",
    name: "SAM SOKHOM",
    date: "04-13-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "13",
    name: "SAM SOKHOM",
    date: "04-09-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "14",
    name: "MAO SREYNICH",
    date: "05-03-2025",
    shift: "Day Off",
    position: "CS"
  },
  {
    id: "15",
    name: "PHANG RATHA",
    date: "05-20-2025",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "16",
    name: "SAO CHANTHO",
    date: "04-13-2025",
    shift: "8AM-5PM",
    position: "Teamleader"
  },
  {
    id: "17",
    name: "PHANG RATHA",
    date: "05-07-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "18", 
    name: "ANG PHEARAK",
    date: "05-20-2025",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "19",
    name: "PHANG RATHA",
    date: "04-29-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "20",
    name: "MAO SREYNICH",
    date: "04-24-2025",
    shift: "10AM-7PM",
    position: "CS"
  },
  {
    id: "21",
    name: "PHANG RATHA",
    date: "05-10-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "22",
    name: "PHANG RATHA",
    date: "04-07-2025",
    shift: "5PM-10PM",
    position: "CC"
  },
  {
    id: "23",
    name: "CHEA PISEY",
    date: "04-23-2025",
    shift: "7AM-4PM",
    position: "CC"
  },
  {
    id: "24",
    name: "CHEA USA",
    date: "04-14-2025",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "25",
    name: "SOEM VEASNA",
    date: "04-07-2025",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "26",
    name: "SOEM VEASNA",
    date: "04-24-2025",
    shift: "8AM-5PM",
    position: "CS"
  },
  {
    id: "27",
    name: "PHANG RATHA",
    date: "04-29-2025",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "28",
    name: "CHUM VUTHY",
    date: "04-02-2025",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "29",
    name: "CHUM VUTHY",
    date: "04-15-2025",
    shift: "Public Holiday",
    position: "CC"
  },
  {
    id: "30",
    name: "CHEA PISEY",
    date: "05-13-2025",
    shift: "Day Off",
    position: "CC"
  },
  {
    id: "31",
    name: "CHUM VUTHY",
    date: "04-07-2025",
    shift: "3AM-8AM",
    position: "CC"
  },
  {
    id: "32",
    name: "CHEA USA",
    date: "04-23-2025",
    shift: "7AM-4PM",
    position: "CS"
  }
];

export async function readExcelFile(fileData: ArrayBuffer): Promise<any[]> {
  try {
    const workbook = XLSX.read(fileData, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw new Error("Failed to read Excel file");
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

// Adjust the date matching for MM-DD-YYYY format
export function getTasksForDate(data: ScheduleItem[], date: string): ScheduleItem[] {
  // Convert input date to MM-DD-YYYY if it's in YYYY-MM-DD format
  const formattedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) 
    ? formatDateToDisplay(date) 
    : date;
    
  return data.filter(item => item.date === formattedDate);
}

// Adjust the date matching for MM-DD-YYYY format
export function getWorkScheduleForDate(data: WorkScheduleItem[], date: string): WorkScheduleItem[] {
  // Convert input date to MM-DD-YYYY if it's in YYYY-MM-DD format
  const formattedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) 
    ? formatDateToDisplay(date) 
    : date;
    
  return data.filter(item => item.date === formattedDate);
}

// Modify to handle MM-DD-YYYY format
export function getWorkScheduleForMonth(data: WorkScheduleItem[], year: number, month: number): WorkScheduleItem[] {
  // Format month string to include leading zero if needed
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  
  return data.filter(item => {
    // Extract month from MM-DD-YYYY format
    const parts = item.date.split('-');
    if (parts.length === 3) {
      const itemMonth = parts[0];
      const itemYear = parseInt(parts[2]);
      return itemMonth === monthStr && itemYear === year;
    }
    return false;
  });
}

export function searchWorkSchedule(data: WorkScheduleItem[], query: string): WorkScheduleItem[] {
  const lowercaseQuery = query.toLowerCase();
  return data.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.shift.toLowerCase().includes(lowercaseQuery) ||
    item.position.toLowerCase().includes(lowercaseQuery) ||
    String(item.date).includes(lowercaseQuery)  // Ensure date is a string
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
    String(item.date).includes(lowercaseQuery)  // Convert date to string explicitly here too for consistency
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
