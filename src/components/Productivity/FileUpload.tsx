
import { useState } from "react";
import { Upload, FileType, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  fileType: "call" | "care";
  accept: string;
  selectedFile: File | null;
}

export default function FileUpload({ onFileSelect, fileType, accept, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    const isValidType = accept.split(",").some(type => 
      file.name.toLowerCase().endsWith(type.trim().replace(".", ""))
    );

    if (!isValidType) {
      alert(`Please upload a valid ${fileType === "call" ? "Call Logs" : "Care Logs"} file (${accept})`);
      return;
    }

    setIsUploading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onFileSelect(file);
      setIsUploading(false);
    }, 1000);
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  const getTitle = () => {
    return fileType === "call" ? "Call Logs" : "Care Logs";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{getTitle()} File</label>
      
      {selectedFile ? (
        <div className="p-4 border rounded-md flex items-center justify-between bg-background">
          <div className="flex items-center">
            <FileType className="h-6 w-6 mr-2 text-primary" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Button variant="ghost" size="icon" onClick={removeFile} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary/50 bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/25 hover:bg-primary/5"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-${fileType}`)?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium">Processing file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Drag & drop {getTitle()} file here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse (.xls, .xlsx, .csv)
              </p>
            </div>
          )}
          <input
            type="file"
            id={`file-${fileType}`}
            className="hidden"
            accept={accept}
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
