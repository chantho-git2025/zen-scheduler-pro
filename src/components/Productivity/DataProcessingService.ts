
import { StaffMember, ShiftCount } from "./types";

export async function processFiles(callLogsFile: File | null, careLogsFile: File | null): Promise<StaffMember[]> {
  console.log("Processing files:", callLogsFile, careLogsFile);
  
  // In a real implementation, this would parse the files and process the data
  // For now, return mock data with both call logs and care logs
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const mockData: StaffMember[] = [
        {
          name: "John Smith",
          shift: "Morning",
          role: "Senior Agent",
          callRecords: 127,
          careRecords: 45,
          records: 172,
          contribution: 23.5
        },
        {
          name: "Sarah Johnson",
          shift: "Morning",
          role: "Agent",
          callRecords: 98,
          careRecords: 32,
          records: 130,
          contribution: 18.1
        },
        {
          name: "Michael Brown",
          shift: "Afternoon",
          role: "Senior Agent",
          callRecords: 143,
          careRecords: 51,
          records: 194,
          contribution: 26.4
        },
        {
          name: "Emily Davis",
          shift: "Evening",
          role: "Team Lead",
          callRecords: 87,
          careRecords: 39,
          records: 126,
          contribution: 16.1
        },
        {
          name: "Robert Wilson",
          shift: "Afternoon",
          role: "Agent",
          callRecords: 62,
          careRecords: 25,
          records: 87,
          contribution: 11.5
        },
        {
          name: "Jennifer Taylor",
          shift: "Evening",
          role: "Agent",
          callRecords: 24,
          careRecords: 10,
          records: 34,
          contribution: 4.4
        }
      ];
      resolve(mockData);
    }, 1500);
  });
}

export function generateShiftCounts(data: StaffMember[]): Record<string, ShiftCount> {
  // Generate mock shift counts
  const mockShiftCounts: Record<string, ShiftCount> = {};
  
  data.forEach(staff => {
    mockShiftCounts[staff.name] = {
      shift3to8: Math.floor(Math.random() * 10),
      shift8to17: Math.floor(Math.random() * 30) + 10,
      shift17to22: Math.floor(Math.random() * 20) + 5,
      shift22to3: Math.floor(Math.random() * 8)
    };
  });
  
  return mockShiftCounts;
}
