
import { useState, useEffect, useMemo } from "react";
import { FileUpload } from "./FileUpload";
import { 
  FileSpreadsheet, 
  Download,
  ArrowUpDown,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import "./ChartUtils";

// Define interfaces
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

// Default excluded solutions
const defaultExcludedSolutions = [
  "appointment call back to customer",
  "cus.no need support - finish",
  "get some information - drop call",
  "get some information - wait customer call back",
  "unreachable contact - finish",
];

export default function ProductivityDashboard() {
  // Files
  const [callLogsFile, setCallLogsFile] = useState<File | null>(null);
  const [careLogsFile, setCareLogsFile] = useState<File | null>(null);
  
  // Data
  const [productivityData, setProductivityData] = useState<StaffMember[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [shiftFilter, setShiftFilter] = useState<string>("");
  const [excludedSolutions, setExcludedSolutions] = useState<string[]>(defaultExcludedSolutions);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof StaffMember>("name");
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  // Shift counts for each staff member
  const [shiftCounts, setShiftCounts] = useState<Record<string, ShiftCount>>({});

  useEffect(() => {
    if (callLogsFile && careLogsFile) {
      processData();
    }
  }, [callLogsFile, careLogsFile]);

  const processData = async () => {
    setIsProcessing(true);
    try {
      // In a real application, we would process both files here
      // For now, use mock data with both call logs and care logs
      const data = await processFiles(callLogsFile, careLogsFile);
      setProductivityData(data);
      
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
      setShiftCounts(mockShiftCounts);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSort = (field: keyof StaffMember) => {
    if (field === sortField) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const filteredData = useMemo(() => {
    let data = productivityData;
    
    // Apply date filters if present
    if (startDate || endDate) {
      data = data.filter(item => {
        // In a real implementation, we would filter based on dates
        return true; // Mock implementation
      });
    }
    
    // Apply shift filter if present
    if (shiftFilter) {
      data = data.filter(item => item.shift === shiftFilter);
    }
    
    // Apply sorting
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortAscending 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortAscending 
          ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
          : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
      }
    });
    
    return sortedData;
  }, [productivityData, startDate, endDate, shiftFilter, sortField, sortAscending]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setShiftFilter("");
    setExcludedSolutions(defaultExcludedSolutions);
  };

  const handleExport = () => {
    const csvRows = [
      ["Work Shift", "Name", "Callogs", "Carelogs", "3AM-8AM", "8AM-5PM", "5PM-10PM", "10PM-3AM", "Total Records"],
      ...filteredData.map(staff => [
        staff.shift,
        staff.name,
        staff.callRecords.toString(),
        staff.careRecords.toString(),
        (shiftCounts[staff.name]?.shift3to8 || 0).toString(),
        (shiftCounts[staff.name]?.shift8to17 || 0).toString(),
        (shiftCounts[staff.name]?.shift17to22 || 0).toString(),
        (shiftCounts[staff.name]?.shift22to3 || 0).toString(),
        staff.records.toString()
      ])
    ];
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "staff_productivity.csv");
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Productivity Dashboard</h1>
        <p className="text-muted-foreground">
          Upload files and analyze team productivity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          onFileSelect={setCallLogsFile}
          fileType="call"
          accept=".xls,.xlsx,.csv"
          selectedFile={callLogsFile}
        />
        
        <FileUpload
          onFileSelect={setCareLogsFile}
          fileType="care"
          accept=".xls,.xlsx,.csv"
          selectedFile={careLogsFile}
        />
      </div>
      
      {(!callLogsFile || !careLogsFile) && (
        <div className="card border-dashed text-center py-8">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Please upload both Call Logs and Care Logs files to view productivity metrics and analytics.
          </p>
        </div>
      )}
      
      {callLogsFile && careLogsFile && (
        <>
          {isProcessing ? (
            <div className="card text-center py-12">
              <div className="mx-auto h-12 w-12 animate-spin text-primary">
                <SlidersHorizontal className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Processing Files</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we analyze your data...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <h2 className="text-xl font-semibold">Productivity Report</h2>
                  <span className="text-sm text-muted-foreground">
                    {filteredData.length} staff members
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Calendar className="mr-2 h-3 w-3" />
                          {startDate ? format(startDate, "PPP") : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate || undefined}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Calendar className="mr-2 h-3 w-3" />
                          {endDate ? format(endDate, "PPP") : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate || undefined}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Select value={shiftFilter} onValueChange={setShiftFilter}>
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue placeholder="All Shifts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Shifts</SelectItem>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
                      Reset
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="text-xs"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {sortField === "name" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("shift")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Work Shift</span>
                          {sortField === "shift" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Role</span>
                          {sortField === "role" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("callRecords")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Call Logs</span>
                          {sortField === "callRecords" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("careRecords")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Care Logs</span>
                          {sortField === "careRecords" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("records")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Total Records</span>
                          {sortField === "records" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("contribution")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Contribution (%)</span>
                          {sortField === "contribution" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((staff, index) => (
                      <TableRow key={index} className="hover:bg-muted/50 group relative">
                        <TableCell className="font-medium">
                          <div className="text-teal-700 font-semibold cursor-pointer border-l-4 border-teal-500 pl-2">
                            {staff.name}
                          </div>
                          <div className="absolute z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-gray-800 text-sm rounded-lg p-4 shadow-md border border-teal-500 min-w-[250px] left-0 top-full mt-2">
                            <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-teal-500"></div>
                            <p className="font-semibold text-gray-900">Name: {staff.name}</p>
                            <p className="text-gray-700">Work Shift: {staff.shift}</p>
                            <p className="text-gray-700">Role: {staff.role}</p>
                            <p className="mt-3 font-semibold text-gray-900">Record Counts by Time:</p>
                            <ul className="list-disc pl-4 text-gray-700">
                              <li>3AM–8AM: {shiftCounts[staff.name]?.shift3to8 || 0} records</li>
                              <li>8AM–5PM: {shiftCounts[staff.name]?.shift8to17 || 0} records</li>
                              <li>5PM–10PM: {shiftCounts[staff.name]?.shift17to22 || 0} records</li>
                              <li>10PM–3AM: {shiftCounts[staff.name]?.shift22to3 || 0} records</li>
                            </ul>
                          </div>
                        </TableCell>
                        <TableCell>{staff.shift}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>{staff.callRecords}</TableCell>
                        <TableCell>{staff.careRecords}</TableCell>
                        <TableCell>{staff.records}</TableCell>
                        <TableCell>{staff.contribution.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                    {filteredData.length > 0 && (
                      <TableRow className="font-semibold bg-muted/50">
                        <TableCell>Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>{filteredData.reduce((sum, staff) => sum + staff.callRecords, 0)}</TableCell>
                        <TableCell>{filteredData.reduce((sum, staff) => sum + staff.careRecords, 0)}</TableCell>
                        <TableCell>{filteredData.reduce((sum, staff) => sum + staff.records, 0)}</TableCell>
                        <TableCell>100%</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mock data processing for development
async function processFiles(callLogsFile: File | null, careLogsFile: File | null): Promise<StaffMember[]> {
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
