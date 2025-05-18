
import { StaffMember, ShiftCount } from "./types";
import { ArrowUpDown } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ProductivityTableProps {
  filteredData: StaffMember[];
  sortField: keyof StaffMember;
  sortAscending: boolean;
  shiftCounts: Record<string, ShiftCount>;
  handleSort: (field: keyof StaffMember) => void;
}

export function ProductivityTable({ 
  filteredData, 
  sortField, 
  sortAscending, 
  shiftCounts,
  handleSort 
}: ProductivityTableProps) {
  return (
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
  );
}
