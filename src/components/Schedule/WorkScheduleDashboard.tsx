import { useState, useEffect, useMemo } from "react";
import { 
  fetchWorkScheduleData, 
  getWorkScheduleForDate,
  searchWorkSchedule,
  filterWorkScheduleByShift,
  filterWorkScheduleByPosition,
  getUniqueShifts,
  getUniquePositions,
  getUniqueNames,
  WorkScheduleItem,
  readExcelFile,
  normalizeDate,
  formatDateToReadable
} from "@/services/sheetService";

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parse, isValid } from "date-fns";
import { Calendar as CalendarIcon, User, Clock, Filter, BriefcaseIcon, Upload, FileUp, ArrowUpDown } from "lucide-react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Helper function to get shift color
const getShiftColor = (shift: string) => {
  switch (shift.toLowerCase()) {
    case 'day off':
    case 'public holiday':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    case '8am-5pm':
    case '10am-7pm':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case '5pm-10pm':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case '3am-8am':
    case '9pm-3am':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

// Helper function to format date for display
const formatDateForDisplay = (dateStr: string) => {
  try {
    if (!dateStr) return "";
    // If already in MM-DD-YYYY format, convert to readable format
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const date = parse(dateStr, "MM-dd-yyyy", new Date());
      if (!isValid(date)) {
        console.error("Invalid date parsed:", dateStr);
        return dateStr;
      }
      return format(date, 'MMM dd, yyyy');
    }
    // Otherwise treat as ISO format
    const date = new Date(dateStr);
    if (!isValid(date)) {
      console.error("Invalid date:", dateStr);
      return dateStr;
    }
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error("Error formatting date for display:", dateStr, error);
    return dateStr;
  }
};

export default function WorkScheduleDashboard() {
  const [scheduleData, setScheduleData] = useState<WorkScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMonth, setViewMonth] = useState<Date>(new Date());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sortField, setSortField] = useState<keyof WorkScheduleItem>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkScheduleData();
        setScheduleData(data);
      } catch (error) {
        console.error("Failed to fetch work schedule data:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    
    try {
      setLoading(true);
      toast.info("Processing schedule file...");
      
      // Read the file
      const fileData = await file.arrayBuffer();
      const result = await readExcelFile(fileData);
      
      // Check if data is valid
      if (Array.isArray(result) && result.length > 0) {
        // Map file data to WorkScheduleItem format
        const formattedData = result.map((row: any, index: number) => {
          // Debug the data we're receiving
          console.log("Row data:", row);
          
          return {
            id: `${index + 1}`,
            name: row.Name || "",
            // Use normalized date format
            date: row.Date ? normalizeDate(String(row.Date)) : "",
            // Use the exact column name from Excel: "Shifts", fallback to alternatives
            shift: row.Shifts || row.SHIFT || row.Shift || row.shift || "",
            position: row.Position || row.POSITION || row.position || ""
          };
        }).filter((item: any) => item.name && item.date);
        
        if (formattedData.length > 0) {
          console.log("Formatted data:", formattedData.slice(0, 3));
          setScheduleData(formattedData);
          toast.success(`Loaded ${formattedData.length} schedule records`);
        } else {
          toast.error("No valid data found in file");
        }
      } else {
        toast.error("Invalid file format");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof WorkScheduleItem) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    let filtered = scheduleData;
    
    // Apply search query
    if (searchQuery) {
      filtered = searchWorkSchedule(filtered, searchQuery);
    }
    
    // Apply shift filter
    if (shiftFilter && shiftFilter !== "all") {
      filtered = filterWorkScheduleByShift(filtered, shiftFilter);
    }
    
    // Apply position filter
    if (positionFilter && positionFilter !== "all") {
      filtered = filterWorkScheduleByPosition(filtered, positionFilter);
    }
    
    // Apply name filter
    if (nameFilter && nameFilter !== "all") {
      filtered = filtered.filter(item => item.name === nameFilter);
    }
    
    // Apply date filter for both list and calendar views
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'MM-dd-yyyy');
      filtered = getWorkScheduleForDate(filtered, formattedDate);
    }
    
    // Sort data based on current sort field and direction
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      // Handle different field types
      if (sortField === "date") {
        // Convert dates to consistent format for comparison
        try {
          // Normalize both dates to MM-DD-YYYY format
          const dateStrA = normalizeDate(a.date);
          const dateStrB = normalizeDate(b.date);
          
          // Parse the normalized dates to Date objects
          const dateA = parse(dateStrA, "MM-dd-yyyy", new Date());
          const dateB = parse(dateStrB, "MM-dd-yyyy", new Date());
          
          // Check if parse was successful
          if (!isValid(dateA) || !isValid(dateB)) {
            console.error("Invalid date during sort:", a.date, b.date);
            return 0;
          }
          
          // Compare timestamps
          comparison = dateA.getTime() - dateB.getTime();
        } catch (error) {
          console.error("Error sorting dates:", error, a.date, b.date);
          comparison = 0;
        }
      } else {
        // For string fields
        const valueA = String(a[sortField] || "").toLowerCase();
        const valueB = String(b[sortField] || "").toLowerCase();
        comparison = valueA.localeCompare(valueB);
      }
      
      // Apply sort direction
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [scheduleData, searchQuery, shiftFilter, positionFilter, nameFilter, selectedDate, sortField, sortDirection]);
  
  const todaySchedule = useMemo(() => {
    if (!selectedDate) return [];
    // Format selected date to MM-DD-YYYY for comparison
    const formattedDate = format(selectedDate, 'MM-dd-yyyy');
    return getWorkScheduleForDate(filteredData, formattedDate);
  }, [filteredData, selectedDate]);
  
  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewMonth),
      end: endOfMonth(viewMonth)
    });
  }, [viewMonth]);
  
  const uniqueShifts = useMemo(() => getUniqueShifts(scheduleData), [scheduleData]);
  const uniquePositions = useMemo(() => getUniquePositions(scheduleData), [scheduleData]);
  const uniqueNames = useMemo(() => getUniqueNames(scheduleData), [scheduleData]);

  const resetFilters = () => {
    setSearchQuery("");
    setShiftFilter("all");
    setPositionFilter("all");
    setNameFilter("all");
    setSelectedDate(null);
  };

  // Function to download CSV with consistent date format
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    // CSV header
    let csv = "Name,Date,Shift,Position\n";
    
    // Add data rows with consistent date format
    filteredData.forEach(item => {
      const formattedDate = formatDateToReadable(item.date);
      csv += `"${item.name}","${formattedDate}","${item.shift}","${item.position}"\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'work_schedule.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Schedule exported successfully");
  };

  // Function to get schedule items for a specific day using proper date comparison
  const getScheduleForDay = (day: Date) => {
    const dateStr = format(day, 'MM-dd-yyyy');
    return scheduleData.filter(item => {
      try {
        // Normalize item date
        const normalizedItemDate = normalizeDate(item.date);
        
        // Compare with formatted day
        return normalizedItemDate === dateStr;
      } catch (error) {
        console.error("Error comparing dates in calendar:", error, item.date, dateStr);
        return false;
      }
    });
  };

  // Function to render calendar day content
  const renderCalendarDay = (date: Date) => {
    const daySchedule = getScheduleForDay(date);
    if (daySchedule.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 right-0 left-0 flex justify-center">
        <div className={`w-1.5 h-1.5 rounded-full ${daySchedule.length > 0 ? 'bg-primary' : ''}`}></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Work Schedule Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage your team's work schedule
        </p>
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label htmlFor="scheduleFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-2 text-primary" />
                <p className="mb-2 text-sm text-center">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">XLSX, XLS, CSV (MAX. 10MB)</p>
              </div>
              <input 
                id="scheduleFile" 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
          
          {uploadedFile && (
            <div className="w-full sm:w-auto bg-background p-3 rounded-md border flex items-center gap-2">
              <FileUp className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search name, shift, position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs"
              >
                Clear Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="text-xs"
              >
                Export CSV
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setActiveTab(value as "list" | "calendar")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-4 space-y-4">
              {loading ? (
                <div>
                  <Skeleton className="h-8 w-full mb-4" />
                  <Skeleton className="h-24 w-full mb-2" />
                  <Skeleton className="h-24 w-full mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : filteredData.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Name</span>
                            {sortField === "name" && (
                              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Date</span>
                            {sortField === "date" && (
                              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("shift")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Shift</span>
                            {sortField === "shift" && (
                              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort("position")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Position</span>
                            {sortField === "position" && (
                              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{formatDateToReadable(item.date)}</TableCell>
                          <TableCell>
                            <Badge className={`${getShiftColor(item.shift)}`}>
                              {item.shift}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.position}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No schedule found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-4 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {format(viewMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newDate = new Date(viewMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setViewMonth(newDate);
                    }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newDate = new Date(viewMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setViewMonth(newDate);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={setSelectedDate}
                month={viewMonth}
                onMonthChange={setViewMonth}
                className="rounded-md border"
                components={{
                  DayContent: (props) => (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div>{props.date.getDate()}</div>
                      {renderCalendarDay(props.date)}
                    </div>
                  ),
                }}
              />
              
              {selectedDate && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold mb-3">
                    Schedule for {format(selectedDate, 'MMMM d, yyyy')}
                  </h3>
                  
                  {todaySchedule.length > 0 ? (
                    <div className="space-y-3">
                      {todaySchedule.map((item) => (
                        <div key={item.id} className="card card-hover">
                          <div className="flex justify-between">
                            <h4 className="font-semibold">{item.name}</h4>
                            <Badge className={`${getShiftColor(item.shift)}`}>
                              {item.shift}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                            <span>{item.position}</span>
                            <span>{formatDateToReadable(item.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">No schedule for this date</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Staff Member</label>
              <Select value={nameFilter} onValueChange={setNameFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All staff</SelectItem>
                  {uniqueNames.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Shift</label>
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All shifts</SelectItem>
                  {uniqueShifts.map(shift => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All positions</SelectItem>
                  {uniquePositions.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total shifts:</span>
                  <span className="font-medium">{filteredData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Day Off shifts:</span>
                  <span className="font-medium">
                    {filteredData.filter(item => item.shift === "Day Off").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Public Holidays:</span>
                  <span className="font-medium">
                    {filteredData.filter(item => item.shift === "Public Holiday").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
