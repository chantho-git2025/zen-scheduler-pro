
// This is a simplified implementation of file processing service
// In a real application, this would connect to a backend for file processing

interface StaffMember {
  name: string;
  shift: string;
  role: string;
  callRecords: number;
  careRecords: number;
  records: number;
  contribution: number;
}

interface ShiftCount {
  shift3to8: number;
  shift8to17: number;
  shift17to22: number;
  shift22to3: number;
}

// Mock data for development
const mockProductivityData: StaffMember[] = [
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

export async function processFiles(callLogsFile: File | null, careLogsFile: File | null) {
  console.log("Processing files:", callLogsFile, careLogsFile);
  
  // In a real implementation, this would send the files to a server for processing
  // For now, return mock data
  return new Promise<StaffMember[]>((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockProductivityData);
    }, 1500);
  });
}

export function filterByDateRange(data: StaffMember[], startDate: Date | null, endDate: Date | null) {
  // In a real implementation, this would filter data based on dates
  // For mock data, just return the original data
  return data;
}

export function filterByShift(data: StaffMember[], shift: string) {
  if (!shift) return data;
  return data.filter(item => item.shift === shift);
}

export function sortData(data: StaffMember[], sortField: keyof StaffMember, ascending: boolean) {
  return [...data].sort((a, b) => {
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      const aValue = (a[sortField] as string).toLowerCase();
      const bValue = (b[sortField] as string).toLowerCase();
      
      return ascending 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      return ascending 
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
    }
  });
}

export function exportToCSV(data: StaffMember[]) {
  const headers = ["Work Shift", "Name", "Call Logs", "Care Logs", "3AM-8AM", "8AM-5PM", "5PM-10PM", "10PM-3AM", "Total Records"];
  
  // Mock shift counts for each staff member
  const mockShiftCounts: Record<string, ShiftCount> = {};
  data.forEach(staff => {
    mockShiftCounts[staff.name] = {
      shift3to8: Math.floor(Math.random() * 10),
      shift8to17: Math.floor(Math.random() * 30) + 10,
      shift17to22: Math.floor(Math.random() * 20) + 5,
      shift22to3: Math.floor(Math.random() * 8)
    };
  });
  
  const csvRows = [
    headers.join(","),
    ...data.map(staff => [
      staff.shift,
      staff.name,
      staff.callRecords.toString(),
      staff.careRecords.toString(),
      (mockShiftCounts[staff.name]?.shift3to8 || 0).toString(),
      (mockShiftCounts[staff.name]?.shift8to17 || 0).toString(),
      (mockShiftCounts[staff.name]?.shift17to22 || 0).toString(),
      (mockShiftCounts[staff.name]?.shift22to3 || 0).toString(),
      staff.records.toString()
    ].join(","))
  ];
  
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "productivity_report.csv");
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getShiftDistribution(data: StaffMember[]) {
  const shifts = data.reduce((acc, item) => {
    acc[item.shift] = (acc[item.shift] || 0) + item.records;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(shifts).map(([shift, records]) => ({
    shift,
    records
  }));
}

export function getStaffContribution(data: StaffMember[]) {
  return data.map(item => ({
    name: item.name,
    records: item.records
  }));
}
