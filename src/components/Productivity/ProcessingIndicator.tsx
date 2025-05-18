
import { SlidersHorizontal } from "lucide-react";

export function ProcessingIndicator() {
  return (
    <div className="card text-center py-12">
      <div className="mx-auto h-12 w-12 animate-spin text-primary">
        <SlidersHorizontal className="h-12 w-12" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Processing Files</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Please wait while we analyze your data...
      </p>
    </div>
  );
}
