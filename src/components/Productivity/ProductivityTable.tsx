
import { StaffMember } from "./types";
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
  handleSort: (field: keyof StaffMember) => void;
}

export function ProductivityTable({ 
  filteredData, 
  sortField, 
  sortAscending, 
  handleSort 
}: ProductivityTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
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
              onClick={() => handleSort("callRecords")}
            >
              <div className="flex items-center space-x-1">
                <span>Callogs</span>
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
                <span>Carelogs</span>
                {sortField === "careRecords" && (
                  <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("shift3to8")}
            >
              <div className="flex items-center space-x-1">
                <span>3AM-8AM</span>
                {sortField === "shift3to8" && (
                  <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("shift8to17")}
            >
              <div className="flex items-center space-x-1">
                <span>8AM-5PM</span>
                {sortField === "shift8to17" && (
                  <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("shift17to22")}
            >
              <div className="flex items-center space-x-1">
                <span>5PM-10PM</span>
                {sortField === "shift17to22" && (
                  <ArrowUpDown size={14} className={sortAscending ? "" : "rotate-180"} />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("shift22to3")}
            >
              <div className="flex items-center space-x-1">
                <span>10PM-3AM</span>
                {sortField === "shift22to3" && (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((staff, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              <TableCell>{staff.shift}</TableCell>
              <TableCell className="font-medium">
                <div className="text-teal-700 font-semibold cursor-pointer border-l-4 border-teal-500 pl-2">
                  {staff.name}
                </div>
              </TableCell>
              <TableCell>{staff.callRecords}</TableCell>
              <TableCell>{staff.careRecords}</TableCell>
              <TableCell>{staff.shift3to8}</TableCell>
              <TableCell>{staff.shift8to17}</TableCell>
              <TableCell>{staff.shift17to22}</TableCell>
              <TableCell>{staff.shift22to3}</TableCell>
              <TableCell>{staff.records}</TableCell>
            </TableRow>
          ))}
          {filteredData.length > 0 && (
            <TableRow className="font-semibold bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.callRecords, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.careRecords, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.shift3to8, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.shift8to17, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.shift17to22, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.shift22to3, 0)}</TableCell>
              <TableCell>{filteredData.reduce((sum, staff) => sum + staff.records, 0)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
