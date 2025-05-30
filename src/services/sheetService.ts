// This is a simplified implementation of Google Sheets API service
// In a real application, you'd want to handle authentication properly on a server
import * as XLSX from "xlsx";
import { format, parse, isValid } from "date-fns";

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

// Function to check if a string is a valid date in MM-DD-YYYY format
function isValidDateString(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  // Try to parse various formats
  const formats = ["MM-dd-yyyy", "MM/dd/yyyy", "MM-dd-yy", "MM/dd/yy"];
  
  for (const formatStr of formats) {
    const parsedDate = parse(dateStr, formatStr, new Date());
    if (isValid(parsedDate)) {
      return true;
    }
  }
  
  return false;
}

// Function to normalize date strings to MM-DD-YYYY format
export function normalizeDate(dateStr: string): string {
  if (!dateStr || typeof dateStr !== 'string') return "";
  
  try {
    // Check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, "MM-dd-yyyy");
      }
    }
    
    // Try to parse various common formats
    const formats = ["MM-dd-yyyy", "MM/dd/yyyy", "MM-dd-yy", "MM/dd/yy"];
    
    for (const formatStr of formats) {
      const parsedDate = parse(dateStr, formatStr, new Date());
      if (isValid(parsedDate)) {
        // For 2-digit years, ensure we use 4-digit years in output
        return format(parsedDate, "MM-dd-yyyy");
      }
    }
    
    console.error("Failed to normalize date:", dateStr);
    return dateStr;
  } catch (error) {
    console.error("Error normalizing date:", dateStr, error);
    return dateStr;
  }
}

