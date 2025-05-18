
import { StaffMember } from "./types";

export async function processFiles(callLogsFile: File | null, careLogsFile: File | null): Promise<StaffMember[]> {
  console.log("Processing files:", callLogsFile, careLogsFile);
  
  // In a real implementation, this would parse the files and process the data
  // For now, return mock data that matches the required format
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const mockData: StaffMember[] = [
        {
          name: "ANG PHEARAK",
          shift: "Day Shift",
          role: "Senior Agent",
          callRecords: 1289,
          careRecords: 0,
          records: 1289,
          contribution: 14.2,
          shift3to8: 11,
          shift8to17: 1214,
          shift17to22: 64,
          shift22to3: 0
        },
        {
          name: "SEANG MENG HOUR",
          shift: "Day Shift",
          role: "Agent",
          callRecords: 1163,
          careRecords: 0,
          records: 1163,
          contribution: 12.8,
          shift3to8: 0,
          shift8to17: 1103,
          shift17to22: 60,
          shift22to3: 0
        },
        {
          name: "AUN RATHA",
          shift: "Day Shift",
          role: "Agent",
          callRecords: 1125,
          careRecords: 0,
          records: 1125,
          contribution: 12.4,
          shift3to8: 6,
          shift8to17: 1118,
          shift17to22: 1,
          shift22to3: 0
        },
        {
          name: "CHEA PISEY",
          shift: "Day Shift",
          role: "Agent",
          callRecords: 1015,
          careRecords: 0,
          records: 1015,
          contribution: 11.2,
          shift3to8: 70,
          shift8to17: 944,
          shift17to22: 1,
          shift22to3: 0
        },
        {
          name: "RATH RANIKA",
          shift: "Hybrid",
          role: "Senior Agent",
          callRecords: 812,
          careRecords: 0,
          records: 812,
          contribution: 8.9,
          shift3to8: 0,
          shift8to17: 787,
          shift17to22: 25,
          shift22to3: 0
        },
        {
          name: "KONG SOPHEAK",
          shift: "Management",
          role: "Team Lead",
          callRecords: 374,
          careRecords: 0,
          records: 374,
          contribution: 4.1,
          shift3to8: 0,
          shift8to17: 373,
          shift17to22: 1,
          shift22to3: 0
        },
        {
          name: "SAM SOKHOM",
          shift: "Nightshift",
          role: "Senior Agent",
          callRecords: 885,
          careRecords: 0,
          records: 885,
          contribution: 9.7,
          shift3to8: 190,
          shift8to17: 20,
          shift17to22: 671,
          shift22to3: 4
        },
        {
          name: "SOEM VEASNA",
          shift: "Survey Team",
          role: "Agent",
          callRecords: 1284,
          careRecords: 0,
          records: 1284,
          contribution: 14.1,
          shift3to8: 64,
          shift8to17: 1082,
          shift17to22: 138,
          shift22to3: 0
        }
      ];
      resolve(mockData);
    }, 1500);
  });
}

export function generateShiftCounts(data: StaffMember[]): Record<string, { shift3to8: number, shift8to17: number, shift17to22: number, shift22to3: number }> {
  const shiftCounts: Record<string, { shift3to8: number, shift8to17: number, shift17to22: number, shift22to3: number }> = {};
  
  data.forEach(staff => {
    shiftCounts[staff.name] = {
      shift3to8: staff.shift3to8,
      shift8to17: staff.shift8to17,
      shift17to22: staff.shift17to22,
      shift22to3: staff.shift22to3
    };
  });
  
  return shiftCounts;
}
