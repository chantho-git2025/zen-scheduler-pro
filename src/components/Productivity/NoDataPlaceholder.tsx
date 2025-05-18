
import { FileSpreadsheet } from "lucide-react";

export function NoDataPlaceholder() {
  return (
    <div className="card border-dashed text-center py-8">
      <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        Please upload both Call Logs and Care Logs files to view productivity metrics and analytics.
      </p>
    </div>
  );
}
