
// This is a simplified implementation of file processing service
// In a real application, this would connect to a backend for file processing

interface StaffMember {
  name: string;
  shift: string;
  role: string;
  records: number;
  contribution: number;
}

// Mock data for development
const mockProductivityData: StaffMember[] = [
  {
    name: "John Smith",
    shift: "Morning",
    role: "Senior Agent",
    records: 127,
    contribution: 23.5
  },
  {
    name: "Sarah Johnson",
    shift: "Morning",
    role: "Agent",
    records: 98,
    contribution: 18.1
  },
  {
    name: "Michael Brown",
    shift: "Afternoon",
    role: "Senior Agent",
    records: 143,
    contribution: 26.4
  },
  {
    name: "Emily Davis",
    shift: "Evening",
    role: "Team Lead",
    records: 87,
    contribution: 16.1
  },
  {
    name: "Robert Wilson",
    shift: "Afternoon",
    role: "Agent",
    records: 62,
    contribution: 11.5
  },
  {
    name: "Jennifer Taylor",
    shift: "Evening",
    role: "Agent",
    records: 24,
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
  const headers = ["Name", "Shift", "Role", "Records", "Contribution (%)"];
  const csvRows = [
    headers.join(","),
    ...data.map(item => [
      item.name,
      item.shift,
      item.role,
      item.records,
      item.contribution.toFixed(1)
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
