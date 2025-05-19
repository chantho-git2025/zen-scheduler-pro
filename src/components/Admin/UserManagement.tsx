
import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, Plus, Search, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  role: string;
  status: "active" | "inactive";
}

const mockUsers: UserData[] = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "john.smith@example.com", 
    department: "Management", 
    position: "Team Lead", 
    role: "admin", 
    status: "active" 
  },
  { 
    id: "2", 
    name: "Sarah Johnson", 
    email: "sarah.johnson@example.com", 
    department: "Customer Support", 
    position: "Agent", 
    role: "user", 
    status: "active" 
  },
  { 
    id: "3", 
    name: "Michael Brown", 
    email: "michael.brown@example.com", 
    department: "Technical Support", 
    position: "Engineer", 
    role: "user", 
    status: "active" 
  },
  { 
    id: "4", 
    name: "Emma Wilson", 
    email: "emma.wilson@example.com", 
    department: "Customer Support", 
    position: "Senior Agent", 
    role: "manager", 
    status: "active" 
  },
  { 
    id: "5", 
    name: "David Lee", 
    email: "david.lee@example.com", 
    department: "Management", 
    position: "Director", 
    role: "admin", 
    status: "inactive" 
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserData>>({
    name: "",
    email: "",
    department: "",
    position: "",
    role: "user",
    status: "active"
  });
  
  useEffect(() => {
    // In a real app, fetch users from an API
    setUsers(mockUsers);
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const handleCreateUser = () => {
    const id = (users.length + 1).toString();
    const createdUser = { ...newUser, id } as UserData;
    setUsers([...users, createdUser]);
    setNewUser({
      name: "",
      email: "",
      department: "",
      position: "",
      role: "user",
      status: "active"
    });
    setIsDialogOpen(false);
    toast.success("User created successfully");
  };
  
  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
    setIsDialogOpen(false);
    toast.success("User updated successfully");
  };
  
  const handleDeleteUsers = () => {
    if (selectedUsers.length === 0) return;
    
    setUsers(users.filter(user => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    toast.success(`${selectedUsers.length} user(s) deleted`);
  };
  
  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteUsers}
            disabled={selectedUsers.length === 0}
          >
            Delete Selected
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? "Update user information in the form below." 
                    : "Add a new user to the system."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={editingUser ? editingUser.name : newUser.name}
                    onChange={e => editingUser 
                      ? setEditingUser({ ...editingUser, name: e.target.value })
                      : setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={e => editingUser 
                      ? setEditingUser({ ...editingUser, email: e.target.value })
                      : setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      value={editingUser ? editingUser.department : newUser.department}
                      onChange={e => editingUser 
                        ? setEditingUser({ ...editingUser, department: e.target.value })
                        : setNewUser({ ...newUser, department: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position"
                      value={editingUser ? editingUser.position : newUser.position}
                      onChange={e => editingUser 
                        ? setEditingUser({ ...editingUser, position: e.target.value })
                        : setNewUser({ ...newUser, position: e.target.value })
                      }
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={editingUser ? editingUser.role : newUser.role}
                      onValueChange={value => editingUser 
                        ? setEditingUser({ ...editingUser, role: value })
                        : setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={editingUser ? editingUser.status : (newUser.status as string)}
                      onValueChange={value => {
                        const status = value as "active" | "inactive";
                        editingUser 
                          ? setEditingUser({ ...editingUser, status })
                          : setNewUser({ ...newUser, status });
                      }}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                  {editingUser ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 hidden sm:flex">
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.position}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : (user.role === "manager" ? "default" : "outline")}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "success" : "secondary"}>{user.status}</TableCell>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          handleSelectUser(user.id);
                          handleDeleteUsers();
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
