
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import ProductivityDashboard from "@/components/Productivity/ProductivityDashboard";

export default function ProductivityPage() {
  return (
    <ThemeProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Productivity Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor team productivity metrics and analyze performance data
            </p>
          </div>
          
          <ProductivityDashboard />
        </div>
      </AppLayout>
    </ThemeProvider>
  );
}
