
import { useState, useEffect, useMemo } from "react";
import { 
  processFiles,
  filterByDateRange,
  filterByShift,
  sortData,
  exportToCSV,
  getShiftDistribution,
  getStaffContribution
} from "@/services/fileService";
import FileUpload from "./FileUpload";
import { 
  Calendar,
  FileSpreadsheet, 
  Download,
  ArrowUpDown,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface StaffMember {
  name: string;
  shift: string;
  role: string;
  records: number;
  contribution: number;
}

export default function ProductivityDashboard() {
  // Files
  const [callLogsFile, setCallLogsFile] = useState<File | null>(null);
  const [careLogsFile, setCareLogsFile] = useState<File | null>(null);
  
  // Data
  const [productivityData, setProductivityData] = useState<StaffMember[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Filters
  const [shiftFilter, setShiftFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof StaffMember>("name");
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  useEffect(() => {
    if (callLogsFile && careLogsFile) {
      processData();
    }
  }, [callLogsFile, careLogsFile]);

  const processData = async () => {
    setIsProcessing(true);
    try {
      const data = await processFiles(callLogsFile, careLogsFile);
      setProductivityData(data);
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
    
    // Apply filters
    data = filterByDateRange(data, startDate, endDate);
    data = filterByShift(data, shiftFilter);
    
    // Apply sorting
    data = sortData(data, sortField, sortAscending);
    
    return data;
  }, [productivityData, startDate, endDate, shiftFilter, sortField, sortAscending]);

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setShiftFilter("");
  };

  const shiftDistribution = useMemo(() => getShiftDistribution(filteredData), [filteredData]);
  const staffContribution = useMemo(() => getStaffContribution(filteredData), [filteredData]);

  // Charts configuration
  const barChartData = {
    labels: staffContribution.map(item => item.name),
    datasets: [
      {
        label: "Records",
        data: staffContribution.map(item => item.records),
        backgroundColor: "rgba(45, 212, 191, 0.7)",
        borderColor: "rgb(45, 212, 191)",
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: shiftDistribution.map(item => item.shift),
    datasets: [
      {
        data: shiftDistribution.map(item => item.records),
        backgroundColor: [
          "rgba(45, 212, 191, 0.7)",
          "rgba(79, 70, 229, 0.7)",
          "rgba(249, 115, 22, 0.7)"
        ],
        borderColor: [
          "rgb(45, 212, 191)",
          "rgb(79, 70, 229)",
          "rgb(249, 115, 22)"
        ],
        borderWidth: 1
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Records by Staff Member"
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Records by Shift"
      }
    }
  };

  const handleExport = () => {
    exportToCSV(filteredData);
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
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
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
                        <CalendarComponent
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
                        <CalendarComponent
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
              
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th 
                        className="h-10 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {sortField === "name" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="h-10 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("shift")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Shift</span>
                          {sortField === "shift" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="h-10 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Role</span>
                          {sortField === "role" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="h-10 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("records")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Records</span>
                          {sortField === "records" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="h-10 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                        onClick={() => handleSort("contribution")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Contribution (%)</span>
                          {sortField === "contribution" && (
                            <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((staff, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50">
                        <td className="p-4 align-middle">{staff.name}</td>
                        <td className="p-4 align-middle">{staff.shift}</td>
                        <td className="p-4 align-middle">{staff.role}</td>
                        <td className="p-4 align-middle">{staff.records}</td>
                        <td className="p-4 align-middle">{staff.contribution.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Records by Staff Member</CardTitle>
                    <CardDescription>
                      Total records processed by each staff member
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Bar data={barChartData} options={barChartOptions} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Shift Distribution</CardTitle>
                    <CardDescription>
                      Distribution of records by shift
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