// Function to format date from MM-DD-YYYY to YYYY-MM-DD for internal use
export function formatDateToISO(dateStr: string): string {
  try {
    if (!dateStr || typeof dateStr !== 'string') return "";
    
    // First normalize to MM-DD-YYYY
    const normalizedDate = normalizeDate(dateStr);
    
    // Then convert to YYYY-MM-DD
    const parsedDate = parse(normalizedDate, "MM-dd-yyyy", new Date());
    if (!isValid(parsedDate)) {
      console.error("Invalid date during ISO conversion:", dateStr);
      return dateStr;
    }
    return format(parsedDate, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", dateStr, error);
    return dateStr; // Return original if parsing fails
  }
}

// Function to format date from YYYY-MM-DD to MM-DD-YYYY for display
export function formatDateToDisplay(dateStr: string): string {
  try {
    if (!dateStr || typeof dateStr !== 'string') return "";
    
    // First normalize input
    const normalizedDate = normalizeDate(dateStr);
    
    // It should already be in MM-DD-YYYY format after normalization
    return normalizedDate;
  } catch (error) {
    console.error("Error formatting date for display:", dateStr, error);
    return dateStr; // Return original if parsing fails
  }
}

// Function to format date as a readable string (e.g., "May 19, 2025")
export function formatDateToReadable(dateStr: string): string {
  try {
    if (!dateStr || typeof dateStr !== 'string') return "";
    
    // First normalize to MM-DD-YYYY
    const normalizedDate = normalizeDate(dateStr);
    
    // Then format to readable date
    const parsedDate = parse(normalizedDate, "MM-dd-yyyy", new Date());
    if (!isValid(parsedDate)) {
      console.error("Invalid date during readable conversion:", dateStr);
      return dateStr;
    }
    return format(parsedDate, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date for readable display:", dateStr, error);
    return dateStr;
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

// Mock work schedule data standardized to MM-DD-YYYY format
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
    
    // Use header option to make sure we get an array of objects with headers
    const options = {
      raw: false,
      header: 1,  // Get array of arrays first to inspect headers
      defval: "" // Default value for empty cells
    };
    
    const rawData = XLSX.utils.sheet_to_json(worksheet, options) as Array<any>;
    
    if (rawData.length === 0) {
      throw new Error("Empty spreadsheet");
    }
    
    // Get headers from first row
    const headers = rawData[0] as Array<any>;
    console.log("Excel headers:", headers);
    
    // Map header indices
    const headerIndices: Record<string, number> = {};
    if (Array.isArray(headers)) {
      headers.forEach((header: any, index: number) => {
        if (typeof header === 'string') {
          headerIndices[header.toLowerCase()] = index;
        }
      });
    }
    
    console.log("Header indices:", headerIndices);
    
    // Map data rows to objects based on header indices
    const result = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && Array.isArray(row) && row.length > 0) {
        const item: Record<string, any> = {};
        
        // Map common column names to standardized fields
        if (headerIndices.hasOwnProperty('name')) {
          item.Name = row[headerIndices['name']];
        }
        
        // Extract Date field and normalize it
        if (headerIndices.hasOwnProperty('date')) {
          const rawDate = row[headerIndices['date']];
          // Normalize date format to MM-DD-YYYY
          item.Date = normalizeDate(String(rawDate));
        }
        
        if (headerIndices.hasOwnProperty('shifts') || headerIndices.hasOwnProperty('shift')) {
          const shiftIndex = headerIndices['shifts'] !== undefined ? 
            headerIndices['shifts'] : headerIndices['shift'];
          item.Shifts = row[shiftIndex];
        }
        if (headerIndices.hasOwnProperty('position')) {
          item.Position = row[headerIndices['position']];
        }
        
        // Also store with original header names for backup
        if (Array.isArray(headers)) {
          headers.forEach((header: any, index: number) => {
            if (typeof header === 'string' && row[index] !== undefined) {
              // For date fields, normalize the format
              if (header.toLowerCase() === 'date') {
                item[header] = normalizeDate(String(row[index]));
              } else {
                item[header] = row[index];
              }
            }
          });
        }
        
        // Only add rows that have at least a name and date
        if (item.Name && item.Date) {
          result.push(item);
        }
      }
    }
    
    console.log("Processed Excel data sample:", result.slice(0, 3));
    return result;
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
  // Normalize input date to MM-DD-YYYY
  const formattedDate = normalizeDate(date);
  console.log("Getting tasks for date:", formattedDate);
  
  return data.filter(item => normalizeDate(item.date) === formattedDate);
}

// Adjust the date matching for MM-DD-YYYY format with improved logging
export function getWorkScheduleForDate(data: WorkScheduleItem[], date: string): WorkScheduleItem[] {
  // Normalize input date to MM-DD-YYYY
  const formattedDate = normalizeDate(date);
  console.log("Getting work schedule for date:", formattedDate);
  
  const result = data.filter(item => {
    const normalizedItemDate = normalizeDate(item.date);
    const match = normalizedItemDate === formattedDate;
    
    if (match) {
      console.log(`Match found: ${item.name} on ${normalizedItemDate} matches ${formattedDate}`);
    }
    
    return match;
  });
  
  console.log(`Found ${result.length} items for date ${formattedDate}`);
  return result;
}

// Modify to handle MM-DD-YYYY format
export function getWorkScheduleForMonth(data: WorkScheduleItem[], year: number, month: number): WorkScheduleItem[] {
  // Format month string to include leading zero if needed
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  
  return data.filter(item => {
    try {
      // Normalize date and extract month and year
      const normalizedDate = normalizeDate(item.date);
      const parts = normalizedDate.split('-');
      if (parts.length === 3) {
        const itemMonth = parts[0]; // MM in MM-DD-YYYY format
        let itemYear = parseInt(parts[2]);
        
        // Handle 2-digit years
        if (parts[2].length === 2) {
          itemYear = 2000 + itemYear; // Assume 20xx for 2-digit years
        }
        
        return itemMonth === monthStr && itemYear === year;
      }
      return false;
    } catch (error) {
      console.error("Error filtering by month:", error, item.date);
      return false;
    }
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
