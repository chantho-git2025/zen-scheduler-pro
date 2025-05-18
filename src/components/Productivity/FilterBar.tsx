
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface FilterBarProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  shiftFilter: string;
  setShiftFilter: (shift: string) => void;
  resetFilters: () => void;
  handleExport: () => void;
}

export function FilterBar({ 
  startDate, 
  endDate, 
  setStartDate, 
  setEndDate, 
  shiftFilter, 
  setShiftFilter,
  resetFilters,
  handleExport 
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Productivity Report</h2>
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
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="Day Shift">Day Shift</SelectItem>
              <SelectItem value="Nightshift">Nightshift</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
              <SelectItem value="Relief Team">Relief Team</SelectItem>
              <SelectItem value="Survey Team">Survey Team</SelectItem>
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
  );
}
