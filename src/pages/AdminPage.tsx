
import { useState, useEffect } from "react";
import AppLayout from "@/components/Layout/AppLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/Admin/UserManagement";
import SystemSettings from "@/components/Admin/SystemSettings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("users");

  return (
    <ThemeProvider>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, settings, and system configuration
            </p>
          </div>
          
          <Tabs defaultValue="users" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ThemeProvider>
  );
}
