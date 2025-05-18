
export interface StaffMember {
  name: string;
  shift: string;
  role: string;
  callRecords: number;
  careRecords: number;
  records: number;
  contribution: number;
  // Time-based record counts
  shift3to8: number;
  shift8to17: number;
  shift17to22: number;
  shift22to3: number;
}

export interface ShiftCount {
  shift3to8: number;
  shift8to17: number;
  shift17to22: number;
  shift22to3: number;
}

export const defaultExcludedSolutions = [
  "appointment call back to customer",
  "cus.no need support - finish",
  "get some information - drop call",
  "get some information - wait customer call back",
  "unreachable contact - finish",
];
