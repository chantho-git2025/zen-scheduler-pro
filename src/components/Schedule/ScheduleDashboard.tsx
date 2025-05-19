
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskScheduleDashboard from "./TaskScheduleDashboard";
import WorkScheduleDashboard from "./WorkScheduleDashboard";

export default function ScheduleDashboard() {
  const [activeTab, setActiveTab] = useState<"tasks" | "workSchedule">("workSchedule");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="workSchedule" onValueChange={(value) => setActiveTab(value as "tasks" | "workSchedule")}>
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Meeting Schedule</TabsTrigger>
          <TabsTrigger value="workSchedule">Work Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <TaskScheduleDashboard />
        </TabsContent>
        
        <TabsContent value="workSchedule">
          <WorkScheduleDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
