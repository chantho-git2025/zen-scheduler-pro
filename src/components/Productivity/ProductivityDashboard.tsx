
import { useState, useEffect, useMemo } from "react";
import FileUpload from "./FileUpload";
import { FilterBar } from "./FilterBar";
import { ProductivityTable } from "./ProductivityTable";
import { NoDataPlaceholder } from "./NoDataPlaceholder";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { processFiles, generateShiftCounts } from "./DataProcessingService";
import { StaffMember, ShiftCount, defaultExcludedSolutions } from "./types";
import "./ChartUtils";

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
      processFilesData();
    }
  }, [callLogsFile, careLogsFile]);

  const processFilesData = async () => {
    setIsProcessing(true);
    try {
      const data = await processFiles(callLogsFile, careLogsFile);
      setProductivityData(data);
      
      // Generate mock shift counts
      const mockShiftCounts = generateShiftCounts(data);
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
      
      {(!callLogsFile || !careLogsFile) && <NoDataPlaceholder />}
      
      {callLogsFile && careLogsFile && (
        <>
          {isProcessing ? (
            <ProcessingIndicator />
          ) : (
            <div className="space-y-6">
              <FilterBar 
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                shiftFilter={shiftFilter}
                setShiftFilter={setShiftFilter}
                resetFilters={resetFilters}
                handleExport={handleExport}
              />
              
              <ProductivityTable 
                filteredData={filteredData}
                sortField={sortField}
                sortAscending={sortAscending}
                shiftCounts={shiftCounts}
                handleSort={handleSort}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
