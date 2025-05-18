
import { useState, useEffect, useMemo } from "react";
import { 
  fetchScheduleData, 
  getTasksForDate, 
  searchTasks, 
  filterTasksByStatus,
  filterTasksByAssignee,
  getUniqueAssignees,
  getUniqueStatuses
} from "@/services/sheetService";
import { Calendar, Clock, User, CheckCircle, AlertCircle, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ScheduleItem {
  id: string;
  taskName: string;
  date: string;
  time: string;
  assignee: string;
  status: string;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'ongoing':
      return <Clock className="h-4 w-4" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// For today and tomorrow specifically
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export default function ScheduleDashboard() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  
  const today = getTodayDate();
  const tomorrow = getTomorrowDate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchScheduleData();
        setScheduleData(data);
      } catch (error) {
        console.error("Failed to fetch schedule data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    let filtered = scheduleData;
    
    // Apply search query
    if (searchQuery) {
      filtered = searchTasks(filtered, searchQuery);
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filterTasksByStatus(filtered, statusFilter);
    }
    
    // Apply assignee filter
    if (assigneeFilter && assigneeFilter !== "all") {
      filtered = filterTasksByAssignee(filtered, assigneeFilter);
    }
    
    return filtered;
  }, [scheduleData, searchQuery, statusFilter, assigneeFilter]);
  
  const todayTasks = useMemo(() => getTasksForDate(filteredData, today), [filteredData, today]);
  const tomorrowTasks = useMemo(() => getTasksForDate(filteredData, tomorrow), [filteredData, tomorrow]);
  
  const uniqueAssignees = useMemo(() => getUniqueAssignees(scheduleData), [scheduleData]);
  const uniqueStatuses = useMemo(() => getUniqueStatuses(scheduleData), [scheduleData]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAssigneeFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Schedule Dashboard</h1>
        <p className="text-muted-foreground">
          View and manage your team's schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search tasks, assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="today" className="w-full" onValueChange={(value) => setActiveTab(value as "today" | "tomorrow")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4 space-y-4">
              <h2 className="text-lg font-semibold">{formatDate(today)}</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex justify-between mt-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : todayTasks.length > 0 ? (
                <div className="space-y-4">
                  {todayTasks.map((task) => (
                    <div key={task.id} className="card card-hover">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{task.taskName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status}</span>
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{task.time}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No tasks for today</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enjoy your free time or create a new task.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="tomorrow" className="mt-4 space-y-4">
              <h2 className="text-lg font-semibold">{formatDate(tomorrow)}</h2>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="card">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex justify-between mt-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tomorrowTasks.length > 0 ? (
                <div className="space-y-4">
                  {tomorrowTasks.map((task) => (
                    <div key={task.id} className="card card-hover">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{task.taskName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status}</span>
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{task.time}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="mr-1 h-4 w-4" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No tasks for tomorrow</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Looks like you'll have a free day tomorrow.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {uniqueStatuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All assignees</SelectItem>
                  {uniqueAssignees.map(assignee => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total tasks today:</span>
                  <span className="font-medium">{todayTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total tasks tomorrow:</span>
                  <span className="font-medium">{tomorrowTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed today:</span>
                  <span className="font-medium">
                    {todayTasks.filter(t => t.status === 'completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
