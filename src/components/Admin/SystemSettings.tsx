
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SystemSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState("https://api.example.com/v1");
  const [sheetId, setSheetId] = useState("1_qm2Ge6cHwk3esD6VHj3Vl-od2MBHb44uQ3cyd_uPCE");
  const [worksheetName, setWorksheetName] = useState("Schedule_BOT");
  
  const handleSaveGeneral = () => {
    toast.success("Settings saved successfully");
  };
  
  const handleSaveIntegration = () => {
    toast.success("Integration settings saved successfully");
  };
  
  const handleResetSettings = () => {
    setEmailNotifications(true);
    setWeeklyReports(true);
    setSystemAlerts(true);
    setDarkMode(false);
    setAutoLogout(true);
    toast.info("Settings reset to defaults");
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports" className="font-medium">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Get weekly summary reports</p>
                </div>
                <Switch 
                  id="weekly-reports" 
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-alerts" className="font-medium">System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive important system alerts</p>
                </div>
                <Switch 
                  id="system-alerts" 
                  checked={systemAlerts}
                  onCheckedChange={setSystemAlerts}
                />
              </div>
            </CardContent>
            
            <CardHeader className="border-t pt-6">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the application appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
            </CardContent>
            
            <CardHeader className="border-t pt-6">
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-logout" className="font-medium">Auto Logout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity</p>
                </div>
                <Switch 
                  id="auto-logout" 
                  checked={autoLogout}
                  onCheckedChange={setAutoLogout}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Integration</CardTitle>
              <CardDescription>Configure connection to Google Sheets for data import</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sheet-id">Google Sheet ID</Label>
                <Input 
                  id="sheet-id" 
                  value={sheetId}
                  onChange={(e) => setSheetId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="worksheet-name">Worksheet Name</Label>
                <Input 
                  id="worksheet-name" 
                  value={worksheetName}
                  onChange={(e) => setWorksheetName(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardHeader className="border-t pt-6">
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API endpoints for the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input 
                  id="api-endpoint" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end border-t pt-6">
              <Button onClick={handleSaveIntegration}>Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup Data</CardTitle>
              <CardDescription>Create a backup of all system data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create a complete backup of all system data, including user information, schedules, and productivity metrics.</p>
              <Button>Create Backup</Button>
            </CardContent>
            
            <CardHeader className="border-t pt-6">
              <CardTitle>Restore Data</CardTitle>
              <CardDescription>Restore data from a previous backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Upload a backup file to restore your data. Warning: This will replace all current data.</p>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".zip,.json" />
                <Button variant="secondary">Restore</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
