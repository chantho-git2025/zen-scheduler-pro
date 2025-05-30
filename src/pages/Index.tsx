
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import ScheduleDashboard from "@/components/Schedule/ScheduleDashboard";

const Index = () => {
  return (
    <ThemeProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Schedule Dashboard</h1>
            <p className="text-muted-foreground">
              View and manage team schedules
            </p>
          </div>
          
          <ScheduleDashboard />
        </div>
      </AppLayout>
    </ThemeProvider>
  );
};

export default Index;
