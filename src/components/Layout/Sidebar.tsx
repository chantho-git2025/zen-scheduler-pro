
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, BarChart3, Settings, Menu, X, User } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      name: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      path: "#schedule",
      active: true,
    },
    {
      name: "Productivity",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "#productivity",
    },
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      path: "#profile",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "#settings",
    },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-background rounded-md p-2 shadow-md"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col w-64 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-teal-500" />
            <span className="text-xl font-semibold">WorkFlow</span>
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col justify-between flex-1 py-6 overflow-y-auto">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-auto">
            <div className="flex items-center justify-between pt-4 border-t border-sidebar-border">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <span className="text-sm font-medium">JS</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
