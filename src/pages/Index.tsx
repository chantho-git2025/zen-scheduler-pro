
import { useState } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import ScheduleDashboard from "@/components/Schedule/ScheduleDashboard";
import ProductivityDashboard from "@/components/Productivity/ProductivityDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("schedule");

  return (
    <ThemeProvider>
      <AppLayout>
        <Tabs defaultValue="schedule" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <ScheduleDashboard />
          </TabsContent>
          
          <TabsContent value="productivity">
            <ProductivityDashboard />
          </TabsContent>
        </Tabs>
      </AppLayout>
    </ThemeProvider>
  );
};

export default Index;
